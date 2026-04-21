/* ════════════════════════════
   NEXUS ERP — Production
════════════════════════════ */
function renderProductionPanel() {
  const panel = document.getElementById('panel-production');
  if (!panel) return;
  const acts = NEXUS.getActivities();
  const running = acts.filter(a => a.status !== 'done').length;
  const avgActual = Math.round(acts.reduce((s,a) => s+a.actual, 0) / acts.length);
  const avgPlanned = Math.round(acts.reduce((s,a) => s+a.planned, 0) / acts.length);
  const behind = acts.filter(a => a.actual < a.planned - 5).length;

  panel.innerHTML = `
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--orange)">
        <div class="stat-icon" style="background:var(--orange-dim)">⚙️</div>
        <div class="stat-label">Activities Running</div>
        <div class="stat-value">${running}</div>
        <div class="stat-delta">Across 2 shifts</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-dim)">📈</div>
        <div class="stat-label">Avg. Progress</div>
        <div class="stat-value">${avgActual}%</div>
        <div class="stat-delta ${avgActual>=avgPlanned?'delta-up':'delta-dn'}">${avgActual>=avgPlanned?'Above':'Below'} plan (${avgPlanned}%)</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">🔴</div>
        <div class="stat-label">Behind Schedule</div>
        <div class="stat-value">${behind}</div>
        <div class="stat-delta delta-dn">Activities need attention</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--amber)">
        <div class="stat-icon" style="background:rgba(245,158,11,0.12)">🔩</div>
        <div class="stat-label">Materials Consumed</div>
        <div class="stat-value">18.4T</div>
        <div class="stat-delta">Steel this week</div>
      </div>
    </div>

    <!-- ACTIVITIES TABLE -->
    <div class="card gap-b">
      <div class="card-header">
        <div><div class="card-title">Production Status</div><div class="card-sub">Click any row to update progress</div></div>
        <button class="btn btn-ghost btn-sm" onclick="openModal('pr-modal')">+ Raise PR</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Activity</th><th>Crew</th><th>Phase</th><th>Planned</th><th>Actual</th><th>Variance</th><th>Last Update</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${acts.map(a => {
              const variance = a.actual - a.planned;
              return \`
                <tr>
                  <td class="td-main">\${a.name}</td>
                  <td>\${a.crew}</td>
                  <td><span class="badge badge-gray">\${a.phase}</span></td>
                  <td class="td-mono">\${a.planned}%</td>
                  <td class="td-mono">\${a.actual}%</td>
                  <td style="color:\${variance>0?'var(--green)':variance<0?'var(--red)':'var(--text3)';font-family:'var(--font-mono)';font-size:11px">\${variance>0?'+':''}\${variance}%</td>
                  <td style="font-size:11px;color:var(--text3)">\${a.lastUpdated}</td>
                  <td>\${NEXUS.getStatusBadge(a.status)}</td>
                  <td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openModal('update-activity-modal', NEXUS.activities.find(aa=>aa.id==='\${a.id}'))">Update</button></td>
                </tr>
              \`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- RAISE PR FROM PRODUCTION -->
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Raise Material / Purchase Request</div><div class="card-sub">Request materials from store or trigger a purchase</div></div>
      </div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Item Description</label><input class="form-input" id="prod-pr-item" placeholder="Material or service needed"></div>
        <div class="form-group"><label class="form-label">Quantity & Unit</label><input class="form-input" id="prod-pr-qty" placeholder="e.g. 200 pcs / 5 tons"></div>
        <div class="form-group"><label class="form-label">Required Date</label><input type="date" class="form-input" id="prod-pr-date"></div>
        <div class="form-group"><label class="form-label">Priority</label>
          <select class="form-select" id="prod-pr-priority"><option>normal</option><option>urgent</option><option>critical</option></select>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="raiseProdPR()">Submit Request →</button>
    </div>
  `;
}

function raiseProdPR() {
  const item = document.getElementById('prod-pr-item')?.value;
  if (!item?.trim()) { showToast('Item description required', 'warning'); return; }
  openModal('pr-modal');
}
