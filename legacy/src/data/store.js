/* Explicitly bind to window for global access */
window.NEXUS = {
  /* ── CURRENT USER ── */
  currentUser: null,
  currentRole: 'management',
  currentProject: 'p1',

  /* ── USERS / ROLES ── */
  roles: {
    management: { name: 'Ahmed Mansouri', initials: 'AM', title: 'Project Manager', color: '#e8a020' },
    marketing:  { name: 'Sara Al Hashimi', initials: 'SH', title: 'Marketing Lead', color: '#3b82f6' },
    purchase:   { name: 'Khalid Ibrahim', initials: 'KI', title: 'Procurement Officer', color: '#f59e0b' },
    qaqc:       { name: 'Priya Nair', initials: 'PN', title: 'QC Engineer', color: '#10b981' },
    production: { name: 'Omar Al Suwaidi', initials: 'OS', title: 'Production Supervisor', color: '#f97316' },
    store:      { name: 'Rajan Pillai', initials: 'RP', title: 'Store Keeper', color: '#8b5cf6' }
  },

  /* ── PROJECTS ── */
  projects: [
    {
      id: 'p1',
      title: 'ADNOC Offshore Platform A',
      client: 'ADNOC Offshore',
      type: 'EPC',
      contractValue: 18400000,
      currency: 'AED',
      startDate: '2025-01-15',
      endDate: '2025-08-30',
      progress: 72,
      status: 'on-track',
      pm: 'Ahmed Mansouri',
      qcLead: 'Priya Nair',
      procLead: 'Khalid Ibrahim',
      phases: ['Engineering', 'Procurement', 'Fabrication', 'QAQC', 'Delivery'],
      currentPhase: 2
    },
    {
      id: 'p2',
      title: 'Ruwais Industrial Expansion',
      client: 'Ruwais Authority',
      type: 'Civil + MEP',
      contractValue: 9200000,
      currency: 'AED',
      startDate: '2025-03-01',
      endDate: '2025-10-15',
      progress: 45,
      status: 'delayed',
      pm: 'Ahmed Mansouri',
      qcLead: 'Priya Nair',
      procLead: 'Khalid Ibrahim',
      phases: ['Design', 'Procurement', 'Civil', 'MEP', 'Handover'],
      currentPhase: 1
    },
    {
      id: 'p3',
      title: 'KIZAD Infrastructure Ph.3',
      client: 'KIZAD Authority',
      type: 'Fabrication',
      contractValue: 5700000,
      currency: 'AED',
      startDate: '2024-11-01',
      endDate: '2025-05-20',
      progress: 91,
      status: 'near-complete',
      pm: 'Ahmed Mansouri',
      qcLead: 'Priya Nair',
      procLead: 'Khalid Ibrahim',
      phases: ['Design', 'Procurement', 'Fabrication', 'Inspection', 'Delivery'],
      currentPhase: 4
    }
  ],

  /* ── PURCHASE REQUESTS ── */
  purchaseRequests: [
    { id:'PR-0815', item:'SS Pipe 4" SCH40', qty:'24 pcs', unit:'pcs', project:'p1', dept:'Production', priority:'urgent', status:'pending', raised:'2025-05-19', raisedBy:'Omar Al Suwaidi', remarks:'Required for manifold spool assembly', justification:'Phase 2 fabrication critical path item' },
    { id:'PR-0814', item:'Hydraulic Fittings 1/2"', qty:'240 pcs', unit:'pcs', project:'p1', dept:'Production', priority:'normal', status:'pending', raised:'2025-05-18', raisedBy:'Omar Al Suwaidi', remarks:'Stock replenishment', justification:'Current stock at 12 pcs — reorder point 50 pcs' },
    { id:'PR-0813', item:'Carbon Steel Plate 25mm', qty:'18 tons', unit:'tons', project:'p2', dept:'Store', priority:'normal', status:'approved', raised:'2025-05-16', raisedBy:'Rajan Pillai', remarks:'Approved by PM', justification:'Deck frame construction' },
    { id:'PR-0812', item:'Welding Wire ER70S-6 (15kg)', qty:'30 spools', unit:'spools', project:'p1', dept:'Production', priority:'normal', status:'po-issued', raised:'2025-05-14', raisedBy:'Omar Al Suwaidi', poNo:'PO-4412', remarks:'PO issued to Gulf Steel', justification:'Stock depleted' },
    { id:'PR-0811', item:'Safety Helmets Class E', qty:'50 pcs', unit:'pcs', project:'p1', dept:'QAQC', priority:'normal', status:'delivered', raised:'2025-05-10', raisedBy:'Priya Nair', remarks:'Delivered and GRN processed', justification:'Site safety requirement' },
    { id:'PR-0810', item:'Grinding Discs 115mm', qty:'200 pcs', unit:'pcs', project:'p3', dept:'Production', priority:'normal', status:'delivered', raised:'2025-05-08', raisedBy:'Omar Al Suwaidi', remarks:'Delivered', justification:'Fabrication consumables' }
  ],

  /* ── INSPECTION REQUESTS ── */
  inspectionRequests: [
    { id:'IR-2048', activity:'Hydro Test — Manifold Spool MS-07', type:'Hold Point', project:'p1', itp:'ITP-001 §4.8', date:'2025-05-22', requestedBy:'Omar Al Suwaidi', status:'scheduled', location:'Bay 4 — Test bench', drawingRef:'DWG-MS-07-R2' },
    { id:'IR-2047', activity:'PWHT — Node Joints N44-N52', type:'Witness Point', project:'p1', itp:'ITP-001 §3.5', date:'2025-05-21', requestedBy:'Omar Al Suwaidi', status:'scheduled', location:'Furnace Room A', drawingRef:'DWG-STR-12-R3' },
    { id:'IR-2046', activity:'Dimensional Check — Skid Frame SK-03', type:'Review Point', project:'p1', itp:'ITP-002 §2.1', date:'2025-05-20', requestedBy:'Omar Al Suwaidi', status:'pending', location:'Bay 2', drawingRef:'DWG-SK-03-R1' },
    { id:'IR-2045', activity:'Visual Weld Inspection — Deck 3', type:'Hold Point', project:'p1', itp:'ITP-001 §3.2', date:'2025-05-18', requestedBy:'Omar Al Suwaidi', status:'approved', location:'Deck 3 — All joints', drawingRef:'DWG-DK3-R4', reportRef:'RPT-2045', result:'Pass' },
    { id:'IR-2044', activity:'Pressure Test — Piping Loop C', type:'Witness Point', project:'p1', itp:'ITP-003 §5.1', date:'2025-05-15', requestedBy:'Omar Al Suwaidi', status:'approved', location:'Piping Bay', drawingRef:'DWG-PP-C-R2', reportRef:'RPT-2044', result:'Pass' },
    { id:'IR-2043', activity:'Blasting Grade SA 2.5 — Zone B', type:'Hold Point', project:'p1', itp:'ITP-004 §1.3', date:'2025-05-12', requestedBy:'Omar Al Suwaidi', status:'rejected', location:'Zone B', drawingRef:'DWG-BLT-02', result:'Fail — NCR Raised', ncrRef:'NCR-041' }
  ],

  /* ── INSPECTION REPORTS ── */
  reports: [
    { id:'RPT-2045', irRef:'IR-2045', title:'Visual Weld Inspection — Deck 3', type:'Weld Inspection', project:'p1', date:'2025-05-18', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'VWI_DECK3_20250518.pdf', size:'2.4 MB' },
    { id:'RPT-2044', irRef:'IR-2044', title:'Pressure Test — Piping Loop C', type:'Pressure Test', project:'p1', date:'2025-05-15', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'PT_LOOP_C_20250515.pdf', size:'1.8 MB' },
    { id:'RPT-2043', irRef:'IR-2042', title:'Hydrotest — Manifold Assembly', type:'Hydrotest', project:'p1', date:'2025-05-10', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'HT_MANF_20250510.pdf', size:'3.1 MB' },
    { id:'RPT-2042', irRef:'IR-2039', title:'Dimensional Report — Jacket Nodes', type:'Dimensional', project:'p1', date:'2025-05-05', result:'Pass', inspector:'Priya Nair', client:'ADNOC Offshore', file:'DIM_NODES_20250505.pdf', size:'4.2 MB' }
  ],

  /* ── NCRs ── */
  ncrs: [
    { id:'NCR-042', activity:'Painting Defect — Zone C', project:'p1', raised:'2025-05-16', raisedBy:'Priya Nair', severity:'major', status:'open', description:'Primer adhesion failure on 3 panels. Area: approx 12 m².', corrective:'Re-blasting to SA 2.5 and re-application required' },
    { id:'NCR-041', activity:'Blasting Grade SA 2.5 — Zone B', project:'p1', raised:'2025-05-12', raisedBy:'Priya Nair', severity:'major', status:'closed', description:'Surface profile below specification. Ra 40µm vs required 50µm.', corrective:'Re-blasted and re-inspected. Accepted.', closedDate:'2025-05-15' }
  ],

  /* ── PRODUCTION ACTIVITIES ── */
  activities: [
    { id:'ACT-01', name:'Structural Welding — Deck A', crew:'Team Alpha', planned:80, actual:85, start:'2025-04-01', end:'2025-06-15', status:'in-progress', lastUpdated:'Today 09:30', phase:'Fabrication' },
    { id:'ACT-02', name:'Pipe Spool Fabrication', crew:'Team Beta', planned:65, actual:58, start:'2025-04-15', end:'2025-06-30', status:'behind', lastUpdated:'Today 08:45', phase:'Fabrication' },
    { id:'ACT-03', name:'Blasting & Painting Zone B', crew:'Techno Coat LLC', planned:70, actual:70, start:'2025-05-01', end:'2025-06-20', status:'on-track', lastUpdated:'Yesterday', phase:'Fabrication' },
    { id:'ACT-04', name:'Electrical Conduit Installation', crew:'Team Gamma', planned:40, actual:44, start:'2025-05-10', end:'2025-07-01', status:'ahead', lastUpdated:'Today 10:00', phase:'MEP' },
    { id:'ACT-05', name:'Insulation Works — Piping', crew:'Sub-contractor', planned:20, actual:12, start:'2025-05-15', end:'2025-07-15', status:'behind', lastUpdated:'May 17', phase:'MEP' },
    { id:'ACT-06', name:'Structural Assembly — Module 2', crew:'Team Alpha', planned:55, actual:52, start:'2025-04-20', end:'2025-06-25', status:'on-track', lastUpdated:'Today 07:30', phase:'Fabrication' }
  ],

  /* ── MATERIAL REQUESTS ── */
  materialRequests: [
    { id:'MR-0528', item:'SS Pipe 4" SCH40', qty:'12 pcs', from:'Production', status:'pending', date:'2025-05-19', project:'p1' },
    { id:'MR-0527', item:'Bolts M20×80 Gr.8.8', qty:'500 pcs', from:'Production', status:'issued', date:'2025-05-18', project:'p1' },
    { id:'MR-0526', item:'Grinding Discs 115mm', qty:'100 pcs', from:'Production', status:'issued', date:'2025-05-17', project:'p1' },
    { id:'MR-0525', item:'Protective Gloves L/XL', qty:'40 pairs', from:'QAQC', status:'partial', date:'2025-05-16', project:'p1' },
    { id:'MR-0524', item:'Welding Rods E7018 (5kg)', qty:'20 packs', from:'Production', status:'pending', date:'2025-05-19', project:'p2' }
  ],

  /* ── INVENTORY ── */
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

  /* ── TENDERS ── */
  tenders: [
    { id:'TND-2504', ref:'T-25-004', client:'Mubadala Energy', title:'Offshore Jacket Modification', value:6800000, deadline:'2025-06-20', status:'drafting', team:'Sara Al Hashimi', probability:40 },
    { id:'TND-2503', ref:'T-25-003', client:'Emirates Steel', title:'Maintenance Framework 2025', value:1100000, deadline:'2025-06-15', status:'drafting', team:'Sara Al Hashimi', probability:55 },
    { id:'TND-2502', ref:'T-25-002', client:'TAQA Arabia', title:'Pipeline Fabrication Ph.2', value:7800000, deadline:'2025-06-03', status:'submitted', team:'Sara Al Hashimi', probability:35 },
    { id:'TND-2501', ref:'T-25-001', client:'ADNOC Offshore', title:'Structural Mods — Jacket', value:4200000, deadline:'2025-05-28', status:'submitted', team:'Sara Al Hashimi', probability:65 },
    { id:'TND-2499', ref:'T-24-012', client:'KIZAD Authority', title:'Civil & MEP Works', value:3400000, deadline:'2025-04-30', status:'won', team:'Sara Al Hashimi', probability:100 },
    { id:'TND-2498', ref:'T-24-011', client:'Mubadala Energy', title:'Tank Farm Modification', value:2900000, deadline:'2025-04-15', status:'lost', team:'Sara Al Hashimi', probability:0 }
  ],

  /* ── VENDORS ── */
  vendors: [
    { id:'V001', name:'Gulf Steel Trading LLC', category:'Structural Steel', contact:'Mohammed Saleh', phone:'+971-2-555-0101', onTime:94, quality:96, active:true, spend:842000, pqs:'ADNOC,TAQA' },
    { id:'V002', name:'Al Fajr Industrial Supply', category:'Pipes & Fittings', contact:'James Wilson', phone:'+971-2-555-0202', onTime:78, quality:82, active:true, spend:340000, pqs:'ADNOC' },
    { id:'V003', name:'Techno Coatings LLC', category:'Paints & Blasting', contact:'Ravi Kumar', phone:'+971-50-555-0303', onTime:62, quality:74, active:true, spend:120000, pqs:'' },
    { id:'V004', name:'ABB Gulf FZE', category:'Electrical & Instruments', contact:'Laura Chen', phone:'+971-4-555-0404', onTime:91, quality:95, active:true, spend:280000, pqs:'ADNOC,KIZAD,TAQA' },
    { id:'V005', name:'National Fasteners UAE', category:'Fasteners & Hardware', contact:'Ali Hassan', phone:'+971-2-555-0505', onTime:88, quality:90, active:true, spend:58000, pqs:'' }
  ],

  /* ── ACTIVITY LOG ── */
  activityLog: [
    { type:'success', title:'IR-2045 Approved', text:'QC inspection passed — Offshore Platform A Deck 3', time:'12 min ago', dept:'QAQC' },
    { type:'warning', title:'PR-0815 Raised', text:'SS Pipe 4" SCH40 — 24 pcs requested by Production', time:'38 min ago', dept:'Production' },
    { type:'info', title:'Report Uploaded', text:'Weld inspection report WPS-77 submitted by Priya N.', time:'2 hrs ago', dept:'QAQC' },
    { type:'danger', title:'NCR-042 Raised', text:'Painting defect Zone C — major non-conformance', time:'4 hrs ago', dept:'QAQC' },
    { type:'success', title:'PO-4412 Issued', text:'PO issued to Gulf Steel Trading — AED 184,000', time:'Yesterday', dept:'Purchase' },
    { type:'info', title:'PR-0813 Approved', text:'Carbon Steel Plate 25mm approved by Ahmed M.', time:'2 days ago', dept:'Management' }
  ],

  /* ── HELPERS ── */
  getProject(id) { return this.projects.find(p => p.id === (id || this.currentProject)); },
  getPRs(projectId) { return this.purchaseRequests.filter(p => !projectId || p.project === projectId); },
  getIRs(projectId) { return this.inspectionRequests.filter(i => !projectId || i.project === projectId); },
  getActivities() { return this.activities; }
};
