export type UserRole = 'admin' | 'broker' | 'importer' | 'viewer';
export type Tenant = { id: string; name: string; plan: 'starter' | 'broker' | 'enterprise' };
export type ShipmentStatus = 'draft' | 'documents_uploaded' | 'ai_reviewed' | 'broker_review' | 'ready_for_entry' | 'filed' | 'released';
export type Shipment = {
  id: string;
  tenantId: string;
  importerName: string;
  reference: string;
  originCountry: string;
  mode: 'ocean' | 'air' | 'truck' | 'rail';
  customsValue: number;
  status: ShipmentStatus;
};
