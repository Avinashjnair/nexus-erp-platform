import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { formatCurrency } from '../utils/formatters';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { 
  Folder, DollarSign, Clock, AlertTriangle, Zap, 
  CheckCircle, XCircle, TrendingUp, Package, ShieldCheck
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import GaugeChart from '../components/ui/GaugeChart';

const COLORS = ['var(--violet)', 'var(--blue)', 'var(--teal)', 'var(--amber)', 'var(--red)'];

const ManagementPage: React.FC = () => {
  const { 
    projects, purchaseRequests, ncrs, deptEfficiency, financialStats, 
    hseStats, laborCosts, bidPipeline, vendorCompliance,
    procurement, engineering, production, quality, projectControls,
    approvePR, rejectPR, addToast, openModal 
  } = useNexusStore();

  // ── Metrics Calculation ───────────────────────────────────────
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'on-track' || p.status === 'delayed').length;
  const completedProjects = projects.filter(p => p.status === 'near-complete').length; // Assuming near-complete as a proxy for this mock
  const delayedProjects = projects.filter(p => p.status === 'delayed').length;
  const pendingRelease = 1; // Mocked for this view

  const totalTCV = projects.reduce((s, p) => s + p.contractValue, 0);
  const ordersInHand = totalTCV;
  const ordersProcess = projects.filter(p => p.progress < 100).reduce((s, p) => s + (p.contractValue * (p.progress/100)), 0);
  const ordersCompleted = projects.reduce((s, p) => s + (p.contractValue * (p.progress/100)), 0);
  const delayedValue = projects.filter(p => p.status === 'delayed').reduce((s, p) => s + p.contractValue, 0);
  const resourceLoss = 124500; // Calculated risk metric

  const pendingApprovals = purchaseRequests.filter(p => p.status === 'pending');
  const activeNCRs = ncrs.filter(n => n.status === 'open');

  const financialDistribution = [
    { name: 'In Hand', value: ordersInHand - ordersProcess },
    { name: 'Under Process', value: ordersProcess },
    { name: 'Realized', value: ordersCompleted },
  ];

  return (
    <div className="page-fade-in">
      
      {/* ── AI Intelligence active ── */}
      <div className="ai-panel gap-b">
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <div className="flex-center" style={{ gap: 10 }}>
            <div className="pulse-dot" style={{ background: 'var(--neon)' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-0)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Neural Intelligence Active
            </span>
            <Badge variant="neon">92% Forecast Accuracy</Badge>
          </div>
          <Zap size={14} color="var(--violet-2)" />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', maxWidth: '800px', lineHeight: 1.6 }}>
          Operational patterns suggest a 12% probability of material bottlenecks in <span style={{ color: 'var(--amber)' }}>Production Bay 4</span> next week. 
          Financial risk on Project P2 is estimated at <span style={{ color: 'var(--red)' }}>AED 84k</span> due to resource idle time. 
          Recommendation: Expedite PR-0815 and re-allocate 2 welders from Module 2 to Spool Fabrication.
        </p>
      </div>

      {/* ── 1. Projects Overview Widget ── */}
      <div className="stat-grid gap-b">
        <StatCard 
          label="Total Projects" value={totalProjects} 
          icon={<Folder size={18} />} accentColor="var(--blue)" 
          trend={{ label: 'Master count', up: true }}
        />
        <StatCard 
          label="Active Projects" value={activeProjects} 
          icon={<TrendingUp size={18} />} accentColor="var(--neon)" 
          trend={{ label: 'In production', up: true }}
        />
        <StatCard 
          label="Completed" value={completedProjects} 
          icon={<CheckCircle size={18} />} accentColor="var(--teal)" 
          trend={{ label: 'Closed/Delivered', up: true }}
        />
        <StatCard 
          label="Pending Release" value={pendingRelease} 
          icon={<Clock size={18} />} accentColor="var(--amber)" 
          trend={{ label: 'Ready for ops', up: false }}
        />
        <StatCard 
          label="Delayed Projects" value={delayedProjects} 
          icon={<AlertTriangle size={18} />} accentColor="var(--red)" 
          trend={{ label: 'High visibility', up: false }}
        />
      </div>

      {/* ── 2. Financial Command Center ── */}
      <div className="grid-5-3 gap-b">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">TCV & Financial Portfolio</div>
              <div className="card-sub">Aggregate contract value and risk distribution</div>
            </div>
          </div>
          <div className="grid-2 gap-b">
            <div className="flex-col gap-b">
              <div className="stat-card mini">
                <div className="stat-label">Orders in Hand</div>
                <div className="stat-value sm">{formatCurrency(ordersInHand)}</div>
              </div>
              <div className="stat-card mini">
                <div className="stat-label">Value of Delayed Projects</div>
                <div className="stat-value sm" style={{ color: 'var(--red)' }}>{formatCurrency(delayedValue)}</div>
              </div>
              <div className="stat-card mini">
                <div className="stat-label">Resource Underutilization Loss</div>
                <div className="stat-value sm" style={{ color: 'var(--orange)' }}>{formatCurrency(resourceLoss)}</div>
              </div>
            </div>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {financialDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: 'var(--text-0)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue Forecast</div>
              <div className="card-sub">Realized revenue vs Cost (YTD)</div>
            </div>
          </div>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialStats}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--violet)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--violet)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="period" stroke="var(--text-3)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-3)" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--violet)" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="cost" stroke="var(--blue)" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── SUPPLEMENTARY EXECUTIVE OVERVIEW ── */}
      <div className="grid-2 gap-b">
        {/* ── HSE & Safety Overview ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">HSE & Safety Overview</div>
              <div className="card-sub">Incident tracking and safety performance</div>
            </div>
          </div>
          <div className="grid-2 gap-b">
            <div className="flex-col justify-center">
              <div className="stat-label">Days Since Last LTI</div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--green)', margin: '8px 0' }}>{hseStats.ltiDays}</div>
              <Badge variant="neon">OPTIMAL PERFORMANCE</Badge>
            </div>
            <div style={{ height: '160px' }}>
              <div className="stat-label mb-4" style={{ fontSize: 10 }}>Incident History (YTD)</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hseStats.incidentHistory}>
                  <XAxis dataKey="month" hide />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '10px' }}
                  />
                  <Bar dataKey="misses" name="Near Misses" fill="var(--amber)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="incidents" name="Incidents" fill="var(--red)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Labor & Workforce Costs ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Labor & Workforce Costs</div>
              <div className="card-sub">Regular vs. Overtime hour burn rates</div>
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laborCosts} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="dept" type="category" axisLine={false} tickLine={false} fontSize={10} stroke="var(--text-3)" width={70} />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'Overtime') return [value, `OT Hours (Cost: ${formatCurrency(props.payload.otCost)})` ];
                    return [value, name];
                  }}
                  contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                <Bar dataKey="regular" name="Regular" stackId="a" fill="var(--bg4)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="overtime" name="Overtime" stackId="a" fill="var(--orange)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2 gap-b">
        {/* ── Bid Pipeline Funnel ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Bid Pipeline Funnel</div>
              <div className="card-sub">Active tender lifecycle and value projection</div>
            </div>
          </div>
          <div className="flex-col gap-8">
            {bidPipeline.map((stage, idx) => (
              <div key={stage.stage} className="flex-center" style={{ gap: 12 }}>
                <div style={{ width: 80, fontSize: 10, color: 'var(--text-3)', textAlign: 'right' }}>{stage.stage}</div>
                <div style={{ flex: 1, height: 24, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(stage.value / bidPipeline[0].value) * 100}%`, 
                      background: `linear-gradient(90deg, var(--violet) ${idx * 20}%, var(--neon))`,
                      opacity: 1 - (idx * 0.15)
                    }} 
                  />
                  <div className="flex-between" style={{ position: 'absolute', inset: 0, padding: '0 8px', pointerEvents: 'none' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-0)' }}>{stage.count} Bids</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-0)' }}>{formatCurrency(stage.value)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vendor Compliance Status ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Vendor Compliance Status</div>
              <div className="card-sub">Tracking certification and safety validity</div>
            </div>
          </div>
          <div className="grid-2">
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorCompliance}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vendorCompliance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-col justify-center gap-8">
              {vendorCompliance.map(item => (
                <div key={item.category} className="flex-between">
                  <div className="flex-center" style={{ gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                    <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{item.category}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-0)' }}>{item.value}%</span>
                </div>
              ))}
              <div className="ai-panel" style={{ padding: '8px 12px', marginTop: 8, borderColor: 'var(--red)' }}>
                <span style={{ fontSize: 10, color: 'var(--text-2)' }}>
                  <AlertTriangle size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  6 Vendors flagged for immediate certification renewal.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Action Command Center ── */}
      <div className="grid-2 gap-b">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Approval Requests</div>
              <div className="card-sub">Pending operational & financial gates</div>
            </div>
          </div>
          <div className="table-wrap">
            <table className="nexus-table">
              <thead>
                <tr>
                  <th>Requestor</th>
                  <th>Item</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map(req => (
                  <tr key={req.id}>
                    <td>
                      <div className="flex-center" style={{ gap: 8 }}>
                        <div className="sidebar-avatar sm">{req.raisedBy.charAt(0)}</div>
                        <span style={{ fontSize: 12 }}>{req.raisedBy}</span>
                      </div>
                    </td>
                    <td><div style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.item}</div></td>
                    <td style={{ fontSize: 10, color: 'var(--text-3)' }}>{req.raised}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex-center" style={{ gap: 4, justifyContent: 'flex-end' }}>
                        <button className="action-btn-sm text-green" onClick={() => { approvePR(req.id); addToast('PR Approved', 'success'); }}><CheckCircle size={14} /></button>
                        <button className="action-btn-sm text-red" onClick={() => { rejectPR(req.id); addToast('PR Rejected', 'error'); }}><XCircle size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">NCR Command Center</div>
              <div className="card-sub">Active quality & compliance issues</div>
            </div>
          </div>
          <div className="flex-col gap-8">
            {activeNCRs.map(n => (
              <div key={n.id} className="vendor-card" style={{ borderLeft: `3px solid ${n.severity === 'major' ? 'var(--red)' : 'var(--amber)'}` }}>
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-0)' }}>{n.id}</span>
                    <Badge variant={n.severity === 'major' ? 'danger' : 'warning'}>{n.severity.toUpperCase()}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{n.activity}</div>
                  <div className="flex-between" style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 9, color: 'var(--text-3)' }}>Raised: {n.raised} by {n.raisedBy}</span>
                    <button className="btn-link-sm" onClick={() => openModal('VIEW_NCR', n)}>Investigate</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Department Efficiency Analytics ── */}
      <div className="card gap-b">
        <div className="card-header">
          <div>
            <div className="card-title">Divisional Efficiency Analytics</div>
            <div className="card-sub">Utilization, Delivery Performance, and Lead Times</div>
          </div>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-3)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-3)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'var(--bg3)', opacity: 0.4 }}
                contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px' }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20, fontSize: 10 }} />
              <Bar dataKey="utilization" name="Utilization %" fill="var(--violet)" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="onTime" name="On-Time Delivery %" fill="var(--teal)" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 5. Procurement Status Tracker ── */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Procurement Command: PO / WO Issued</div>
            <div className="card-sub">Real-time tracking of supply chain commitments</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => addToast('Exporting to Excel...', 'info')}>
            <Package size={12} /> Export Register
          </button>
        </div>
        <div className="table-wrap">
          <table className="nexus-table">
            <thead>
              <tr>
                <th>Document No.</th>
                <th>Vendor / Contractor</th>
                <th>Issue Date</th>
                <th>Value (AED)</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseRequests.map(pr => (
                <tr key={pr.id}>
                  <td className="td-primary">{pr.poNo || 'Pending'}</td>
                  <td>
                    <div className="flex-center" style={{ gap: 8 }}>
                      <div className="sidebar-avatar sm" style={{ background: 'var(--bg4)', color: 'var(--text-3)' }}><Package size={10} /></div>
                      <span>{pr.item}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{pr.raised}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatCurrency(Math.random() * 50000)}</td>
                  <td>
                    <Badge variant={
                      pr.status === 'po-issued' ? 'teal' : 
                      pr.status === 'delivered' ? 'neon' : 
                      pr.status === 'rejected' ? 'red' : 'amber'
                    }>
                      {pr.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DEPARTMENTAL PERFORMANCE HUBS ── */}
      <div className="section-title">Departmental Command Centers</div>
      <div className="accent-line" />

      <div className="grid-2 gap-b">
        {/* ── 1. Procurement & Engineering ── */}
        <div className="card">
          <div className="card-header">
            <div className="flex-center" style={{ gap: 8 }}><ShieldCheck size={16} color="var(--blue)" /> <div className="card-title">Procurement & Commercial</div></div>
          </div>
          <div className="grid-2 gap-b">
            <GaugeChart value={procurement.ppv / 100} label="PPV %" target={0.9} color="var(--blue)" max={1.2} />
            <div className="flex-col gap-4">
              <span className="sidebar-section-label">Top/Bottom Supplier OTIF</span>
              {procurement.otif.map(s => (
                <div key={s.vendor} className="flex-col mb-4">
                  <div className="flex-between mb-4">
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{s.vendor}</span>
                    <span style={{ fontSize: 10, color: s.rate < 80 ? 'var(--red)' : 'var(--neon)' }}>{s.rate}%</span>
                  </div>
                  <div className="progress-track" style={{ height: 4 }}><div className="progress-fill" style={{ width: `${s.rate}%`, background: s.rate < 80 ? 'var(--red)' : 'var(--blue)' }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex-center" style={{ gap: 8 }}><TrendingUp size={16} color="var(--violet)" /> <div className="card-title">Engineering & Design</div></div>
          </div>
          <div className="grid-2 gap-b">
            <div style={{ height: '140px' }}>
              <span className="sidebar-section-label mb-4">ECO Frequency Rate</span>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engineering.ecoTrend}>
                  <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="count" stroke="var(--violet)" strokeWidth={2} dot={{ r: 3, fill: 'var(--violet)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-col justify-center items-center">
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--neon)' }}>{engineering.releaseAdherence}%</div>
              <div className="stat-label">Design Release Adherence</div>
              <Badge variant="neon" size="xs" style={{ marginTop: 8 }}>ON TARGET</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 gap-b">
        {/* ── 2. Production & Quality ── */}
        <div className="card">
          <div className="card-header">
            <div className="flex-center" style={{ gap: 8 }}><Package size={16} color="var(--amber)" /> <div className="card-title">Production & Shop Floor</div></div>
          </div>
          <div className="flex-col gap-b">
            <div style={{ height: '160px' }}>
              <span className="sidebar-section-label">Phase Cycle Time (Est vs Act)</span>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={production.cycleTime}>
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} fontSize={10} stroke="var(--text-3)" />
                  <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="estimated" name="Est" fill="var(--bg4)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="actual" name="Act" fill="var(--amber)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid-4 gap-8">
              {production.machineLoad.map(m => (
                <div key={m.bay} className="ai-panel" style={{ padding: 8, textAlign: 'center', borderColor: m.load > 100 ? 'var(--red)' : m.load > 80 ? 'var(--amber)' : 'var(--teal)' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-3)' }}>{m.bay}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-0)' }}>{m.load}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex-center" style={{ gap: 8 }}><ShieldCheck size={16} color="var(--teal)" /> <div className="card-title">Quality & Project Controls</div></div>
          </div>
          <div className="grid-2 gap-b">
            <div className="flex-col justify-center items-center">
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal)' }}>{quality.fpy}%</div>
              <div className="stat-label">First Pass Yield (FPY)</div>
              <div style={{ height: 60, width: '100%', marginTop: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quality.ncrResolution}>
                    <Line type="monotone" dataKey="days" stroke="var(--red)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 9, color: 'var(--text-3)', textAlign: 'center' }}>NCR Resolution Trend</div>
              </div>
            </div>
            <div className="flex-col gap-4">
              <GaugeChart value={projectControls.cpi} label="CPI" target={1.0} color="var(--neon)" min={0.5} max={1.5} />
              <GaugeChart value={projectControls.spi} label="SPI" target={0.85} color="var(--amber)" min={0.5} max={1.5} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagementPage;
