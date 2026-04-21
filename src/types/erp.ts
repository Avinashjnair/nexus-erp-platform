export type RoleId = 'management' | 'marketing' | 'purchase' | 'qaqc' | 'production' | 'store' | 'workflow' | 'reports' | 'initiate';

export interface UserRole {
  name: string;
  initials: string;
  title: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  type: string;
  contractValue: number;
  currency: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'near-complete';
  pm: string;
  qcLead: string;
  procLead: string;
  phases: string[];
  currentPhase: number;
}

export interface PurchaseRequest {
  id: string;
  item: string;
  qty: string;
  unit: string;
  project: string;
  dept: string;
  priority: 'urgent' | 'normal';
  status: 'pending' | 'approved' | 'po-issued' | 'delivered' | 'rejected';
  raised: string;
  raisedBy: string;
  remarks: string;
  justification: string;
  poNo?: string;
}

export interface InspectionRequest {
  id: string;
  activity: string;
  type: string;
  project: string;
  itp: string;
  date: string;
  requestedBy: string;
  status: 'scheduled' | 'pending' | 'approved' | 'rejected';
  location: string;
  drawingRef: string;
  reportRef?: string;
  result?: string;
  ncrRef?: string;
}

export interface InspectionReport {
  id: string;
  irRef: string;
  title: string;
  type: string;
  project: string;
  date: string;
  result: string;
  inspector: string;
  client: string;
  file: string;
  size: string;
}

export interface NCR {
  id: string;
  activity: string;
  project: string;
  raised: string;
  raisedBy: string;
  severity: 'major' | 'minor';
  status: 'open' | 'closed';
  description: string;
  corrective: string;
  closedDate?: string;
}

export interface ProductionActivity {
  id: string;
  name: string;
  crew: string;
  planned: number;
  actual: number;
  start: string;
  end: string;
  status: 'in-progress' | 'behind' | 'on-track' | 'ahead';
  lastUpdated: string;
  phase: string;
}

export interface MaterialRequest {
  id: string;
  item: string;
  qty: string;
  from: string;
  status: 'pending' | 'issued' | 'partial';
  date: string;
  project: string;
}

export interface SKU {
  id: string;
  desc: string;
  category: string;
  onHand: number;
  unit: string;
  minStock: number;
  maxStock: number;
  location: string;
  status: 'critical' | 'low' | 'ok';
}

export interface Tender {
  id: string;
  ref: string;
  client: string;
  title: string;
  value: number;
  deadline: string;
  status: 'drafting' | 'submitted' | 'won' | 'lost';
  team: string;
  probability: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  onTime: number;
  quality: number;
  active: boolean;
  spend: number;
  pqs: string;
}

export interface ActivityLogItem {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  text: string;
  time: string;
  dept: string;
}
