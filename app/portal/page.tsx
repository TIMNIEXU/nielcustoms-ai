import ImporterPortal from '@/components/ImporterPortal';
import OcrUpload from '@/components/OcrUpload';
import TariffCalculator from '@/components/TariffCalculator';
export default function PortalPage(){ return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl space-y-6"><h1 className="text-4xl font-bold">Importer Portal</h1><ImporterPortal/><div className="grid gap-6 lg:grid-cols-2"><OcrUpload/><TariffCalculator/></div></div></main>; }
