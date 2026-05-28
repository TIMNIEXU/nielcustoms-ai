import OcrUpload from '@/components/OcrUpload';
import TariffCalculator from '@/components/TariffCalculator';
import CustomsChatbot from '@/components/CustomsChatbot';
import HtsClassifier from '@/components/HtsClassifier';
import ComplianceRiskEngine from '@/components/ComplianceRiskEngine';
import ImporterPortal from '@/components/ImporterPortal';
import BrokerDashboard from '@/components/BrokerDashboard';
import PlatformModules from '@/components/PlatformModules';

export default function Home() {
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0e7490_0,#020617_38%)] px-6 py-10">
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="rounded-3xl border border-cyan-400/20 bg-black/40 p-8">
        <p className="text-cyan-300">NielCustoms.ai</p>
        <h1 className="mt-2 text-4xl font-bold md:text-6xl">AI Customs Operating System</h1>
        <p className="mt-4 max-w-3xl text-slate-300">OCR document intake, HTS classification, tariff calculation, compliance risk engine, importer portal, broker dashboard, and ABI/ACE-ready architecture.</p>
        <div className="mt-6 flex gap-3"><a href="/portal" className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Importer Portal</a><a href="/broker" className="rounded-lg border border-cyan-400 px-5 py-3 text-cyan-300">Broker Dashboard</a></div>
      </header>
      <PlatformModules />
      <div className="grid gap-8 lg:grid-cols-2"><OcrUpload /><TariffCalculator /></div>
      <div className="grid gap-8 lg:grid-cols-2"><HtsClassifier /><ComplianceRiskEngine /></div>
      <CustomsChatbot />
      <div className="grid gap-8 lg:grid-cols-2"><ImporterPortal /><BrokerDashboard /></div>
    </div>
  </main>;
}
