/* ══════════════════════
   NEXUS ERP — QA/QC
══════════════════════ */
function renderQAQCPanel() {
  const panel = document.getElementById('panel-qaqc');
  if (!panel) return;
  const openIRs = NEXUS.inspectionRequests.filter(i => i.status==='pending'||i.status==='scheduled');
  const passed = NEXUS.inspectionRequests.filter(i => i.status==='approved').length;
  const openNCRs = NEXUS.ncrs.filter(n => n.status==='open').length;

  panel.innerHTML = `
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-dim)">🔍</div>
        <div class="stat-label">Open IRs</div>
        <div class="stat-value">${openIRs.length}</div>
        <div class="stat-delta">${openIRs.filter(i=>i.type==='Hold Point').length} hold points</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--teal)">
        <div class="stat-icon" style="background:var(--teal-dim)">✅</div>
        <div class="stat-label">Passed Inspections</div>
        <div class="stat-value">${passed}</div>
        <div class="stat-delta delta-up">This project cycle</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">⚠️</div>
        <div class="stat-label">Open NCRs</div>
        <div class="stat-value">${openNCRs}</div>
        <div class="stat-delta delta-dn">${openNCRs > 0 ? 'Requires closure' : 'All closed'}</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--blue)">
        <div class="stat-icon" style="background:var(--blue-dim)">📄</div>
        <div class="stat-label">Reports Uploaded</div>
        <div class="stat-value">${NEXUS.reports.length}</div>
        <div class="stat-delta delta-up">Last: today</div>
      </div>
    </div>

    <div class="grid-2 gap-b">
      <!-- IR TABLE -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Inspection Requests</div></div>
          <button class="btn btn-primary btn-sm" onclick="openModal('ir-modal')">+ Raise IR</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>IR No.</th><th>Activity</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${NEXUS.inspectionRequests.map(ir => `
                <tr onclick="openModal('view-ir-modal', NEXUS.inspectionRequests.find(i=>i.id==='${ir.id}'))">
                  <td class="td-main td-mono">${ir.id}</td>
                  <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ir.activity}</td>
                  <td><span class="badge badge-blue" style="font-size:9px">${ir.type.split(' ')[0]}</span></td>
                  <td>${ir.date}</td>
                  <td>${NEXUS.getStatusBadge(ir.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- REPORT UPLOAD -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Upload Inspection Report</div></div>
          <button class="btn btn-ghost btn-sm" onclick="openModal('report-upload-modal')">Upload</button>
        </div>
        <div class="upload-zone gap-b" onclick="openModal('report-upload-modal')" style="margin-bottom:16px">
          <div class="upload-zone-icon">📎</div>
          <div class="upload-zone-text">Click to upload inspection report</div>
          <div class="upload-zone-sub">PDF, DOCX, JPG — max 50 MB</div>
        </div>
        <div class="card-title" style="font-size:12px;margin-bottom:10px">Recent Reports</div>
        ${NEXUS.reports.map(r => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:12px;color:var(--text);font-weight:500">${r.id}</div>
              <div style="font-size:10px;color:var(--text3)">${r.title.length>40?r.title.slice(0,40)+'…':r.title}</div>
            </div>
            <div style="text-align:right">
              ${NEXUS.getStatusBadge(r.result)}
              <div style="font-size:10px;color:var(--text3);margin-top:2px">${r.date}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- NCR TABLE -->
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Non-Conformance Reports (NCRs)</div></div>
        <button class="btn btn-danger btn-sm" onclick="openModal('ncr-modal')">+ Raise NCR</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>NCR No.</th><th>Activity</th><th>Severity</th><th>Raised By</th><th>Date</th><th>Corrective Action</th><th>Status</th></tr></thead>
          <tbody>
            ${NEXUS.ncrs.map(n => `
              <tr>
                <td class="td-main td-mono">${n.id}</td>
                <td>${n.activity}</td>
                <td><span class="badge ${n.severity==='major'?'badge-red':n.severity==='minor'?'badge-amber':'badge-red'}">${n.severity}</span></td>
                <td>${n.raisedBy}</td>
                <td>${n.raised}</td>
                <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text2)">${n.corrective}</td>
                <td>${NEXUS.getStatusBadge(n.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
