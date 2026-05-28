import OpenAI from "openai";
import { formidable } from "formidable";
import fs from "fs";
import * as XLSX from "xlsx";

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function extractExcelText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });

  let text = "";

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_csv(sheet);
    text += `\n\nSheet: ${sheetName}\n${rows}`;
  });

  return text;
}

function normalizeFiles(uploaded) {
  if (!uploaded) return [];
  return Array.isArray(uploaded) ? uploaded : [uploaded];
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY",
        details: "Please add OPENAI_API_KEY in Vercel Environment Variables."
      });
    }

    const { files } = await parseForm(req);
    const uploaded = files.files || files.file || files.documents;
    const fileArray = normalizeFiles(uploaded);

    if (!fileArray.length) {
      return res.status(400).json({
        error: "No files uploaded",
        details: "No file was received by /api/analyze."
      });
    }

    let documentText = "";

    for (const file of fileArray) {
      const filePath = file.filepath;
      const fileName = file.originalFilename || "uploaded file";
      const lowerName = fileName.toLowerCase();

      if (lowerName.endsWith(".xls") || lowerName.endsWith(".xlsx")) {
        documentText += `\n\nFile: ${fileName}`;
        documentText += extractExcelText(filePath);
      } else {
        const buffer = fs.readFileSync(filePath);
        documentText += `\n\nFile: ${fileName}\nBase64 Preview:\n${buffer
          .toString("base64")
          .slice(0, 5000)}`;
      }
    }

    const prompt = `
You are a licensed U.S. Customs Broker AI assistant.

Analyze the uploaded shipment documents and return ONLY valid JSON.

Important rules:
- This is preliminary AI review only. Do not claim final legal classification.
- If invoice value exceeds USD 2,500 or repeated imports are likely, recommend Continuous Bond.
- Section 122 temporary tariff: apply +10% ad valorem when applicable, effective through 2026-07-24.
- Also review Section 301, FDA/PGA risks, and import compliance risks.
- If data is missing, write "Review needed" for that field.

Return this exact JSON format:
{
  "product_description": "",
  "country_of_origin": "",
  "invoice_value": "",
  "quantity": "",
  "suggested_hts": "",
  "estimated_duty": "",
  "section_122_duty": "",
  "section_301_risk": "",
  "bond_recommendation": "",
  "compliance_risks": "",
  "case_status": "",
  "broker_notes": ""
}

Shipment documents:
${documentText}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a licensed U.S. Customs Broker AI assistant. Return only valid JSON using the exact keys requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1
    });

    const text = completion.choices?.[0]?.message?.content || "{}";
    console.log("OPENAI RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      return res.status(500).json({
        error: "AI returned non-JSON output",
        details: text
      });
    }

    return res.status(200).json({
      hts: data.suggested_hts || "Review needed",
      duty: data.estimated_duty || "Review needed",
      section122: data.section_122_duty || "Review needed",
      section301: data.section_301_risk || "Review needed",
      bond: data.bond_recommendation || "Review needed",
      status: data.case_status || "Broker review required",
      product: data.product_description || "Review needed",
      origin: data.country_of_origin || "Review needed",
      value: data.invoice_value || "Review needed",
      quantity: data.quantity || "Review needed",
      risks: data.compliance_risks || "Review needed",
      notes: data.broker_notes || "Review needed"
    });
  } catch (error) {
    console.error("AI analysis failed:", error);
    return res.status(500).json({
      error: "AI analysis failed",
      details: error.message
    });
  }
}
