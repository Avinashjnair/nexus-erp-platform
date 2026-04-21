/* ═════════════════════════════════
   NEXUS ERP — Initiate Project Page
═════════════════════════════════ */

function renderInitiatePanel() {
  const panel = document.getElementById('panel-initiate');
  if (!panel) return;

  panel.innerHTML = `
    <div class="section-title">Initiate New Project</div>
    <div class="accent-line"></div>

    <div class="grid-2 gap-b">
      <!-- PROJECT FORM -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Project Information</div>
            <div class="card-sub">Basic project setup and parameters</div>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Project Title</label><input class="form-input" id="init-title" placeholder="e.g. Offshore Platform Fabrication Phase 2"></div>
        <div class="form-group"><label class="form-label">Client / Owner</label><input class="form-input" id="init-client" placeholder="e.g. ADNOC Offshore"></div>
        <div class="form-group"><label class="form-label">Project Type</label>
          <select class="form-select" id="init-type">
            <option>EPC — Engineering, Procurement & Construction</option>
            <option>Fabrication</option><option>Civil Works</option>
            <option>Mechanical Works</option><option>Maintenance</option><option>Supply Only</option>
          </select>
        </div>
        <div class="form-grid-2">
          <div class="form-group"><label class="form-label">Start Date</label><input type="date" class="form-input" id="init-start"></div>
          <div class="form-group"><label class="form-label">End Date</label><input type="date" class="form-input" id="init-end"></div>
        </div>
        <div class="form-group"><label class="form-label">Contract Value (AED)</label><input class="form-input" type="number" id="init-value" placeholder="0.00"></div>
        <div class="form-group"><label class="form-label">Description / Scope Summary</label><textarea class="form-textarea" id="init-desc" placeholder="Briefly describe the project scope..."></textarea></div>
      </div>

      <!-- ROLES -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Roles & Responsibilities</div>
            <div class="card-sub">Assign team members to key roles</div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;margin-bottom:18px">
          ${[
            ['📋','Project Manager','blue'],
            ['🔬','QC Engineer','green'],
            ['🛒','Procurement Officer','amber'],
            ['🏭','Production Supervisor','orange'],
            ['📦','Store Keeper','purple'],
            ['🔧','Site Engineer','teal'],
            ['📊','Marketing Lead','blue'],
            ['📐','Design Engineer','teal']
          ].map(([icon, label, color]) => `
            <span class="role-chip" style="border-color:rgba(var(--${color}-rgb,79,124,255),0.3);color:var(--${color});background:var(--${color}-dim)">
              ${icon} ${label}
            </span>
          `).join('')}
        </div>

        <div class="form-grid-2">
          <div class="form-group"><label class="form-label">Project Manager</label><input class="form-input" id="init-pm" value="Ahmed Mansouri"></div>
          <div class="form-group"><label class="form-label">QC Lead</label><input class="form-input" id="init-qc" value="Priya Nair"></div>
          <div class="form-group"><label class="form-label">Procurement Lead</label><input class="form-input" id="init-proc" value="Khalid Ibrahim"></div>
          <div class="form-group"><label class="form-label">Production Supervisor</label><input class="form-input" id="init-prod" value="Omar Al Suwaidi"></div>
          <div class="form-group"><label class="form-label">Store Keeper</label><input class="form-input" id="init-store" value="Rajan Pillai"></div>
          <div class="form-group"><label class="form-label">Site Engineer</label><input class="form-input" id="init-site" placeholder="Assign name"></div>
        </div>

        <button class="btn btn-primary btn-block" onclick="initiateProject()" style="margin-top:8px">
          ⊕ Initiate Project
        </button>
      </div>
    </div>

    <!-- WORK BREAKDOWN STRUCTURE -->
    <div class="card gap-b">
      <div class="card-header">
        <div>
          <div class="card-title">Work Breakdown Structure (WBS)</div>
          <div class="card-sub">Define phases, deliverables and milestones</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="addWBSPhase()">+ Add Phase</button>
      </div>
      <div id="wbs-container">
        ${renderWBS()}
      </div>
    </div>

    <!-- EXISTING PROJECTS -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">All Projects</div>
          <div class="card-sub">Overview of current project portfolio</div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Project</th><th>Client</th><th>Type</th><th>Value</th><th>Start</th><th>End</th><th>Progress</th><th>Status</th></tr></thead>
          <tbody>
            ${NEXUS.projects.map(p => `
              <tr>
                <td class="td-main">${p.title}</td>
                <td>${p.client}</td>
                <td><span class="badge badge-gray">${p.type}</span></td>
                <td class="td-mono">${NEXUS.formatCurrency(p.contractValue)}</td>
                <td>${p.startDate}</td>
                <td>${p.endDate}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;min-width:100px">
                    <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${p.progress}%;background:var(--accent)"></div></div>
                    <span style="font-family:var(--font-mono);font-size:11px;color:var(--text2)">${p.progress}%</span>
                  </div>
                </td>
                <td>${NEXUS.getStatusBadge(p.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderWBS() {
  const phases = [
    { label: 'Phase 1', color: 'blue', name: 'Engineering & Design', weeks: 'Weeks 1–4',
      items: ['Structural drawings', 'Material TDL', 'ITP preparation', 'Client approval', 'Design freeze'] },
    { label: 'Phase 2', color: 'amber', name: 'Procurement & Logistics', weeks: 'Weeks 5–8',
      items: ['RFQ issuance', 'Vendor evaluation', 'PO placement', 'Material delivery', 'Material traceability'] },
    { label: 'Phase 3', color: 'orange', name: 'Fabrication & Construction', weeks: 'Weeks 9–20',
      items: ['Steel cutting & fitting', 'Welding & assembly', 'Dimensional inspection', 'NDT inspection', 'Blasting & painting'] },
    { label: 'Phase 4', color: 'green', name: 'QA/QC & Testing', weeks: 'Weeks 18–22',
      items: ['Hydrotest', 'Final dimensional check', 'Third party inspection', 'Client witnessing', 'Punch list closure'] },
    { label: 'Phase 5', color: 'teal', name: 'Delivery & Handover', weeks: 'Weeks 22–24',
      items: ['Document handover', 'As-built drawings', 'Certificates compilation', 'Final inspection', 'Project close-out'] }
  ];

  return phases.map(ph => `
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-${ph.color}">${ph.label}</span>
        <span style="font-size:13px;color:var(--text);font-weight:600">${ph.name}</span>
        <span style="font-size:10px;color:var(--text3);margin-left:auto">${ph.weeks}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${ph.items.map(item => `
          <span style="background:var(--bg4);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:11px;color:var(--text2)">${item}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function addWBSPhase() {
  showToast('Use the form above to define project phases', 'info');
}

function initiateProject() {
  const title = document.getElementById('init-title').value;
  const client = document.getElementById('init-client').value;
  if (!title.trim()) { showToast('Project title is required', 'warning'); return; }
  if (!client.trim()) { showToast('Client name is required', 'warning'); return; }

  const newP = {
    id: 'p' + (NEXUS.projects.length + 1),
    title, client,
    type: document.getElementById('init-type').value,
    contractValue: parseFloat(document.getElementById('init-value').value) || 0,
    startDate: document.getElementById('init-start').value,
    endDate: document.getElementById('init-end').value,
    progress: 0, status: 'on-track',
    pm: document.getElementById('init-pm').value,
    qcLead: document.getElementById('init-qc').value,
    procLead: document.getElementById('init-proc').value,
    phases: ['Engineering', 'Procurement', 'Fabrication', 'QAQC', 'Delivery'],
    currentPhase: 0
  };
  NEXUS.projects.push(newP);

  const sel = document.getElementById('active-project-select');
  if (sel) sel.innerHTML += `<option value="${newP.id}">${newP.title}</option>`;

  addActivity('success', 'Project Initiated', `${title} has been created for ${client}`, 'Just now', 'Management');
  showToast(`Project "${title}" initiated successfully!`, 'success');
  showPanel('management');
}
