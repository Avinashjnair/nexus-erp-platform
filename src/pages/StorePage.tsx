import React from 'react';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { Package, AlertTriangle, Truck, Plus, Boxes } from 'lucide-react';

const StorePage: React.FC = () => {
  const { inventory, materialRequests, openModal, addToast } = useNexusStore();

  const criticalItems = inventory.filter(i => i.status === 'critical').length;
  const lowItems = inventory.filter(i => i.status === 'low').length;
  const pendingMRs = materialRequests.filter(m => m.status === 'pending').length;

  const invColumns = [
    { header: 'SKU', accessor: (item: any) => <span className="font-mono">{item.id}</span> },
    { header: 'Description', accessor: 'desc' },
    { header: 'On Hand', render: (item: any) => `${item.onHand} ${item.unit}` },
    { header: 'Location', accessor: 'location' },
    { 
      header: 'Stock Level', 
      render: (item: any) => (
        <div style={{ minWidth: 80 }}>
          <ProgressBar 
            progress={Math.round((item.onHand / item.maxStock) * 100)} 
            color={item.status === 'critical' ? 'var(--red)' : item.status === 'low' ? 'var(--amber)' : 'var(--neon)'} 
            height={4}
          />
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (item: any) => (
        <Badge variant={item.status === 'ok' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}>
          {item.status.toUpperCase()}
        </Badge>
      )
    },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Control</h1>
          <p className="page-subtitle">Material tracking, warehouse management, and stock optimization</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => addToast('Inventory update coming soon', 'info')}>
             <Boxes size={14} /> Audit Stock
          </button>
          <button className="btn btn-primary" onClick={() => openModal('MR_MODAL')}>
            <Plus size={14} /> New Material Request
          </button>
        </div>
      </div>

      <div className="stat-grid gap-b">
        <StatCard
          label="Total SKUs"
          value={inventory.length}
          sub="Tracked inventory items"
          icon={<Package size={18} />}
          accentColor="var(--blue)"
        />
        <StatCard
          label="Critical Stock"
          value={criticalItems}
          sub="Reorder immediately"
          icon={<AlertTriangle size={18} />}
          accentColor="var(--red)"
        />
        <StatCard
          label="Pending MRs"
          value={pendingMRs}
          sub="Awaiting issuance"
          icon={<Truck size={18} />}
          accentColor="var(--amber)"
        />
        <StatCard
          label="Low Stock"
          value={lowItems}
          sub="Items near threshold"
          icon={<AlertTriangle size={18} />}
          accentColor="var(--amber)"
          dimColor="var(--amber-dim)"
        />
      </div>

      <div className="grid-3-2 gap-b">
        {/* Inventory Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Warehouse Inventory</div>
              <div className="card-sub">Stock levels across all storage locations</div>
            </div>
          </div>
          <Table data={inventory} columns={invColumns} />
        </div>

        {/* Material Requests */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Material Requests</div>
              <div className="card-sub">Internal issuance pipeline</div>
            </div>
          </div>
          <div className="flex-col" style={{ gap: '10px' }}>
            {materialRequests.map(m => (
              <div key={m.id} className="vendor-card">
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <span className="vendor-name">{m.item}</span>
                    <Badge variant={m.status === 'issued' ? 'success' : m.status === 'partial' ? 'warning' : 'info'}>
                      {m.status}
                    </Badge>
                  </div>
                  <div className="vendor-cat" style={{ marginTop: 4 }}>
                    {m.id} · {m.qty} · From {m.from}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
