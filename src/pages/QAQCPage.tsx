import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { ClipboardCheck, ShieldAlert, FileText, CheckCircle2, Plus, Search, MoreHorizontal } from 'lucide-react';
import { formatStatus } from '../utils/formatters';

const QAQCPage: React.FC = () => {
  const { inspectionRequests, ncrs, reports, openModal } = useNexusStore();
  const [search, setSearch] = useState('');

  const stats = {
    totalIR: inspectionRequests.length,
    pendingIR: inspectionRequests.filter(i => i.status === 'pending' || i.status === 'scheduled').length,
    openNCR: ncrs.filter(n => n.status === 'open').length,
    reportsTotal: reports.length
  };

  const filteredIR = inspectionRequests.filter(ir => 
    ir.activity.toLowerCase().includes(search.toLowerCase()) || ir.id.toLowerCase().includes(search.toLowerCase())
  );

  const irColumns = [
    { header: 'Ref ID', render: (ir: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '13px' }}>{ir.id}</span> },
    { header: 'Inspection Item', accessor: 'activity', width: '30%' },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', render: (ir: any) => (
      <Badge variant={
        ir.status === 'approved' ? 'success' : 
        ir.status === 'rejected' ? 'danger' : 
        ir.status === 'scheduled' ? 'info' : 'warning'
      }>
        {formatStatus(ir.status).toUpperCase()}
      </Badge>
    )},
    { header: 'Actions', render: (ir: any) => (
      <button className="theme-toggle" style={{ width: '32px', height: '32px' }} onClick={() => openModal('ir_details', ir)}>
        <MoreHorizontal size={14} />
      </button>
    )}
  ];

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Badge variant="danger" style={{ marginBottom: '8px' }}>Quality & Compliance</Badge>
          <h1 style={{ margin: 0 }}>Inspection Control</h1>
          <p className="card-sub">Tracking non-conformances and scheduled site inspections</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ background: 'var(--error)' }} onClick={() => openModal('ncr_create')}>
            <ShieldAlert size={18} style={{ marginRight: '8px' }} /> Raise NCR
          </button>
          <button className="btn-primary" onClick={() => openModal('ir_create')}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Request Inspection
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Inspections" value={stats.totalIR} icon={<ClipboardCheck size={18} />} accentColor="#3b82f6" />
        <StatCard label="Scheduled / Pending" value={stats.pendingIR} trend={{ value: 'Active', type: 'up' }} icon={<FileText size={18} />} accentColor="#f59e0b" />
        <StatCard label="Open NCRs" value={stats.openNCR} trend={{ value: 'Critical', type: 'down' }} icon={<ShieldAlert size={18} />} accentColor="#ef4444" />
        <StatCard label="Closed Reports" value={stats.reportsTotal} icon={<CheckCircle2 size={18} />} accentColor="#10b981" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Live Inspection Stream</h4>
              <p className="card-sub">Review and process inspection requests</p>
            </div>
            <div className="topbar-search" style={{ width: '200px', backgroundColor: 'var(--bg-base)' }}>
              <Search size={14} color="var(--text-tertiary)" />
              <input type="text" placeholder="Search IR..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <Table data={filteredIR} columns={irColumns} onRowClick={(ir) => openModal('ir_details', ir)} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Open NCR Registry</h4>
              <p className="card-sub">Critical non-conformance items requiring rectification</p>
            </div>
          </div>
          <Table 
            data={ncrs.filter(n => n.status === 'open')}
            columns={[
              { header: 'NCR ID', render: (n: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: 'var(--error)' }}>{n.id}</span> },
              { header: 'Description', accessor: 'activity' },
              { header: 'Severity', render: (n: any) => (
                <Badge variant={n.severity === 'major' ? 'danger' : 'warning'}>{n.severity.toUpperCase()}</Badge>
              )}
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default QAQCPage;
