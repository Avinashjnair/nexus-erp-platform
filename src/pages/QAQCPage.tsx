import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { ClipboardCheck, ShieldAlert, FileText, CheckCircle2, Plus, Search } from 'lucide-react';
import { formatStatus } from '../utils/formatters';

const QAQCPage: React.FC = () => {
  const { inspectionRequests, ncrs, reports, currentRole, openModal } = useNexusStore();
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
    { header: 'IR Ref', accessor: (ir: any) => <span className="font-mono text-sm">{ir.id}</span> },
    { header: 'Activity / Item', accessor: 'activity' },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: (ir: any) => (
      <Badge variant={
        ir.status === 'approved' ? 'success' : 
        ir.status === 'rejected' ? 'danger' : 
        ir.status === 'scheduled' ? 'info' : 'warning'
      }>
        {formatStatus(ir.status)}
      </Badge>
    )},
    { header: 'Requested Date', accessor: 'date' },
    { header: 'Location', accessor: 'location' },
    { header: 'Actions', accessor: (ir: any) => (
      <div className="table-actions">
        <button className="action-btn-sm" onClick={() => openModal('ir_details', ir)}>Inspect</button>
      </div>
    )}
  ];

  const ncrColumns = [
    { header: 'NCR ID', accessor: (ncr: any) => <span className="font-mono text-sm">{ncr.id}</span> },
    { header: 'Issue Description', accessor: 'activity' },
    { header: 'Severity', accessor: (ncr: any) => (
      <Badge variant={ncr.severity === 'major' ? 'danger' : 'warning'}>{ncr.severity.toUpperCase()}</Badge>
    )},
    { header: 'Status', accessor: (ncr: any) => (
      <Badge variant={ncr.status === 'open' ? 'danger' : 'success'}>{ncr.status.toUpperCase()}</Badge>
    )},
    { header: 'Raised By', accessor: 'raisedBy' }
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">QA / QC Dashboard</h1>
          <p className="page-subtitle">Quality control tracking and non-conformance management</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => openModal('ncr_create')}>
            <ShieldAlert size={18} />
            <span>Raise NCR</span>
          </button>
          <button className="btn btn-primary" onClick={() => openModal('ir_create')}>
            <Plus size={18} />
            <span>New Inspection Request</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total Inspections" 
          value={stats.totalIR} 
          icon={<ClipboardCheck />} 
          accentColor="var(--blue)" 
        />
        <StatCard 
          label="Pending / Scheduled" 
          value={stats.pendingIR} 
          icon={<FileText />} 
          accentColor="var(--amber)" 
        />
        <StatCard 
          label="Open NCRs" 
          value={stats.openNCR} 
          icon={<ShieldAlert />} 
          accentColor="var(--red)" 
        />
        <StatCard 
          label="Inspection Reports" 
          value={stats.reportsTotal} 
          icon={<CheckCircle2 />} 
          accentColor="var(--green)" 
        />
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Pending Inspections</h2>
            <div className="search-box-sm">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search IRs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Table data={filteredIR} columns={irColumns} />
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active NCRs</h2>
          </div>
          <Table data={ncrs.filter(n => n.status === 'open')} columns={ncrColumns} />
        </div>
      </div>
    </div>
  );
};

export default QAQCPage;
