import React from 'react';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { ShoppingCart, ClipboardCheck, Folder, DollarSign, Clock, AlertTriangle, Plus } from 'lucide-react';
import { formatCurrency, getStatusLabel } from '../utils/formatters';

const ManagementPage: React.FC = () => {
  const { projects, purchaseRequests, ncrs, activityLog, openModal } = useNexusStore();

  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const pendingPRs = purchaseRequests.filter(p => p.status === 'pending').length;
  const openNCRs = ncrs.filter(n => n.status === 'open').length;

  return (
    <>
      {/* QUICK ACTIONS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => openModal('PR_MODAL')}>
          <ShoppingCart size={14} />
          Raise Purchase Request
        </button>
        <button className="btn btn-ghost" onClick={() => openModal('IR_MODAL')}>
          <ClipboardCheck size={14} />
          Request Inspection (IR)
        </button>
      </div>

      {/* AI SUMMARY WIDGET */}
      <div className="card gap-b ai-summary-card" style={{ background: 'linear-gradient(135deg, var(--bg2), #1a1e26)', border: '1px solid var(--accent-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div className="status-dot pulse" style={{ background: 'var(--accent)', width: '10px', height: '10px' }}></div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.02em' }}>AI Intelligence Summary</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analyzing core project vitals...</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>84% Operational Efficiency</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="ai-insight">
            <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>Critical Alert</div>
            <div style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 500 }}>Material shortage for P1 Fabrication path detected. PR-0815 approval recommended within 24h.</div>
          </div>
          <div className="ai-insight" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>Risk Analysis</div>
            <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 500 }}>Project P2 showing 12% slip in MEP phase. Suggest rescheduling Site Engineer tasks.</div>
          </div>
          <div className="ai-insight" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>Financial Projection</div>
            <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 500 }}>On track to realize 92% budget utilization by Q3. Vendor V001 performance improving.</div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid gap-b">
        <StatCard 
          label="Active Projects" 
          value={projects.length} 
          delta="↑ 1 initiated this month" 
          deltaType="up"
          icon={<Folder size={18} />}
          accentColor="var(--accent)"
        />
        <StatCard 
          label="Total Contract Value" 
          value={formatCurrency(totalValue)} 
          delta="Across all projects" 
          deltaType="neutral"
          icon={<DollarSign size={18} />}
          accentColor="var(--green)"
        />
        <StatCard 
          label="Pending Approvals" 
          value={pendingPRs + 1} 
          delta={`${pendingPRs} PRs · 1 IR awaiting`} 
          deltaType="down"
          icon={<Clock size={18} />}
          accentColor="var(--orange)"
        />
        <StatCard 
          label="Open NCRs" 
          value={openNCRs} 
          delta={openNCRs > 0 ? 'Requires immediate attention' : 'All clear'} 
          deltaType={openNCRs > 0 ? 'down' : 'neutral'}
          icon={<AlertTriangle size={18} />}
          accentColor="var(--red)"
        />
      </div>

      {/* PROJECT PROGRESS + ACTIVITY FEED */}
      <div className="grid-2 gap-b">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Project Progress</div>
              <div className="card-sub">Current fabrication & construction status</div>
            </div>
            <button className="btn btn-ghost btn-sm"><Plus size={14} /> New Project</button>
          </div>
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{p.title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{p.client} · {p.type} · Due {p.endDate}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>{p.progress}%</div>
                  <Badge variant={p.status === 'on-track' ? 'success' : p.status === 'delayed' ? 'warning' : 'info'}>
                    {getStatusLabel(p.status)}
                  </Badge>
                </div>
              </div>
              <ProgressBar 
                progress={p.progress} 
                color={p.status === 'on-track' ? 'var(--green)' : p.status === 'delayed' ? 'var(--amber)' : 'var(--teal)'} 
              />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-sub">Latest event log from all departments</div>
            </div>
          </div>
          <div className="timeline">
            {activityLog.slice(0, 6).map((a, i) => (
              <div key={i} className="tl-item">
                <div>
                  <div className="tl-dot" style={{ background: a.type === 'success' ? 'var(--green)' : a.type === 'warning' ? 'var(--amber)' : a.type === 'danger' ? 'var(--red)' : 'var(--blue)' }}></div>
                  {i < 5 && <div className="tl-line"></div>}
                </div>
                <div>
                  <div className="tl-label">{a.title}</div>
                  <div className="tl-text">{a.text}</div>
                  <div className="tl-time">{a.time} · {a.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEPARTMENT OVERVIEW */}
      <div className="card gap-b">
        <div className="card-header">
          <div>
            <div className="card-title">Department Workload Overview</div>
            <div className="card-sub">Real-time status of divisional backlogs</div>
          </div>
        </div>
        <Table 
          data={[
            { dept: 'Marketing & Tendering', tasks: '6 Bids', critical: '0', load: 60, status: 'on-track', color: 'var(--blue)' },
            { dept: 'Procurement', tasks: '14 Orders', critical: `${purchaseRequests.filter(p => p.priority === 'urgent').length} urgent`, load: 85, status: 'high-priority', color: 'var(--amber)' },
            { dept: 'Quality Control', tasks: '9 Inspections', critical: `${openNCRs} Open NCR`, load: 75, status: 'on-track', color: 'var(--green)' },
            { dept: 'Production Bay', tasks: '22 Spools', critical: '3 Delay', load: 92, status: 'critical', color: 'var(--orange)' },
          ]}
          keyExtractor={(item) => item.dept}
          columns={[
            { header: 'Department', key: 'dept' },
            { header: 'Open Tasks', key: 'tasks' },
            { header: 'Critical Items', key: 'critical' },
            { 
              header: 'Load Factor', 
              key: 'load',
              render: (item) => <ProgressBar progress={item.load} color={item.color} className="table-progress" />
            },
            { 
              header: 'Current Status', 
              key: 'status',
              render: (item) => (
                <Badge variant={item.status === 'on-track' ? 'success' : item.status === 'critical' ? 'danger' : 'warning'}>
                  {item.status.replace('-', ' ')}
                </Badge>
              )
            }
          ]}
        />
      </div>
      {/* Global modals handled by ModalManager */}
    </>
  );
};

export default ManagementPage;
