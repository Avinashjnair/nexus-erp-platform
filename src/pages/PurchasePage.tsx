import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { formatStatus } from '../utils/formatters';

const PurchasePage: React.FC = () => {
  const { purchaseRequests, approvePR, rejectPR, currentRole, openModal, addToast } = useNexusStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const stats = {
    total: purchaseRequests.length,
    pending: purchaseRequests.filter(p => p.status === 'pending').length,
    approved: purchaseRequests.filter(p => p.status === 'approved' || p.status === 'po-issued').length,
    urgent: purchaseRequests.filter(p => p.priority === 'urgent' && p.status === 'pending').length
  };

  const filteredData = purchaseRequests.filter(pr => {
    const matchesFilter = filter === 'all' || pr.status === filter;
    const matchesSearch = pr.item.toLowerCase().includes(search.toLowerCase()) || pr.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const columns = [
    { header: 'PR ID', render: (pr: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '13px' }}>{pr.id}</span> },
    { header: 'Requirement', accessor: 'item', width: '25%' },
    { header: 'Quantity', render: (pr: any) => `${pr.qty} ${pr.unit}` },
    { header: 'Priority', render: (pr: any) => (
      <Badge variant={pr.priority === 'urgent' ? 'danger' : 'info'}>{pr.priority.toUpperCase()}</Badge>
    )},
    { header: 'Status', render: (pr: any) => (
      <Badge variant={
        pr.status === 'approved' || pr.status === 'po-issued' ? 'success' : 
        pr.status === 'rejected' ? 'danger' : 
        pr.status === 'pending' ? 'warning' : 'info'
      }>
        {formatStatus(pr.status).toUpperCase()}
      </Badge>
    )},
    { header: 'Actions', render: (pr: any) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        {pr.status === 'pending' && (currentRole === 'management' || currentRole === 'purchase') && (
          <>
            <button 
              className="theme-toggle" 
              style={{ width: '32px', height: '32px', color: 'var(--success)' }}
              onClick={(e) => { e.stopPropagation(); approvePR(pr.id); addToast(`PR ${pr.id} approved`, 'success'); }}
            >
              <CheckCircle size={14} />
            </button>
            <button 
              className="theme-toggle" 
              style={{ width: '32px', height: '32px', color: 'var(--error)' }}
              onClick={(e) => { e.stopPropagation(); rejectPR(pr.id); addToast(`PR ${pr.id} rejected`, 'error'); }}
            >
              <AlertCircle size={14} />
            </button>
          </>
        )}
        <button className="theme-toggle" style={{ width: '32px', height: '32px' }} onClick={() => openModal('pr_details', pr)}>
          <MoreHorizontal size={14} />
        </button>
      </div>
    )}
  ];

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Badge variant="info" style={{ marginBottom: '8px' }}>Procurement & Supply Chain</Badge>
          <h1 style={{ margin: 0 }}>Materials Control</h1>
          <p className="card-sub">Manage purchase requisitions and vendor fulfillment</p>
        </div>
        <button className="btn-primary" onClick={() => openModal('pr_create')}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Create Requisition
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Requests" value={stats.total} icon={<ShoppingCart size={18} />} accentColor="#3b82f6" />
        <StatCard label="Pending Approval" value={stats.pending} trend={{ value: 'Needs Action', type: 'down' }} icon={<Clock size={18} />} accentColor="#f59e0b" />
        <StatCard label="PO Issued" value={stats.approved} icon={<CheckCircle size={18} />} accentColor="#10b981" />
        <StatCard label="Urgent Items" value={stats.urgent} trend={{ value: 'Critical', type: 'down' }} icon={<AlertCircle size={18} />} accentColor="#ef4444" />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h4 className="card-title">Active Requisitions</h4>
            <p className="card-sub">Listing {filteredData.length} entries</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="topbar-search" style={{ width: '240px', backgroundColor: 'var(--bg-base)' }}>
              <Search size={14} color="var(--text-tertiary)" />
              <input type="text" placeholder="Search ID or Item..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select 
              style={{ padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '13px' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <Table data={filteredData} columns={columns} onRowClick={(pr) => openModal('pr_details', pr)} />
      </div>
    </div>
  );
};

export default PurchasePage;
