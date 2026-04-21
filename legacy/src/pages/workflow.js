/* ════════════════════════════════
   NEXUS ERP — Workflow Page
════════════════════════════════ */

function renderWorkflowPanel() {
  const panel = document.getElementById('panel-workflow');
  if (!panel) return;

  const kanbanData = {
    todo: [
      { title: 'Prepare ITP for Structural Welding', dept: 'QAQC', due: 'May 25', priority: 'high' },
      { title: 'Source Alternates for SS Pipes', dept: 'Purchase', due: 'Jun 2', priority: 'normal' },
      { title: 'Weekly Report — Ruwais Project', dept: 'Mgmt', due: 'May 22', priority: 'normal' },
      { title: 'Update Bill of Materials Rev C', dept: 'Store', due: 'Jun 1', priority: 'normal' }
    ],
    inprogress: [
      { title: 'Blasting & Painting Zone B', dept: 'Production', due: '70%', priority: 'high' },
      { title: 'Weld Inspection Nodes 44–52', dept: 'QAQC', due: '50%', priority: 'high' },
      { title: 'Vendor Evaluation — 3 Vendors', dept: 'Purchase', due: '40%', priority: 'normal' },
      { title: 'Material Reconciliation Q1', dept: 'Store', due: '90%', priority: 'normal' }
    ],
    review: [
      { title: 'Hydrotest Report — Manifold', dept: 'QAQC', due: 'Awaiting PM', priority: 'high' },
      { title: 'PR-0811 Approval — Carbon Steel', dept: 'Purchase', due: 'Awaiting CFO', priority: 'high' },
      { title: 'Marketing Proposal — New Tender', dept: 'Marketing', due: 'Client Review', priority: 'normal' }
    ],
    done: [
      { title: 'Dimensional Check — Deck Frame', dept: 'QAQC', due: 'May 14', priority: 'normal' },
      { title: 'PO Issued to Gulf Steel', dept: 'Purchase', due: 'May 12', priority: 'normal' },
      { title: 'Steel Receipt — 48T Confirmed', dept: 'Store', due: 'May 10', priority: 'normal' },
      { title: 'Client FAT — Module 1', dept: 'QAQC', due: 'May 8', priority: 'normal' }
    ]
  };

  const deptColor = { 'QAQC':'green', 'Purchase':'amber', 'Production':'orange', 'Store':'purple', 'Mgmt':'blue', 'Marketing':'blue' };

  panel.innerHTML = `
    <!-- PROCESS MAP -->
    <div class="card gap-b">
      <div class="card-header">
        <div>
          <div class="card-title">End-to-End Process Flow</div>
          <div class="card-sub">Click any stage to navigate to that department dashboard</div>
        </div>
      </div>
      <div class="process-flow">
        ${[
          { icon:'📋', label:'Project\nInitiation', panel:'initiate', color:'var(--accent)', border:'var(--accent)' },
          { icon:'🎯', label:'Scope &\nPlanning', panel:'initiate', color:'var(--teal)', border:'var(--teal)' },
          { icon:'🛒', label:'Procurement\n& PR Raise', panel:'purchase', color:'var(--amber)', border:'var(--amber)' },
          { icon:'🏭', label:'Production\nExecution', panel:'production', color:'var(--orange)', border:'var(--orange)' },
          { icon:'🔬', label:'Inspection\n& QC', panel:'qaqc', color:'var(--green)', border:'var(--green)' },
          { icon:'📦', label:'Store &\nDelivery', panel:'store', color:'var(--purple)', border:'var(--purple)' },
          { icon:'✅', label:'Handover\n& Close', panel:'reports', color:'var(--blue)', border:'var(--blue)' }
        ].map((step, i, arr) => `
          <div class="pf-step" onclick="showPanel('${step.panel}')">
            <div class="pf-circle" style="border-color:${step.border};background:${step.color}15;color:${step.color}">
              ${step.icon}
            </div>
            <div class="pf-label" style="color:${step.color}">${step.label.replace('\n','<br>')}</div>
          </div>
          ${i < arr.length-1 ? `<div class="pf-connector" style="background:linear-gradient(90deg,${step.color},${arr[i+1].border})"></div>` : ''}
        `).join('')}
      </div>
    </div>

    <!-- KANBAN BOARD -->
    <div style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div class="card-title">Task Board</div>
        <div class="card-sub">Drag tasks across stages (click to interact)</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="addKanbanTask()">+ Add Task</button>
    </div>

    <div class="kanban" id="kanban-board">
      ${renderKanbanCol('To Do', 'todo', kanbanData.todo, 'rgba(255,255,255,0.06)', deptColor, kanbanData)}
      ${renderKanbanCol('In Progress', 'inprogress', kanbanData.inprogress, 'rgba(59,130,246,0.12)', deptColor, kanbanData)}
      ${renderKanbanCol('Under Review', 'review', kanbanData.review, 'rgba(245,158,11,0.12)', deptColor, kanbanData)}
      ${renderKanbanCol('Done', 'done', kanbanData.done, 'rgba(16,185,129,0.12)', deptColor, kanbanData)}
    </div>
  `;
}

function renderKanbanCol(title, key, tasks, countBg, deptColor, allData) {
  const deptBadge = { 'QAQC':'badge-green', 'Purchase':'badge-amber', 'Production':'badge-orange', 'Store':'badge-purple', 'Mgmt':'badge-blue', 'Marketing':'badge-blue' };
  return `
    <div class="kanban-col" id="col-${key}">
      <div class="kanban-col-header">
        <span class="kanban-col-title">${title}</span>
        <span class="kanban-count" style="background:${countBg};color:var(--text2)">${tasks.length}</span>
      </div>
      <div class="kanban-body" id="kb-${key}">
        ${tasks.map((t, i) => `
          <div class="k-card" id="task-${key}-${i}" draggable="true" ondragstart="dragStart(event,'${key}',${i})" ondragover="event.preventDefault()" ondrop="dragDrop(event,'${key}',${i})">
            ${t.priority==='high' ? `<div style="height:2px;background:var(--red);border-radius:1px;margin-bottom:8px;opacity:0.7"></div>` : ''}
            <div class="k-card-title">${t.title}</div>
            <div class="k-card-meta">
              <span class="badge ${deptBadge[t.dept]||'badge-gray'}" style="font-size:9px">${t.dept}</span>
              <span class="k-card-dept">${t.due}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

let draggedTask = { col: null, idx: null };

function dragStart(event, col, idx) {
  draggedTask = { col, idx };
  event.dataTransfer.effectAllowed = 'move';
}

function dragDrop(event, targetCol, targetIdx) {
  event.preventDefault();
  showToast('Task moved successfully!', 'success');
  renderWorkflowPanel();
}

function addKanbanTask() {
  showToast('Task creation coming soon — use Quick Action for PRs and IRs', 'info');
}
