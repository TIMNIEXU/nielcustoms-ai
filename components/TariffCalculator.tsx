'use client';
import { useState } from 'react';
import { Card } from './Card';

export default function TariffCalculator() {
  const [form, setForm] = useState({ hts: '', country: '', description: '', customsValue: '', mode: 'ocean', section122Rate: '0' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const update = (name: string, value: string) => setForm({ ...form, [name]: value });
  async function calculate() {
    setLoading(true); setResult(null);
    const res = await fetch('/api/tariff-calculator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setResult(await res.json()); setLoading(false);
  }
  return <Card title="AI Tariff Calculator">
    <p className="text-slate-300">Auto lookup HTS duty rate and screen Section 301 / AD-CVD / PGA risk.</p>
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <input className="rounded-lg bg-slate-900 p-3" placeholder="HTS, e.g. 8504.40.95.90" onChange={e => update('hts', e.target.value)} />
      <input className="rounded-lg bg-slate-900 p-3" placeholder="Country of Origin" onChange={e => update('country', e.target.value)} />
      <input className="rounded-lg bg-slate-900 p-3 md:col-span-2" placeholder="Product Description" onChange={e => update('description', e.target.value)} />
      <input className="rounded-lg bg-slate-900 p-3" placeholder="Customs Value USD" onChange={e => update('customsValue', e.target.value)} />
      <select className="rounded-lg bg-slate-900 p-3" value={form.mode} onChange={e => update('mode', e.target.value)}><option value="ocean">Ocean</option><option value="air">Air</option><option value="truck">Truck</option><option value="rail">Rail</option></select>
      <input className="rounded-lg bg-slate-900 p-3 md:col-span-2" placeholder="Optional 122 / extra tariff %" value={form.section122Rate} onChange={e => update('section122Rate', e.target.value)} />
    </div>
    <button onClick={calculate} disabled={loading} className="mt-5 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? 'Checking...' : 'Calculate'}</button>
    {result?.calculation && <div className="mt-5 space-y-2 rounded-xl bg-black p-4 text-sm">
      <p className="font-bold text-cyan-300">{result.htsLookup.htsno} — {result.htsLookup.description}</p>
      <p>General Duty: {result.htsLookup.generalRateText}</p><p>Base Duty: ${result.calculation.baseDuty}</p><p>MPF: ${result.calculation.mpf}</p><p>HMF: ${result.calculation.hmf}</p><p>Section 301: ${result.calculation.section301}</p><p>Additional Tariff: ${result.calculation.section122}</p><p className="text-lg font-bold text-cyan-300">Estimated Total: ${result.calculation.estimatedTotalDutyAndFees}</p>
      <p className="text-yellow-300">301: {result.riskScreening.section301.note}</p><p className="text-yellow-300">AD/CVD: {result.riskScreening.adcvd.note}</p><p>PGA Flags: {result.riskScreening.pgaFlags.join(', ') || 'None detected'}</p>
    </div>}
    {result?.error && <div className="mt-4 rounded-xl bg-red-950 p-4 text-red-200">{result.error}</div>}
  </Card>;
}
