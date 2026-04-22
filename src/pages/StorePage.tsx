import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { Warehouse, Package, ArrowDownRight, ArrowUpRight, Search, Plus } from 'lucide-react';

const StorePage: React.FC = () => {
  const { inventory, materialRequests, issueMR, currentRole, openModal, addToast } = useNexusStore();
  const [search, setSearch] = useState('');

  const stats = {
    totalSKUs: inventory.length,
    criticalItems: inventory.filter(i => i.status === 'critical').length,
    pendingMR: materialRequests.filter(m => m.status === 'pending').length,
    inventoryValue: '1.2M AED' // Placeholder for calculated value
  };

  const filteredInventory = inventory.filter(i => 
    i.desc.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())
  );

  const invColumns = [
    { header: 'SKU ID', accessor: (i: any) => <span className="font-mono text-sm">{i.id}</span> },
    { header: 'Description', accessor: 'desc' },
    { header: 'Category', accessor: 'category' },
    { header: 'On Hand', accessor: (i: any) => <span className="font-bold">{i.onHand} {i.unit}</span> },
    { header: 'Status', accessor: (i: any) => (
      <Badge variant={i.status === 'critical' ? 'danger' : i.status === 'low' ? 'warning' : 'success'}>
        {i.status.toUpperCase()}
      </Badge>
    )},
    { header: 'Location', accessor: 'location' }
  ];

  const mrColumns = [
    { header: 'MR ID', accessor: 'id' },
    { header: 'Item', accessor: 'item' },
    { header: 'Qty', accessor: 'qty' },
    { header: 'Dept', accessor: 'from' },
    { header: 'Status', accessor: (m: any) => (
      <Badge variant={m.status === 'issued' ? 'success' : 'warning'}>{m.status.toUpperCase()}</Badge>
    )},
    { header: 'Actions', accessor: (m: any) => (
      <div className="table-actions">
        {m.status === 'pending' && (
          <button 
            className="action-btn-sm text-blue" 
            onClick={() => {
              issueMR(m.id);
              addToast(`Materials issued for ${m.id}`, 'success');
            }}
          >
            Issue
          </button>
        )}
      </div>
    )}
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Warehouse Dashboard</h1>
          <p className="page-subtitle">Inventory levels, material issues, and logistics tracking</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => openModal('stock_count')}>
            <Package size={18} />
            <span>Stock Count</span>
          </button>
          <button className="btn btn-primary" onClick={() => openModal('mr_create')}>
            <Plus size={18} />
            <span>New MR</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total SKUs" 
          value={stats.totalSKUs} 
          icon={<Warehouse />} 
          accentColor="var(--blue)" 
        />
        <StatCard 
          label="Critical Stock" 
          value={stats.criticalItems} 
          icon={<ArrowDownRight />} 
          accentColor="var(--red)" 
        />
        <StatCard 
          label="Pending MRs" 
          value={stats.pendingMR} 
          icon={<ArrowUpRight />} 
          accentColor="var(--amber)" 
        />
        <StatCard 
          label="Inventory Value" 
          value={stats.inventoryValue} 
          icon={<Package />} 
          accentColor="var(--green)" 
        />
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Current Inventory</h2>
          <div className="search-box-sm">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Table data={filteredInventory} columns={invColumns} />
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Pending Material Requests</h2>
        </div>
        <Table data={materialRequests.filter(m => m.status === 'pending')} columns={mrColumns} />
      </div>
    </div>
  );
};

export default StorePage;
