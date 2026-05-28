import { cleanHTS } from './hts';

export function money(n: number) { return Math.round((Number(n) || 0) * 100) / 100; }
export function calcMpf(value: number) { return money(Math.min(Math.max(value * 0.003464, 33.58), 651.5)); }
export function calcHmf(value: number, mode: string) { return mode === 'ocean' ? money(value * 0.00125) : 0; }
export function isChina(country: string) { return /china|cn|prc|中国/i.test(country || ''); }

const china301RiskPrefixes = [
  '841','842','843','846','847','848','850','851','852','853','854','9403','3926','4016','7318','7604','8302','8708','9503'
];

export function section301Risk(hts: string, country: string) {
  if (!isChina(country)) return { applies: false, rate: 0, chapter99: '', note: 'Non-China origin: Section 301 China tariff not automatically indicated.' };
  const code = cleanHTS(hts);
  const risk = china301RiskPrefixes.some(p => code.startsWith(p));
  return {
    applies: risk,
    rate: risk ? 25 : 0,
    chapter99: risk ? '9903.88.xx review required' : '',
    note: risk ? 'China origin and HTS prefix is in a common Section 301 risk group. Verify official Chapter 99 mapping before entry.' : 'China origin detected; verify against current USTR/USITC Section 301 list.'
  };
}

export function adcvdRisk(hts: string, description: string, country: string) {
  const text = `${hts} ${description} ${country}`.toLowerCase();
  const keywords = ['aluminum','steel','wood flooring','vinyl','solar','tire','cabinet','mattress','paper','pipe','tube','fastener','bolt','nail','extrusion','stainless','quartz','ceramic','plywood','glycine','honey','shrimp','rebar'];
  const matchedKeywords = keywords.filter(k => text.includes(k));
  return {
    risk: matchedKeywords.length > 0,
    matchedKeywords,
    note: matchedKeywords.length ? 'Possible AD/CVD scope risk. Verify product scope, country, exporter/manufacturer, and case number in ACE AD/CVD.' : 'No obvious keyword-based AD/CVD risk detected; scope review may still be required.',
    aceAdcvdUrl: 'https://trade.cbp.dhs.gov/ace/adcvd/adcvd-public/'
  };
}

export function pgaRisk(description: string) {
  const t = (description || '').toLowerCase();
  const flags: string[] = [];
  if (/food|supplement|cosmetic|medical|drug|device|fda/.test(t)) flags.push('FDA review');
  if (/wood|plant|seed|lumber|plywood|bamboo/.test(t)) flags.push('APHIS/Lacey Act review');
  if (/engine|motor|vehicle|epa|chemical|pesticide/.test(t)) flags.push('EPA review');
  if (/textile|apparel|cotton|tomato|polysilicon|xinjiang/.test(t)) flags.push('UFLPA forced labor screening');
  return flags;
}
