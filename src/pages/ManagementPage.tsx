import React from 'react';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { ShoppingCart, ClipboardCheck, Folder, DollarSign, Clock, AlertTriangle, Plus, Sparkles } from 'lucide-react';
import { formatCurrency, getStatusLabel } from '../utils/formatters';

const ManagementPage: React.FC = () => {
  const { projects, purchaseRequests, ncrs, activityLog, openModal } = useNexusStore();

  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const pendingPRs = purchaseRequests.filter(p => p.status === 'pending').length;
  const openNCRs = ncrs.filter(n => n.status === 'open').length;

  return (
    <div className="space-y-20 animate-in">
      {/* AI INTELLIGENCE HEADER */}
      <div className="bg-gradient-to-br from-surface/50 to-card border border-border-subtle rounded-3xl p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="flex items-center gap-6 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <Sparkles size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-primary tracking-tighter">Executive Intelligence</h3>
            <p className="text-sm text-text-tertiary font-medium">Predictive operational insights & risk analysis</p>
          </div>
          <div className="ml-auto">
            <Badge variant="success" className="px-4 py-1.5 rounded-full text-[11px]">84% Operational Efficiency</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-error uppercase tracking-[0.2em]">Supply Chain Risk</div>
            <p className="text-[15px] text-text-secondary leading-relaxed">Critical material shortage for <strong className="text-text-primary font-bold">Project P1</strong>. Immediate approval of PR-0815 recommended to avoid 4-day slippage.</p>
          </div>
          <div className="md:border-l border-border-subtle md:pl-16 space-y-2">
            <div className="text-[10px] font-black text-warning uppercase tracking-[0.2em]">Project Slippage</div>
            <p className="text-[15px] text-text-secondary leading-relaxed"><strong className="text-text-primary font-bold">Project P2</strong> indicates a 12% lag in MEP phase. Strategic rescheduling can recover 3 days.</p>
          </div>
          <div className="md:border-l border-border-subtle md:pl-16 space-y-2">
            <div className="text-[10px] font-black text-success uppercase tracking-[0.2em]">Cashflow Health</div>
            <p className="text-[15px] text-text-secondary leading-relaxed">Budget utilization is at 92%. Current vendor performance yields a <strong className="text-text-primary font-bold">3.2% cost saving</strong> vs projection.</p>
          </div>
        </div>
      </div>

      {/* CORE VITALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard 
          label="Active Projects" 
          value={projects.length} 
          trend={{ value: '1 New', type: 'up' }}
          icon={<Folder size={18} />}
          accentColor="#3b82f6"
        />
        <StatCard 
          label="Contract Value" 
          value={formatCurrency(totalValue)} 
          subValue="Across 4 active sites"
          icon={<DollarSign size={18} />}
          accentColor="#10b981"
        />
        <StatCard 
          label="Pending Approvals" 
          value={pendingPRs + 1} 
          trend={{ value: '2 Urgent', type: 'down' }}
          icon={<Clock size={18} />}
          accentColor="#f59e0b"
        />
        <StatCard 
          label="Open NCRs" 
          value={openNCRs} 
          subValue={openNCRs > 0 ? 'Action required' : 'All clear'}
          icon={<AlertTriangle size={18} />}
          accentColor="#ef4444"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* PROGRESS TRACKER */}
        <div className="lg:col-span-3 bg-card rounded-3xl p-10 border border-border-subtle shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h4 className="text-xl font-black text-text-primary tracking-tight">Project Execution</h4>
              <p className="text-xs text-text-tertiary font-medium">Real-time fabrication & delivery milestones</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => openModal('NEW_TRANSACTION_MODAL')}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-surface transition-all flex items-center gap-2"
              >
                <DollarSign size={14} /> Transaction
              </button>
              <button 
                onClick={() => openModal('PR_MODAL')}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Project
              </button>
            </div>
          </div>
          <div className="space-y-12 flex-1">
            {projects.map(p => (
              <div key={p.id} className="group">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="font-bold text-[15px] text-text-primary group-hover:text-primary transition-colors tracking-tight">{p.title}</div>
                    <div className="text-[11px] text-text-tertiary font-semibold uppercase tracking-wider mt-0.5">{p.client} · Due {p.endDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-primary text-base mb-1 tracking-tighter">{p.progress}%</div>
                    <Badge variant={p.status === 'on-track' ? 'success' : 'warning'} className="text-[10px] px-2 py-0.5">{getStatusLabel(p.status)}</Badge>
                  </div>
                </div>
                <ProgressBar progress={p.progress} color="var(--primary)" />
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-10 border border-border-subtle shadow-sm flex flex-col h-full">
          <div className="mb-12">
            <h4 className="text-xl font-black text-text-primary tracking-tight">Event Stream</h4>
            <p className="text-xs text-text-tertiary font-medium">Cross-departmental live feed</p>
          </div>
          <div className="space-y-10 flex-1">
            {activityLog.slice(0, 5).map((a, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 transition-transform group-hover:scale-125 ring-4 ring-offset-2 ${
                    a.type === 'success' ? 'bg-success ring-success/10' : a.type === 'warning' ? 'bg-warning ring-warning/10' : 'bg-primary ring-primary/10'
                  }`} />
                  {i < 4 && <div className="w-px flex-1 bg-border-subtle my-4" />}
                </div>
                <div className="pb-2">
                  <div className="text-sm font-bold text-text-primary mb-1 tracking-tight">{a.title}</div>
                  <div className="text-[13px] text-text-secondary leading-relaxed mb-2">{a.text}</div>
                  <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-surface/50 px-2 py-1 rounded inline-block">
                    {a.time} · {a.dept}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WORKLOAD ANALYSIS */}
      <div className="bg-card rounded-3xl p-10 border border-border-subtle shadow-sm">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h4 className="text-xl font-black text-text-primary tracking-tight">Divisional Backlog</h4>
            <p className="text-xs text-text-tertiary font-medium">Resource allocation & capacity load</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success" /> Optimal</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warning" /> Warning</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-error" /> Critical</div>
          </div>
        </div>
        <Table 
          data={[
            { dept: 'Marketing & Tendering', tasks: '6 active bids', critical: '0 pending', load: 60, status: 'on-track' },
            { dept: 'Procurement', tasks: '14 purchase orders', critical: '3 urgent PRs', load: 85, status: 'high-load' },
            { dept: 'Quality Control', tasks: '9 pending IRs', critical: '1 open NCR', load: 75, status: 'on-track' },
            { dept: 'Production Bay', tasks: '22 spools in fab', critical: '4 delayed items', load: 92, status: 'critical' },
          ]}
          columns={[
            { header: 'Department', accessor: 'dept', width: '30%', render: (item) => (
              <span className="font-bold text-text-primary tracking-tight">{item.dept}</span>
            )},
            { header: 'Active Tasks', accessor: 'tasks' },
            { header: 'Priority Items', accessor: 'critical', render: (item) => (
              <span className={`font-bold ${item.critical.includes('urgent') || item.critical.includes('delayed') ? 'text-error' : 'text-text-secondary'}`}>
                {item.critical}
              </span>
            )},
            { header: 'Utilization', render: (item) => (
              <div className="w-40">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-text-tertiary">{item.load}%</span>
                </div>
                <ProgressBar progress={item.load} color={item.load > 90 ? 'var(--error)' : item.load > 70 ? 'var(--warning)' : 'var(--success)'} />
              </div>
            )},
            { header: 'Health', render: (item) => (
              <Badge variant={item.status === 'on-track' ? 'success' : item.status === 'critical' ? 'danger' : 'warning'} className="text-[9px] px-2 py-0.5">
                {item.status.toUpperCase()}
              </Badge>
            )}
          ]}
        />
      </div>
    </div>
  );
};

export default ManagementPage;
