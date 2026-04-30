// ═══════════════════════════════════
// PurchasePage.tsx — Sprint 4
// ═══════════════════════════════════
import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import {
  ShoppingCart, Clock, CheckCircle, AlertCircle, Plus, Search,
} from 'lucide-react';
import { formatStatus } from '../utils/formatters';
import type { PurchaseRequest } from '../types/erp';

const PurchasePage: React.FC = () => {
  const { purchaseRequests, approvePR, rejectPR, currentRole, openModal, addToast } = useNexusStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const stats = {
    total:    purchaseRequests.length,
    pending:  purchaseRequests.filter(p => p.status === 'pending').length,
    approved: purchaseRequests.filter(p => p.status === 'approved' || p.status === 'po-issued').length,
    urgent:   purchaseRequests.filter(p => p.priority === 'urgent' && p.status === 'pending').length,
  };

  const filtered = purchaseRequests.filter(pr => {
    const matchStatus = filter === 'all' || pr.status === filter;
    const q = search.toLowerCase();
    const matchSearch = pr.item.toLowerCase().includes(q) || pr.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const canApprove = currentRole === 'management' || currentRole === 'purchase';

  const columns = [
    {
      header: 'PR ID',
      accessor: (pr: PurchaseRequest) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{pr.id}</span>
      ),
    },
    { header: 'Item', accessor: 'item' as keyof PurchaseRequest },
    {
      header: 'Qty',
      accessor: (pr: PurchaseRequest) => `${pr.qty} ${pr.unit}`,
    },
    {
      header: 'Priority',
      accessor: (pr: PurchaseRequest) => (
        <Badge variant={pr.priority === 'urgent' ? 'danger' : 'info'}>
          {pr.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: (pr: PurchaseRequest) => (
        <Badge
          variant={
            pr.status === 'approved' || pr.status === 'po-issued' || pr.status === 'delivered'
              ? 'success'
              : pr.status === 'rejected'
              ? 'danger'
              : pr.status === 'pending'
              ? 'warning'
              : 'info'
          }
        >
          {formatStatus(pr.status)}
        </Badge>
      ),
    },
    { header: 'Raised', accessor: 'raised' as keyof PurchaseRequest },
    {
      header: 'Actions',
      accessor: (pr: PurchaseRequest) => (
        <div className="table-actions">
          {pr.status === 'pending' && canApprove && (
            <>
              <button
                className="action-btn-sm text-green"
                onClick={() => { approvePR(pr.id); addToast(`${pr.id} approved`, 'success'); }}
                title="Approve"
              >
                <CheckCircle size={12} />
              </button>
              <button
                className="action-btn-sm text-red"
                onClick={() => { rejectPR(pr.id); addToast(`${pr.id} rejected`, 'error'); }}
                title="Reject"
              >
                <AlertCircle size={12} />
              </button>
            </>
          )}
          <button className="action-btn-sm" onClick={() => openModal('VIEW_PR_MODAL', pr)}>
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase dashboard</h1>
          <p className="page-subtitle">Procurement tracking and PR lifecycle management</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('PR_MODAL')}>
          <Plus size={14} /> New purchase request
        </button>
      </div>

      <div className="stats-grid gap-b">
        <StatCard label="Total requests"    value={stats.total}    icon={<ShoppingCart size={18} />} accentColor="var(--blue)"   />
        <StatCard label="Pending approval"  value={stats.pending}  icon={<Clock size={18} />}        accentColor="var(--amber)"  />
        <StatCard label="Approved / PO"     value={stats.approved} icon={<CheckCircle size={18} />}  accentColor="var(--green)"  />
        <StatCard label="Urgent pending"    value={stats.urgent}   icon={<AlertCircle size={18} />}  accentColor="var(--red)"    />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Purchase requests</div>
          <div className="card-actions">
            <div className="search-box-sm">
              <Search size={12} />
              <input
                type="text"
                placeholder="Search PRs…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select-sm"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="po-issued">PO Issued</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <Table data={filtered} columns={columns} keyExtractor={pr => pr.id} />
      </div>
    </div>
  );
};

export default PurchasePage;
