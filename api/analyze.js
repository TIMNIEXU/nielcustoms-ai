import OpenAI from "openai";
import { formidable } from "formidable";
import fs from "fs";
import XLSX from "xlsx";

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
  const workbook = XLSX.readFile(filePath);
  let text = "";

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_csv(sheet);
    text += `\n\nSheet: ${sheetName}\n${rows}`;
  });

  return text;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { files } = await parseForm(req);
    const uploaded = files.files;
    const fileArray = Array.isArray(uploaded) ? uploaded : [uploaded];

    let documentText = "";

    for (const file of fileArray) {
      const filePath = file.filepath;
      const fileName = file.originalFilename || "uploaded file";

      if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        documentText += extractExcelText(filePath);
      } else {
        const buffer = fs.readFileSync(filePath);
        documentText += `\n\nFile: ${fileName}\nBase64 Preview:\n${buffer.toString("base64").slice(0, 5000)}`;
      }
    }

    const prompt = `
You are a licensed U.S. Customs Broker AI assistant.

Analyze the shipment documents and return ONLY valid JSON.

Return this exact JSON format:
{
  "product_description": "",
  "country_of_origin": "",
  "invoice_value": "",
  "quantity": "",
  "suggested_hts": "",
  "estimated_duty": "",
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
          content: "You are a U.S. customs brokerage assistant. Return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1
    });

    const text = completion.choices[0].message.content;
    console.log("OPENAI RESPONSE:", text);
    const data = JSON.parse(text);
    console.log("PARSED DATA:", data);
    
    return res.status(200).json({
      hts: data.suggested_hts || "Review needed",
      duty: data.estimated_duty || "Review needed",
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
    return res.status(500).json({
      error: "AI analysis failed",
      details: error.message
    });
  }
}
