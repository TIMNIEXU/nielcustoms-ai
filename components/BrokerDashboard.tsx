import { Card } from './Card';
import { demoShipments } from '@/data/demo';

export default function BrokerDashboard(){
 return <Card title="Broker Dashboard">
  <div className="grid gap-4 md:grid-cols-4"><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">Queue</p><p className="text-3xl font-bold">{demoShipments.length}</p></div><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">Needs HTS Review</p><p className="text-3xl font-bold">2</p></div><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">AD/CVD Alerts</p><p className="text-3xl font-bold">1</p></div><div className="rounded-xl bg-slate-900 p-4"><p className="text-slate-400">Ready ABI</p><p className="text-3xl font-bold">0</p></div></div>
  <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4 text-yellow-200">ABI / ACE panels are intentionally mock-safe until approved filer/vendor access is configured.</div>
 </Card>;
}
