import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    success: false,
    mode: 'mock',
    message: 'ABI integration placeholder only. Production ABI filing requires CBP broker/filer authorization, ABI software certification/vendor connection, audit controls, and broker review.',
    received: body,
    nextSteps: ['Map entry data to ABI CATAIR messages', 'Validate importer/bond/HTS/Chapter 99/PGA', 'Broker approve before transmit', 'Connect certified ABI vendor or approved direct interface']
  });
}
