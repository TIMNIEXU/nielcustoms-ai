'use client';
import { useState } from 'react';
import { Card } from './Card';

export default function ComplianceRiskEngine(){
 const [form,setForm]=useState({hts:'',country:'',description:''}); const [result,setResult]=useState<any>(null);
 const update=(k:string,v:string)=>setForm({...form,[k]:v});
 async function screen(){ const res=await fetch('/api/compliance-risk',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setResult(await res.json()); }
 return <Card title="AI Compliance Risk Engine">
  <div className="grid gap-3 md:grid-cols-3"><input className="rounded-lg bg-slate-900 p-3" placeholder="HTS" onChange={e=>update('hts',e.target.value)} /><input className="rounded-lg bg-slate-900 p-3" placeholder="Country" onChange={e=>update('country',e.target.value)} /><input className="rounded-lg bg-slate-900 p-3" placeholder="Description" onChange={e=>update('description',e.target.value)} /></div>
  <button onClick={screen} className="mt-4 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Run Risk Screen</button>
  {result && <pre className="mt-4 max-h-[360px] overflow-auto rounded-xl bg-black p-4 text-xs text-cyan-100">{JSON.stringify(result,null,2)}</pre>}
 </Card>;
}
