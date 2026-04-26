import React, { useState } from 'react';
import Card from '../components/ui/Card';

import DraggableGrid from '../components/ui/DraggableGrid';
import { useNexusStore } from '../store/useNexusStore';
import { PlusCircle, Layers, Calendar, Users } from 'lucide-react';

const LAYOUTS = {
  lg: [
    { i: 'header', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'form', x: 0, y: 2, w: 7, h: 6, minW: 5, minH: 5 },
    { i: 'wbs', x: 7, y: 2, w: 5, h: 6, minW: 4, minH: 5 },
  ],
};

const WBS_TEMPLATE = [
  { id: 'WBS-1', name: 'Engineering & Design', children: ['Detailed Design', 'Design Review', 'Drawing Issue'] },
  { id: 'WBS-2', name: 'Procurement', children: ['Material Takeoff', 'Vendor Selection', 'PO Issue', 'Delivery'] },
  { id: 'WBS-3', name: 'Fabrication', children: ['Cutting & Prep', 'Welding', 'Assembly', 'NDT'] },
  { id: 'WBS-4', name: 'QA/QC', children: ['ITP Preparation', 'Inspections', 'Reports', 'Handover'] },
  { id: 'WBS-5', name: 'Delivery', children: ['Load-out', 'Transport', 'Site Installation'] },
];

const InitiatePage: React.FC = () => {
  const { addProject, addToast } = useNexusStore();
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [type, setType] = useState('EPC');
  const [value, setValue] = useState('');

  const handleCreate = () => {
    if (!title || !client) { addToast('Fill required fields', 'warning'); return; }
    addProject({
      id: `p${Date.now()}`, title, client, type, contractValue: parseFloat(value) || 0, currency: 'AED',
      startDate: new Date().toISOString().slice(0, 10), endDate: '', progress: 0, status: 'on-track',
      pm: 'Ahmed Mansouri', qcLead: 'Priya Nair', procLead: 'Khalid Ibrahim',
      phases: WBS_TEMPLATE.map(w => w.name), currentPhase: 0,
    });
    addToast('Project created successfully', 'success');
    setTitle(''); setClient(''); setValue('');
  };

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Header Stats */}
      <div key="header">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move">
            <p className="text-xs text-[var(--text-muted)] font-medium">New Project</p>
            <h3 className="text-2xl font-display font-semibold">Setup</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move">
            <p className="text-xs text-[var(--text-muted)] font-medium">WBS Phases</p>
            <h3 className="text-3xl font-display font-semibold">{WBS_TEMPLATE.length}</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move">
            <p className="text-xs text-[var(--text-muted)] font-medium">Sub-Activities</p>
            <h3 className="text-3xl font-display font-semibold">{WBS_TEMPLATE.reduce((s, w) => s + w.children.length, 0)}</h3>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">Template</p>
            <h3 className="text-2xl font-display font-bold text-black">Standard</h3>
          </div>
        </div>
      </div>

      {/* Project Form */}
      <div key="form">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-5">Project Details</h2>
          <div className="space-y-4 flex-1">
            <div>
              <label className="form-label-s3"><Layers className="w-4 h-4" />Project Title</label>
              <input className="form-input-s3" placeholder="Enter project title..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="form-label-s3"><Users className="w-4 h-4" />Client Name</label>
              <input className="form-input-s3" placeholder="Client organization..." value={client} onChange={e => setClient(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label-s3"><Calendar className="w-4 h-4" />Project Type</label>
                <select className="form-input-s3 appearance-none cursor-pointer" value={type} onChange={e => setType(e.target.value)}>
                  <option>EPC</option><option>Civil + MEP</option><option>Fabrication</option><option>Maintenance</option>
                </select>
              </div>
              <div>
                <label className="form-label-s3">Contract Value (AED)</label>
                <input type="number" className="form-input-s3" placeholder="0" value={value} onChange={e => setValue(e.target.value)} />
              </div>
            </div>
            <button onClick={handleCreate} className="w-full bg-black text-white font-semibold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#222] transition-colors mt-4">
              <PlusCircle className="w-4 h-4" /> Create Project
            </button>
          </div>
        </Card>
      </div>

      {/* WBS Template */}
      <div key="wbs">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-5">WBS Template</h2>
          <div className="space-y-4 flex-1 overflow-auto">
            {WBS_TEMPLATE.map((phase, idx) => (
              <div key={phase.id} className="bg-[var(--bg3)] p-4 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg4)] text-[var(--text-muted)]'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-sm font-semibold text-[var(--text)]">{phase.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-11">
                  {phase.children.map((child, ci) => (
                    <span key={ci} className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-[var(--border)] text-[var(--text2)] font-medium">{child}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default InitiatePage;
