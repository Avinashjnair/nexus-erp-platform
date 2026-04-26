import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DraggableGrid from '../components/ui/DraggableGrid';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { Package, AlertTriangle, Truck, ArrowUpRight } from 'lucide-react';

const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'inventory', x: 0, y: 2, w: 7, h: 5, minW: 5, minH: 4 },
    { i: 'requests', x: 7, y: 2, w: 5, h: 5, minW: 4, minH: 4 },
  ],
};

const StorePage: React.FC = () => {
  const { inventory, materialRequests, openModal } = useNexusStore();

  const criticalItems = inventory.filter(i => i.status === 'critical').length;
  const lowItems = inventory.filter(i => i.status === 'low').length;
  const pendingMRs = materialRequests.filter(m => m.status === 'pending').length;

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Stats */}
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Total SKUs</p>
            <h3 className="text-3xl font-display font-semibold">{inventory.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--green)]"><Package className="w-3 h-3" /> Tracked</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Critical Stock</p>
            <h3 className="text-3xl font-display font-semibold text-[var(--red)]">{criticalItems}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--red)]"><AlertTriangle className="w-3 h-3" /> Reorder now</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Pending MRs</p>
            <h3 className="text-3xl font-display font-semibold">{pendingMRs}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--amber)]"><Truck className="w-3 h-3" /> Awaiting</div>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">Low Stock Items</p>
            <h3 className="text-3xl font-display font-bold text-black">{lowItems}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-black/60"><ArrowUpRight className="w-3 h-3" /> Monitor</div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div key="inventory">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Inventory Status</h2>
          <div className="flex-1 overflow-auto">
            <Table
              data={inventory}
              columns={[
                { header: 'SKU', accessor: 'id', render: (item) => <span className="font-semibold text-[var(--text)]">{item.id}</span> },
                { header: 'Description', accessor: 'desc' },
                { header: 'On Hand', render: (item) => `${item.onHand} ${item.unit}` },
                { header: 'Location', accessor: 'location' },
                { header: 'Stock Level', render: (item) => (
                  <div className="w-20">
                    <ProgressBar 
                      progress={Math.round((item.onHand / item.maxStock) * 100)} 
                      color={item.status === 'critical' ? 'var(--red)' : item.status === 'low' ? 'var(--amber)' : 'var(--green)'} 
                      size="sm" 
                    />
                  </div>
                )},
                { header: 'Status', render: (item) => (
                  <Badge variant={item.status === 'ok' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}>
                    {item.status.toUpperCase()}
                  </Badge>
                )},
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Material Requests */}
      <div key="requests">
        <Card className="h-full drag-handle cursor-move">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Material Requests</h2>
            <button onClick={() => openModal('MR_MODAL')} className="btn-accent text-xs py-2 px-4 rounded-xl">+ New MR</button>
          </div>
          <div className="space-y-3 flex-1 overflow-auto">
            {materialRequests.map(m => (
              <div key={m.id} className="bg-[var(--bg3)] p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{m.item}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{m.id} · {m.qty} · From {m.from}</div>
                </div>
                <Badge variant={m.status === 'issued' ? 'success' : m.status === 'partial' ? 'warning' : 'info'}>
                  {m.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default StorePage;
