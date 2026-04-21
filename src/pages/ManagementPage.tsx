import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { formatCurrency, getStatusBadgeClass, getStatusLabel } from '../utils/formatters';
import { Folder, DollarSign, Clock, AlertTriangle, Plus } from 'lucide-react';

const ManagementPage: React.FC = () => {
  const { projects, purchaseRequests, ncrs, activityLog } = useNexusStore();

  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const pendingPRs = purchaseRequests.filter(p => p.status === 'pending').length;
  const openNCRs = ncrs.filter(n => n.status === 'open').length;

  return (
    <>
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
        <div className="stat-card" style={{ '--accent-color': 'var(--accent)' } as any}>
          <div className="stat-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}><Folder size={18} /></div>
          <div className="stat-label">Active Projects</div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-delta delta-up">↑ 1 initiated this month</div>
        </div>
        <div className="stat-card" style={{ '--accent-color': 'var(--green)' } as any}>
          <div className="stat-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><DollarSign size={18} /></div>
          <div className="stat-label">Total Contract Value</div>
          <div className="stat-value">{formatCurrency(totalValue)}</div>
          <div className="stat-delta delta-up">Across all projects</div>
        </div>
        <div className="stat-card" style={{ '--accent-color': 'var(--orange)' } as any}>
          <div className="stat-icon" style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}><Clock size={18} /></div>
          <div className="stat-label">Pending Approvals</div>
          <div className="stat-value">{pendingPRs + 1}</div>
          <div className="stat-delta delta-dn">{pendingPRs} PRs · 1 IR awaiting</div>
        </div>
        <div className="stat-card" style={{ '--accent-color': 'var(--red)' } as any}>
          <div className="stat-icon" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}><AlertTriangle size={18} /></div>
          <div className="stat-label">Open NCRs</div>
          <div className="stat-value">{openNCRs}</div>
          <div className="stat-delta delta-dn">{openNCRs > 0 ? 'Requires immediate attention' : 'All clear'}</div>
        </div>
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
                  <span className={`badge ${getStatusBadgeClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${p.progress}%`, background: p.status === 'on-track' ? 'var(--green)' : p.status === 'delayed' ? 'var(--amber)' : 'var(--teal)' }}></div>
              </div>
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
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Open Tasks</th>
                <th>Critical Items</th>
                <th>Load Factor</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-main">Marketing & Tendering</td>
                <td>6 Bids</td>
                <td>0</td>
                <td><div className="progress-bar" style={{ width: '80px' }}><div className="progress-fill" style={{ width: '60%', background: 'var(--blue)' }}></div></div></td>
                <td><span className={`badge ${getStatusBadgeClass('on-track')}`}>On Track</span></td>
              </tr>
              <tr>
                <td className="td-main">Procurement</td>
                <td>14 Orders</td>
                <td>{purchaseRequests.filter(p => p.priority === 'urgent').length} urgent</td>
                <td><div className="progress-bar" style={{ width: '80px' }}><div className="progress-fill" style={{ width: '85%', background: 'var(--amber)' }}></div></div></td>
                <td><span className="badge badge-amber">High Priority</span></td>
              </tr>
              <tr>
                <td className="td-main">Quality Control</td>
                <td>9 Inspections</td>
                <td>{openNCRs} Open NCR</td>
                <td><div className="progress-bar" style={{ width: '80px' }}><div className="progress-fill" style={{ width: '75%', background: 'var(--green)' }}></div></div></td>
                <td><span className={`badge ${getStatusBadgeClass('on-track')}`}>On Track</span></td>
              </tr>
              <tr>
                <td className="td-main">Production Bay</td>
                <td>22 Spools</td>
                <td>3 Delay</td>
                <td><div className="progress-bar" style={{ width: '80px' }}><div className="progress-fill" style={{ width: '92%', background: 'var(--orange)' }}></div></div></td>
                <td><span className="badge badge-red">Critical Load</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManagementPage;
