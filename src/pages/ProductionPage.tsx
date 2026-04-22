import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { Factory, Construction, Users, Activity, Plus } from 'lucide-react';

const ProductionPage: React.FC = () => {
  const { activities, updateActivityProgress, currentRole, openModal, addToast } = useNexusStore();

  const stats = {
    activeJobs: activities.length,
    onTrack: activities.filter(a => a.status === 'on-track' || a.status === 'ahead').length,
    behind: activities.filter(a => a.status === 'behind').length,
    overallCompletion: 64 // Placeholder
  };

  const activityColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Activity Name', accessor: (a: any) => (
      <div className="flex-col">
        <div className="font-bold">{a.name}</div>
        <div className="text-xs text-text3">{a.phase}</div>
      </div>
    )},
    { header: 'Crew', accessor: 'crew' },
    { header: 'Progress', accessor: (a: any) => (
      <div style={{ width: '120px' }}>
        <ProgressBar progress={(a.actual / a.planned) * 100} height={6} showLabel={false} color="var(--blue)" />
        <div className="flex-between mt-1">
          <span className="text-xs text-text3">{a.actual}%</span>
          <span className="text-xs text-text3">Plan: {a.planned}%</span>
        </div>
      </div>
    )},
    { header: 'Status', accessor: (a: any) => (
      <Badge variant={
        a.status === 'ahead' ? 'success' : 
        a.status === 'behind' ? 'danger' : 
        a.status === 'on-track' ? 'info' : 'warning'
      }>
        {a.status.toUpperCase()}
      </Badge>
    )},
    { header: 'Last Update', accessor: 'lastUpdated' },
    { header: 'Actions', accessor: (a: any) => (
      <div className="table-actions">
        <button 
          className="action-btn-sm" 
          onClick={() => {
            const next = Math.min(100, a.actual + 5);
            updateActivityProgress(a.id, next);
            addToast(`Updated ${a.id} progress to ${next}%`, 'info');
          }}
        >
          +5%
        </button>
        <button className="action-btn-sm" onClick={() => openModal('activity_details', a)}>Details</button>
      </div>
    )}
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Production Dashboard</h1>
          <p className="page-subtitle">Fabrication monitoring, progress tracking, and site management</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('activity_create')}>
          <Plus size={18} />
          <span>New Activity</span>
        </button>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Active Activities" 
          value={stats.activeJobs} 
          icon={<Activity />} 
          accentColor="var(--blue)" 
        />
        <StatCard 
          label="On-Track / Ahead" 
          value={stats.onTrack} 
          icon={<Construction />} 
          accentColor="var(--green)" 
        />
        <StatCard 
          label="Behind Schedule" 
          value={stats.behind} 
          icon={<Factory />} 
          accentColor="var(--red)" 
        />
        <StatCard 
          label="Crews Assigned" 
          value={4} 
          icon={<Users />} 
          accentColor="var(--amber)" 
        />
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Project Execution Timeline</h2>
        </div>
        <Table data={activities} columns={activityColumns} />
      </div>
    </div>
  );
};

export default ProductionPage;
