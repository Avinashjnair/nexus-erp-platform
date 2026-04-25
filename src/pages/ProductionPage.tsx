import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { Factory, Construction, Users, Activity, Plus, MoreHorizontal } from 'lucide-react';

const ProductionPage: React.FC = () => {
  const { activities, updateActivityProgress, openModal, addToast } = useNexusStore();

  const stats = {
    activeJobs: activities.length,
    onTrack: activities.filter(a => a.status === 'on-track' || a.status === 'ahead').length,
    behind: activities.filter(a => a.status === 'behind').length,
  };

  const activityColumns = [
    { header: 'Ref', render: (a: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '13px' }}>{a.id}</span> },
    { header: 'Activity / Phase', render: (a: any) => (
      <div>
        <div style={{ fontWeight: 700, fontSize: '14px' }}>{a.name}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{a.phase}</div>
      </div>
    ), width: '30%' },
    { header: 'Execution', render: (a: any) => (
      <div style={{ width: '140px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>
          <span style={{ color: 'var(--primary)' }}>{a.actual}%</span>
          <span style={{ color: 'var(--text-tertiary)' }}>Plan: {a.planned}%</span>
        </div>
        <ProgressBar progress={a.actual} color={a.status === 'behind' ? 'var(--error)' : 'var(--primary)'} />
      </div>
    )},
    { header: 'Health', render: (a: any) => (
      <Badge variant={
        a.status === 'ahead' ? 'success' : 
        a.status === 'behind' ? 'danger' : 
        a.status === 'on-track' ? 'info' : 'warning'
      }>
        {a.status.toUpperCase()}
      </Badge>
    )},
    { header: 'Actions', render: (a: any) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="theme-toggle" 
          style={{ width: '32px', height: '32px', color: 'var(--primary)' }}
          onClick={(e) => {
            e.stopPropagation();
            const next = Math.min(100, a.actual + 5);
            updateActivityProgress(a.id, next);
            addToast(`Updated ${a.id} progress to ${next}%`, 'info');
          }}
        >
          +5%
        </button>
        <button className="theme-toggle" style={{ width: '32px', height: '32px' }} onClick={() => openModal('activity_details', a)}>
          <MoreHorizontal size={14} />
        </button>
      </div>
    )}
  ];

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Badge variant="primary" style={{ marginBottom: '8px' }}>Execution & Fabrication</Badge>
          <h1 style={{ margin: 0 }}>Production Tracking</h1>
          <p className="card-sub">Real-time monitoring of fabrication spools and site installation</p>
        </div>
        <button className="btn-primary" onClick={() => openModal('activity_create')}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Log New Activity
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Active Workfronts" value={stats.activeJobs} icon={<Activity size={18} />} accentColor="#3b82f6" />
        <StatCard label="On-Track Units" value={stats.onTrack} trend={{ value: 'Stable', type: 'up' }} icon={<Construction size={18} />} accentColor="#10b981" />
        <StatCard label="Critical Delays" value={stats.behind} trend={{ value: 'Review', type: 'down' }} icon={<Factory size={18} />} accentColor="#ef4444" />
        <StatCard label="Crews Deployed" value={4} subValue="2 night shift" icon={<Users size={18} />} accentColor="#f59e0b" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Project Execution Log</h4>
              <p className="card-sub">Detailed progress of active fabrication items</p>
            </div>
          </div>
          <Table data={activities} columns={activityColumns} onRowClick={(a) => openModal('activity_details', a)} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Production Activity</h4>
              <p className="card-sub">Latest updates from the shop floor</p>
            </div>
          </div>
          <div className="timeline">
            {useNexusStore.getState().activityLog
              .filter(a => a.dept === 'Production')
              .slice(0, 6)
              .map((a, i) => (
                <div key={i} className="tl-item">
                  <div style={{ position: 'relative' }}>
                    <div className="tl-dot" style={{ backgroundColor: a.type === 'success' ? 'var(--success)' : a.type === 'warning' ? 'var(--warning)' : 'var(--primary)' }}></div>
                    {i < 5 && <div className="tl-line"></div>}
                  </div>
                  <div>
                    <div className="tl-label">{a.title}</div>
                    <div className="tl-text">{a.text}</div>
                    <div className="tl-time">{a.time}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;
