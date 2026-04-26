import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import Badge from '../components/ui/Badge';
import { Plus, ArrowRight } from 'lucide-react';

interface KanbanCard {
  title: string;
  dept: string;
  due: string;
  priority: 'high' | 'normal';
}

type KanbanCol = 'todo' | 'inprogress' | 'review' | 'done';

const DEPT_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'ghost'> = {
  QAQC:       'success',
  Purchase:   'warning',
  Production: 'danger',
  Store:      'info',
  Mgmt:       'info',
  Marketing:  'info',
};

const INITIAL_BOARD: Record<KanbanCol, KanbanCard[]> = {
  todo: [
    { title: 'Prepare ITP for Structural Welding', dept: 'QAQC',     due: 'May 25', priority: 'high'   },
    { title: 'Source alternates for SS pipes',      dept: 'Purchase', due: 'Jun 2',  priority: 'normal' },
    { title: 'Weekly report — Ruwais project',      dept: 'Mgmt',     due: 'May 22', priority: 'normal' },
    { title: 'Update Bill of Materials Rev C',       dept: 'Store',    due: 'Jun 1',  priority: 'normal' },
  ],
  inprogress: [
    { title: 'Blasting & Painting Zone B',         dept: 'Production', due: '70% done',  priority: 'high'   },
    { title: 'Weld inspection nodes 44–52',        dept: 'QAQC',       due: '50% done',  priority: 'high'   },
    { title: 'Vendor evaluation — 3 vendors',      dept: 'Purchase',   due: '40% done',  priority: 'normal' },
    { title: 'Material reconciliation Q1',          dept: 'Store',      due: '90% done',  priority: 'normal' },
  ],
  review: [
    { title: 'Hydrotest report — Manifold',        dept: 'QAQC',    due: 'Awaiting PM',     priority: 'high'   },
    { title: 'PR-0811 approval — Carbon Steel',    dept: 'Purchase',due: 'Awaiting CFO',    priority: 'high'   },
    { title: 'Marketing proposal — new tender',     dept: 'Marketing',due: 'Client review', priority: 'normal' },
  ],
  done: [
    { title: 'Dimensional check — Deck Frame',     dept: 'QAQC',    due: 'May 14',  priority: 'normal' },
    { title: 'PO issued to Gulf Steel',             dept: 'Purchase',due: 'May 12',  priority: 'normal' },
    { title: 'Steel receipt — 48T confirmed',       dept: 'Store',   due: 'May 10',  priority: 'normal' },
    { title: 'Client FAT — Module 1',               dept: 'QAQC',    due: 'May 8',   priority: 'normal' },
  ],
};

const COL_META: Record<KanbanCol, { label: string; accent: string }> = {
  todo:       { label: 'To do',         accent: 'rgba(255,255,255,0.06)' },
  inprogress: { label: 'In progress',   accent: 'rgba(79,124,255,0.12)'  },
  review:     { label: 'Under review',  accent: 'rgba(245,158,11,0.12)'  },
  done:       { label: 'Done',          accent: 'rgba(16,185,129,0.12)'  },
};

const PROCESS_STEPS = [
  { icon: '📋', label: 'Project initiation', color: 'var(--accent)', panel: 'initiate' },
  { icon: '🎯', label: 'Scope & planning',   color: 'var(--teal)',   panel: 'initiate' },
  { icon: '🛒', label: 'Procurement',        color: 'var(--amber)',  panel: 'purchase' },
  { icon: '🏭', label: 'Production',         color: 'var(--orange)', panel: 'production' },
  { icon: '🔬', label: 'Inspection & QC',    color: 'var(--green)',  panel: 'qaqc' },
  { icon: '📦', label: 'Store & delivery',   color: 'var(--purple)', panel: 'store' },
  { icon: '✅', label: 'Handover & close',   color: 'var(--blue)',   panel: 'reports' },
];

const WorkflowPage: React.FC = () => {
  const { setRole, addToast } = useNexusStore();
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [dragging, setDragging] = useState<{ col: KanbanCol; idx: number } | null>(null);

  const handleDragStart = (col: KanbanCol, idx: number) => {
    setDragging({ col, idx });
  };

  const handleDrop = (targetCol: KanbanCol) => {
    if (!dragging || dragging.col === targetCol) { setDragging(null); return; }
    const card = board[dragging.col][dragging.idx];
    setBoard(prev => ({
      ...prev,
      [dragging.col]: prev[dragging.col].filter((_, i) => i !== dragging.idx),
      [targetCol]: [card, ...prev[targetCol]],
    }));
    addToast(`Task moved to "${COL_META[targetCol].label}"`, 'success');
    setDragging(null);
  };

  const cols = Object.keys(COL_META) as KanbanCol[];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workflow & Processes</h1>
          <p className="page-subtitle">Task management, process flow, and cross-department coordination</p>
        </div>
        <button className="btn btn-primary" onClick={() => addToast('Task creation coming soon', 'info')}>
          <Plus size={14} /> Add task
        </button>
      </div>

      {/* Process flow map */}
      <div className="card gap-b">
        <div className="card-header">
          <div>
            <div className="card-title">End-to-end process flow</div>
            <div className="card-sub">Click any stage to navigate to that module</div>
          </div>
        </div>
        <div className="process-flow-wrap">
          <div className="process-flow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {PROCESS_STEPS.map((step, i) => (
              <React.Fragment key={step.label}>
                <div
                  className="pf-step"
                  onClick={() => setRole(step.panel as any)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}
                >
                  <div
                    className="pf-circle"
                    style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${step.color}`, 
                      background: `${step.color}18`, color: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', marginBottom: '8px'
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="pf-label" style={{ color: step.color, fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
                    {step.label}
                  </div>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="pf-connector" style={{ flex: 1, height: '2px', background: step.color, opacity: 0.3, minWidth: '20px', marginBottom: '25px' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="card-title">Task board</div>
          <div className="card-sub">Drag tasks between columns to update status</div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {cols.map(col => (
            <div key={col} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text3)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text2)' }}>{board[col].length}</span>
              {COL_META[col].label}
              {col !== 'done' && <ArrowRight size={10} />}
            </div>
          ))}
        </div>
      </div>

      <div className="kanban-board">
        {cols.map(col => (
          <div
            key={col}
            className="kanban-col"
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(col)}
          >
            <div className="kanban-col-header">
              <span className="kanban-col-title">{COL_META[col].label}</span>
              <span
                className="kanban-col-count"
                style={{ background: COL_META[col].accent, color: 'var(--text2)' }}
              >
                {board[col].length}
              </span>
            </div>

            <div className="kanban-body">
              {board[col].map((card, idx) => (
                <div
                  key={`${col}-${idx}`}
                  className="kanban-card"
                  draggable
                  onDragStart={() => handleDragStart(col, idx)}
                  style={{ opacity: dragging?.col === col && dragging?.idx === idx ? 0.4 : 1 }}
                >
                  {card.priority === 'high' && (
                    <div
                      style={{
                        height: '2px',
                        background: 'var(--red)',
                        borderRadius: '1px',
                        marginBottom: '8px',
                        opacity: 0.7,
                      }}
                    />
                  )}
                  <div className="kanban-card-title">{card.title}</div>
                  <div className="kanban-card-meta">
                    <Badge variant={DEPT_BADGE[card.dept] ?? 'ghost'}>
                      {card.dept}
                    </Badge>
                    <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{card.due}</span>
                  </div>
                </div>
              ))}

              {board[col].length === 0 && (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: 'var(--text3)',
                    fontSize: '11px',
                    border: '1px dashed var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowPage;
