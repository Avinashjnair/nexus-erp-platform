import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DraggableGrid from '../components/ui/DraggableGrid';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNexusStore } from '../store/useNexusStore';


const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'deptChart', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'activity', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'projects', x: 0, y: 6, w: 12, h: 4, minW: 8, minH: 3 },
  ],
};

const ReportsPage: React.FC = () => {
  const { projects, purchaseRequests, inspectionRequests, activityLog } = useNexusStore();
  const DEPT_DATA = [
    { name: 'Purchase', value: purchaseRequests.length },
    { name: 'QAQC', value: inspectionRequests.length },
    { name: 'Production', value: 6 },
    { name: 'Marketing', value: 6 },
    { name: 'Store', value: 8 },
  ];

  return (
    <DraggableGrid layouts={LAYOUTS}>
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move">
            <p className="text-xs text-[var(--text-muted)] font-medium">Total Documents</p>
            <h3 className="text-3xl font-display font-semibold">{purchaseRequests.length + inspectionRequests.length}</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move">
            <p className="text-xs text-[var(--text-muted)] font-medium">Active Projects</p>
            <h3 className="text-3xl font-display font-semibold">{projects.length}</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move">
            <p className="text-xs text-[var(--text-muted)] font-medium">Departments</p>
            <h3 className="text-3xl font-display font-semibold">{DEPT_DATA.length}</h3>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">Events</p>
            <h3 className="text-3xl font-display font-bold text-black">{activityLog.length}</h3>
          </div>
        </div>
      </div>

      <div key="deptChart">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Divisional Backlog</h2>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_DATA}>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px' }} />
                <Bar dataKey="value" radius={[20, 20, 20, 20]} barSize={28}>
                  {DEPT_DATA.map((_, i) => <Cell key={i} fill={i < 2 ? '#111' : '#ececec'} />)}
                </Bar>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div key="activity">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 flex-1 overflow-auto">
            {activityLog.slice(0, 6).map((a, i) => (
              <div key={i} className="bg-[var(--bg3)] p-4 rounded-2xl border border-[var(--border)] flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'success' ? 'bg-[var(--green)]' : a.type === 'danger' ? 'bg-[var(--red)]' : 'bg-[var(--blue)]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text)]">{a.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{a.text}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">{a.time} · {a.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div key="projects">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-5">Project Performance</h2>
          <div className="grid grid-cols-3 gap-5 flex-1">
            {projects.map(p => (
              <div key={p.id} className="bg-[var(--bg3)] p-6 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">{p.title}</span>
                  <Badge variant={p.status === 'on-track' ? 'success' : 'warning'}>{p.status}</Badge>
                </div>
                <div className="text-xs text-[var(--text-muted)] mb-3">{p.client}</div>
                <ProgressBar progress={p.progress} showValue color="var(--accent)" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default ReportsPage;
