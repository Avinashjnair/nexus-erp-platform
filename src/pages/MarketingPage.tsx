import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DraggableGrid from '../components/ui/DraggableGrid';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { Target, ArrowUpRight, DollarSign, Briefcase } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'pipeline', x: 0, y: 2, w: 7, h: 5, minW: 5, minH: 4 },
    { i: 'quotes', x: 7, y: 2, w: 5, h: 5, minW: 4, minH: 4 },
    { i: 'feedback', x: 0, y: 7, w: 12, h: 4, minW: 8, minH: 3 },
  ],
};

const MarketingPage: React.FC = () => {
  const { tenders, quotations, feedback } = useNexusStore();

  const pipelineValue = tenders.reduce((s, t) => s + t.value, 0);
  const wonValue = tenders.filter(t => t.status === 'won').reduce((s, t) => s + t.value, 0);
  const winRate = tenders.length ? Math.round((tenders.filter(t => t.status === 'won').length / tenders.length) * 100) : 0;

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Stats Row */}
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)] font-medium">Pipeline Value</p>
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent-dark)]"><DollarSign className="w-5 h-5" /></div>
            </div>
            <h3 className="text-2xl font-display font-semibold mt-2">{formatCurrency(pipelineValue)}</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)] font-medium">Active Tenders</p>
              <div className="w-10 h-10 rounded-2xl bg-[var(--blue-dim)] flex items-center justify-center text-[var(--blue)]"><Briefcase className="w-5 h-5" /></div>
            </div>
            <h3 className="text-2xl font-display font-semibold mt-2">{tenders.filter(t => t.status !== 'won' && t.status !== 'lost').length}</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)] font-medium">Win Rate</p>
              <div className="w-10 h-10 rounded-2xl bg-[var(--green-dim)] flex items-center justify-center text-[var(--green)]"><Target className="w-5 h-5" /></div>
            </div>
            <h3 className="text-2xl font-display font-semibold mt-2">{winRate}%</h3>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-black/60 font-semibold">Won Value</p>
              <ArrowUpRight className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-2xl font-display font-bold text-black mt-2">{formatCurrency(wonValue)}</h3>
          </div>
        </div>
      </div>

      {/* Tender Pipeline */}
      <div key="pipeline">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Tender Pipeline</h2>
          <div className="flex-1 overflow-auto">
            <Table
              data={tenders}
              columns={[
                { header: 'Reference', accessor: 'ref', render: (item) => <span className="font-semibold text-[var(--text)]">{item.ref}</span> },
                { header: 'Client', accessor: 'client' },
                { header: 'Value', render: (item) => formatCurrency(item.value) },
                { header: 'Status', render: (item) => (
                  <Badge variant={item.status === 'won' ? 'success' : item.status === 'lost' ? 'danger' : item.status === 'submitted' ? 'info' : 'warning'}>
                    {item.status.toUpperCase()}
                  </Badge>
                )},
                { header: 'Probability', render: (item) => (
                  <div className="w-24">
                    <ProgressBar progress={item.probability} color={item.probability > 60 ? 'var(--green)' : 'var(--accent)'} size="sm" />
                  </div>
                )},
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Quotations */}
      <div key="quotes">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Recent Quotations</h2>
          <div className="space-y-4 flex-1">
            {(quotations || []).map(q => (
              <div key={q.id} className="bg-[var(--bg3)] p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{q.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{q.client} · v{q.version}</div>
                </div>
                <Badge variant={q.status === 'accepted' ? 'success' : q.status === 'sent' ? 'info' : 'warning'}>
                  {q.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Client Feedback */}
      <div key="feedback">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Client Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {(feedback || []).map(f => (
              <div key={f.id} className="bg-[var(--bg3)] p-5 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">{f.client}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < f.rating ? 'bg-[var(--accent)]' : 'bg-[#eee]'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--text2)] leading-relaxed">{f.comment}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">{f.date}</span>
                  <Badge variant={f.status === 'resolved' ? 'success' : 'warning'}>{f.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default MarketingPage;
