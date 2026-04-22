import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import { formatCurrency, formatStatus } from '../utils/formatters';

const PurchasePage: React.FC = () => {
  const { purchaseRequests, approvePR, rejectPR, currentRole, openModal, addToast } = useNexusStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Stats calculation
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
    { header: 'PR ID', accessor: (pr: any) => <span className="font-mono text-sm">{pr.id}</span> },
    { header: 'Item Description', accessor: 'item' },
    { header: 'Qty', accessor: (pr: any) => `${pr.qty} ${pr.unit}` },
    { header: 'Priority', accessor: (pr: any) => (
      <Badge variant={pr.priority === 'urgent' ? 'danger' : 'info'}>{pr.priority.toUpperCase()}</Badge>
    )},
    { header: 'Status', accessor: (pr: any) => (
      <Badge variant={
        pr.status === 'approved' || pr.status === 'po-issued' ? 'success' : 
        pr.status === 'rejected' ? 'danger' : 
        pr.status === 'pending' ? 'warning' : 'info'
      }>
        {formatStatus(pr.status)}
      </Badge>
    )},
    { header: 'Date Raised', accessor: 'raised' },
    { header: 'Actions', accessor: (pr: any) => (
      <div className="table-actions">
        {pr.status === 'pending' && (currentRole === 'management' || currentRole === 'purchase') && (
          <>
            <button 
              className="action-btn-sm text-green" 
              onClick={() => {
                approvePR(pr.id);
                addToast(`PR ${pr.id} approved`, 'success');
              }}
              title="Approve"
            >
              <CheckCircle size={14} />
            </button>
            <button 
              className="action-btn-sm text-red" 
              onClick={() => {
                rejectPR(pr.id);
                addToast(`PR ${pr.id} rejected`, 'error');
              }}
              title="Reject"
            >
              <AlertCircle size={14} />
            </button>
          </>
        )}
        <button className="action-btn-sm" onClick={() => openModal('pr_details', pr)}>View</button>
      </div>
    )}
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Dashboard</h1>
          <p className="page-subtitle">Procurement tracking and PR lifecycle management</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('pr_create')}>
          <Plus size={18} />
          <span>New Purchase Request</span>
        </button>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total Requests" 
          value={stats.total} 
          icon={<ShoppingCart />} 
          accentColor="var(--blue)" 
        />
        <StatCard 
          label="Pending Approval" 
          value={stats.pending} 
          icon={<Clock />} 
          accentColor="var(--amber)" 
        />
        <StatCard 
          label="Approved / PO" 
          value={stats.approved} 
          icon={<CheckCircle />} 
          accentColor="var(--green)" 
        />
        <StatCard 
          label="Urgent Pending" 
          value={stats.urgent} 
          icon={<AlertCircle />} 
          accentColor="var(--red)" 
        />
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Purchase Requests</h2>
          <div className="card-actions">
            <div className="search-box-sm">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search PRs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="form-select-sm" 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="po-issued">PO Issued</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <Table data={filteredData} columns={columns} />
      </div>
    </div>
  );
};

export default PurchasePage;
