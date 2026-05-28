'use client';
import { useState } from 'react';
import { Card } from './Card';

export default function HtsClassifier() {
  const [form, setForm] = useState({ description: '', material: '', use: '', country: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const update = (k:string,v:string)=>setForm({...form,[k]:v});
  async function classify(){ setLoading(true); const res=await fetch('/api/hts-classify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setResult(await res.json()); setLoading(false); }
  return <Card title="Automatic HTS Classification">
    <div className="grid gap-3 md:grid-cols-2">
      <input className="rounded-lg bg-slate-900 p-3" placeholder="Product description" onChange={e=>update('description',e.target.value)} />
      <input className="rounded-lg bg-slate-900 p-3" placeholder="Material" onChange={e=>update('material',e.target.value)} />
      <input className="rounded-lg bg-slate-900 p-3" placeholder="Use / function" onChange={e=>update('use',e.target.value)} />
      <input className="rounded-lg bg-slate-900 p-3" placeholder="Country" onChange={e=>update('country',e.target.value)} />
    </div>
    <button onClick={classify} disabled={loading} className="mt-4 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950">{loading?'Classifying...':'Suggest HTS'}</button>
    {result && <pre className="mt-4 max-h-[360px] overflow-auto rounded-xl bg-black p-4 text-xs text-cyan-100">{JSON.stringify(result,null,2)}</pre>}
  </Card>;
}
