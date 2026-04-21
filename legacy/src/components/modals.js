/* ═══════════════════════════════
   NEXUS ERP — Modal Components
═══════════════════════════════ */

function openModal(id, data = {}) {
  const container = document.getElementById('modals-container');
  let html = '';

  if (id === 'pr-modal') html = buildPRModal(data);
  else if (id === 'ir-modal') html = buildIRModal(data);
  else if (id === 'project-modal') html = buildProjectModal(data);
  else if (id === 'quick-action-modal') html = buildQuickActionModal();
  else if (id === 'report-upload-modal') html = buildReportUploadModal(data);
  else if (id === 'ncr-modal') html = buildNCRModal(data);
  else if (id === 'view-pr-modal') html = buildViewPRModal(data);
  else if (id === 'view-ir-modal') html = buildViewIRModal(data);
  else if (id === 'vendor-modal') html = buildVendorModal(data);
  else if (id === 'update-activity-modal') html = buildUpdateActivityModal(data);
  else if (id === 'mr-modal') html = buildMRModal(data);
  else return;

  container.innerHTML = html;
  container.querySelector('.modal-overlay').addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
}

function closeModal() {
  document.getElementById('modals-container').innerHTML = '';
}

/* ── PROJECT MODAL ── */
function buildProjectModal(d = {}) {
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${d.id ? 'Edit Project' : 'Initiate New Project'}</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Project Title</label><input class="form-input" id="m-proj-title" placeholder="e.g. Offshore Jacket Fabrication" value="${d.title||''}"></div>
      <div class="form-group"><label class="form-label">Client / Owner</label><input class="form-input" id="m-proj-client" placeholder="e.g. ADNOC Offshore" value="${d.client||''}"></div>
      <div class="form-group"><label class="form-label">Project Type</label>
        <select class="form-select" id="m-proj-type">
          <option>EPC — Engineering, Procurement & Construction</option>
          <option>Fabrication</option><option>Civil Works</option>
          <option>Maintenance</option><option>Supply Only</option>
        </select>
      </div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Start Date</label><input type="date" class="form-input" id="m-proj-start" value="${d.startDate||new Date().toISOString().slice(0,10)}"></div>
        <div class="form-group"><label class="form-label">End Date</label><input type="date" class="form-input" id="m-proj-end" value="${d.endDate||''}"></div>
      </div>
      <div class="form-group"><label class="form-label">Contract Value (AED)</label><input class="form-input" type="number" id="m-proj-value" placeholder="0" value="${d.contractValue||''}"></div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Project Manager</label><input class="form-input" id="m-proj-pm" placeholder="Name" value="${d.pm||'Ahmed Mansouri'}"></div>
        <div class="form-group"><label class="form-label">QC Lead</label><input class="form-input" id="m-proj-qc" placeholder="Name" value="${d.qcLead||'Priya Nair'}"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveProject()">Create Project →</button>
      </div>
    </div>
  </div>`;
}

function saveProject() {
  const title = document.getElementById('m-proj-title').value;
  if (!title.trim()) { alert('Project title is required'); return; }
  const newP = {
    id: 'p' + (NEXUS.projects.length + 1),
    title, client: document.getElementById('m-proj-client').value,
    type: document.getElementById('m-proj-type').value,
    contractValue: parseFloat(document.getElementById('m-proj-value').value) || 0,
    startDate: document.getElementById('m-proj-start').value,
    endDate: document.getElementById('m-proj-end').value,
    progress: 0, status: 'on-track',
    pm: document.getElementById('m-proj-pm').value,
    qcLead: document.getElementById('m-proj-qc').value,
    procLead: 'Khalid Ibrahim',
    phases: ['Engineering','Procurement','Fabrication','QAQC','Delivery'], currentPhase: 0
  };
  NEXUS.projects.push(newP);
  const sel = document.getElementById('active-project-select');
  if (sel) sel.innerHTML += `<option value="${newP.id}">${newP.title}</option>`;
  closeModal();
  if (typeof showPanel === 'function') showPanel('management');
  if (typeof addActivity === 'function') addActivity('info', 'Project Created', `${title} has been initiated`, 'Just now', 'Management');
  if (typeof showToast === 'function') showToast('Project created successfully!', 'success');
}

/* ── PURCHASE REQUEST MODAL ── */
function buildPRModal(d = {}) {
  const projectOptions = NEXUS.projects.map(p =>
    `<option value="${p.id}" ${p.id===NEXUS.currentProject?'selected':''}>${p.title}</option>`
  ).join('');
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Raise Purchase Request</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Item / Service Description</label><input class="form-input" id="m-pr-item" placeholder="Describe the material or service needed"></div>
      <div class="form-grid-3">
        <div class="form-group"><label class="form-label">Quantity</label><input class="form-input" type="number" id="m-pr-qty" placeholder="0"></div>
        <div class="form-group"><label class="form-label">Unit</label><input class="form-input" id="m-pr-unit" placeholder="pcs / kg / m"></div>
        <div class="form-group"><label class="form-label">Priority</label>
          <select class="form-select" id="m-pr-priority">
            <option>normal</option><option>urgent</option><option>critical</option>
          </select>
        </div>
      </div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Linked Project</label><select class="form-select" id="m-pr-project">${projectOptions}</select></div>
        <div class="form-group"><label class="form-label">Department</label>
          <select class="form-select" id="m-pr-dept">
            <option>Production</option><option>Store</option><option>QAQC</option><option>Marketing</option><option>Management</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Justification / Remarks</label><textarea class="form-textarea" id="m-pr-remarks" placeholder="Why is this required? Reference relevant drawing, ITP, or work order."></textarea></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="savePR()">Submit PR →</button>
      </div>
    </div>
  </div>`;
}

function savePR() {
  const item = document.getElementById('m-pr-item').value;
  if (!item.trim()) { alert('Item description required'); return; }
  const newId = 'PR-0' + (816 + NEXUS.purchaseRequests.length);
  const role = NEXUS.roles[NEXUS.currentRole];
  const pr = {
    id: newId, item,
    qty: document.getElementById('m-pr-qty').value + ' ' + document.getElementById('m-pr-unit').value,
    unit: document.getElementById('m-pr-unit').value,
    project: document.getElementById('m-pr-project').value,
    dept: document.getElementById('m-pr-dept').value,
    priority: document.getElementById('m-pr-priority').value,
    status: 'pending',
    raised: new Date().toISOString().slice(0,10),
    raisedBy: role.name,
    remarks: document.getElementById('m-pr-remarks').value
  };
  NEXUS.purchaseRequests.unshift(pr);
  closeModal();
  if (typeof showPanel === 'function') showPanel('purchase');
  if (typeof addActivity === 'function') addActivity('warning', `${newId} Raised`, `${item} — ${pr.qty} requested by ${pr.dept}`, 'Just now', pr.dept);
  if (typeof showToast === 'function') showToast(`${newId} submitted successfully!`, 'success');
}

/* ── INSPECTION REQUEST MODAL ── */
function buildIRModal(d = {}) {
  const projectOptions = NEXUS.projects.map(p =>
    `<option value="${p.id}" ${p.id===NEXUS.currentProject?'selected':''}>${p.title}</option>`
  ).join('');
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Raise Inspection Request</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Inspection Activity</label><input class="form-input" id="m-ir-activity" placeholder="e.g. Visual Weld Inspection — Deck B Nodes"></div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Inspection Type</label>
          <select class="form-select" id="m-ir-type">
            <option>Hold Point</option><option>Witness Point</option><option>Review Point</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Requested Date</label><input type="date" class="form-input" id="m-ir-date" value="${new Date().toISOString().slice(0,10)}"></div>
      </div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Linked Project</label><select class="form-select" id="m-ir-project">${projectOptions}</select></div>
        <div class="form-group"><label class="form-label">ITP Reference</label><input class="form-input" id="m-ir-itp" placeholder="e.g. ITP-001 §4.3"></div>
      </div>
      <div class="form-group"><label class="form-label">Drawing / Document Reference</label><input class="form-input" id="m-ir-dwg" placeholder="e.g. DWG-STR-15-R2"></div>
      <div class="form-group"><label class="form-label">Location / Area</label><input class="form-input" id="m-ir-location" placeholder="e.g. Bay 3 — Welding Station A"></div>
      <div class="form-group"><label class="form-label">Additional Notes</label><textarea class="form-textarea" id="m-ir-notes" placeholder="Any additional info for the QC team"></textarea></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveIR()">Submit IR →</button>
      </div>
    </div>
  </div>`;
}

function saveIR() {
  const activity = document.getElementById('m-ir-activity').value;
  if (!activity.trim()) { alert('Activity description required'); return; }
  const newId = 'IR-20' + (49 + NEXUS.inspectionRequests.length);
  const role = NEXUS.roles[NEXUS.currentRole];
  const ir = {
    id: newId, activity,
    type: document.getElementById('m-ir-type').value,
    project: document.getElementById('m-ir-project').value,
    itp: document.getElementById('m-ir-itp').value,
    date: document.getElementById('m-ir-date').value,
    drawingRef: document.getElementById('m-ir-dwg').value,
    location: document.getElementById('m-ir-location').value,
    requestedBy: role.name,
    status: 'pending'
  };
  NEXUS.inspectionRequests.unshift(ir);
  closeModal();
  if (typeof showPanel === 'function') showPanel('qaqc');
  if (typeof addActivity === 'function') addActivity('info', `${newId} Submitted`, `${activity} — awaiting QC scheduling`, 'Just now', 'Production');
  if (typeof showToast === 'function') showToast(`${newId} submitted successfully!`, 'success');
}

/* ── REPORT UPLOAD MODAL ── */
function buildReportUploadModal(d = {}) {
  const irOptions = NEXUS.inspectionRequests.map(i =>
    `<option value="${i.id}">${i.id} — ${i.activity}</option>`
  ).join('');
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Upload Inspection Report</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Linked IR Number</label>
        <select class="form-select" id="m-rpt-ir">${irOptions}</select>
      </div>
      <div class="form-group"><label class="form-label">Report Title</label><input class="form-input" id="m-rpt-title" placeholder="e.g. Visual Weld Inspection Report — Deck 3"></div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Inspection Type</label>
          <select class="form-select" id="m-rpt-type">
            <option>Weld Inspection</option><option>Dimensional</option>
            <option>Pressure Test</option><option>Hydrotest</option>
            <option>NDT — UT</option><option>NDT — RT</option><option>Paint / Coating</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Result</label>
          <select class="form-select" id="m-rpt-result">
            <option>Pass</option><option>Fail</option><option>Conditional Pass</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Inspector Name</label><input class="form-input" id="m-rpt-inspector" placeholder="Name of inspector" value="${NEXUS.roles[NEXUS.currentRole].name}"></div>
      <div class="form-group">
        <label class="form-label">Upload File</label>
        <div class="upload-zone" onclick="simulateUpload()">
          <div class="upload-zone-icon" id="upload-icon">📎</div>
          <div class="upload-zone-text" id="upload-text">Drop file here or click to browse</div>
          <div class="upload-zone-sub" id="upload-sub">PDF, DOCX, JPG — max 50 MB</div>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Remarks</label><textarea class="form-textarea" id="m-rpt-remarks" placeholder="Summary of findings"></textarea></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveReport()">Upload Report →</button>
      </div>
    </div>
  </div>`;
}

function simulateUpload() {
  const icon = document.getElementById('upload-icon');
  const text = document.getElementById('upload-text');
  const sub = document.getElementById('upload-sub');
  if (icon) icon.textContent = '✅';
  if (text) text.textContent = 'Report_Inspection_2025.pdf';
  if (sub) sub.textContent = '3.2 MB — Ready to upload';
}

function saveReport() {
  const title = document.getElementById('m-rpt-title').value;
  if (!title.trim()) { alert('Report title required'); return; }
  const newId = 'RPT-20' + (46 + NEXUS.reports.length);
  const report = {
    id: newId,
    irRef: document.getElementById('m-rpt-ir').value,
    title,
    type: document.getElementById('m-rpt-type').value,
    project: NEXUS.currentProject,
    date: new Date().toISOString().slice(0,10),
    result: document.getElementById('m-rpt-result').value,
    inspector: document.getElementById('m-rpt-inspector').value,
    client: NEXUS.getProject().client,
    file: title.replace(/\s/g,'_') + '.pdf', size: '3.2 MB'
  };
  NEXUS.reports.unshift(report);
  closeModal();
  if (typeof addActivity === 'function') addActivity('info', `${newId} Uploaded`, `${title} — ${report.result}`, 'Just now', 'QAQC');
  if (typeof showToast === 'function') showToast('Report uploaded successfully!', 'success');
  if (typeof renderQAQCPanel === 'function') renderQAQCPanel();
}

/* ── NCR MODAL ── */
function buildNCRModal(d = {}) {
  return `<div class="modal-overlay">
    <div class="modal modal-sm">
      <div class="modal-header">
        <div class="modal-title">Raise Non-Conformance Report</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Activity / Description</label><input class="form-input" id="m-ncr-activity" placeholder="What was the non-conformance?"></div>
      <div class="form-group"><label class="form-label">Severity</label>
        <select class="form-select" id="m-ncr-severity"><option>major</option><option>minor</option><option>critical</option></select>
      </div>
      <div class="form-group"><label class="form-label">Description of Finding</label><textarea class="form-textarea" id="m-ncr-desc" placeholder="Detailed description of the non-conformance"></textarea></div>
      <div class="form-group"><label class="form-label">Proposed Corrective Action</label><textarea class="form-textarea" id="m-ncr-corrective" placeholder="What corrective action is proposed?"></textarea></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-danger" onclick="saveNCR()">Raise NCR →</button>
      </div>
    </div>
  </div>`;
}

function saveNCR() {
  const activity = document.getElementById('m-ncr-activity').value;
  if (!activity.trim()) { alert('Activity required'); return; }
  const newId = 'NCR-0' + (43 + NEXUS.ncrs.length);
  NEXUS.ncrs.unshift({
    id: newId, activity, project: NEXUS.currentProject,
    raised: new Date().toISOString().slice(0,10),
    raisedBy: NEXUS.roles[NEXUS.currentRole].name,
    severity: document.getElementById('m-ncr-severity').value,
    status: 'open',
    description: document.getElementById('m-ncr-desc').value,
    corrective: document.getElementById('m-ncr-corrective').value
  });
  closeModal();
  if (typeof addActivity === 'function') addActivity('danger', `${newId} Raised`, `${activity} — NCR logged`, 'Just now', 'QAQC');
  if (typeof showToast === 'function') showToast(`${newId} raised successfully!`, 'warning');
  if (typeof renderQAQCPanel === 'function') renderQAQCPanel();
}

/* ── VIEW PR MODAL ── */
function buildViewPRModal(pr) {
  if (!pr) return '';
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${pr.id}</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
        <div><div class="form-label">Item</div><div style="color:var(--text);font-weight:500">${pr.item}</div></div>
        <div><div class="form-label">Quantity</div><div style="color:var(--text)">${pr.qty}</div></div>
        <div><div class="form-label">Department</div><div style="color:var(--text)">${pr.dept}</div></div>
        <div><div class="form-label">Priority</div>${getStatusBadge(pr.priority)}</div>
        <div><div class="form-label">Status</div>${getStatusBadge(pr.status)}</div>
        <div><div class="form-label">Raised By</div><div style="color:var(--text)">${pr.raisedBy}</div></div>
        <div><div class="form-label">Date Raised</div><div style="color:var(--text)">${pr.raised}</div></div>
        <div><div class="form-label">Project</div><div style="color:var(--text)">${NEXUS.getProject(pr.project)?.title||'—'}</div></div>
      </div>
      ${pr.remarks ? `<div class="form-group"><div class="form-label">Remarks</div><div style="color:var(--text2);font-size:13px">${pr.remarks}</div></div>` : ''}
      ${pr.justification ? `<div class="form-group"><div class="form-label">Justification</div><div style="color:var(--text2);font-size:13px">${pr.justification}</div></div>` : ''}
      <div class="modal-footer">
        ${pr.status === 'pending' ? `
          <button class="btn btn-danger btn-sm" onclick="updatePRStatus('${pr.id}','rejected')">Reject</button>
          <button class="btn btn-success btn-sm" onclick="updatePRStatus('${pr.id}','approved')">Approve →</button>
        ` : '<button class="btn btn-ghost" onclick="closeModal()">Close</button>'}
      </div>
    </div>
  </div>`;
}

function updatePRStatus(id, status) {
  const pr = NEXUS.purchaseRequests.find(p => p.id === id);
  if (pr) {
    pr.status = status;
    if (typeof addActivity === 'function') addActivity(status==='approved'?'success':'danger', `${id} ${status}`, `${pr.item} has been ${status}`, 'Just now', 'Management');
  }
  closeModal();
  if (typeof showToast === 'function') showToast(`PR ${id} has been ${status}`, status === 'approved' ? 'success' : 'warning');
  if (typeof renderPurchasePanel === 'function') renderPurchasePanel();
}

/* ── VIEW IR MODAL ── */
function buildViewIRModal(ir) {
  if (!ir) return '';
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${ir.id}</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
        <div style="grid-column:1/-1"><div class="form-label">Activity</div><div style="color:var(--text);font-weight:500">${ir.activity}</div></div>
        <div><div class="form-label">Type</div><span class="badge badge-blue">${ir.type}</span></div>
        <div><div class="form-label">Status</div>${getStatusBadge(ir.status)}</div>
        <div><div class="form-label">Date</div><div style="color:var(--text)">${ir.date}</div></div>
        <div><div class="form-label">ITP Reference</div><div style="color:var(--text)">${ir.itp||'—'}</div></div>
        <div><div class="form-label">Drawing Ref</div><div style="color:var(--text)">${ir.drawingRef||'—'}</div></div>
        <div><div class="form-label">Location</div><div style="color:var(--text)">${ir.location||'—'}</div></div>
        <div><div class="form-label">Requested By</div><div style="color:var(--text)">${ir.requestedBy}</div></div>
        ${ir.result ? `<div><div class="form-label">Result</div>${getStatusBadge(ir.result.toLowerCase())}</div>` : ''}
        ${ir.reportRef ? `<div><div class="form-label">Report Ref</div><div style="color:var(--teal)">${ir.reportRef}</div></div>` : ''}
        ${ir.ncrRef ? `<div><div class="form-label">NCR Raised</div><div style="color:var(--red)">${ir.ncrRef}</div></div>` : ''}
      </div>
      <div class="modal-footer">
        ${ir.status === 'pending' || ir.status === 'scheduled' ? `
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">Close</button>
          <button class="btn btn-success btn-sm" onclick="updateIRStatus('${ir.id}','approved')">Mark Approved →</button>
        ` : '<button class="btn btn-ghost" onclick="closeModal()">Close</button>'}
      </div>
    </div>
  </div>`;
}

function updateIRStatus(id, status) {
  const ir = NEXUS.inspectionRequests.find(i => i.id === id);
  if (ir) ir.status = status;
  closeModal();
  if (typeof showToast === 'function') showToast(`IR ${id} marked as ${status}`, 'success');
  if (typeof renderQAQCPanel === 'function') renderQAQCPanel();
}

/* ── QUICK ACTION MODAL ── */
function buildQuickActionModal() {
  const actions = [
    { icon:'📋', label:'Raise Purchase Request', action:"openModal('pr-modal')", color:'var(--accent)' },
    { icon:'🔬', label:'Raise Inspection Request', action:"openModal('ir-modal')", color:'var(--green)' },
    { icon:'📤', label:'Upload Inspection Report', action:"openModal('report-upload-modal')", color:'var(--blue)' },
    { icon:'⚠️', label:'Raise NCR', action:"openModal('ncr-modal')", color:'var(--red)' },
    { icon:'⊕', label:'New Project', action:"openModal('project-modal')", color:'var(--purple)' }
  ];
  return `<div class="modal-overlay">
    <div class="modal modal-sm">
      <div class="modal-header">
        <div class="modal-title">Quick Actions</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${actions.map(a => `
          <button onclick="closeModal(); ${a.action}" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;transition:all 0.15s;width:100%" onmouseover="this.style.borderColor='${a.color}'" onmouseout="this.style.borderColor='var(--border)'">
            <span style="font-size:20px;width:28px">${a.icon}</span>
            <span style="font-size:13px;font-weight:500;color:var(--text)">${a.label}</span>
            <span style="margin-left:auto;color:var(--text3)">→</span>
          </button>
        `).join('')}
      </div>
    </div>
  </div>`;
}

/* ── VENDOR MODAL ── */
function buildVendorModal(v = {}) {
  return `<div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${v.id ? v.name : 'Add New Vendor'}</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Company Name</label><input class="form-input" id="m-v-name" value="${v.name||''}" placeholder="Full legal company name"></div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Category</label><input class="form-input" id="m-v-cat" value="${v.category||''}" placeholder="e.g. Structural Steel"></div>
        <div class="form-group"><label class="form-label">Contact Person</label><input class="form-input" id="m-v-contact" value="${v.contact||''}" placeholder="Name"></div>
      </div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="m-v-phone" value="${v.phone||''}" placeholder="+971-X-XXX-XXXX"></div>
      <div class="form-group"><label class="form-label">Pre-qualified For (comma separated)</label><input class="form-input" id="m-v-pqs" value="${v.pqs||''}" placeholder="ADNOC, TAQA, KIZAD"></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveVendor()">Save Vendor →</button>
      </div>
    </div>
  </div>`;
}

function saveVendor() {
  const name = document.getElementById('m-v-name').value;
  if (!name.trim()) { alert('Vendor name required'); return; }
  NEXUS.vendors.push({
    id: 'V00' + (NEXUS.vendors.length + 1), name,
    category: document.getElementById('m-v-cat').value,
    contact: document.getElementById('m-v-contact').value,
    phone: document.getElementById('m-v-phone').value,
    pqs: document.getElementById('m-v-pqs').value,
    onTime: 85, quality: 85, active: true, spend: 0
  });
  closeModal();
  if (typeof showToast === 'function') showToast('Vendor added successfully!', 'success');
  if (typeof renderPurchasePanel === 'function') renderPurchasePanel();
}

/* ── UPDATE ACTIVITY MODAL ── */
function buildUpdateActivityModal(act) {
  if (!act) return '';
  return `<div class="modal-overlay">
    <div class="modal modal-sm">
      <div class="modal-header">
        <div class="modal-title">Update Progress</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div style="margin-bottom:18px">
        <div class="form-label">Activity</div>
        <div style="color:var(--text);font-weight:500">${act.name}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Actual Progress (%)</label>
        <div style="display:flex;align-items:center;gap:12px">
          <input type="range" id="m-act-pct" min="0" max="100" value="${act.actual}" style="flex:1" oninput="const valSpan=document.getElementById('m-act-pct-val'); if(valSpan) valSpan.textContent=this.value+'%'">
          <span id="m-act-pct-val" style="font-family:var(--font-mono);font-size:14px;font-weight:600;color:var(--accent);min-width:40px">${act.actual}%</span>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Remarks</label><textarea class="form-textarea" id="m-act-remarks" placeholder="What was completed? Any blockers?"></textarea></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveActivity('${act.id}')">Update →</button>
      </div>
    </div>
  </div>`;
}

function saveActivity(id) {
  const act = NEXUS.activities.find(a => a.id === id);
  if (act) {
    const newPct = parseInt(document.getElementById('m-act-pct').value);
    act.actual = newPct;
    act.lastUpdated = 'Just now';
    act.status = newPct >= act.planned ? 'on-track' : newPct < act.planned - 10 ? 'behind' : 'on-track';
    if (typeof addActivity === 'function') addActivity('info', `${act.name} Updated`, `Progress updated to ${newPct}%`, 'Just now', 'Production');
  }
  closeModal();
  if (typeof showToast === 'function') showToast('Activity progress updated!', 'success');
  if (typeof renderProductionPanel === 'function') renderProductionPanel();
}

/* ── MR MODAL ── */
function buildMRModal(d = {}) {
  return `<div class="modal-overlay">
    <div class="modal modal-sm">
      <div class="modal-header">
        <div class="modal-title">Material Request</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="form-group"><label class="form-label">Item Description</label><input class="form-input" id="m-mr-item" placeholder="Material needed from store"></div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Quantity</label><input class="form-input" id="m-mr-qty" placeholder="e.g. 50 pcs"></div>
        <div class="form-group"><label class="form-label">Requested By</label>
          <select class="form-select" id="m-mr-from">
            <option>Production</option><option>QAQC</option><option>Marketing</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveMR()">Submit MR →</button>
      </div>
    </div>
  </div>`;
}

function saveMR() {
  const item = document.getElementById('m-mr-item').value;
  if (!item.trim()) { alert('Item required'); return; }
  const newId = 'MR-0' + (529 + NEXUS.materialRequests.length);
  NEXUS.materialRequests.unshift({
    id: newId, item,
    qty: document.getElementById('m-mr-qty').value,
    from: document.getElementById('m-mr-from').value,
    status: 'pending', date: new Date().toISOString().slice(0,10),
    project: NEXUS.currentProject
  });
  closeModal();
  if (typeof showToast === 'function') showToast(`${newId} submitted!`, 'success');
  if (typeof renderStorePanel === 'function') renderStorePanel();
}
