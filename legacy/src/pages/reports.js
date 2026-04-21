/* ═══════════════════════
   NEXUS ERP — Reports
═══════════════════════ */
function renderReportsPanel() {
  const panel = document.getElementById('panel-reports');
  if (!panel) return;

  panel.innerHTML = `
    <div class="section-title">Reports & Documents</div>
    <div class="accent-line"></div>

    <!-- SUMMARY CARDS -->
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--blue)">
        <div class="stat-icon" style="background:var(--blue-dim)">📊</div>
        <div class="stat-label">Inspection Reports</div>
        <div class="stat-value">${NEXUS.reports.length}</div>
        <div class="stat-delta delta-up">All projects</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--amber)">
        <div class="stat-icon" style="background:rgba(245,158,11,0.12)">📋</div>
        <div class="stat-label">Purchase Requests</div>
        <div class="stat-value">${NEXUS.purchaseRequests.length}</div>
        <div class="stat-delta">${NEXUS.purchaseRequests.filter(p=>p.status==='pending').length} pending approval</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-dim)">🔬</div>
        <div class="stat-label">Inspection Requests</div>
        <div class="stat-value">${NEXUS.inspectionRequests.length}</div>
        <div class="stat-delta">${NEXUS.inspectionRequests.filter(i=>i.status==='approved').length} passed</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">⚠️</div>
        <div class="stat-label">NCRs Total</div>
        <div class="stat-value">${NEXUS.ncrs.length}</div>
        <div class="stat-delta delta-dn">${NEXUS.ncrs.filter(n=>n.status==='open').length} open</div>
      </div>
    </div>

    <!-- INSPECTION REPORTS TABLE -->
    <div class="card gap-b">
      <div class="card-header">
        <div><div class="card-title">Inspection Reports Register</div></div>
        <button class="btn btn-primary btn-sm" onclick="openModal('report-upload-modal')">+ Upload</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Report ID</th><th>IR Ref</th><th>Title</th><th>Type</th><th>Date</th><th>Inspector</th><th>Result</th><th>File</th></tr></thead>
          <tbody>
            ${NEXUS.reports.map(r => `
              <tr>
                <td class="td-main td-mono">${r.id}</td>
                <td class="td-mono">${r.irRef}</td>
                <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.title}</td>
                <td><span class="badge badge-gray">${r.type}</span></td>
                <td>${r.date}</td>
                <td>${r.inspector}</td>
                <td>${NEXUS.getStatusBadge(r.result.toLowerCase())}</td>
                <td><button class="btn btn-ghost btn-sm" onclick="showToast('Downloading ${r.file}…','info')">⬇ ${r.size}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- PROJECT SUMMARY EXPORT -->
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Export Project Report</div><div class="card-sub">Generate comprehensive project reports</div></div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${[
          { label:'Weekly Progress Report', icon:'📈', color:'var(--accent)' },
          { label:'Inspection Summary', icon:'🔬', color:'var(--green)' },
          { label:'NCR Register', icon:'⚠️', color:'var(--red)' },
          { label:'Purchase Summary', icon:'🛒', color:'var(--amber)' },
          { label:'Material Reconciliation', icon:'📦', color:'var(--purple)' },
          { label:'Project Close-out Report', icon:'✅', color:'var(--teal)' }
        ].map(r => `
          <button class="btn btn-ghost" onclick="showToast('Generating ${r.label}…','info')" style="border-color:${r.color}20;color:var(--text2)">
            <span>${r.icon}</span> ${r.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
