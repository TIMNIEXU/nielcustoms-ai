import { Card } from './Card';
import { demoShipments } from '@/data/demo';

export default function ImporterPortal(){
 return <Card title="Importer Portal">
  <div className="grid gap-4 md:grid-cols-3"><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">Open Shipments</p><p className="text-3xl font-bold">{demoShipments.length}</p></div><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">AI Reviewed</p><p className="text-3xl font-bold">1</p></div><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">Broker Review</p><p className="text-3xl font-bold">1</p></div></div>
  <table className="mt-5 w-full text-left text-sm"><thead className="text-slate-400"><tr><th>Shipment</th><th>Importer</th><th>Origin</th><th>Value</th><th>Status</th></tr></thead><tbody>{demoShipments.map(s=><tr key={s.id} className="border-t border-slate-800"><td className="py-3">{s.id}</td><td>{s.importerName}</td><td>{s.originCountry}</td><td>${s.customsValue}</td><td className="text-cyan-300">{s.status}</td></tr>)}</tbody></table>
 </Card>;
}
