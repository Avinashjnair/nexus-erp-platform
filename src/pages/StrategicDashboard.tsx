import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { formatCurrency } from '../utils/formatters';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Package, Download, Maximize2, AlertCircle,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';

const COLORS = ['var(--violet)', 'var(--blue)', 'var(--teal)', 'var(--amber)', 'var(--red)'];
const HEATMAP_COLORS = {
  optimal: 'var(--green)',
  nearing: 'var(--amber)',
  over:    'var(--red)'
};

const StrategicDashboard: React.FC = () => {
  const { 
    purchaseRequests, projects, ncrs, costVariance, vendorSpend, 
    commodityImpact, capacityHeatmap, approvePR, addToast 
  } = useNexusStore();

  // ── Metrics ──────────────────────────────────────────────────
  const highValueApprovals = purchaseRequests.filter(p => p.status === 'pending');
  const escalatedRisks = ncrs.filter(n => n.severity === 'major' && n.status === 'open');
  
  const avgMargin = 18.4;
  const targetMargin = 20.0;
  const marginDelta = avgMargin - targetMargin;

  const exportData = (type: string) => {
    addToast(`Exporting ${type} to PDF…`, 'info');
  };

  return (
    <div className="page-fade-in">
      
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Strategic Boardroom</h1>
          <p className="page-subtitle">Executive oversight, financial health, and operational risk</p>
        </div>
        <div className="flex-center" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => exportData('Executive Summary')}>
            <Download size={14} /> Export Report
          </button>
          <button className="btn btn-primary">
            <Maximize2 size={14} /> Fullscreen
          </button>
        </div>
      </div>

      {/* ── Top Level KPIs ── */}
      <div className="stat-grid gap-b">
        <StatCard 
          label="Total Strategic TCV" 
          value={formatCurrency(33300000)} 
          delta="Across Assets" deltaType="up"
          icon={<TrendingUp size={18} />} accentColor="var(--violet)" 
        />
        <StatCard 
          label="Avg Gross Margin" 
          value={`${avgMargin}%`} 
          delta={`${marginDelta.toFixed(1)}% vs Target`} deltaType={marginDelta >= 0 ? 'up' : 'down'}
          icon={<Activity size={18} />} accentColor="var(--neon)" 
        />
        <StatCard 
          label="Critical Risks" 
          value={escalatedRisks.length} 
          delta="Requiring Intervention" deltaType="down"
          icon={<AlertCircle size={18} />} accentColor="var(--red)" 
        />
        <StatCard 
          label="Pending High-Value" 
          value={highValueApprovals.length} 
          delta="Approvals Pending" deltaType="neutral"
          icon={<Package size={18} />} accentColor="var(--amber)" 
        />
      </div>

      <div className="grid-2 gap-b">
        
        {/* ── 1. Executive Action Center ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Executive Action Center</div>
              <div className="card-sub">High-priority operational gates</div>
            </div>
          </div>
          
          <div className="flex-col gap-b">
            <div className="ai-panel" style={{ padding: '16px', background: 'var(--bg-raised)' }}>
              <div className="flex-between mb-4">
                <span className="sidebar-section-label">High-Value Approvals ( {'>'} $50k )</span>
                <Badge variant="amber">{highValueApprovals.length} PENDING</Badge>
              </div>
              <div className="flex-col gap-8">
                {highValueApprovals.slice(0, 2).map(req => (
                  <div key={req.id} className="vendor-card" style={{ margin: 0 }}>
                    <div className="flex-col" style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-0)' }}>{req.item}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{req.raisedBy} · {req.raised}</span>
                    </div>
                    <div className="text-right" style={{ marginRight: 16 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-0)' }}>{formatCurrency(74200)}</div>
                    </div>
                    <button className="action-btn-sm" style={{ width: 'auto', padding: '0 12px', borderRadius: 4, height: 26 }} onClick={() => { approvePR(req.id); addToast('PO Approved', 'success'); }}>
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-panel" style={{ padding: '16px', borderLeftColor: 'var(--red)' }}>
              <div className="flex-between mb-4">
                <span className="sidebar-section-label">Critical Project Risks</span>
                <Badge variant="danger">ESCALATED</Badge>
              </div>
              <div className="grid-2 gap-8">
                {escalatedRisks.map(risk => (
                  <div key={risk.id} className="vendor-card" style={{ margin: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="flex-between" style={{ width: '100%', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-0)' }}>{risk.id}</span>
                      <Badge variant="danger">MAJOR</Badge>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', margin: '4px 0' }}>{risk.description}</p>
                    <div className="flex-between" style={{ width: '100%', marginTop: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-0)' }}>Impact: AED 84k</span>
                      <button className="btn-link-sm" onClick={() => addToast('Escalation active', 'info')}>Intervene</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Financial Variance Analysis ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Cost Variance Analysis</div>
              <div className="card-sub">Budget vs Actual Spend across phases</div>
            </div>
          </div>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costVariance} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="phase" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-3)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-3)' }} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} />
                <Bar dataKey="budget" name="Budget" fill="var(--bg4)" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="actual" name="Actual" fill="var(--violet)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 3. Supply Chain Concentration ── */}
      <div className="grid-5-3 gap-b">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Strategic Spend by Vendor</div>
              <div className="card-sub">Concentration across top 5 suppliers</div>
            </div>
          </div>
          <div className="grid-2">
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorSpend}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vendorSpend.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-col justify-center">
              {vendorSpend.map((v, i) => (
                <div key={v.name} className="flex-between mb-4">
                  <div className="flex-center" style={{ gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>{v.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{((v.value / vendorSpend.reduce((s, x) => s + x.value, 0)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Commodity Impact</div>
              <div className="card-sub">Market volatility exposure</div>
            </div>
          </div>
          <div className="flex-col gap-8">
            {commodityImpact.map(c => (
              <div key={c.material} className="vendor-card" style={{ margin: 0 }}>
                <div className="flex-col" style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-0)' }}>{c.material}</span>
                  <span style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase' }}>Index Variance</span>
                </div>
                <div className="text-right">
                  <div className="flex-center" style={{ justifyContent: 'flex-end', color: c.change > 0 ? 'var(--red)' : 'var(--green)' }}>
                    {c.change > 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                    <span style={{ fontWeight: 700 }}>{Math.abs(c.change)}%</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{formatCurrency(c.impact)} Impact</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Operations & Throughput ── */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Operations & Throughput Health</div>
            <div className="card-sub">Capacity heatmaps and schedule adherence</div>
          </div>
        </div>
        
        <div className="grid-2">
          <div>
            <div className="sidebar-section-label mb-4">Phase Capacity Heatmap</div>
            <div className="flex-col gap-b">
              {capacityHeatmap.map(step => (
                <div key={step.phase}>
                  <div className="flex-between mb-4">
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{step.phase}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: HEATMAP_COLORS[step.status] }}>{step.status.toUpperCase()}</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(step.load, 100)}%`,
                        background: HEATMAP_COLORS[step.status]
                      }} 
                    />
                  </div>
                  <div className="text-xs text-muted mt-1" style={{ textAlign: 'right' }}>{step.load}% Load</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="sidebar-section-label mb-4">Project Delivery Probability</div>
            <div className="table-wrap">
              <table className="nexus-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Adherence</th>
                    <th>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td className="td-primary">{p.title}</td>
                      <td>{p.progress}%</td>
                      <td>
                        <div className="flex-center" style={{ gap: 8 }}>
                          <div className="pulse-dot" style={{ background: p.status === 'on-track' ? 'var(--neon)' : 'var(--red)' }} />
                          <span style={{ fontWeight: 700, color: 'var(--text-0)' }}>{p.status === 'on-track' ? '94%' : '62%'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StrategicDashboard;
