import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import MarketingProjectDetail from '../components/marketing/MarketingProjectDetail';
import MarketingStats from '../components/marketing/MarketingStats';
import BidPerformanceCard from '../components/marketing/BidPerformanceCard';
import TopClientsCard from '../components/marketing/TopClientsCard';
import { ClientHealthMatrix } from '../components/marketing/ClientHealthMatrix';
import { Plus, ExternalLink } from 'lucide-react';
import type { Tender } from '../types/erp';

const STATUS_BADGE: Record<string, 'ghost' | 'info' | 'success' | 'danger'> = {
  drafting: 'ghost',
  submitted: 'info',
  won: 'success',
  lost: 'danger',
};

const MarketingPage: React.FC = () => {
  const { tenders, projects, addToast, addNotification } = useNexusStore();
  const [filter, setFilter] = useState<string>('all');
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);

  // Resolve the tender's project for the detail view (fall back to first project)
  const selectedProject = selectedTenderId
    ? projects[0] // All tenders are linked to marketing projects; default to p1 for the demo
    : null;

  const active = tenders.filter(t => t.status === 'drafting' || t.status === 'submitted');
  const won    = tenders.filter(t => t.status === 'won');
  const pipeline = active.reduce((s, t) => s + t.value, 0);
  const wonValue = won.reduce((s, t) => s + t.value, 0);
  const closingSoon = active.filter(t => {
    const days = (new Date(t.deadline).getTime() - Date.now()) / 86400000;
    return days <= 14;
  }).length;

  const filtered = filter === 'all' ? tenders : tenders.filter(t => t.status === filter);

  const columns = [
    {
      header: 'Ref',
      accessor: (t: Tender) => (
        <span className="mono-ref">
          {t.ref}
        </span>
      ),
    },
    { header: 'Client', accessor: 'client' as keyof Tender },
    { header: 'Description', accessor: 'title' as keyof Tender },
    {
      header: 'Value (AED)',
      accessor: (t: Tender) => (
        <span className="mono-value">
          {t.value.toLocaleString()}
        </span>
      ),
    },
    { header: 'Deadline', accessor: 'deadline' as keyof Tender },
    {
      header: 'Win prob.',
      accessor: (t: Tender) => (
        <div className="table-progress-cell">
          <div className="table-progress-bg" style={{ width: '100%', height: '5px', background: 'var(--bg4)', borderRadius: '2px', overflow: 'hidden' }}>
             <div style={{ width: `${t.probability}%`, height: '100%', background: 'var(--blue)' }} />
          </div>
          <span className="progress-pct">
            {t.probability}%
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (t: Tender) => (
        <Badge variant={STATUS_BADGE[t.status] ?? 'ghost'}>
          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (t: Tender) => (
        <div className="table-actions">
          <button
            className="action-btn-sm"
            onClick={() => setSelectedTenderId(t.id)}
          >
            <ExternalLink size={12} /> View
          </button>
        </div>
      ),
    },
  ];

  const topClients = [
    { name: 'ADNOC Offshore',  projects: 3, value: 34100000, badge: 'success' as const },
    { name: 'TAQA Arabia',     projects: 1, value: 9200000,  badge: 'info'    as const },
    { name: 'KIZAD Authority', projects: 2, value: 9100000,  badge: 'info'    as const },
    { name: 'Mubadala Energy', projects: 1, value: 6800000,  badge: 'ghost'   as const },
  ];

  return (
    <div className="page-fade-in">

      {/* ── Project Detail View ── */}
      {selectedProject && selectedTenderId && (
        <MarketingProjectDetail
          project={selectedProject}
          onBack={() => setSelectedTenderId(null)}
          onSaveFeedback={(_fb, rating) => {
            addNotification({ type: 'success', title: 'Feedback Saved', text: `Client feedback (${rating}★) recorded for ${selectedProject.client}` });
            addToast('Client feedback saved successfully', 'success');
          }}
        />
      )}

      {/* ── Dashboard (hidden when detail is open) ── */}
      {!selectedTenderId && (<>
      <div className="page-header">
        <div>
          <h1 className="page-title">Marketing & Tendering</h1>
          <p className="page-subtitle">Bid pipeline, win tracking, and client relationship management</p>
        </div>
        <button className="btn btn-primary" onClick={() => addToast('Tender creation coming soon', 'info')}>
          <Plus size={14} /> New Tender
        </button>
      </div>

      {/* Stats */}
      <MarketingStats
        activeCount={active.length}
        pipelineValue={pipeline}
        closingSoonCount={closingSoon}
      />

      {/* Tender table */}
      <div className="card gap-b">
        <div className="card-header">
          <div>
            <div className="card-title">Tender Pipeline</div>
            <div className="card-sub">Track bid status and submission deadlines</div>
          </div>
          <div className="card-actions">
            <select
              className="form-select-sm"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="drafting">Drafting</option>
              <option value="submitted">Submitted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
        <Table data={filtered} columns={columns} keyExtractor={t => t.id} />
      </div>

      {/* Client Health Matrix */}
      <div className="gap-b">
        <ClientHealthMatrix />
      </div>

      {/* Bid performance + Top clients */}
      <div className="grid-2">
        <BidPerformanceCard wonValue={wonValue} />
        <TopClientsCard clients={topClients} />
      </div>
      </>)}
    </div>
  );
};

export default MarketingPage;
