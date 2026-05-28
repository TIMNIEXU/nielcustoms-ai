import { NextRequest, NextResponse } from 'next/server';
import { adcvdRisk, pgaRisk, section301Risk } from '@/lib/risk';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const description = body.description || '';
  const hts = body.hts || '';
  const country = body.country || '';
  return NextResponse.json({
    success: true,
    screening: {
      section301: section301Risk(hts, country),
      adcvd: adcvdRisk(hts, description, country),
      pgaFlags: pgaRisk(description),
      forcedLabor: /xinjiang|cotton|tomato|polysilicon|uyghur/i.test(description + country) ? 'UFLPA review required' : 'No direct keyword hit',
      brokerAction: 'Review commercial docs, product scope, manufacturer/exporter, COO evidence, and Chapter 99 before entry.'
    }
  });
}
