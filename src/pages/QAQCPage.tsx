import React from 'react';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import { useNexusStore } from '../store/useNexusStore';
import { ClipboardCheck, FileCheck, AlertOctagon, Plus, Download } from 'lucide-react';

const QAQCPage: React.FC = () => {
  const { inspectionRequests, ncrs, reports, openModal, addToast } = useNexusStore();

  const scheduled = inspectionRequests.filter(i => i.status === 'scheduled').length;
  const pending = inspectionRequests.filter(i => i.status === 'pending').length;
  const openNCRs = ncrs.filter(n => n.status === 'open').length;

  const irColumns = [
    { header: 'ID', accessor: (i: any) => <span className="font-mono">{i.id}</span> },
    { header: 'Activity', accessor: 'activity' },
    { header: 'Type', accessor: 'type' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Status',
      render: (item: any) => (
        <Badge variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : item.status === 'scheduled' ? 'info' : 'warning'}>
          {item.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  const reportColumns = [
    { header: 'ID', accessor: (r: any) => <span className="font-mono">{r.id}</span> },
    { header: 'Title', accessor: 'title' },
    {
      header: 'Result',
      render: (item: any) => (
        <Badge variant={item.result === 'Pass' ? 'success' : 'danger'}>{item.result}</Badge>
      ),
    },
    {
      header: 'File',
      render: (r: any) => (
        <button className="action-btn-sm" onClick={() => addToast(`Downloading ${r.file}`, 'info')}>
          <Download size={12} /> {r.size || 'PDF'}
        </button>
      ),
    },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quality & Compliance</h1>
          <p className="page-subtitle">Inspection management, non-conformance tracking, and QC reporting</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => openModal('IR_MODAL')}>
            <Plus size={14} /> New Inspection
          </button>
        </div>
      </div>

      <div className="stat-grid gap-b">
        <StatCard
          label="Scheduled IRs"
          value={scheduled}
          sub="Upcoming inspections"
          icon={<ClipboardCheck size={18} />}
          accentColor="var(--blue)"
        />
        <StatCard
          label="Pending Review"
          value={pending}
          sub="Awaiting QC Lead"
          icon={<FileCheck size={18} />}
          accentColor="var(--amber)"
        />
        <StatCard
          label="Open NCRs"
          value={openNCRs}
          sub="Action required"
          icon={<AlertOctagon size={18} />}
          accentColor="var(--red)"
        />
        <StatCard
          label="Total Reports"
          value={reports.length}
          sub="YTD Records"
          icon={<FileCheck size={18} />}
          accentColor="var(--neon)"
        />
      </div>

      <div className="grid-3-2 gap-b">
        {/* Inspection Requests */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Inspection requests</div>
              <div className="card-sub">Current schedule and approval pipeline</div>
            </div>
          </div>
          <Table data={inspectionRequests} columns={irColumns} />
        </div>

        {/* NCRs */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Active NCRs</div>
              <div className="card-sub">Non-conformance items needing closure</div>
            </div>
          </div>
          <div className="flex-col" style={{ gap: '10px' }}>
            {ncrs.map(n => (
              <div key={n.id} className="vendor-card" style={{ borderLeft: n.status === 'open' ? '3px solid var(--red)' : '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <span className="font-mono text-xs">{n.id}</span>
                    <Badge variant={n.status === 'open' ? 'danger' : 'success'}>{n.status}</Badge>
                  </div>
                  <div className="vendor-name" style={{ marginTop: 4 }}>{n.activity}</div>
                  <div className="vendor-cat">{n.severity} · Raised {n.raised}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Inspection reports</div>
            <div className="card-sub">Finalized quality documentation</div>
          </div>
        </div>
        <Table data={reports} columns={reportColumns} />
      </div>
    </div>
  );
};

export default QAQCPage;
