'use client';
import { useState } from 'react';
import { Card } from './Card';

export default function OcrUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  async function handleUpload() {
    if (!file) return alert('Please select a file first.');
    setLoading(true); setResult(null);
    const formData = new FormData(); formData.append('file', file);
    const res = await fetch('/api/ocr-upload', { method: 'POST', body: formData });
    setResult(await res.json()); setLoading(false);
  }
  return <Card title="AI OCR Customs Upload">
    <p className="text-slate-300">Upload Invoice, Packing List, or customs documents. AI extracts data and screens customs risk.</p>
    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-5 block w-full rounded-lg border border-slate-700 bg-slate-900 p-3" />
    <button onClick={handleUpload} disabled={loading} className="mt-4 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? 'Analyzing...' : 'Upload & Analyze'}</button>
    {result && <pre className="mt-5 max-h-[420px] overflow-auto rounded-xl bg-black p-4 text-xs text-cyan-100">{JSON.stringify(result, null, 2)}</pre>}
  </Card>;
}
