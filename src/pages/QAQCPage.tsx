import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

import DraggableGrid from '../components/ui/DraggableGrid';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { ClipboardCheck, FileCheck, AlertOctagon, ArrowUpRight } from 'lucide-react';

const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'inspections', x: 0, y: 2, w: 7, h: 5, minW: 5, minH: 4 },
    { i: 'ncrs', x: 7, y: 2, w: 5, h: 5, minW: 4, minH: 4 },
    { i: 'reports', x: 0, y: 7, w: 12, h: 4, minW: 8, minH: 3 },
  ],
};

const QAQCPage: React.FC = () => {
  const { inspectionRequests, ncrs, reports, openModal } = useNexusStore();

  const scheduled = inspectionRequests.filter(i => i.status === 'scheduled').length;
  const pending = inspectionRequests.filter(i => i.status === 'pending').length;
  const openNCRs = ncrs.filter(n => n.status === 'open').length;

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Stats */}
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Scheduled IRs</p>
            <h3 className="text-3xl font-display font-semibold">{scheduled}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--blue)]"><ClipboardCheck className="w-3 h-3" /> Upcoming</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Pending Review</p>
            <h3 className="text-3xl font-display font-semibold">{pending}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--amber)]"><FileCheck className="w-3 h-3" /> Awaiting</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Open NCRs</p>
            <h3 className="text-3xl font-display font-semibold text-[var(--red)]">{openNCRs}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--red)]"><AlertOctagon className="w-3 h-3" /> Action needed</div>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">Total Reports</p>
            <h3 className="text-3xl font-display font-bold text-black">{reports.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-black/60"><ArrowUpRight className="w-3 h-3" /> Generated</div>
          </div>
        </div>
      </div>

      {/* Inspection Requests */}
      <div key="inspections">
        <Card className="h-full drag-handle cursor-move">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Inspection Requests</h2>
            <button onClick={() => openModal('IR_MODAL')} className="btn-accent text-xs py-2 px-4 rounded-xl">+ New IR</button>
          </div>
          <div className="flex-1 overflow-auto">
            <Table
              data={inspectionRequests}
              columns={[
                { header: 'ID', accessor: 'id', render: (item) => <span className="font-semibold text-[var(--text)]">{item.id}</span> },
                { header: 'Activity', accessor: 'activity' },
                { header: 'Type', accessor: 'type' },
                { header: 'Date', accessor: 'date' },
                { header: 'Status', render: (item) => (
                  <Badge variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : item.status === 'scheduled' ? 'info' : 'warning'}>
                    {item.status.toUpperCase()}
                  </Badge>
                )},
              ]}
            />
          </div>
        </Card>
      </div>

      {/* NCRs */}
      <div key="ncrs">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Non-Conformance Reports</h2>
          <div className="space-y-4 flex-1 overflow-auto">
            {ncrs.map(n => (
              <div key={n.id} className={`p-5 rounded-2xl border ${n.status === 'open' ? 'bg-[var(--red-dim)] border-[var(--red)]/20' : 'bg-[var(--bg3)] border-[var(--border)]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[var(--text)]">{n.id}</span>
                  <Badge variant={n.status === 'open' ? 'danger' : 'success'}>{n.status.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-[var(--text2)] mb-2">{n.activity}</p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-medium">
                  <span>{n.severity.toUpperCase()}</span>
                  <span>·</span>
                  <span>{n.raised}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reports */}
      <div key="reports">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Inspection Reports</h2>
          <div className="flex-1 overflow-auto">
            <Table
              data={reports}
              columns={[
                { header: 'ID', accessor: 'id', render: (item) => <span className="font-semibold text-[var(--text)]">{item.id}</span> },
                { header: 'Title', accessor: 'title' },
                { header: 'Type', accessor: 'type' },
                { header: 'Date', accessor: 'date' },
                { header: 'Result', render: (item) => (
                  <Badge variant={item.result === 'Pass' ? 'success' : 'danger'}>{item.result}</Badge>
                )},
                { header: 'File', accessor: 'file' },
              ]}
            />
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default QAQCPage;
