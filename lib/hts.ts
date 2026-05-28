export function cleanHTS(hts: string) { return (hts || '').replace(/\D/g, ''); }
export function parseDutyRate(rateText?: string) {
  if (!rateText) return 0;
  if (/free/i.test(rateText)) return 0;
  const match = rateText.match(/(\d+(\.\d+)?)\s*%/);
  return match ? Number(match[1]) : 0;
}
export async function lookupHTS(htsOrKeyword: string) {
  const keyword = encodeURIComponent(htsOrKeyword || '');
  const res = await fetch(`https://hts.usitc.gov/reststop/search?keyword=${keyword}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 86400 }
  });
  if (!res.ok) throw new Error('USITC HTS lookup failed');
  const data = await res.json();
  const code = cleanHTS(htsOrKeyword);
  const exact = code
    ? data.find((x: any) => cleanHTS(x.htsno || '') === code) || data.find((x: any) => cleanHTS(x.htsno || '').startsWith(code.slice(0, 8)))
    : null;
  const item = exact || data[0];
  if (!item) return null;
  return {
    htsno: item.htsno,
    description: item.description,
    generalRateText: item.general,
    specialRateText: item.special,
    column2RateText: item.other,
    generalDutyRate: parseDutyRate(item.general),
    raw: item
  };
}
