import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { TrendingUp, DollarSign, Clock, Trophy, Plus, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { Tender } from '../types/erp';

const STATUS_BADGE: Record<string, 'ghost' | 'info' | 'success' | 'danger'> = {
  drafting: 'ghost',
  submitted: 'info',
  won: 'success',
  lost: 'danger',
};

const MarketingPage: React.FC = () => {
  const { tenders, vendors, addToast } = useNexusStore();
  const [filter, setFilter] = useState<string>('all');

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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)' }}>
          {t.ref}
        </span>
      ),
    },
    { header: 'Client', accessor: 'client' as keyof Tender },
    { header: 'Description', accessor: 'title' as keyof Tender },
    {
      header: 'Value (AED)',
      accessor: (t: Tender) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          {formatCurrency(t.value)}
        </span>
      ),
    },
    { header: 'Deadline', accessor: 'deadline' as keyof Tender },
    {
      header: 'Win prob.',
      accessor: (t: Tender) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '90px' }}>
          <ProgressBar progress={t.probability} color="var(--blue)" height="5px" className="table-progress" />
          <span style={{ fontSize: '10px', color: 'var(--text3)', minWidth: '28px' }}>
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
            onClick={() => addToast(`Opening tender ${t.ref}`, 'info')}
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
      <div className="stats-grid gap-b">
        <StatCard
          label="Active Tenders"
          value={active.length}
          delta="↑ 2 submitted this month"
          deltaType="up"
          icon={<TrendingUp size={18} />}
          accentColor="var(--blue)"
        />
        <StatCard
          label="Win Rate"
          value="38%"
          delta="↑ 5% vs last quarter"
          deltaType="up"
          icon={<Trophy size={18} />}
          accentColor="var(--green)"
        />
        <StatCard
          label="Pipeline Value"
          value={formatCurrency(pipeline)}
          delta={`${active.length} bids active`}
          deltaType="neutral"
          icon={<DollarSign size={18} />}
          accentColor="var(--accent)"
        />
        <StatCard
          label="Closing Soon"
          value={closingSoon}
          delta="Within 14 days"
          deltaType={closingSoon > 0 ? 'down' : 'neutral'}
          icon={<Clock size={18} />}
          accentColor="var(--red)"
        />
      </div>

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

      {/* Bid performance + Top clients */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Bid performance (YTD)</div>
            </div>
          </div>

          {[
            { label: 'Tenders submitted', value: 8,  max: 10, color: 'var(--blue)'  },
            { label: 'Tenders won',        value: 3,  max: 8,  color: 'var(--green)' },
            { label: 'In final evaluation',value: 2,  max: 8,  color: 'var(--amber)' },
            { label: 'Under review',        value: 2,  max: 8,  color: 'var(--teal)'  },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text2)' }}>{row.label}</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{row.value}</span>
              </div>
              <ProgressBar progress={(row.value / row.max) * 100} color={row.color} height="5px" />
            </div>
          ))}

          <div
            style={{
              background: 'var(--bg3)',
              borderRadius: 'var(--radius)',
              padding: '14px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total won value
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--green)',
                  marginTop: '2px',
                }}
              >
                {formatCurrency(wonValue)}
              </div>
            </div>
            <Trophy size={28} style={{ color: 'var(--green)', opacity: 0.4 }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top clients</div>
              <div className="card-sub">By total contract value</div>
            </div>
          </div>

          {topClients.map(c => (
            <div key={c.name} className="vendor-card" style={{ marginBottom: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--bg4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text3)',
                }}
              >
                {c.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div className="vendor-name">{c.name}</div>
                <div className="vendor-cat">
                  {c.projects} project{c.projects !== 1 ? 's' : ''} · {formatCurrency(c.value)}
                </div>
              </div>
              <Badge variant={c.badge}>Active</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
