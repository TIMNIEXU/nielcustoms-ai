import { NextResponse } from 'next/server';
import { demoTenants } from '@/data/demo';
export async function GET() { return NextResponse.json({ success: true, tenants: demoTenants }); }
