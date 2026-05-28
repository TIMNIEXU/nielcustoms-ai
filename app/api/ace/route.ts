import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    mode: 'reference',
    aceAdcvdSearch: 'https://trade.cbp.dhs.gov/ace/adcvd/adcvd-public/',
    aceAvailabilityDashboard: 'https://trade.cbp.dhs.gov/ace/dashboard/public/',
    note: 'ACE data integration requires authorized ACE account, reports access, EDI/API/vendor arrangement, and data security controls.'
  });
}
