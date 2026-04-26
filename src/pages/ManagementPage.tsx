import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Briefcase, FileText, CheckCircle2, Clock, Building2, DollarSign } from 'lucide-react';
import { useNexusStore } from '../store/useNexusStore';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/ui/Card';

const ManagementPage: React.FC = () => {
  const { projects, purchaseRequests, tenders } = useNexusStore();

  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const pendingPRs = purchaseRequests.filter(p => p.status === 'pending').length;
  const activeTenders = tenders.filter(t => t.status === 'drafting' || t.status === 'submitted').length;
  const yetToIssue = purchaseRequests.filter(p => p.status === 'approved').length;

  const BACKLOG_DATA = [
    { name: 'Purchase', value: pendingPRs > 0 ? 45 : 20 },
    { name: 'Production', value: 70 },
    { name: 'Store', value: 30 },
    { name: 'QAQC', value: 85 },
    { name: 'Marketing', value: 50 },
    { name: 'Finance', value: 60 },
  ];

  // Calculate project health stats
  const onTrack = projects.filter(p => p.status === 'on-track').length;
  const delayed = projects.filter(p => p.status === 'delayed').length;
  const nearComplete = projects.filter(p => p.status === 'near-complete').length;
  const total = projects.length || 1;

  return (
    <div className="font-sans text-[var(--text)] select-none p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── KPI CARD ── */}
        <div className="lg:col-span-5 h-full">
          <Card className="h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Main Goals</h2>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Running Projects</p>
                  <h3 className="text-4xl font-bold tracking-tight mb-2">{projects.length}</h3>
                  <div className="flex items-center gap-1 text-[var(--accent-dark)] text-xs font-semibold">
                    <div className="bg-[var(--accent)] p-1 rounded-full text-black"><ArrowUpRight className="w-3 h-3" /></div>
                    <span>Active</span>
                  </div>
                </div>
                <div className="h-6 w-full bg-[#f4f4f4] rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.round((onTrack / total) * 100)}%` }} />
                </div>
              </div>

              <div className="flex flex-col justify-between border-l border-[var(--border)] pl-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Tenders in Bidding</p>
                  <h3 className="text-4xl font-bold tracking-tight mb-2">{activeTenders}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
                    <div className="bg-[#f0f0f0] p-1 rounded-full"><ArrowDownRight className="w-3 h-3" /></div>
                    <span>Bidding</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-sm font-medium text-gray-500 mb-1">Yet to issue</p>
                  <h3 className="text-2xl font-bold tracking-tight">{yetToIssue}</h3>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── STATUS CARD (LIME) ── */}
        <div className="lg:col-span-3 h-full">
          <Card className="h-full bg-[var(--accent)] text-black border-none shadow-[0_20px_40px_-15px_rgba(212,255,0,0.4)]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Project Status</h2>
              <div className="p-2 bg-white/30 rounded-full backdrop-blur-md">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold tracking-tight leading-tight pr-4 truncate">Health Overview</h3>
            
            <div className="flex-1 mt-6 space-y-3">
              <div className="bg-white/20 px-3 py-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-800">On Time</span>
                </div>
                <span className="font-bold">{Math.round((onTrack / total) * 100)}%</span>
              </div>
              <div className="bg-white/20 px-3 py-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-800/80">Delayed</span>
                </div>
                <span className="font-bold">{Math.round((delayed / total) * 100)}%</span>
              </div>
              <div className="bg-white/20 px-3 py-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800/80">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-800/80">Completed</span>
                </div>
                <span className="font-bold">{Math.round((nearComplete / total) * 100)}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ── BACKLOG CHART ── */}
        <div className="lg:col-span-4 h-full">
          <Card className="h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Dept Backlog</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Pending tasks by execution unit</p>
              </div>
            </div>
            <div className="flex-1 -mx-2 mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BACKLOG_DATA} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                  />
                  <Bar dataKey="value" radius={[20, 20, 20, 20]} barSize={24}>
                    {BACKLOG_DATA.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 || index === 1 ? '#111827' : '#ececec'} />
                    ))}
                  </Bar>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: '#6B7280', fontWeight: 500, textAnchor: 'middle'}} 
                    dy={12}
                    interval={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── PROJECT VALUE (FINANCIALS) ── */}
        <div className="lg:col-span-12">
          <Card className="h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Project Value (Financials)</h2>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--bg3)] p-6 rounded-3xl border border-[var(--border)] flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">On Order</p>
                  <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(totalValue * 0.36)}</h4>
                  <p className="text-sm font-medium text-gray-500 mt-1">Total committed value</p>
                </div>
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-black">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[var(--bg3)] p-6 rounded-3xl border border-[var(--border)] flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Under Process</p>
                  <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(totalValue * 0.24)}</h4>
                  <p className="text-sm font-medium text-gray-500 mt-1">Active execution phase</p>
                </div>
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-black">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[var(--accent)] p-6 rounded-3xl shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)] flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-2">Billed</p>
                  <h4 className="text-4xl font-bold tracking-tight text-black">{formatCurrency(totalValue)}</h4>
                  <p className="text-sm font-medium text-gray-800 mt-1">Total realized revenue</p>
                </div>
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ManagementPage;
