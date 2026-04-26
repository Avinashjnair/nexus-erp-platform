import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { Settings, TrendingUp, AlertTriangle, Package, Plus } from 'lucide-react';
import type { ProductionActivity } from '../types/erp';

const STATUS_COLOR: Record<string, string> = {
  ahead:       'var(--green)',
  'on-track':  'var(--blue)',
  'in-progress':'var(--blue)',
  behind:      'var(--red)',
};

const STATUS_BADGE: Record<string, 'success' | 'info' | 'danger' | 'warning'> = {
  ahead:        'success',
  'on-track':   'info',
  'in-progress':'info',
  behind:       'danger',
};

const ProductionPage: React.FC = () => {
  const { activities, updateActivityProgress, openModal, addToast } = useNexusStore();

  const running = activities.filter(a => a.status !== 'done').length;
  const avgActual = Math.round(activities.reduce((s, a) => s + a.actual, 0) / activities.length);
  const avgPlanned = Math.round(activities.reduce((s, a) => s + a.planned, 0) / activities.length);
  const behind = activities.filter(a => a.actual < a.planned - 5).length;

  const columns = [
    {
      header: 'ID',
      accessor: (a: ProductionActivity) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{a.id}</span>
      ),
    },
    {
      header: 'Activity',
      accessor: (a: ProductionActivity) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '12px' }}>{a.name}</div>
          <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{a.phase} · {a.crew}</div>
        </div>
      ),
    },
    {
      header: 'Progress vs plan',
      accessor: (a: ProductionActivity) => (
        <div style={{ minWidth: '140px' }}>
          <ProgressBar
            progress={(a.actual / Math.max(a.planned, 1)) * 100}
            height="5px"
            color={STATUS_COLOR[a.status] ?? 'var(--blue)'}
            className="table-progress"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text3)' }}>Actual: {a.actual}%</span>
            <span style={{ fontSize: '10px', color: 'var(--text3)' }}>Plan: {a.planned}%</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Variance',
      accessor: (a: ProductionActivity) => {
        const v = a.actual - a.planned;
        return (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: v > 0 ? 'var(--green)' : v < 0 ? 'var(--red)' : 'var(--text3)',
              fontWeight: 600,
            }}
          >
            {v > 0 ? '+' : ''}{v}%
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: (a: ProductionActivity) => (
        <Badge variant={STATUS_BADGE[a.status] ?? 'ghost'}>
          {a.status.replace('-', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Updated',
      accessor: (a: ProductionActivity) => (
        <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{a.lastUpdated}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (a: ProductionActivity) => (
        <div className="table-actions">
          <button
            className="action-btn-sm"
            onClick={() => {
              const next = Math.min(100, a.actual + 5);
              updateActivityProgress(a.id, next);
              addToast(`${a.id} updated to ${next}%`, 'success');
            }}
          >
            +5%
          </button>
          <button
            className="action-btn-sm"
            onClick={() => openModal('UPDATE_ACTIVITY_MODAL', a)}
          >
            Update
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Production dashboard</h1>
          <p className="page-subtitle">Fabrication monitoring, progress tracking, and site management</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => openModal('PR_MODAL')}>
            <Package size={14} /> Raise PR
          </button>
          <button className="btn btn-primary" onClick={() => addToast('Activity creation coming soon', 'info')}>
            <Plus size={14} /> New activity
          </button>
        </div>
      </div>

      <div className="stats-grid gap-b">
        <StatCard
          label="Activities running"
          value={running}
          delta="Across 2 shifts"
          deltaType="neutral"
          icon={<Settings size={18} />}
          accentColor="var(--orange)"
        />
        <StatCard
          label="Avg. progress"
          value={`${avgActual}%`}
          delta={`${avgActual >= avgPlanned ? 'Above' : 'Below'} plan (${avgPlanned}%)`}
          deltaType={avgActual >= avgPlanned ? 'up' : 'down'}
          icon={<TrendingUp size={18} />}
          accentColor="var(--green)"
        />
        <StatCard
          label="Behind schedule"
          value={behind}
          delta="Activities need attention"
          deltaType={behind > 0 ? 'down' : 'neutral'}
          icon={<AlertTriangle size={18} />}
          accentColor="var(--red)"
        />
        <StatCard
          label="Materials consumed"
          value="18.4T"
          delta="Steel this week"
          deltaType="neutral"
          icon={<Package size={18} />}
          accentColor="var(--amber)"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Production status</div>
            <div className="card-sub">Click +5% to log quick progress updates</div>
          </div>
        </div>
        <Table data={activities} columns={columns} keyExtractor={a => a.id} />
      </div>
    </div>
  );
};

export default ProductionPage;
