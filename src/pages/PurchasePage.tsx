import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DraggableGrid from '../components/ui/DraggableGrid';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { Truck, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';

const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'prs', x: 0, y: 2, w: 7, h: 5, minW: 5, minH: 4 },
    { i: 'vendors', x: 7, y: 2, w: 5, h: 5, minW: 4, minH: 4 },
  ],
};

const PurchasePage: React.FC = () => {
  const { purchaseRequests, vendors, openModal } = useNexusStore();

  const pending = purchaseRequests.filter(p => p.status === 'pending').length;
  const approved = purchaseRequests.filter(p => p.status === 'approved').length;
  const delivered = purchaseRequests.filter(p => p.status === 'delivered').length;
  const urgent = purchaseRequests.filter(p => p.priority === 'urgent').length;

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Stats */}
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Pending PRs</p>
            <h3 className="text-3xl font-display font-semibold">{pending}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--amber)]">
              <AlertTriangle className="w-3 h-3" /> {urgent} urgent
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Approved</p>
            <h3 className="text-3xl font-display font-semibold">{approved}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--green)]"><CheckCircle2 className="w-3 h-3" /> Ready for PO</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Delivered</p>
            <h3 className="text-3xl font-display font-semibold">{delivered}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)]"><Truck className="w-3 h-3" /> This month</div>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">Total PRs</p>
            <h3 className="text-3xl font-display font-bold text-black">{purchaseRequests.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-black/60"><ArrowUpRight className="w-3 h-3" /> All time</div>
          </div>
        </div>
      </div>

      {/* Purchase Requests Table */}
      <div key="prs">
        <Card className="h-full drag-handle cursor-move">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Purchase Requests</h2>
            <button onClick={() => openModal('PR_MODAL')} className="btn-accent text-xs py-2 px-4 rounded-xl">+ New PR</button>
          </div>
          <div className="flex-1 overflow-auto">
            <Table
              data={purchaseRequests}
              columns={[
                { header: 'ID', accessor: 'id', render: (item) => <span className="font-semibold text-[var(--text)]">{item.id}</span> },
                { header: 'Item', accessor: 'item' },
                { header: 'Qty', accessor: 'qty' },
                { header: 'Priority', render: (item) => (
                  <Badge variant={item.priority === 'urgent' ? 'danger' : 'default'}>{item.priority.toUpperCase()}</Badge>
                )},
                { header: 'Status', render: (item) => (
                  <Badge variant={item.status === 'delivered' ? 'success' : item.status === 'approved' ? 'info' : item.status === 'pending' ? 'warning' : 'default'}>
                    {item.status.toUpperCase()}
                  </Badge>
                )},
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Vendor Performance */}
      <div key="vendors">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Vendor Performance</h2>
          <div className="space-y-4 flex-1 overflow-auto">
            {vendors.map(v => (
              <div key={v.id} className="bg-[var(--bg3)] p-4 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{v.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{v.category}</div>
                  </div>
                  <Badge variant={v.onTime > 85 ? 'success' : v.onTime > 70 ? 'warning' : 'danger'}>
                    {v.onTime}% OTD
                  </Badge>
                </div>
                <ProgressBar progress={v.quality} color={v.quality > 90 ? 'var(--green)' : 'var(--accent)'} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default PurchasePage;
