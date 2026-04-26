import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { FileText, ClipboardCheck, ShoppingCart, AlertTriangle, Download } from 'lucide-react';
import type { InspectionReport } from '../types/erp';

const EXPORT_TYPES = [
  { label: 'Weekly progress report',    icon: '📈', color: 'var(--accent)' },
  { label: 'Inspection summary',        icon: '🔬', color: 'var(--green)'  },
  { label: 'NCR register',              icon: '⚠️', color: 'var(--red)'    },
  { label: 'Purchase summary',          icon: '🛒', color: 'var(--amber)'  },
  { label: 'Material reconciliation',   icon: '📦', color: 'var(--purple)' },
  { label: 'Project close-out report',  icon: '✅', color: 'var(--teal)'   },
];

const ReportsPage: React.FC = () => {
  const { reports, purchaseRequests, inspectionRequests, ncrs, addToast } = useNexusStore();

  const columns = [
    {
      header: 'Report ID',
      accessor: (r: InspectionReport) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{r.id}</span>
      ),
    },
    {
      header: 'IR ref',
      accessor: (r: InspectionReport) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--blue)' }}>
          {r.irRef}
        </span>
      ),
    },
    {
      header: 'Title',
      accessor: (r: InspectionReport) => (
        <span style={{ maxWidth: '220px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.title}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: (r: InspectionReport) => (
        <Badge variant="ghost">{r.type}</Badge>
      ),
    },
    { header: 'Date', accessor: 'date' as keyof InspectionReport },
    { header: 'Inspector', accessor: 'inspector' as keyof InspectionReport },
    {
      header: 'Result',
      accessor: (r: InspectionReport) => (
        <Badge variant={r.result.toLowerCase().includes('pass') ? 'success' : 'danger'}>
          {r.result}
        </Badge>
      ),
    },
    {
      header: 'File',
      accessor: (r: InspectionReport) => (
        <div className="table-actions">
          <button
            className="action-btn-sm"
            onClick={() => addToast(`Downloading ${r.file}…`, 'info')}
          >
            <Download size={12} /> {r.size}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Documents</h1>
          <p className="page-subtitle">Inspection register, document management, and report generation</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => addToast('Upload modal coming soon', 'info')}
        >
          + Upload report
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid gap-b">
        <StatCard
          label="Inspection reports"
          value={reports.length}
          delta="All projects"
          deltaType="up"
          icon={<FileText size={18} />}
          accentColor="var(--blue)"
        />
        <StatCard
          label="Purchase requests"
          value={purchaseRequests.length}
          delta={`${purchaseRequests.filter(p => p.status === 'pending').length} pending approval`}
          deltaType="neutral"
          icon={<ShoppingCart size={18} />}
          accentColor="var(--amber)"
        />
        <StatCard
          label="Inspection requests"
          value={inspectionRequests.length}
          delta={`${inspectionRequests.filter(i => i.status === 'approved').length} passed`}
          deltaType="up"
          icon={<ClipboardCheck size={18} />}
          accentColor="var(--green)"
        />
        <StatCard
          label="NCRs total"
          value={ncrs.length}
          delta={`${ncrs.filter(n => n.status === 'open').length} open`}
          deltaType={ncrs.some(n => n.status === 'open') ? 'down' : 'neutral'}
          icon={<AlertTriangle size={18} />}
          accentColor="var(--red)"
        />
      </div>

      {/* Reports table */}
      <div className="card gap-b">
        <div className="card-header">
          <div>
            <div className="card-title">Inspection reports register</div>
            <div className="card-sub">All QC inspection reports across projects</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => addToast('Filter panel coming soon', 'info')}
          >
            Filter
          </button>
        </div>
        <Table data={reports} columns={columns} keyExtractor={r => r.id} />
      </div>

      {/* Export panel */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Generate project reports</div>
            <div className="card-sub">One-click report generation for key operational documents</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {EXPORT_TYPES.map(r => (
            <button
              key={r.label}
              className="btn btn-ghost"
              style={{ borderColor: `${r.color}30`, color: 'var(--text2)' }}
              onClick={() => addToast(`Generating ${r.label}…`, 'info')}
            >
              <span style={{ fontSize: '14px' }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
