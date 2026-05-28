import BrokerDashboard from '@/components/BrokerDashboard';
import HtsClassifier from '@/components/HtsClassifier';
import ComplianceRiskEngine from '@/components/ComplianceRiskEngine';
export default function BrokerPage(){ return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl space-y-6"><h1 className="text-4xl font-bold">Broker Dashboard</h1><BrokerDashboard/><div className="grid gap-6 lg:grid-cols-2"><HtsClassifier/><ComplianceRiskEngine/></div></div></main>; }
