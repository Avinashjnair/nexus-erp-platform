export type RoleId = 'management' | 'marketing' | 'purchase' | 'qaqc' | 'production' | 'store' | 'workflow' | 'reports' | 'initiate' | 'strategic';

export interface UserRole {
  role: RoleId;
  name: string;
  initials: string;
  title: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  clientId: string;
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
  acquisitionCost?: number; // Total bid cost
  partnerId?: string; // JV Partner
}

// ... existing interfaces ...

export interface TenderCostEntry {
  id: string;
  projectId: string;
  type: 'Engineering' | 'Estimation' | 'BD' | 'Travel' | 'Testing' | 'Consulting';
  description: string;
  amount: number;
  hours?: number;
  date: string;
  performedBy: string;
}

export interface ProposalMapping {
  id: string;
  projectId: string;
  sections: {
    id: string;
    name: string;
    source: 'Engineering' | 'Legal' | 'CRM' | 'Finance';
    status: 'pending' | 'mapped' | 'error';
    data?: any;
  }[];
  generatedAt?: string;
  version: number;
}

export interface ClientHealth {
  clientId: string;
  clientName: string;
  healthScore: number; // 1-100
  winRate: number; // percentage
  avgPaymentDelay: number; // days
  marginVariance: number; // percentage
  totalValue: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Partner {
  id: string;
  name: string;
  category: 'Civil' | 'Electrical' | 'Logistics' | 'Specialist';
  revenueSplit: number; // percentage
  activeBids: string[]; // project IDs
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
  category: string;
}

export interface Quotation {
  id: string;
  tenderId?: string;
  title: string;
  client: string;
  value: number;
  status: 'draft' | 'approval' | 'sent' | 'revised' | 'accepted' | 'rejected';
  date: string;
  version: number;
}

export interface Feedback {
  id: string;
  projectId: string;
  client: string;
  rating: number;
  comment: string;
  date: string;
  status: 'resolved' | 'pending';
}

export interface ERPDocument {
  id: string;
  title: string;
  type: 'Drawing' | 'Specification' | 'ITP' | 'MOM' | 'Deviation Clearance' | 'Contract' | 'Photo';
  category: string;
  status: 'Draft' | 'Approved' | 'Superseded' | 'Verified';
  version: string;
  revision?: string;
  remarks?: string;
  parentId: string; // ProjectID or TenderID
  file: string;
  size: string;
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

export interface VaultDocument {
  id: string;
  category: string;
  mandatory: boolean;
  file?: File;
  fileName?: string;
  revision?: string;
  remarks?: string;
  verified: boolean;
}

export interface DocumentVersion {
  versionId: string;
  revisionName: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  remarks: string;
}

export interface ProjectDocument {
  id: string;
  category: 'Drawing' | 'Specification' | 'MOM' | 'Contract' | 'Deviation Request' | 'Approval Copies' | 'Scope Additions';
  title: string;
  currentVersion: DocumentVersion;
  history: DocumentVersion[];
}

export interface CompetitorBid {
  id: string;
  tenderId: string;
  competitorName: string;
  winningBid: number;
  reasonForLoss: string;
  date: string;
}

export interface InternalApproval {
  id: string;
  projectId: string;
  stage: 'Costing' | 'Technical' | 'Commercial' | 'Final';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';
  requestedBy: string;
  assignedTo: string;
  estimationCost?: number;
  grossMargin?: number;
  remarks: string;
  updatedAt: string;
}

export interface ClientActivity {
  id: string;
  projectId: string;
  type: 'Meeting' | 'Email' | 'Call' | 'Visit' | 'Drawing Send';
  description: string;
  attendees?: string;
  date: string;
  performedBy: string;
}
