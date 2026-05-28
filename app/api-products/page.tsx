import { Card } from '@/components/Card';
export default function ApiProductsPage(){ return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-5xl space-y-6"><h1 className="text-4xl font-bold">API Products</h1><Card title="Available Internal APIs"><pre className="rounded-xl bg-black p-4 text-sm text-cyan-100">{`POST /api/ocr-upload
POST /api/tariff-calculator
POST /api/hts-classify
POST /api/compliance-risk
POST /api/customs-chat
GET  /api/shipments
POST /api/shipments
POST /api/abi  mock-safe
GET  /api/ace  reference-safe
GET  /api/tenants`}</pre></Card></div></main>; }
