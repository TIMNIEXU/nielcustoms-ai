import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NielCustoms.ai | AI Customs Operating System',
  description: 'AI customs clearance, OCR, tariff calculation, risk screening, importer portal, broker dashboard.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
