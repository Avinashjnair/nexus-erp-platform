import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { Warehouse, Package, ArrowDownRight, ArrowUpRight, Search, Plus, MoreHorizontal } from 'lucide-react';

const StorePage: React.FC = () => {
  const { inventory, materialRequests, issueMR, openModal, addToast } = useNexusStore();
  const [search, setSearch] = useState('');

  const stats = {
    totalSKUs: inventory.length,
    criticalItems: inventory.filter(i => i.status === 'critical').length,
    pendingMR: materialRequests.filter(m => m.status === 'pending').length,
    inventoryValue: '1.2M AED'
  };

  const filteredInventory = inventory.filter(i => 
    i.desc.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())
  );

  const invColumns = [
    { header: 'SKU Ref', render: (i: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '13px' }}>{i.id}</span> },
    { header: 'Material Description', accessor: 'desc', width: '35%' },
    { header: 'Category', accessor: 'category' },
    { header: 'In Stock', render: (i: any) => <span style={{ fontWeight: 700 }}>{i.onHand} {i.unit}</span> },
    { header: 'Status', render: (i: any) => (
      <Badge variant={i.status === 'critical' ? 'danger' : i.status === 'low' ? 'warning' : 'success'}>
        {i.status.toUpperCase()}
      </Badge>
    )},
    { header: 'Location', accessor: 'location' }
  ];

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Badge variant="success" style={{ marginBottom: '8px' }}>Logistics & Warehouse</Badge>
          <h1 style={{ margin: 0 }}>Inventory Control</h1>
          <p className="card-sub">Stock level monitoring, material issuance, and location tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="theme-toggle" style={{ width: 'auto', padding: '0 16px', gap: '8px' }} onClick={() => openModal('stock_count')}>
            <Package size={16} /> Stock Count
          </button>
          <button className="btn-primary" onClick={() => openModal('mr_create')}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Issue Material
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total SKUs" value={stats.totalSKUs} icon={<Warehouse size={18} />} accentColor="#3b82f6" />
        <StatCard label="Critical Stock" value={stats.criticalItems} trend={{ value: 'Review', type: 'down' }} icon={<ArrowDownRight size={18} />} accentColor="#ef4444" />
        <StatCard label="Pending Requests" value={stats.pendingMR} trend={{ value: 'Active', type: 'up' }} icon={<ArrowUpRight size={18} />} accentColor="#f59e0b" />
        <StatCard label="Holding Value" value={stats.inventoryValue} icon={<Package size={18} />} accentColor="#10b981" />
      </div>

      <div className="card gap-b">
        <div className="card-header">
          <div>
            <h4 className="card-title">Live Inventory Ledger</h4>
            <p className="card-sub">Tracking {filteredInventory.length} unique material items</p>
          </div>
          <div className="topbar-search" style={{ width: '280px', backgroundColor: 'var(--bg-base)' }}>
            <Search size={14} color="var(--text-tertiary)" />
            <input type="text" placeholder="Search by SKU or Description..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <Table data={filteredInventory} columns={invColumns} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Pending Material Requests</h4>
              <p className="card-sub">Departmental withdrawal requisitions</p>
            </div>
          </div>
          <Table 
            data={materialRequests.filter(m => m.status === 'pending')} 
            columns={[
              { header: 'MR ID', render: (m: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>{m.id}</span> },
              { header: 'Item', accessor: 'item' },
              { header: 'Qty', accessor: 'qty' },
              { header: 'Action', render: (m: any) => (
                <button 
                  className="theme-toggle" 
                  style={{ width: 'auto', padding: '0 12px', fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}
                  onClick={() => { issueMR(m.id); addToast(`Materials issued for ${m.id}`, 'success'); }}
                >
                  ISSUE
                </button>
              )}
            ]} 
          />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Stock Movements</h4>
              <p className="card-sub">Recent log from store and logistics</p>
            </div>
          </div>
          <div className="timeline">
            {useNexusStore.getState().activityLog
              .filter(a => a.dept === 'Store' || a.dept === 'Purchase')
              .slice(0, 5)
              .map((a, i) => (
                <div key={i} className="tl-item">
                  <div style={{ position: 'relative' }}>
                    <div className="tl-dot" style={{ backgroundColor: a.type === 'success' ? 'var(--success)' : a.type === 'warning' ? 'var(--warning)' : 'var(--primary)' }}></div>
                    {i < 4 && <div className="tl-line"></div>}
                  </div>
                  <div>
                    <div className="tl-label">{a.title}</div>
                    <div className="tl-text">{a.text}</div>
                    <div className="tl-time">{a.time}</div>
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
