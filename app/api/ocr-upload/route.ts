import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { openai, AI_VISION_MODEL } from '@/lib/openai';
import { adcvdRisk, pgaRisk, section301Risk } from '@/lib/risk';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: 'Only PDF, PNG, JPG, JPEG, WEBP files are allowed' }, { status: 400 });

    const blob = await put(`customs-uploads/${Date.now()}-${file.name}`, file, { access: 'public' });
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const content: any[] = [
      file.type === 'application/pdf'
        ? { type: 'input_file', filename: file.name, file_data: `data:${file.type};base64,${base64}` }
        : { type: 'input_image', image_url: `data:${file.type};base64,${base64}` },
      { type: 'input_text', text: 'Analyze this customs document. Extract invoice/packing list data. Return JSON only: documentType, shipper, consignee, invoiceNumber, invoiceDate, countryOfOrigin, portOfLoading, portOfDestination, items[{description, quantity, unitPrice, totalValue, suggestedHTS, confidence, customsRisk}], totalInvoiceValue, currency, grossWeight, netWeight, cartons, customsFlags, missingInformation, bondRecommendation, summary. Do not invent missing data.' }
    ];

    const response = await openai.responses.create({ model: AI_VISION_MODEL, input: [{ role: 'user', content }] });
    let text = response.output_text.replace(/```json|```/g, '').trim();
    let analysis: any;
    try { analysis = JSON.parse(text); } catch { analysis = { rawResult: text }; }

    const firstItem = analysis?.items?.[0] || {};
    const hts = firstItem?.suggestedHTS || '';
    const description = firstItem?.description || analysis?.summary || '';
    const country = analysis?.countryOfOrigin || '';
    const riskScreening = { section301: section301Risk(hts, country), adcvd: adcvdRisk(hts, description, country), pgaFlags: pgaRisk(description) };

    return NextResponse.json({ success: true, fileName: file.name, fileType: file.type, fileUrl: blob.url, analysis, riskScreening });
  } catch (error: any) {
    return NextResponse.json({ error: 'OCR analysis failed', detail: error.message }, { status: 500 });
  }
}
