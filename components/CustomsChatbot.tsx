'use client';
import { useState } from 'react';
import { Card } from './Card';

export default function CustomsChatbot() {
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  async function ask() {
    if (!message.trim()) return;
    setLoading(true);
    const res = await fetch('/api/customs-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
    const data = await res.json(); setAnswer(data.answer || data.error); setLoading(false);
  }
  return <Card title="Customs AI Chatbot">
    <textarea className="min-h-28 w-full rounded-lg bg-slate-900 p-3" placeholder="Ask about HTS, duty, bond, ISF, PGA, documents..." value={message} onChange={e => setMessage(e.target.value)} />
    <button onClick={ask} disabled={loading} className="mt-3 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? 'Thinking...' : 'Ask Customs AI'}</button>
    {answer && <div className="mt-4 whitespace-pre-wrap rounded-xl bg-black p-4 text-sm text-slate-100">{answer}</div>}
  </Card>;
}
