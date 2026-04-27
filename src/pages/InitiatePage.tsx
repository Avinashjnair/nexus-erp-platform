import React, { useState, useMemo } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DocumentVault from '../components/ui/DocumentVault';
import { PlusCircle, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { Project, VaultDocument } from '../types/erp';

const WBS_PHASES = [
  // ... (keeping existing WBS_PHASES)
  {
    label: 'Phase 1', color: 'badge-blue', name: 'Engineering & design', weeks: 'Weeks 1–4',
    items: ['Structural drawings', 'Material TDL', 'ITP preparation', 'Client approval', 'Design freeze'],
  },
  {
    label: 'Phase 2', color: 'badge-amber', name: 'Procurement & logistics', weeks: 'Weeks 5–8',
    items: ['RFQ issuance', 'Vendor evaluation', 'PO placement', 'Material delivery', 'Traceability'],
  },
  {
    label: 'Phase 3', color: 'badge-orange', name: 'Fabrication & construction', weeks: 'Weeks 9–20',
    items: ['Cutting & fitting', 'Welding & assembly', 'Dimensional inspection', 'NDT', 'Painting'],
  },
  {
    label: 'Phase 4', color: 'badge-green', name: 'QA/QC & testing', weeks: 'Weeks 18–22',
    items: ['Hydrotest', 'Final checks', 'Third-party inspection', 'Client witness', 'Punch list'],
  },
  {
    label: 'Phase 5', color: 'badge-teal', name: 'Delivery & handover', weeks: 'Weeks 22–24',
    items: ['Document handover', 'As-built drawings', 'Certificates', 'Final inspection', 'Close-out'],
  },
];

const INITIAL_DOCS: VaultDocument[] = [
  { id: 'drawings', category: 'Drawings', mandatory: true, verified: false },
  { id: 'specs', category: 'Specifications', mandatory: true, verified: false },
  { id: 'itp', category: 'ITP - Inspection & Test Plan', mandatory: true, verified: false },
  { id: 'mom', category: 'MOM - Minutes of Meeting', mandatory: false, verified: false },
  { id: 'deviation', category: 'Deviation Clearance', mandatory: false, verified: false },
];

const EMPTY_FORM = {
  title: '', client: '', type: 'EPC — Engineering, Procurement & Construction',
  startDate: new Date().toISOString().split('T')[0], endDate: '',
  contractValue: '', description: '',
  pm: 'Ahmed Mansouri', qcLead: 'Priya Nair', procLead: 'Khalid Ibrahim',
  prodSupervisor: 'Omar Al Suwaidi', storeKeeper: 'Rajan Pillai', siteEngineer: '',
};

const InitiatePage: React.FC = () => {
  const { projects, addProject, addToast, setRole } = useNexusStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>(INITIAL_DOCS);

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleVaultUpload = (id: string, file: File, metadata: { revision: string; remarks: string }) => {
    setVaultDocs(prev => prev.map(doc => 
      doc.id === id ? { ...doc, verified: true, fileName: file.name, file, revision: metadata.revision, remarks: metadata.remarks } : doc
    ));
    addToast(`${file.name} uploaded and verified!`, 'success');
  };

  const handleVaultRemove = (id: string) => {
    setVaultDocs(prev => prev.map(doc => 
      doc.id === id ? { ...doc, verified: false, fileName: undefined, file: undefined, revision: undefined, remarks: undefined } : doc
    ));
  };

  const isMandatoryComplete = useMemo(() => {
    return vaultDocs.filter(d => d.mandatory).every(d => d.verified);
  }, [vaultDocs]);

  const handleSubmit = () => {
    if (!form.title.trim()) { addToast('Project title is required', 'warning'); return; }
    if (!form.client.trim()) { addToast('Client name is required', 'warning'); return; }
    if (!isMandatoryComplete) { addToast('Please upload all mandatory documents', 'error'); return; }

    const newProject: Project = {
      id: `p${projects.length + 1}`,
      title: form.title,
      client: form.client,
      type: form.type,
      contractValue: parseFloat(form.contractValue) || 0,
      currency: 'AED',
      startDate: form.startDate,
      endDate: form.endDate,
      progress: 0,
      status: 'on-track',
      pm: form.pm,
      qcLead: form.qcLead,
      procLead: form.procLead,
      phases: ['Engineering', 'Procurement', 'Fabrication', 'QAQC', 'Delivery'],
      currentPhase: 0,
    };

    addProject(newProject);
    setSubmitted(true);
    addToast(`Project "${form.title}" initiated successfully!`, 'success');
    setTimeout(() => { 
      setSubmitted(false); 
      setForm(EMPTY_FORM); 
      setVaultDocs(INITIAL_DOCS);
      setRole('management'); 
    }, 1800);
  };

  const projColumns = [
    { header: 'Project', accessor: 'title' as keyof Project },
    { header: 'Client', accessor: 'client' as keyof Project },
    {
      header: 'Type',
      accessor: (p: Project) => <Badge variant="ghost">{p.type}</Badge>,
    },
    {
      header: 'Value',
      accessor: (p: Project) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          {formatCurrency(p.contractValue)}
        </span>
      ),
    },
    {
      header: 'Progress',
      accessor: (p: Project) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
          <ProgressBar progress={p.progress} color="var(--accent)" height="5px" className="table-progress" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>
            {p.progress}%
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (p: Project) => (
        <Badge variant={p.status === 'on-track' ? 'success' : p.status === 'delayed' ? 'warning' : 'info'}>
          {p.status.replace('-', ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project initiation</h1>
          <p className="page-subtitle">Define scope, assign team, and generate the work breakdown structure</p>
        </div>
      </div>

      <div className="grid-2 gap-b">
        {/* Project info form */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Project information</div>
              <div className="card-sub">Basic setup and contract parameters</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project title</label>
            <input className="form-input" placeholder="e.g. Offshore Platform Fabrication Phase 2" value={form.title} onChange={set('title')} />
          </div>
          <div className="form-group">
            <label className="form-label">Client / Owner</label>
            <input className="form-input" placeholder="e.g. ADNOC Offshore" value={form.client} onChange={set('client')} />
          </div>
          <div className="form-group">
            <label className="form-label">Project type</label>
            <select className="form-select" value={form.type} onChange={set('type')}>
              <option>EPC — Engineering, Procurement &amp; Construction</option>
              <option>Fabrication</option>
              <option>Civil Works</option>
              <option>Mechanical Works</option>
              <option>Maintenance</option>
              <option>Supply Only</option>
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Start date</label>
              <input type="date" className="form-input" value={form.startDate} onChange={set('startDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">End date</label>
              <input type="date" className="form-input" value={form.endDate} onChange={set('endDate')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Contract value (AED)</label>
            <input type="number" className="form-input" placeholder="0.00" value={form.contractValue} onChange={set('contractValue')} />
          </div>
          <div className="form-group">
            <label className="form-label">Description / scope summary</label>
            <textarea className="form-textarea" placeholder="Briefly describe the project scope…" value={form.description} onChange={set('description')} />
          </div>
        </div>

        {/* Team roles */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Roles & responsibilities</div>
              <div className="card-sub">Assign team members to key project roles</div>
            </div>
          </div>

          <div
            style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px', gap: '4px' }}
          >
            {['📋 Project Manager', '🔬 QC Engineer', '🛒 Procurement', '🏭 Production', '📦 Store', '📐 Design Engineer'].map(r => (
              <span
                key={r}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border2)',
                  fontSize: '11px', color: 'var(--text2)', margin: '2px',
                }}
              >
                {r}
              </span>
            ))}
          </div>

          <div className="form-grid-2" style={{ flex: 1 }}>
            {([
              ['Project Manager',       'pm'],
              ['QC Lead',               'qcLead'],
              ['Procurement Lead',      'procLead'],
              ['Production Supervisor', 'prodSupervisor'],
              ['Store Keeper',          'storeKeeper'],
              ['Site Engineer',         'siteEngineer'],
            ] as [string, keyof typeof EMPTY_FORM][]).map(([label, key]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className="form-input" placeholder="Assign name" value={form[key]} onChange={set(key)} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            {!isMandatoryComplete && (
              <div style={{ 
                background: 'var(--red-dim)', 
                padding: '10px', 
                borderRadius: 'var(--r-sm)', 
                border: '1px solid var(--red-border)',
                marginBottom: '12px',
                fontSize: '11px',
                color: 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={14} /> Upload all mandatory documents to activate project creation
              </div>
            )}
            
            <button
              className="btn btn-primary btn-block"
              style={{ 
                width: '100%', 
                opacity: (submitted || !isMandatoryComplete) ? 0.6 : 1,
                cursor: (submitted || !isMandatoryComplete) ? 'not-allowed' : 'pointer'
              }}
              onClick={handleSubmit}
              disabled={submitted || !isMandatoryComplete}
            >
              {submitted ? (
                <>
                  <CheckCircle size={14} /> Project Created!
                </>
              ) : isMandatoryComplete ? (
                <>
                  <ShieldCheck size={14} /> Create Active Project
                </>
              ) : (
                <>
                  <PlusCircle size={14} /> Mandatory Documents Required
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <DocumentVault 
        documents={vaultDocs} 
        onUpload={handleVaultUpload} 
        onRemove={handleVaultRemove} 
      />

      {/* WBS */}
      <div className="card gap-b">
        <div className="card-header">
          <div>
            <div className="card-title">Work breakdown structure (WBS)</div>
            <div className="card-sub">Standard phases, deliverables, and milestones</div>
          </div>
        </div>
        {WBS_PHASES.map(ph => (
          <div
            key={ph.label}
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className={`badge ${ph.color}`}>{ph.label}</span>
              <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>{ph.name}</span>
              <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: 'auto' }}>{ph.weeks}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ph.items.map(item => (
                <span
                  key={item}
                  style={{
                    background: 'var(--bg4)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    color: 'var(--text2)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Existing projects */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All projects</div>
            <div className="card-sub">Current portfolio overview</div>
          </div>
        </div>
        <Table data={projects} columns={projColumns} keyExtractor={p => p.id} />
      </div>
    </div>
  );
};

export default InitiatePage;
