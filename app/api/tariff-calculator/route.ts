import { NextRequest, NextResponse } from 'next/server';
import { lookupHTS } from '@/lib/hts';
import { adcvdRisk, calcHmf, calcMpf, money, pgaRisk, section301Risk } from '@/lib/risk';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hts = body.hts || '';
    const country = body.country || '';
    const description = body.description || '';
    const customsValue = Number(body.customsValue || 0);
    const mode = body.mode || 'ocean';
    const section122Rate = Number(body.section122Rate || 0);

    const htsData = await lookupHTS(hts);
    if (!htsData) return NextResponse.json({ error: 'HTS not found' }, { status: 404 });

    const baseDuty = customsValue * (htsData.generalDutyRate / 100);
    const mpf = calcMpf(customsValue);
    const hmf = calcHmf(customsValue, mode);
    const s301 = section301Risk(htsData.htsno, country);
    const section301 = customsValue * (s301.rate / 100);
    const section122 = customsValue * (section122Rate / 100);
    const adcvd = adcvdRisk(htsData.htsno, `${description} ${htsData.description}`, country);
    const pgaFlags = pgaRisk(`${description} ${htsData.description}`);

    return NextResponse.json({
      success: true,
      htsLookup: htsData,
      riskScreening: { section301: s301, adcvd, pgaFlags },
      calculation: {
        customsValue: money(customsValue),
        generalDutyRate: htsData.generalDutyRate,
        baseDuty: money(baseDuty),
        mpf,
        hmf,
        section301: money(section301),
        section122: money(section122),
        estimatedTotalDutyAndFees: money(baseDuty + mpf + hmf + section301 + section122),
        bondRecommendation: customsValue > 2500 ? 'Continuous bond recommended' : 'Single transaction bond may apply'
      },
      disclaimer: 'Estimate only. Broker must verify HTS, Chapter 99, Section 301, AD/CVD, PGA, and ACE/ABI filing requirements.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Tariff calculation failed', detail: error.message }, { status: 500 });
  }
}
