import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai';
import { lookupHTS } from '@/lib/hts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { description, material, use, country } = await req.json();
    const search = await lookupHTS(`${description} ${material || ''}`);
    const response = await openai.responses.create({
      model: AI_MODEL,
      input: `You are a licensed customs broker assistant. Suggest likely HTS candidates, but do not make final legal classification. Product: ${description}. Material: ${material}. Use: ${use}. Origin: ${country}. USITC initial result: ${JSON.stringify(search)}. Return JSON with candidates, questionsNeeded, risks, brokerReviewRequired.`
    });
    return NextResponse.json({ success: true, usitcFirstMatch: search, aiClassification: response.output_text });
  } catch (error: any) {
    return NextResponse.json({ error: 'HTS classification failed', detail: error.message }, { status: 500 });
  }
}
