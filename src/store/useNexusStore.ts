import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Project, PurchaseRequest, InspectionRequest, InspectionReport, 
  NCR, ProductionActivity, MaterialRequest, SKU, Tender, Vendor, 
  ActivityLogItem, RoleId, UserRole, Quotation, Feedback, ERPDocument,
  ProjectDocument, DocumentVersion, CompetitorBid, InternalApproval, ClientActivity,
  TenderCostEntry, ProposalMapping, ClientHealth, Partner
} from '../types/erp';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NexusState {
  currentUser: UserRole | null;
  currentRole: RoleId;
  currentProject: string;
  roles: Record<RoleId, UserRole>;
  projects: Project[];
  purchaseRequests: PurchaseRequest[];
  inspectionRequests: InspectionRequest[];
  reports: InspectionReport[];
  ncrs: NCR[];
  activities: ProductionActivity[];
  materialRequests: MaterialRequest[];
  inventory: SKU[];
  activeStoreSection: 'dashboard' | 'inventory' | 'inbound' | 'outbound' | 'audit';
  tenders: Tender[];
  quotations: Quotation[];
  feedback: Feedback[];
  documents: ERPDocument[];
  projectDocuments: ProjectDocument[];
  vendors: Vendor[];
  activityLog: ActivityLogItem[];
  competitorBids: CompetitorBid[];
  internalApprovals: InternalApproval[];
  clientActivities: ClientActivity[];
  tenderCosts: TenderCostEntry[];
  clients: ClientHealth[];
  partners: Partner[];
  
  // Modal State
  modalOpen: string | null;
  modalData: any;

  // Toast State
  toasts: Toast[];

  deptEfficiency: {
    name: string;
    utilization: number;
    onTime: number;
    completionTime: number; // in days
  }[];
  financialStats: {
    period: string;
    revenue: number;
    cost: number;
    loss: number;
  }[];

  costVariance: { phase: string; budget: number; actual: number; labor: number; material: number }[];
  vendorSpend: { name: string; value: number }[];
  commodityImpact: { material: string; change: number; impact: number }[];
  capacityHeatmap: { phase: string; load: number; capacity: number; status: 'optimal' | 'nearing' | 'over' }[];
  
  hseStats: { ltiDays: number; incidentHistory: { month: string; misses: number; incidents: number }[] };
  laborCosts: { dept: string; regular: number; overtime: number; otCost: number }[];
  bidPipeline: { stage: string; value: number; count: number }[];
  vendorCompliance: { category: string; value: number; color: string }[];

  // Departmental Performance
  procurement: { ppv: number; otif: { vendor: string; rate: number }[] };
  engineering: { ecoTrend: { week: string; count: number }[]; releaseAdherence: number };
  production: { cycleTime: { stage: string; estimated: number; actual: number }[]; machineLoad: { bay: string; load: number }[] };
  quality: { fpy: number; ncrResolution: { month: string; days: number }[] };
  projectControls: { cpi: number; spi: number };

  notifications: { id: string; type: 'success' | 'warning' | 'error' | 'info'; title: string; text: string; time: string; read: boolean }[];

  // Actions
  setRole: (role: RoleId) => void;
  addNotification: (notif: { type: 'success' | 'warning' | 'error' | 'info'; title: string; text: string }) => void;
  markAsRead: (id: string) => void;
  setCurrentProject: (id: string) => void;
  login: (role: RoleId) => void;
  logout: () => void;
  openModal: (id: string, data?: any) => void;
  closeModal: () => void;
  
  addToast: (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;

  // Mutation Actions
  addProject: (project: Project) => void;
  
  addPR: (pr: PurchaseRequest) => void;
  approvePR: (id: string) => void;
  rejectPR: (id: string) => void;
  
  addIR: (ir: InspectionRequest) => void;
  updateIRStatus: (id: string, status: InspectionRequest['status']) => void;
  addNCR: (ncr: NCR) => void;
  addReport: (report: InspectionReport) => void;

  addCompetitorBid: (bid: CompetitorBid) => void;
  addInternalApproval: (approval: InternalApproval) => void;
  updateInternalApproval: (id: string, updates: Partial<InternalApproval>) => void;
  addClientActivity: (activity: ClientActivity) => void;
  
  updateActivityProgress: (id: string, progress: number) => void;
  
  addMR: (mr: MaterialRequest) => void;
  issueMR: (id: string) => void;
  
  uploadDocumentRevision: (docId: string, version: DocumentVersion) => void;
  setStoreSection: (section: 'dashboard' | 'inventory' | 'inbound' | 'outbound' | 'audit') => void;
  addTenderCost: (cost: TenderCostEntry) => void;
  updateClientHealth: (id: string, updates: Partial<ClientHealth>) => void;
  generateProposal: (projectId: string) => void;
  _log: (item: Omit<ActivityLogItem, 'id'>) => void;
}

export const useNexusStore = create<NexusState>()(
  persist(
    (set) => ({
  currentUser: null,
  currentRole: 'management',
  currentProject: 'p1',
  modalOpen: null,
  modalData: null,
  toasts: [],
  activeStoreSection: 'dashboard',

  roles: {
    management: { role: 'management', name: 'Ahmed Mansouri', initials: 'AM', title: 'Project Manager', color: '#e8a020' },
    marketing:  { role: 'marketing', name: 'Sara Al Hashimi', initials: 'SH', title: 'Marketing Lead', color: '#3b82f6' },
    purchase:   { role: 'purchase', name: 'Khalid Ibrahim', initials: 'KI', title: 'Procurement Officer', color: '#f59e0b' },
    qaqc:       { role: 'qaqc', name: 'Priya Nair', initials: 'PN', title: 'QC Engineer', color: '#10b981' },
    production: { role: 'production', name: 'Omar Al Suwaidi', initials: 'OS', title: 'Production Supervisor', color: '#f97316' },
    store:      { role: 'store', name: 'Rajan Pillai', initials: 'RP', title: 'Store Keeper', color: '#8b5cf6' },
    workflow:   { role: 'workflow', name: 'System Automator', initials: 'SA', title: 'Workflow Engine', color: '#14b8a6' },
    reports:    { role: 'reports', name: 'Data Analyst', initials: 'DA', title: 'Intelligence Lead', color: '#4f7cff' },
    initiate:   { role: 'initiate', name: 'Ahmed Mansouri', initials: 'AM', title: 'Project Manager', color: '#e8a020' },
    strategic:  { role: 'strategic', name: 'Data Analyst', initials: 'DA', title: 'Intelligence Lead', color: '#4f7cff' }
  },

  projects: [
    { id: 'p1', title: 'ADNOC Offshore Platform A', client: 'ADNOC Offshore', clientId: 'c1', type: 'EPC', contractValue: 18400000, currency: 'AED', startDate: '2025-01-15', endDate: '2025-08-30', progress: 72, status: 'on-track', pm: 'Ahmed Mansouri', qcLead: 'Priya Nair', procLead: 'Khalid Ibrahim', phases: ['Engineering', 'Procurement', 'Fabrication', 'QAQC', 'Delivery'], currentPhase: 2, acquisitionCost: 245000 },
    { id: 'p2', title: 'Ruwais Industrial Expansion', client: 'Ruwais Authority', clientId: 'c2', type: 'Civil + MEP', contractValue: 9200000, currency: 'AED', startDate: '2025-03-01', endDate: '2025-10-15', progress: 45, status: 'delayed', pm: 'Ahmed Mansouri', qcLead: 'Priya Nair', procLead: 'Khalid Ibrahim', phases: ['Design', 'Procurement', 'Civil', 'MEP', 'Handover'], currentPhase: 1, acquisitionCost: 110000 },
    { id: 'p3', title: 'KIZAD Infrastructure Ph.3', client: 'KIZAD Authority', clientId: 'c3', type: 'Fabrication', contractValue: 5700000, currency: 'AED', startDate: '2024-11-01', endDate: '2025-05-20', progress: 91, status: 'near-complete', pm: 'Ahmed Mansouri', qcLead: 'Priya Nair', procLead: 'Khalid Ibrahim', phases: ['Design', 'Procurement', 'Fabrication', 'Inspection', 'Delivery'], currentPhase: 4, acquisitionCost: 45000 }
  ],

  purchaseRequests: [
    { id:'PR-0815', item:'SS Pipe 4" SCH40', qty:'24 pcs', unit:'pcs', project:'p1', dept:'Production', priority:'urgent', status:'pending', raised:'2025-05-19', raisedBy:'Omar Al Suwaidi', remarks:'Required for manifold spool assembly', justification:'Phase 2 fabrication critical path item' },
    { id:'PR-0814', item:'Hydraulic Fittings 1/2"', qty:'240 pcs', unit:'pcs', project:'p1', dept:'Production', priority:'normal', status:'pending', raised:'2025-05-18', raisedBy:'Omar Al Suwaidi', remarks:'Stock replenishment', justification:'Current stock at 12 pcs — reorder point 50 pcs' },
    { id:'PR-0813', item:'Carbon Steel Plate 25mm', qty:'18 tons', unit:'tons', project:'p2', dept:'Store', priority:'normal', status:'approved', raised:'2025-05-16', raisedBy:'Rajan Pillai', remarks:'Approved by PM', justification:'Deck frame construction' },
    { id:'PR-0812', item:'Welding Wire ER70S-6 (15kg)', qty:'30 spools', unit:'spools', project:'p1', dept:'Production', priority:'normal', status:'po-issued', raised:'2025-05-14', raisedBy:'Omar Al Suwaidi', poNo:'PO-4412', remarks:'PO issued to Gulf Steel', justification:'Stock depleted' },
    { id:'PR-0811', item:'Safety Helmets Class E', qty:'50 pcs', unit:'pcs', project:'p1', dept:'QAQC', priority:'normal', status:'delivered', raised:'2025-05-10', raisedBy:'Priya Nair', remarks:'Delivered and GRN processed', justification:'Site safety requirement' },
    { id:'PR-0810', item:'Grinding Discs 115mm', qty:'200 pcs', unit:'pcs', project:'p3', dept:'Production', priority:'normal', status:'delivered', raised:'2025-05-08', raisedBy:'Omar Al Suwaidi', remarks:'Delivered', justification:'Fabrication consumables' }
  ],

  inspectionRequests: [
    { id:'IR-2048', activity:'Hydro Test — Manifold Spool MS-07', type:'Hold Point', project:'p1', itp:'ITP-001 §4.8', date:'2025-05-22', requestedBy:'Omar Al Suwaidi', status:'scheduled', location:'Bay 4 — Test bench', drawingRef:'DWG-MS-07-R2' },
    { id:'IR-2047', activity:'PWHT — Node Joints N44-N52', type:'Witness Point', project:'p1', itp:'ITP-001 §3.5', date:'2025-05-21', requestedBy:'Omar Al Suwaidi', status:'scheduled', location:'Furnace Room A', drawingRef:'DWG-STR-12-R3' },
    { id:'IR-2046', activity:'Dimensional Check — Skid Frame SK-03', type:'Review Point', project:'p1', itp:'ITP-002 §2.1', date:'2025-05-20', requestedBy:'Omar Al Suwaidi', status:'pending', location:'Bay 2', drawingRef:'DWG-SK-03-R1' },
    { id:'IR-2045', activity:'Visual Weld Inspection — Deck 3', type:'Hold Point', project:'p1', itp:'ITP-001 §3.2', date:'2025-05-18', requestedBy:'Omar Al Suwaidi', status:'approved', location:'Deck 3 — All joints', drawingRef:'DWG-DK3-R4', reportRef:'RPT-2045', result:'Pass' },
    { id:'IR-2044', activity:'Pressure Test — Piping Loop C', type:'Witness Point', project:'p1', itp:'ITP-003 §5.1', date:'2025-05-15', requestedBy:'Omar Al Suwaidi', status:'approved', location:'Piping Bay', drawingRef:'DWG-PP-C-R2', reportRef:'RPT-2044', result:'Pass' },
    { id:'IR-2043', activity:'Blasting Grade SA 2.5 — Zone B', type:'Hold Point', project:'p1', itp:'ITP-004 §1.3', date:'2025-05-12', requestedBy:'Omar Al Suwaidi', status:'rejected', location:'Zone B', drawingRef:'DWG-BLT-02', result:'Fail — NCR Raised', ncrRef:'NCR-041' }
  ],

  reports: [
    { id:'RPT-2045', irRef:'IR-2045', title:'Visual Weld Inspection — Deck 3', type:'Weld Inspection', project:'p1', date:'2025-05-18', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'VWI_DECK3_20250518.pdf', size:'2.4 MB' },
    { id:'RPT-2044', irRef:'IR-2044', title:'Pressure Test — Piping Loop C', type:'Pressure Test', project:'p1', date:'2025-05-15', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'PT_LOOP_C_20250515.pdf', size:'1.8 MB' },
    { id:'RPT-2043', irRef:'IR-2042', title:'Hydrotest — Manifold Assembly', type:'Hydrotest', project:'p1', date:'2025-05-10', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'HT_MANF_20250510.pdf', size:'3.1 MB' },
    { id:'RPT-2042', irRef:'IR-2039', title:'Dimensional Report — Jacket Nodes', type:'Dimensional', project:'p1', date:'2025-05-05', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'DIM_NODES_20250505.pdf', size:'4.2 MB' }
  ],

  ncrs: [
    { id:'NCR-042', activity:'Painting Defect — Zone C', project:'p1', raised:'2025-05-16', raisedBy:'Priya Nair', severity:'major', status:'open', description:'Primer adhesion failure on 3 panels. Area: approx 12 m².', corrective:'Re-blasting to SA 2.5 and re-application required' },
    { id:'NCR-041', activity:'Blasting Grade SA 2.5 — Zone B', project:'p1', raised:'2025-05-12', raisedBy:'Priya Nair', severity:'major', status:'closed', description:'Surface profile below specification. Ra 40µm vs required 50µm.', corrective:'Re-blasted and re-inspected. Accepted.', closedDate:'2025-05-15' }
  ],

  activities: [
    { id:'ACT-01', name:'Structural Welding — Deck A', crew:'Team Alpha', planned:80, actual:85, start:'2025-04-01', end:'2025-06-15', status:'in-progress', lastUpdated:'Today 09:30', phase:'Fabrication' },
    { id:'ACT-02', name:'Pipe Spool Fabrication', crew:'Team Beta', planned:65, actual:58, start:'2025-04-15', end:'2025-06-30', status:'behind', lastUpdated:'Today 08:45', phase:'Fabrication' },
    { id:'ACT-03', name:'Blasting & Painting Zone B', crew:'Techno Coat LLC', planned:70, actual:70, start:'2025-05-01', end:'2025-06-20', status:'on-track', lastUpdated:'Yesterday', phase:'Fabrication' },
    { id:'ACT-04', name:'Electrical Conduit Installation', crew:'Team Gamma', planned:40, actual:44, start:'2025-05-10', end:'2025-07-01', status:'ahead', lastUpdated:'Today 10:00', phase:'MEP' },
    { id:'ACT-05', name:'Insulation Works — Piping', crew:'Sub-contractor', planned:20, actual:12, start:'2025-05-15', end:'2025-07-15', status:'behind', lastUpdated:'May 17', phase:'MEP' },
    { id:'ACT-06', name:'Structural Assembly — Module 2', crew:'Team Alpha', planned:55, actual:52, start:'2025-04-20', end:'2025-06-25', status:'on-track', lastUpdated:'Today 07:30', phase:'Fabrication' }
  ],

  materialRequests: [
    { id:'MR-0528', item:'SS Pipe 4" SCH40', qty:'12 pcs', from:'Production', status:'pending', date:'2025-05-19', project:'p1' },
    { id:'MR-0527', item:'Bolts M20×80 Gr.8.8', qty:'500 pcs', from:'Production', status:'issued', date:'2025-05-18', project:'p1' },
    { id:'MR-0526', item:'Grinding Discs 115mm', qty:'100 pcs', from:'Production', status:'issued', date:'2025-05-17', project:'p1' },
    { id:'MR-0525', item:'Protective Gloves L/XL', qty:'40 pairs', from:'QAQC', status:'partial', date:'2025-05-16', project:'p1' },
    { id:'MR-0524', item:'Welding Rods E7018 (5kg)', qty:'20 packs', from:'Production', status:'pending', date:'2025-05-19', project:'p2' }
  ],

  inventory: [
    { id:'SKU-001', desc:'Carbon Steel Plate 25mm', category:'Steel', onHand:1.2, unit:'tons', minStock:5, maxStock:20, location:'Bay A-1', status:'critical' },
    { id:'SKU-002', desc:'SS Pipe 4" SCH40', category:'Pipes', onHand:8, unit:'pcs', minStock:20, maxStock:80, location:'Pipe Rack B', status:'low' },
    { id:'SKU-003', desc:'Welding Wire ER70S-6 15kg', category:'Consumables', onHand:3, unit:'spools', minStock:10, maxStock:50, location:'Store Room 2', status:'critical' },
    { id:'SKU-004', desc:'Welding Electrodes E7018 5kg', category:'Consumables', onHand:45, unit:'packs', minStock:20, maxStock:100, location:'Store Room 2', status:'ok' },
    { id:'SKU-005', desc:'Primer Paint EP Red Oxide', category:'Paint', onHand:8, unit:'litre', minStock:20, maxStock:100, location:'Paint Store', status:'low' },
    { id:'SKU-006', desc:'Safety Helmets Class E', category:'PPE', onHand:22, unit:'pcs', minStock:10, maxStock:60, location:'PPE Store', status:'ok' },
    { id:'SKU-007', desc:'Grinding Discs 115mm', category:'Consumables', onHand:380, unit:'pcs', minStock:100, maxStock:500, location:'Store Room 1', status:'ok' },
    { id:'SKU-008', desc:'Bolts M20×80 Gr.8.8', category:'Fasteners', onHand:1420, unit:'pcs', minStock:500, maxStock:3000, location:'Fastener Bay', status:'ok' }
  ],

  tenders: [
    { id:'TND-2504', ref:'T-25-004', client:'Mubadala Energy', title:'Offshore Jacket Modification', value:6800000, deadline:'2025-06-20', status:'drafting', team:'Sara Al Hashimi', probability:40, category: 'Oil & Gas' },
    { id:'TND-2503', ref:'T-25-003', client:'Emirates Steel', title:'Maintenance Framework 2025', value:1100000, deadline:'2025-06-15', status:'drafting', team:'Sara Al Hashimi', probability:55, category: 'Infrastructure' },
    { id:'TND-2502', ref:'T-25-002', client:'TAQA Arabia', title:'Pipeline Fabrication Ph.2', value:7800000, deadline:'2025-06-03', status:'submitted', team:'Sara Al Hashimi', probability:35, category: 'Oil & Gas' },
    { id:'TND-2501', ref:'T-25-001', client:'ADNOC Offshore', title:'Structural Mods — Jacket', value:4200000, deadline:'2025-05-28', status:'submitted', team:'Sara Al Hashimi', probability:65, category: 'Oil & Gas' },
    { id:'TND-2499', ref:'T-24-012', client:'KIZAD Authority', title:'Civil & MEP Works', value:3400000, deadline:'2025-04-30', status:'won', team:'Sara Al Hashimi', probability:100, category: 'Industrial' },
    { id:'TND-2498', ref:'T-24-011', client:'Mubadala Energy', title:'Tank Farm Modification', value:2900000, deadline:'2025-04-15', status:'lost', team:'Sara Al Hashimi', probability:0, category: 'Oil & Gas' }
  ],

  quotations: [
    { id: 'QT-8801', title: 'Jacket Modification Proposal', client: 'Mubadala Energy', value: 6800000, status: 'draft', date: '2025-05-18', version: 1, tenderId: 'TND-2504' },
    { id: 'QT-8800', title: 'Infrastructure Upgrade Ph.3', client: 'KIZAD Authority', value: 5700000, status: 'accepted', date: '2025-05-10', version: 3, tenderId: 'TND-2499' },
    { id: 'QT-8799', title: 'Pipeline Fab Ph.2 Final', client: 'TAQA Arabia', value: 7800000, status: 'sent', date: '2025-05-15', version: 2, tenderId: 'TND-2502' }
  ],

  feedback: [
    { id: 'FB-001', projectId: 'p3', client: 'KIZAD Authority', rating: 5, comment: 'Excellent execution on the structural nodes. On time delivery.', date: '2025-05-15', status: 'resolved' },
    { id: 'FB-002', projectId: 'p1', client: 'ADNOC Offshore', rating: 4, comment: 'Project on track, communication could be faster.', date: '2025-05-10', status: 'pending' }
  ],

  documents: [
    { id: 'DOC-101', title: 'Main Deck Layout', type: 'Drawing', category: 'Engineering', status: 'Approved', version: 'V2', parentId: 'p1', file: 'DWG-101-V2.pdf', size: '4.5 MB' },
    { id: 'DOC-102', title: 'Technical Specifications', type: 'Specification', category: 'Technical', status: 'Approved', version: 'V1', parentId: 'p1', file: 'SPEC-ADNOC-01.pdf', size: '1.2 MB' },
    { id: 'DOC-103', title: 'Master Service Agreement', type: 'Contract', category: 'Legal', status: 'Approved', version: 'V1', parentId: 'p1', file: 'MSA-ADNOC.pdf', size: '2.8 MB' }
  ],

  projectDocuments: [
    {
      id: 'PDOC-001', category: 'Drawing', title: 'Main Deck Layout',
      currentVersion: { versionId: 'v3', revisionName: 'Rev B', fileName: 'DWG-Deck-Layout-RevB.dwg', fileSize: '14.2 MB', uploadedAt: '2025-05-18', uploadedBy: 'Sara Al Hashimi', remarks: 'Client-approved IFC issue' },
      history: [
        { versionId: 'v2', revisionName: 'Rev A', fileName: 'DWG-Deck-Layout-RevA.dwg', fileSize: '12.4 MB', uploadedAt: '2025-04-10', uploadedBy: 'Sara Al Hashimi', remarks: 'Incorporated client markups from review meeting' },
        { versionId: 'v1', revisionName: 'Rev 0', fileName: 'DWG-Deck-Layout-Rev0.dwg', fileSize: '11.8 MB', uploadedAt: '2025-03-01', uploadedBy: 'Sara Al Hashimi', remarks: 'Initial issue for client review' }
      ]
    },
    {
      id: 'PDOC-002', category: 'Specification', title: 'Technical Specifications',
      currentVersion: { versionId: 'v2', revisionName: 'Rev 1', fileName: 'Technical_Specs_Rev1.pdf', fileSize: '2.4 MB', uploadedAt: '2025-05-12', uploadedBy: 'Sara Al Hashimi', remarks: 'Updated material grades per client P.O.' },
      history: [
        { versionId: 'v1', revisionName: 'Rev 0', fileName: 'Technical_Specs_Rev0.pdf', fileSize: '2.1 MB', uploadedAt: '2025-03-15', uploadedBy: 'Sara Al Hashimi', remarks: 'First issue' }
      ]
    },
    {
      id: 'PDOC-003', category: 'MOM', title: 'Kick-off Meeting Minutes',
      currentVersion: { versionId: 'v1', revisionName: 'Rev 0', fileName: 'MOM_Kickoff_20250310.pdf', fileSize: '340 KB', uploadedAt: '2025-03-10', uploadedBy: 'Sara Al Hashimi', remarks: 'Approved by PM and client' },
      history: []
    },
    {
      id: 'PDOC-004', category: 'Contract', title: 'Master Service Agreement',
      currentVersion: { versionId: 'v1', revisionName: 'V1', fileName: 'MSA-ADNOC-Signed.pdf', fileSize: '2.8 MB', uploadedAt: '2025-01-20', uploadedBy: 'Sara Al Hashimi', remarks: 'Executed copy, signed by both parties' },
      history: []
    },
    {
      id: 'PDOC-005', category: 'Deviation Request', title: 'Material Substitution — CS to SS',
      currentVersion: { versionId: 'v2', revisionName: 'DR-02', fileName: 'DevReq-002-Approved.pdf', fileSize: '890 KB', uploadedAt: '2025-05-05', uploadedBy: 'Priya Nair', remarks: 'Client approved substitution with conditions' },
      history: [
        { versionId: 'v1', revisionName: 'DR-01', fileName: 'DevReq-001-Draft.pdf', fileSize: '780 KB', uploadedAt: '2025-04-22', uploadedBy: 'Priya Nair', remarks: 'Initial deviation request for client review' }
      ]
    },
    {
      id: 'PDOC-006', category: 'Approval Copies', title: 'ADNOC Client Approval Pack',
      currentVersion: { versionId: 'v1', revisionName: 'APC-01', fileName: 'ADNOC-ApprovalPack-IFC.pdf', fileSize: '5.6 MB', uploadedAt: '2025-05-19', uploadedBy: 'Ahmed Mansouri', remarks: 'Stamped IFC drawings + approval transmittal' },
      history: []
    },
    {
      id: 'PDOC-007', category: 'Scope Additions', title: 'Scope Change Order #1',
      currentVersion: { versionId: 'v2', revisionName: 'SCO-1 Rev A', fileName: 'SCO-001-RevA-Signed.pdf', fileSize: '1.1 MB', uploadedAt: '2025-05-14', uploadedBy: 'Ahmed Mansouri', remarks: 'Signed variation order — additional structural nodes' },
      history: [
        { versionId: 'v1', revisionName: 'SCO-1 Draft', fileName: 'SCO-001-Draft.pdf', fileSize: '980 KB', uploadedAt: '2025-05-01', uploadedBy: 'Sara Al Hashimi', remarks: 'Draft for PM review and client negotiation' }
      ]
    }
  ],

  vendors: [
    { id:'V001', name:'Gulf Steel Trading LLC', category:'Structural Steel', contact:'Mohammed Saleh', phone:'+971-2-555-0101', onTime:94, quality:96, active:true, spend:842000, pqs:'ADNOC,TAQA' },
    { id:'V002', name:'Al Fajr Industrial Supply', category:'Pipes & Fittings', contact:'James Wilson', phone:'+971-2-555-0202', onTime:78, quality:82, active:true, spend:340000, pqs:'ADNOC' },
    { id:'V003', name:'Techno Coatings LLC', category:'Paints & Blasting', contact:'Ravi Kumar', phone:'+971-50-555-0303', onTime:62, quality:74, active:true, spend:120000, pqs:'' },
    { id:'V004', name:'ABB Gulf FZE', category:'Electrical & Instruments', contact:'Laura Chen', phone:'+971-4-555-0404', onTime:91, quality:95, active:true, spend:280000, pqs:'ADNOC,KIZAD,TAQA' },
    { id:'V005', name:'National Fasteners UAE', category:'Fasteners & Hardware', contact:'Ali Hassan', phone:'+971-2-555-0505', onTime:88, quality:90, active:true, spend:58000, pqs:'' }
  ],

  activityLog: [
    { type:'success', title:'IR-2045 Approved', text:'QC inspection passed — Offshore Platform A Deck 3', time:'12 min ago', dept:'QAQC' },
    { type:'warning', title:'PR-0815 Raised', text:'SS Pipe 4" SCH40 — 24 pcs requested by Production', time:'38 min ago', dept:'Production' },
    { type:'info', title:'Report Uploaded', text:'Weld inspection report WPS-77 submitted by Priya N.', time:'2 hrs ago', dept:'QAQC' },
    { type:'danger', title:'NCR-042 Raised', text:'Painting defect Zone C — major non-conformance', time:'4 hrs ago', dept:'QAQC' },
    { type:'success', title:'PO-4412 Issued', text:'PO issued to Gulf Steel Trading — AED 184,000', time:'Yesterday', dept:'Purchase' },
    { type:'info', title:'PR-0813 Approved', text:'Carbon Steel Plate 25mm approved by Ahmed M.', time:'2 days ago', dept:'Management' }
  ],

  competitorBids: [
    { id: 'cb1', tenderId: 'T-2024-002', competitorName: 'Global EPC Ltd', winningBid: 4200000, reasonForLoss: 'Lead time too long (Offered 18 weeks, we had 24 weeks)', date: '2025-01-15' },
    { id: 'cb2', tenderId: 'T-2024-004', competitorName: 'Apex Industrial', winningBid: 8900000, reasonForLoss: 'Price (Apex was 8% lower on main equipment)', date: '2025-02-10' },
  ],

  internalApprovals: [
    { id: 'ia1', projectId: 'p1', stage: 'Costing', status: 'Approved', requestedBy: 'Ahmed Mansouri', assignedTo: 'Engineering', estimationCost: 3200000, grossMargin: 24.5, remarks: 'Estimation finalized based on latest vendor quotes.', updatedAt: '2025-04-20' },
    { id: 'ia2', projectId: 'p1', stage: 'Technical', status: 'Pending', requestedBy: 'Ahmed Mansouri', assignedTo: 'Engineering', remarks: 'Under technical review for phase 2 drawings.', updatedAt: '2025-05-15' },
  ],

  clientActivities: [
    { id: 'ca1', projectId: 'p1', type: 'Meeting', description: 'Kick-off meeting with ADNOC team to discuss fabrication schedule.', attendees: 'Ahmed, Sara, John (ADNOC)', date: '2025-03-10', performedBy: 'Ahmed Mansouri' },
    { id: 'ca2', projectId: 'p1', type: 'Email', description: 'Sent revised DWG for Main Deck Layout.', date: '2025-05-18', performedBy: 'Sara Al Hashimi' },
    { id: 'ca3', projectId: 'p1', type: 'Call', description: 'Discussed technical clarification on material substitution.', date: '2025-05-20', performedBy: 'Ahmed Mansouri' },
  ],

  tenderCosts: [
    { id: 'tc1', projectId: 'p1', type: 'Engineering', description: 'Manifold spool technical drafting', amount: 45000, hours: 120, date: '2025-02-10', performedBy: 'John Doe' },
    { id: 'tc2', projectId: 'p1', type: 'Estimation', description: 'Bulk material take-off (MTO) analysis', amount: 12000, hours: 40, date: '2025-02-15', performedBy: 'Sara Smith' },
    { id: 'tc3', projectId: 'p1', type: 'Travel', description: 'Site visit to ADNOC offshore facility', amount: 8500, date: '2025-02-20', performedBy: 'Ahmed Mansouri' },
    { id: 'tc4', projectId: 'p1', type: 'BD', description: 'Tender strategy workshop', amount: 5000, hours: 16, date: '2025-02-25', performedBy: 'Sara Al Hashimi' },
  ],

  clients: [
    { clientId: 'c1', clientName: 'ADNOC Offshore', healthScore: 88, winRate: 65, avgPaymentDelay: 42, marginVariance: 4.2, totalValue: 45000000, riskLevel: 'Low' },
    { clientId: 'c2', clientName: 'Ruwais Authority', healthScore: 42, winRate: 20, avgPaymentDelay: 115, marginVariance: -12.5, totalValue: 12000000, riskLevel: 'High' },
    { clientId: 'c3', clientName: 'KIZAD Authority', healthScore: 75, winRate: 45, avgPaymentDelay: 60, marginVariance: 2.1, totalValue: 8500000, riskLevel: 'Medium' },
    { clientId: 'c4', clientName: 'Toxic Global Ltd', healthScore: 15, winRate: 5, avgPaymentDelay: 180, marginVariance: -25.0, totalValue: 1500000, riskLevel: 'Critical' },
  ],

  partners: [
    { id: 'part1', name: 'Al Jaber Civil', category: 'Civil', revenueSplit: 40, activeBids: ['p2'] },
    { id: 'part2', name: 'Schneider Electric', category: 'Electrical', revenueSplit: 25, activeBids: ['p1'] },
  ],

  deptEfficiency: [
    { name: 'Marketing',   utilization: 65, onTime: 92, completionTime: 14 },
    { name: 'Purchase',    utilization: 82, onTime: 78, completionTime: 8 },
    { name: 'Production',  utilization: 94, onTime: 85, completionTime: 22 },
    { name: 'QA/QC',       utilization: 76, onTime: 96, completionTime: 3 },
    { name: 'Store',       utilization: 60, onTime: 98, completionTime: 2 },
  ],

  financialStats: [
    { period: 'Jan', revenue: 1200000, cost: 950000, loss: 45000 },
    { period: 'Feb', revenue: 1500000, cost: 1100000, loss: 38000 },
    { period: 'Mar', revenue: 1100000, cost: 980000, loss: 52000 },
    { period: 'Apr', revenue: 1800000, cost: 1400000, loss: 31000 },
    { period: 'May', revenue: 2100000, cost: 1550000, loss: 24000 },
  ],

  costVariance: [
    { phase: 'Engineering', budget: 500000, actual: 480000, labor: 300000, material: 180000 },
    { phase: 'Procurement', budget: 1200000, actual: 1250000, labor: 100000, material: 1150000 },
    { phase: 'Fabrication', budget: 2800000, actual: 3100000, labor: 2200000, material: 900000 },
    { phase: 'QA/QC',       budget: 300000, actual: 290000, labor: 250000, material: 40000 },
    { phase: 'Logistics',   budget: 450000, actual: 470000, labor: 150000, material: 320000 },
  ],

  vendorSpend: [
    { name: 'Gulf Steel Trading', value: 840000 },
    { name: 'ABB Gulf FZE',       value: 280000 },
    { name: 'Al Fajr Supply',     value: 340000 },
    { name: 'National Fasteners', value: 58000 },
    { name: 'Techno Coatings',    value: 120000 },
  ],

  commodityImpact: [
    { material: 'Carbon Steel', change: 4.2, impact: -42000 },
    { material: 'Stainless Steel', change: -1.5, impact: 12000 },
    { material: 'Copper', change: 8.4, impact: -18000 },
    { material: 'Aluminum', change: 2.1, impact: -5000 },
  ],

  capacityHeatmap: [
    { phase: 'Procurement', load: 85, capacity: 100, status: 'optimal' },
    { phase: 'Fabrication', load: 110, capacity: 100, status: 'over' },
    { phase: 'QA/QC', load: 92, capacity: 100, status: 'nearing' },
    { phase: 'Delivery', load: 45, capacity: 100, status: 'optimal' },
  ],

  hseStats: {
    ltiDays: 442,
    incidentHistory: [
      { month: 'Jan', misses: 4, incidents: 0 },
      { month: 'Feb', misses: 2, incidents: 1 },
      { month: 'Mar', misses: 5, incidents: 0 },
      { month: 'Apr', misses: 3, incidents: 0 },
      { month: 'May', misses: 1, incidents: 0 },
    ]
  },

  laborCosts: [
    { dept: 'Engineering', regular: 2400, overtime: 120, otCost: 18000 },
    { dept: 'Production',  regular: 8500, overtime: 1400, otCost: 125000 },
    { dept: 'QA/QC',       regular: 1200, overtime: 80, otCost: 9500 },
    { dept: 'Logistics',   regular: 950, overtime: 210, otCost: 22000 },
  ],

  bidPipeline: [
    { stage: 'Drafting',     value: 45000000, count: 12 },
    { stage: 'Technical',    value: 28000000, count: 8 },
    { stage: 'Commercial',   value: 15000000, count: 4 },
    { stage: 'Negotiation',  value: 8500000,  count: 2 },
  ],

  vendorCompliance: [
    { category: 'Compliant', value: 82, color: 'var(--green)' },
    { category: 'Expiring',  value: 12, color: 'var(--amber)' },
    { category: 'Expired',   value: 6,  color: 'var(--red)' },
  ],

  procurement: {
    ppv: 94.2,
    otif: [
      { vendor: 'Gulf Steel', rate: 98 },
      { vendor: 'ABB Gulf', rate: 92 },
      { vendor: 'Techno', rate: 85 },
      { vendor: 'Al Fajr', rate: 64 },
      { vendor: 'National', rate: 42 },
    ]
  },

  engineering: {
    ecoTrend: [
      { week: 'W12', count: 4 },
      { week: 'W13', count: 8 },
      { week: 'W14', count: 3 },
      { week: 'W15', count: 12 },
      { week: 'W16', count: 6 },
    ],
    releaseAdherence: 88.5
  },

  production: {
    cycleTime: [
      { stage: 'Cutting', estimated: 40, actual: 42 },
      { stage: 'Fit-up', estimated: 120, actual: 145 },
      { stage: 'Welding', estimated: 240, actual: 230 },
      { stage: 'Painting', estimated: 80, actual: 95 },
    ],
    machineLoad: [
      { bay: 'Bay 1', load: 85 },
      { bay: 'Bay 2', load: 110 },
      { bay: 'Bay 3', load: 92 },
      { bay: 'Bay 4', load: 45 },
    ]
  },

  quality: {
    fpy: 96.4,
    ncrResolution: [
      { month: 'Jan', days: 12 },
      { month: 'Feb', days: 14 },
      { month: 'Mar', days: 10 },
      { month: 'Apr', days: 8 },
      { month: 'May', days: 6 },
    ]
  },

  projectControls: {
    cpi: 0.94,
    spi: 0.82
  },

  notifications: [
    { id: '1', type: 'warning', title: 'Schedule Alert', text: 'SPI has dropped below 0.85 on Project P2.', time: '2m ago', read: false },
    { id: '2', type: 'info', title: 'System Update', text: 'Weekly executive summary is ready.', time: '1h ago', read: false },
  ],

  setRole: (role) => set({ currentRole: role }),
  addNotification: (notif) => set((state) => ({
    notifications: [
      { id: Math.random().toString(36).substr(2, 9), ...notif, time: 'Just now', read: false },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  setCurrentProject: (id) => set({ currentProject: id }),
  login: (role) => set((state) => {
    const user = state.roles[role];
    return { 
      currentUser: { ...user, role }, 
      currentRole: role 
    };
  }),
  logout: () => set({ currentUser: null }),
  openModal: (id, data = null) => set({ modalOpen: id, modalData: data }),
  closeModal: () => set({ modalOpen: null, modalData: null }),

  // Helper for activity log
  _log: (item: ActivityLogItem) => set((state) => ({ 
    activityLog: [item, ...state.activityLog].slice(0, 50) 
  })),

  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects] 
  })),

  addPR: (pr) => set((state) => ({ 
    purchaseRequests: [pr, ...state.purchaseRequests] 
  })),

  approvePR: (id) => set((state) => ({
    purchaseRequests: state.purchaseRequests.map(p => 
      p.id === id ? { ...p, status: 'approved' } : p
    )
  })),

  rejectPR: (id) => set((state) => ({
    purchaseRequests: state.purchaseRequests.map(p => 
      p.id === id ? { ...p, status: 'rejected' } : p
    )
  })),

  addIR: (ir) => set((state) => ({ 
    inspectionRequests: [ir, ...state.inspectionRequests] 
  })),

  updateIRStatus: (id, status) => set((state) => ({
    inspectionRequests: state.inspectionRequests.map(i => 
      i.id === id ? { ...i, status } : i
    )
  })),

  addNCR: (ncr) => set((state) => ({ 
    ncrs: [ncr, ...state.ncrs] 
  })),

  addReport: (report) => set((state) => ({ 
    reports: [report, ...state.reports] 
  })),

  addCompetitorBid: (bid) => set((state) => ({ 
    competitorBids: [bid, ...state.competitorBids] 
  })),

  addInternalApproval: (approval) => set((state) => ({ 
    internalApprovals: [approval, ...state.internalApprovals] 
  })),

  updateInternalApproval: (id, updates) => set((state) => ({
    internalApprovals: state.internalApprovals.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  addClientActivity: (activity) => set((state) => ({ 
    clientActivities: [activity, ...state.clientActivities] 
  })),

  addTenderCost: (cost) => set((state) => ({ 
    tenderCosts: [cost, ...state.tenderCosts] 
  })),

  updateClientHealth: (id, updates) => set((state) => ({
    clients: state.clients.map(c => c.clientId === id ? { ...c, ...updates } : c)
  })),

  generateProposal: (projectId) => {
    // Simulated action for now
    console.log(`Generating proposal for project ${projectId}...`);
  },

  updateActivityProgress: (id, progress) => set((state) => ({
    activities: state.activities.map(a => 
      a.id === id ? { ...a, actual: progress, lastUpdated: 'Just now' } : a
    )
  })),

  addMR: (mr) => set((state) => ({ 
    materialRequests: [mr, ...state.materialRequests] 
  })),

  issueMR: (id) => set((state) => ({
    materialRequests: state.materialRequests.map(m => 
      m.id === id ? { ...m, status: 'issued' } : m
    )
  })),

  uploadDocumentRevision: (docId, version) => set((state) => ({
    projectDocuments: state.projectDocuments.map(doc =>
      doc.id === docId
        ? { ...doc, currentVersion: version, history: [doc.currentVersion, ...doc.history] }
        : doc
    )
  })),

  addToast: (message, type, duration = 4000) => set((state) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Auto remove
    setTimeout(() => {
      useNexusStore.getState().removeToast(id);
    }, duration);

    return { toasts: [...state.toasts, { id, message, type, duration }] };
  }),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  setStoreSection: (section) => set({ activeStoreSection: section }),
}), {
  name: 'nexus-erp-store',
  partialize: (state) => Object.fromEntries(
    Object.entries(state).filter(([key]) => !['modalOpen', 'modalData', 'toasts'].includes(key))
  )
}));
