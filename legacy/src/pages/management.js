/* ═══════════════════════════════════
   NEXUS ERP — Management Dashboard
═══════════════════════════════════ */

function renderManagementPanel() {
  const panel = document.getElementById('panel-management');
  if (!panel) return;

  const projects = NEXUS.projects;
  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const totalPRs = NEXUS.purchaseRequests.filter(p => p.status === 'pending').length;
  const openNCRs = NEXUS.ncrs.filter(n => n.status === 'open').length;

  panel.innerHTML = `
    <!-- AI SUMMARY WIDGET -->
    <div class="card gap-b ai-summary-card" style="background:linear-gradient(135deg, var(--bg2), #1a1e26); border: 1px solid var(--accent-dim)">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px">
        <div class="status-dot pulse" style="background:var(--accent); width:10px; height:10px"></div>
        <div>
          <div style="font-size:13px; font-weight:700; color:var(--text); letter-spacing:0.02em">AI Intelligence Summary</div>
          <div style="font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:0.05em">Analyzing core project vitals...</div>
        </div>
        <div style="margin-left:auto; font-size:11px; color:var(--green); font-weight:600">84% Operational Efficiency</div>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px">
        <div class="ai-insight">
          <div style="font-size:11px; color:var(--text2); margin-bottom:4px">Critical Alert</div>
          <div style="font-size:12px; color:var(--red); font-weight:500">Material shortage for P1 Fabrication path detected. PR-0815 approval recommended within 24h.</div>
        </div>
        <div class="ai-insight" style="border-left:1px solid var(--border); padding-left:20px">
          <div style="font-size:11px; color:var(--text2); margin-bottom:4px">Risk Analysis</div>
          <div style="font-size:12px; color:var(--amber); font-weight:500">Project P2 showing 12% slip in MEP phase. Suggest rescheduling Site Engineer tasks.</div>
        </div>
        <div class="ai-insight" style="border-left:1px solid var(--border); padding-left:20px">
          <div style="font-size:11px; color:var(--text2); margin-bottom:4px">Financial Projection</div>
          <div style="font-size:12px; color:var(--green); font-weight:500">On track to realize 92% budget utilization by Q3. Vendor V001 performance improving.</div>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--accent)">
        <div class="stat-icon" style="background:var(--accent-dim)">📂</div>
        <div class="stat-label">Active Projects</div>
        <div class="stat-value">${projects.length}</div>
        <div class="stat-delta delta-up">↑ 1 initiated this month</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-dim)">💰</div>
        <div class="stat-label">Total Contract Value</div>
        <div class="stat-value">${formatCurrency(totalValue)}</div>
        <div class="stat-delta delta-up">Across all projects</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--orange)">
        <div class="stat-icon" style="background:var(--orange-dim)">⏳</div>
        <div class="stat-label">Pending Approvals</div>
        <div class="stat-value">${totalPRs + 1}</div>
        <div class="stat-delta delta-dn">${totalPRs} PRs · 1 IR awaiting</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">⚠️</div>
        <div class="stat-label">Open NCRs</div>
        <div class="stat-value">${openNCRs}</div>
        <div class="stat-delta delta-dn">${openNCRs > 0 ? 'Requires immediate attention' : 'All clear'}</div>
      </div>
    </div>

    <!-- PROJECT PROGRESS + ACTIVITY FEED -->
    <div class="grid-2 gap-b">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Project Progress</div>
            <div class="card-sub">Current fabrication & construction status</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="openModal('project-modal')">+ New Project</button>
        </div>
        ${projects.map(p => `
          <div style="margin-bottom:18px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text)">${p.title}</div>
                <div style="font-size:10px;color:var(--text3)">${p.client} · ${p.type} · Due ${p.endDate}</div>
              </div>
              <div style="text-align:right">
                <div style="font-family:var(--font-mono);font-size:13px;font-weight:600;color:var(--accent)">${p.progress}%</div>
                ${getStatusBadge(p.status)}
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${p.progress}%;background:${p.status==='on-track'?'var(--green)':p.status==='delayed'?'var(--amber)':'var(--teal)'}"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Recent Activity</div>
            <div class="card-sub">Latest event log from all departments</div>
          </div>
        </div>
        <div class="timeline" id="mgmt-activity-feed">
          ${NEXUS.activityLog.slice(0, 6).map((a, i) => `
            <div class="tl-item">
              <div>
                <div class="tl-dot" style="background:${a.type==='success'?'var(--green)':a.type==='warning'?'var(--amber)':a.type==='danger'?'var(--red)':'var(--blue)'}"></div>
                ${i < 5 ? '<div class="tl-line"></div>' : ''}
              </div>
              <div>
                <div class="tl-label">${a.title}</div>
                <div class="tl-text">${a.text}</div>
                <div class="tl-time">${a.time} · ${a.dept}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- DEPARTMENT OVERVIEW -->
    <div class="card gap-b">
      <div class="card-header">
        <div>
          <div class="card-title">Department Workload Overview</div>
          <div class="card-sub">Real-time status of divisional backlogs</div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Department</th><th>Open Tasks</th><th>Critical Items</th><th>Load Factor</th><th>Current Status</th></tr></thead>
          <tbody>
            <tr onclick="showPanel('marketing')">
              <td class="td-main">Marketing & Tendering</td><td>6 Bids</td><td>0</td>
              <td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:60%;background:var(--blue)"></div></div></td>
              <td>${getStatusBadge('on-track')}</td>
            </tr>
            <tr onclick="showPanel('purchase')">
              <td class="td-main">Procurement</td><td>14 Orders</td>
              <td>${NEXUS.purchaseRequests.filter(p=>p.priority==='urgent').length} urgent</td>
              <td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:85%;background:var(--amber)"></div></div></td>
              <td><span class="badge badge-amber">High Priority</span></td>
            </tr>
            <tr onclick="showPanel('qaqc')">
              <td class="td-main">Quality Control</td><td>9 Inspections</td>
              <td>${openNCRs} Open NCR</td>
              <td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:75%;background:var(--green)"></div></div></td>
              <td>${getStatusBadge('on-track')}</td>
            </tr>
            <tr onclick="showPanel('production')">
              <td class="td-main">Production Bay</td><td>22 Spools</td><td>3 Delay</td>
              <td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:92%;background:var(--orange)"></div></div></td>
              <td><span class="badge badge-red">Critical Load</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Charts
  setTimeout(() => {
    if (typeof renderDonut === 'function') {
        renderDonut('mgmt-donut-chart', [
          { value: 68, color: 'var(--accent)' },
          { value: 32, color: 'var(--bg4)' }
        ]);
    }
  }, 100);
}
