import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DraggableGrid from '../components/ui/DraggableGrid';
import { useNexusStore } from '../store/useNexusStore';
import { Factory, Wrench, AlertTriangle, ArrowUpRight } from 'lucide-react';

const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'activities', x: 0, y: 2, w: 8, h: 5, minW: 6, minH: 4 },
    { i: 'phases', x: 8, y: 2, w: 4, h: 5, minW: 3, minH: 4 },
  ],
};

const ProductionPage: React.FC = () => {
  const { activities, projects } = useNexusStore();

  const inProgress = activities.filter(a => a.status === 'in-progress').length;
  const behind = activities.filter(a => a.status === 'behind').length;
  const onTrack = activities.filter(a => a.status === 'on-track').length;

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Stats */}
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Active Crews</p>
            <h3 className="text-3xl font-display font-semibold">{activities.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--green)]"><Factory className="w-3 h-3" /> Operating</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">In Progress</p>
            <h3 className="text-3xl font-display font-semibold">{inProgress}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--blue)]"><Wrench className="w-3 h-3" /> Active now</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Behind Schedule</p>
            <h3 className="text-3xl font-display font-semibold text-[var(--red)]">{behind}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--red)]"><AlertTriangle className="w-3 h-3" /> Attention</div>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">On Track</p>
            <h3 className="text-3xl font-display font-bold text-black">{onTrack}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-black/60"><ArrowUpRight className="w-3 h-3" /> Healthy</div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div key="activities">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-5">Execution Tracker</h2>
          <div className="space-y-5 flex-1 overflow-auto">
            {activities.map(a => (
              <div key={a.id} className="bg-[var(--bg3)] p-5 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{a.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{a.crew} · {a.phase}</div>
                  </div>
                  <Badge variant={a.status === 'on-track' || a.status === 'ahead' ? 'success' : a.status === 'behind' ? 'danger' : 'info'}>
                    {a.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <ProgressBar progress={a.actual} color={a.status === 'behind' ? 'var(--red)' : 'var(--accent)'} />
                  </div>
                  <span className="text-sm font-display font-semibold w-12 text-right">{a.actual}%</span>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)] font-medium">
                  <span>Planned: {a.planned}%</span>
                  <span>{a.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Project Phases */}
      <div key="phases">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-5">Project Milestones</h2>
          <div className="space-y-5 flex-1 overflow-auto">
            {projects.map(p => (
              <div key={p.id} className="bg-[var(--bg3)] p-5 rounded-2xl border border-[var(--border)]">
                <div className="text-sm font-semibold text-[var(--text)] mb-1">{p.title}</div>
                <div className="text-xs text-[var(--text-muted)] mb-3">{p.client}</div>
                <ProgressBar progress={p.progress} showValue color="var(--accent)" />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.phases.map((phase, idx) => (
                    <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      idx < p.currentPhase ? 'bg-[var(--accent)] text-black' : 
                      idx === p.currentPhase ? 'bg-black text-white' : 
                      'bg-[var(--bg4)] text-[var(--text-muted)]'
                    }`}>{phase}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default ProductionPage;
