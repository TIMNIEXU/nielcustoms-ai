import type { Shipment, Tenant } from '@/lib/types';
export const demoTenants: Tenant[] = [
  { id: 't_niel', name: 'Niel Customs Demo Importer', plan: 'broker' },
  { id: 't_joma', name: 'Joma Logistics Demo Account', plan: 'enterprise' }
];
export const demoShipments: Shipment[] = [
  { id: 'SHP-1001', tenantId: 't_niel', importerName: 'Demo Importer LLC', reference: 'INV-8891', originCountry: 'China', mode: 'ocean', customsValue: 45000, status: 'broker_review' },
  { id: 'SHP-1002', tenantId: 't_joma', importerName: 'Warehouse Buyer Inc.', reference: 'PO-5530', originCountry: 'Vietnam', mode: 'air', customsValue: 12500, status: 'documents_uploaded' }
];
