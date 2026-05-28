import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, shipmentContext } = await req.json();
    const response = await openai.responses.create({
      model: AI_MODEL,
      input: `You are NielCustoms.ai Customs AI Copilot. Help with US import customs, HTS, bond, ISF, PGA, AD/CVD risk, documents, and broker workflow. Never claim final legal classification. Use concise broker-style answers. Shipment context: ${JSON.stringify(shipmentContext || {})}. User: ${message}`
    });
    return NextResponse.json({ success: true, answer: response.output_text });
  } catch (error: any) {
    return NextResponse.json({ error: 'Chat failed', detail: error.message }, { status: 500 });
  }
}
