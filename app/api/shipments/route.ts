import { NextResponse } from 'next/server';
import { demoShipments } from '@/data/demo';

export async function GET() { return NextResponse.json({ success: true, shipments: demoShipments }); }
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, shipment: { id: `shp_${Date.now()}`, status: 'draft', ...body } });
}
