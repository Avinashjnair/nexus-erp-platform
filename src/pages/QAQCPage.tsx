import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { 
  ClipboardCheck, ShieldAlert, FileBadge, Kanban, LayoutDashboard, 
  CheckCircle, AlertTriangle, Clock, Search, Filter, ArrowRight, ShieldCheck, Activity
} from 'lucide-react';

const QAQCPage: React.FC = () => {
  const { 
    inspectionRequests, ncrs, quality, addToast, 
    activeQAQCSection, setQAQCSection 
  } = useNexusStore();

  const pendingIRs = (inspectionRequests || []).filter(ir => ir.status === 'scheduled' || ir.status === 'pending').length;
  const openNCRs = (ncrs || []).filter(n => n.status === 'open').length;

  const handleAction = (msg: string) => {
    addToast(msg, 'success');
  };

  // --- Sub-Navigation Renderers ---
  const renderDashboard = () => (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        <StatCard label="First Pass Yield (FPY)" value={`${quality.fpy}%`} delta="Optimal Range" deltaType="up" icon={<ShieldCheck size={18} />} accentColor="var(--neon)" />
        <StatCard label="Pending Inspections" value={pendingIRs} delta="Hold & Witness Points" deltaType="neutral" icon={<ClipboardCheck size={18} />} accentColor="var(--violet)" />
        <StatCard label="Active NCRs" value={openNCRs} delta="Requires Corrective Action" deltaType={openNCRs > 0 ? 'down' : 'up'} icon={<AlertTriangle size={18} />} accentColor="var(--red)" />
        <StatCard label="Avg NCR Resolution" value="8 Days" delta="-2 Days vs Last Qtr" deltaType="up" icon={<Clock size={18} />} accentColor="var(--amber)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ITP Progress Overview */}
        <div className="lg:col-span-8 card p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-6">
            <Activity size={16} className="text-[#8b5cf6]" /> Active Project ITP Completion
          </div>
          <div className="flex flex-col gap-6">
             {['Project P1 - ADNOC Offshore', 'Project P2 - Ruwais Expansion'].map((proj, idx) => (
               <div key={idx}>
                 <div className="flex justify-between text-xs mb-2">
                   <span className="text-gray-400">{proj}</span>
                   <span className="font-mono text-white">{idx === 0 ? '82%' : '45%'}</span>
                 </div>
                 <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden border border-white/5">
                   <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: idx === 0 ? '82%' : '45%' }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 card p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
           <div className="text-[12px] uppercase tracking-wider font-bold text-white mb-6">Quick Actions</div>
           <div className="flex flex-col gap-3">
             <button onClick={() => handleAction('IR Creation Modal Opened')} className="w-full py-3 rounded bg-[#1a1a1a] border border-white/5 text-xs text-white hover:border-[#8b5cf6] transition-colors">Raise Inspection Request</button>
             <button onClick={() => handleAction('NCR Creation Modal Opened')} className="w-full py-3 rounded bg-[#1a1a1a] border border-white/5 text-xs text-[#ef4444] hover:border-[#ef4444] hover:bg-[#ef44441a] transition-colors">Log Non-Conformance</button>
             <button onClick={() => handleAction('Doc Upload Modal Opened')} className="w-full py-3 rounded bg-[#1a1a1a] border border-white/5 text-xs text-gray-400 hover:text-white transition-colors">Upload QC Document</button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderITPTracker = () => (
    <div className="card h-full animate-fade-in" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="card-header border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
            <ClipboardCheck size={16} className="text-[#8b5cf6]" /> Inspection & Test Plan (ITP) Tracker
          </div>
          <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Sequential workflow for Hold (H), Witness (W), and Review (R) points</div>
        </div>
        <div className="flex gap-2">
          <Badge variant="danger">H - Hold Point</Badge>
          <Badge variant="warning">W - Witness Point</Badge>
          <Badge variant="ghost">R - Review Point</Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-4 relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[39px] top-10 bottom-10 w-px bg-white/10 z-0"></div>

        {(inspectionRequests || []).map((ir, idx) => {
          const isHold = ir.type.includes('Hold');
          const isWitness = ir.type.includes('Witness');
          const isApproved = ir.status === 'approved';
          const isRejected = ir.status === 'rejected';

          return (
            <div key={ir.id} className="relative z-10 flex gap-6 group">
              {/* Timeline Node */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 bg-[#0a0a0a] mt-1 transition-colors
                ${isApproved ? 'border-[#10b981] text-[#10b981]' : isRejected ? 'border-[#ef4444] text-[#ef4444]' : 'border-white/10 text-gray-500 group-hover:border-[#8b5cf6]'}
              `}>
                {isApproved ? <CheckCircle size={14} /> : isRejected ? <AlertTriangle size={14} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
              </div>

              {/* ITP Card */}
              <div className="flex-1 bg-[#121212] border border-white/5 rounded-lg p-4 transition-all hover:border-[#8b5cf633] hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{ir.activity}</span>
                    <Badge variant={isHold ? 'danger' : isWitness ? 'warning' : 'ghost'}>{ir.type}</Badge>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{ir.itp}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs mb-4">
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase tracking-widest mb-1">Date / Location</span>
                    <span className="text-gray-300 font-medium">{ir.date} • {ir.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase tracking-widest mb-1">Inspector</span>
                    <span className="text-gray-300 font-medium">{ir.requestedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase tracking-widest mb-1">Status</span>
                    <span className={`font-bold ${isApproved ? 'text-[#10b981]' : isRejected ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
                      {ir.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {!isApproved && !isRejected && (
                  <div className="flex gap-2 border-t border-white/5 pt-4">
                    <button onClick={() => handleAction(`${ir.id} Signed Off`)} className="bg-[#10b9811a] text-[#10b981] border border-[#10b98133] px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-[#10b981] hover:text-black transition-colors">Sign Off (Pass)</button>
                    <button onClick={() => handleAction(`NCR Raised for ${ir.id}`)} className="bg-[#ef44441a] text-[#ef4444] border border-[#ef444433] px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-[#ef4444] hover:text-white transition-colors">Fail / Raise NCR</button>
                  </div>
                )}
                {ir.result && (
                  <div className={`mt-2 text-[10px] font-mono p-2 rounded bg-black/20 ${isApproved ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    RESULT: {ir.result} {ir.reportRef && `• REF: ${ir.reportRef}`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNCRKanban = () => {
    const stages = [
      { id: 'raised', label: 'Raised', color: 'var(--red)', items: (ncrs || []).filter(n => n.status === 'open') },
      { id: 'review', label: 'Under Review', color: 'var(--amber)', items: [] },
      { id: 'corrective', label: 'Corrective Action', color: 'var(--violet)', items: [{ id:'NCR-043', activity:'Weld Porosity - Spool 12', project:'p2', severity:'major', raisedBy:'Priya Nair', raised:'Today', description: 'Porosity detected in root run of Joint J12.' }] },
      { id: 'closed', label: 'Closed / Verified', color: 'var(--neon)', items: (ncrs || []).filter(n => n.status === 'closed') },
    ];

    return (
      <div className="flex flex-col h-full gap-4 animate-fade-in">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
            <Kanban size={16} className="text-[#ef4444]" /> NCR Defect Lifecycle
          </div>
          <div className="flex gap-2">
            <div className="bg-[#1a1a1a] border border-white/5 px-3 py-1.5 rounded text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:border-white/20"><Filter size={12}/> Filter</div>
            <div className="bg-[#1a1a1a] border border-white/5 px-3 py-1.5 rounded text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:border-white/20"><Search size={12}/> Search</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {stages.map(stage => (
            <div key={stage.id} className="flex flex-col gap-3 p-3 rounded-lg border border-white/5 bg-black/20">
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-gray-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color }}></div>
                  {stage.label}
                </div>
                <Badge variant="ghost">{stage.items.length}</Badge>
              </div>

              {/* Kanban Cards */}
              <div className="flex flex-col gap-3 min-h-[500px]">
                {stage.items.map((ncr: any) => (
                  <div key={ncr.id} className="bg-[#121212] border border-white/5 p-3 rounded-md shadow-lg cursor-grab hover:border-[#8b5cf64d] transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono text-gray-500 tracking-tighter">{ncr.id}</span>
                      <Badge variant={ncr.severity === 'major' ? 'danger' : 'warning'}>{ncr.severity ? ncr.severity.toUpperCase() : 'MAJOR'}</Badge>
                    </div>
                    <div className="text-xs font-bold text-white mb-2 leading-relaxed group-hover:text-[#8b5cf6] transition-colors">{ncr.activity}</div>
                    <div className="text-[10px] text-gray-400 mb-3 leading-relaxed">{ncr.description || 'Corrective action sequence in progress.'}</div>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                      <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{ncr.raisedBy}</div>
                      <ArrowRight size={12} className="text-gray-600 group-hover:text-[#8b5cf6] transition-colors translate-x-0 group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDocControl = () => {
    const MOCK_QC_DOCS = [
      { id: 'WPS-CS-001', type: 'WPS', title: 'Carbon Steel 1G/2G/3G/4G', rev: 'Rev 2', status: 'Active', expiry: '2027-12-31', daysLeft: 940 },
      { id: 'PQR-CS-001A', type: 'PQR', title: 'PQR for WPS-CS-001 (Impact Tested)', rev: 'Rev 0', status: 'Active', expiry: 'Indefinite', daysLeft: 9999 },
      { id: 'MTC-HT-8892', type: 'MTC', title: 'EN 10204 3.1 - Steel Plate 25mm', rev: '-', status: 'Verified', expiry: '-', daysLeft: 9999 },
      { id: 'WQR-WELDER-04', type: 'WQR', title: 'Welder Qual - Omar K.', rev: 'Rev 1', status: 'Expiring Soon', expiry: '2025-06-15', daysLeft: 28 },
    ];

    return (
      <div className="card animate-fade-in" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="card-header border-b border-white/5 p-6 flex justify-between items-center">
          <div>
            <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
              <FileBadge size={16} className="text-[#2dd4bf]" /> QC Document Register
            </div>
            <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">WPS, PQR, WQR, and Material Certifications</div>
          </div>
          <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-[0.1em] transition-all">Upload New Record</button>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[800px] flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-4 text-[9px] uppercase font-bold text-gray-500 px-4 pb-3 border-b border-white/5 tracking-[0.2em]">
              <div className="col-span-2">Doc ID / Type</div>
              <div className="col-span-4">Title / Description</div>
              <div className="col-span-2">Revision</div>
              <div className="col-span-2">Expiry Tracking</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {MOCK_QC_DOCS.map(doc => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-md hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                <div className="col-span-2">
                  <div className="text-xs font-mono text-[#8b5cf6] group-hover:underline cursor-pointer">{doc.id}</div>
                  <div className="text-[10px] text-gray-500 font-bold mt-1">{doc.type}</div>
                </div>
                <div className="col-span-4">
                  <div className="text-sm font-bold text-gray-200">{doc.title}</div>
                </div>
                <div className="col-span-2">
                  <Badge variant="ghost">{doc.rev}</Badge>
                </div>
                <div className="col-span-2">
                  <div className={`text-xs font-mono ${doc.daysLeft <= 30 ? 'text-[#ef4444] font-bold' : 'text-gray-400'}`}>
                    {doc.expiry}
                  </div>
                  {doc.daysLeft <= 30 && <div className="text-[8px] text-[#ef4444] uppercase font-bold mt-1 animate-pulse tracking-tighter">⚠️ ACTION REQUIRED</div>}
                </div>
                <div className="col-span-2 text-right">
                  <Badge variant={doc.status === 'Active' || doc.status === 'Verified' ? 'success' : 'warning'}>
                    {doc.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-fade-in">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">Quality Assurance & Control</h1>
          <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-2 uppercase tracking-[0.2em]">
             <ShieldAlert size={12} className="text-[#ef4444]" /> INSPECTIONS, NCR MANAGEMENT, AND COMPLIANCE
          </p>
        </div>
        <div className="flex gap-3">
           <div className="bg-[#1a1a1a] border border-white/5 p-2 rounded flex flex-col items-end">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Active Ops</span>
              <span className="text-xs font-mono text-white">QA-QC-8.2.1</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {activeQAQCSection === 'dashboard' && renderDashboard()}
        {activeQAQCSection === 'itp'       && renderITPTracker()}
        {activeQAQCSection === 'ncr'       && renderNCRKanban()}
        {activeQAQCSection === 'docs'      && renderDocControl()}
      </div>
    </div>
  );
};

export default QAQCPage;
