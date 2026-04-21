/* ══════════════════════
   NEXUS ERP — Purchase
══════════════════════ */
function renderPurchasePanel() {
  const panel = document.getElementById('panel-purchase');
  if (!panel) return;
  const openPRs = NEXUS.purchaseRequests.filter(p => p.status === 'pending');
  const poIssued = NEXUS.purchaseRequests.filter(p => p.status === 'po-issued').length;
  const delivered = NEXUS.purchaseRequests.filter(p => p.status === 'delivered').length;
  const overdue = 3;

  panel.innerHTML = `
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--amber)">
        <div class="stat-icon" style="background:rgba(245,158,11,0.12)">📋</div>
        <div class="stat-label">Open PRs</div>
        <div class="stat-value">${openPRs.length}</div>
        <div class="stat-delta delta-dn">Awaiting approval</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--teal)">
        <div class="stat-icon" style="background:var(--teal-dim)">📦</div>
        <div class="stat-label">POs Issued (MTD)</div>
        <div class="stat-value">${poIssued + 10}</div>
        <div class="stat-delta delta-up">AED 1.4M committed</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--blue)">
        <div class="stat-icon" style="background:var(--blue-dim)">🏢</div>
        <div class="stat-label">Active Vendors</div>
        <div class="stat-value">${NEXUS.vendors.length}</div>
        <div class="stat-delta delta-up">${NEXUS.vendors.filter(v=>v.pqs).length} pre-qualified</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">⚠️</div>
        <div class="stat-label">Overdue Deliveries</div>
        <div class="stat-value">${overdue}</div>
        <div class="stat-delta delta-dn">Action required</div>
      </div>
    </div>

    <div class="grid-2 gap-b">
      <!-- PR TABLE -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Purchase Requests</div><div class="card-sub">All PRs across projects</div></div>
          <button class="btn btn-primary btn-sm" onclick="openModal('pr-modal')">+ Raise PR</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>PR No.</th><th>Item</th><th>Dept</th><th>Qty</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              ${NEXUS.purchaseRequests.map(pr => `
                <tr onclick="openModal('view-pr-modal', NEXUS.purchaseRequests.find(p=>p.id==='${pr.id}'))">
                  <td class="td-main td-mono">${pr.id}</td>
                  <td>${pr.item}</td>
                  <td><span class="badge badge-gray">${pr.dept}</span></td>
                  <td>${pr.qty}</td>
                  <td>${pr.priority === 'urgent' ? '<span class="badge badge-red">Urgent</span>' : pr.priority === 'critical' ? '<span class="badge badge-red">Critical</span>' : '<span class="badge badge-gray">Normal</span>'}</td>
                  <td>${NEXUS.getStatusBadge(pr.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- VENDOR PERFORMANCE -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Vendor Performance</div></div>
          <button class="btn btn-ghost btn-sm" onclick="openModal('vendor-modal')">+ Add Vendor</button>
        </div>
        ${NEXUS.vendors.map(v => `
          <div class="vendor-card" onclick="openModal('vendor-modal', NEXUS.vendors.find(vv=>vv.id==='${v.id}'))">
            <div style="flex:1">
              <div class="vendor-name">${v.name}</div>
              <div class="vendor-cat">${v.category} · ${v.pqs ? v.pqs : 'No PQ'}</div>
            </div>
            <div style="text-align:right">
              <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:${v.onTime>=85?'var(--green)':v.onTime>=70?'var(--amber)':'var(--red)'}">${v.onTime}%</div>
              <div style="font-size:10px;color:var(--text3)">On-time</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- PO TRACKER -->
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Purchase Order Tracker</div></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>PO No.</th><th>PR Ref</th><th>Vendor</th><th>Item</th><th>Value (AED)</th><th>Delivery Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td class="td-main td-mono">PO-4412</td><td class="td-mono">PR-0812</td><td>Gulf Steel Trading LLC</td><td>Welding Wire ER70S-6</td><td class="td-mono">12,000</td><td>May 22</td><td>${NEXUS.getStatusBadge('delivered')}</td></tr>
            <tr><td class="td-main td-mono">PO-4411</td><td class="td-mono">PR-0811</td><td>Al Fajr Industrial Supply</td><td>Safety Helmets Class E</td><td class="td-mono">4,500</td><td>May 18</td><td>${NEXUS.getStatusBadge('delivered')}</td></tr>
            <tr><td class="td-main td-mono">PO-4410</td><td class="td-mono">PR-0809</td><td>Gulf Steel Trading LLC</td><td>Carbon Steel Plate 25mm</td><td class="td-mono">184,000</td><td>Jun 05</td><td>${NEXUS.getStatusBadge('po-issued')}</td></tr>
            <tr><td class="td-main td-mono">PO-4409</td><td class="td-mono">PR-0808</td><td>Techno Coatings LLC</td><td>Primer Paint EP Red Oxide</td><td class="td-mono">3,600</td><td>Jun 10</td><td><span class="badge badge-red">Overdue</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
