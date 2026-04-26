import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import DraggableGrid from '../components/ui/DraggableGrid';

import { Workflow as WorkflowIcon, Clock, CheckCircle2, GitBranch } from 'lucide-react';

const LAYOUTS = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2 },
    { i: 'kanban', x: 0, y: 2, w: 12, h: 6, minW: 8, minH: 5 },
  ],
};

// Simulated workflow tasks
const WORKFLOW_TASKS = [
  { id: 'WF-001', title: 'PR-0815 Approval Chain', status: 'in-progress', assignee: 'Ahmed M.', priority: 'high', step: '2/4', dept: 'Purchase' },
  { id: 'WF-002', title: 'IR-2048 Schedule Confirmation', status: 'pending', assignee: 'Priya N.', priority: 'medium', step: '1/3', dept: 'QAQC' },
  { id: 'WF-003', title: 'NCR-042 Corrective Action', status: 'in-progress', assignee: 'Omar S.', priority: 'high', step: '3/5', dept: 'Production' },
  { id: 'WF-004', title: 'PO-4412 Payment Release', status: 'completed', assignee: 'Khalid I.', priority: 'low', step: '4/4', dept: 'Finance' },
  { id: 'WF-005', title: 'TND-2504 Bid Submission', status: 'pending', assignee: 'Sara H.', priority: 'high', step: '1/5', dept: 'Marketing' },
  { id: 'WF-006', title: 'MR-0528 Store Issue', status: 'in-progress', assignee: 'Rajan P.', priority: 'medium', step: '2/3', dept: 'Store' },
  { id: 'WF-007', title: 'Project P3 Handover Checklist', status: 'completed', assignee: 'Ahmed M.', priority: 'medium', step: '5/5', dept: 'Management' },
  { id: 'WF-008', title: 'Vendor PQS Renewal — ABB Gulf', status: 'pending', assignee: 'Khalid I.', priority: 'low', step: '1/2', dept: 'Purchase' },
];

const WorkflowPage: React.FC = () => {
  const pending = WORKFLOW_TASKS.filter(t => t.status === 'pending');
  const inProgress = WORKFLOW_TASKS.filter(t => t.status === 'in-progress');
  const completed = WORKFLOW_TASKS.filter(t => t.status === 'completed');

  const renderTask = (task: typeof WORKFLOW_TASKS[0]) => (
    <div key={task.id} className="bg-[var(--bg3)] p-4 rounded-2xl border border-[var(--border)] hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">{task.id}</span>
        <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
          {task.priority}
        </Badge>
      </div>
      <div className="text-sm font-semibold text-[var(--text)] mb-2">{task.title}</div>
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{task.assignee}</span>
        <span className="font-medium">Step {task.step}</span>
      </div>
      <div className="mt-2">
        <ProgressBar 
          progress={parseInt(task.step.split('/')[0]) / parseInt(task.step.split('/')[1]) * 100} 
          color={task.status === 'completed' ? 'var(--green)' : 'var(--accent)'} 
          size="sm" 
        />
      </div>
    </div>
  );

  return (
    <DraggableGrid layouts={LAYOUTS}>
      {/* Stats */}
      <div key="stats">
        <div className="grid grid-cols-4 gap-5 h-full">
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Active Workflows</p>
            <h3 className="text-3xl font-display font-semibold">{WORKFLOW_TASKS.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--blue)]"><GitBranch className="w-3 h-3" /> Running</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">Pending</p>
            <h3 className="text-3xl font-display font-semibold">{pending.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--amber)]"><Clock className="w-3 h-3" /> Awaiting</div>
          </div>
          <div className="bg-white rounded-[2rem] border border-[var(--border)] p-6 flex flex-col justify-between drag-handle cursor-move hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow">
            <p className="text-xs text-[var(--text-muted)] font-medium">In Progress</p>
            <h3 className="text-3xl font-display font-semibold">{inProgress.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--green)]"><WorkflowIcon className="w-3 h-3" /> Active</div>
          </div>
          <div className="bg-[var(--accent)] rounded-[2rem] p-6 flex flex-col justify-between drag-handle cursor-move shadow-[0_10px_30px_-10px_rgba(212,255,0,0.4)]">
            <p className="text-xs text-black/60 font-semibold">Completed</p>
            <h3 className="text-3xl font-display font-bold text-black">{completed.length}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-black/60"><CheckCircle2 className="w-3 h-3" /> Done</div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div key="kanban">
        <Card className="h-full drag-handle cursor-move">
          <h2 className="text-sm font-semibold mb-5">Process Pipeline</h2>
          <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
            {/* Pending Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--amber)]" />
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Pending ({pending.length})</span>
              </div>
              <div className="space-y-3">
                {pending.map(renderTask)}
              </div>
            </div>
            {/* In Progress Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--blue)]" />
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">In Progress ({inProgress.length})</span>
              </div>
              <div className="space-y-3">
                {inProgress.map(renderTask)}
              </div>
            </div>
            {/* Completed Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--green)]" />
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Completed ({completed.length})</span>
              </div>
              <div className="space-y-3">
                {completed.map(renderTask)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DraggableGrid>
  );
};

export default WorkflowPage;
