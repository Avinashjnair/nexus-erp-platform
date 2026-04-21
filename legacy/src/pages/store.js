/* ══════════════════════
   NEXUS ERP — Store
══════════════════════ */
function renderStorePanel() {
  const panel = document.getElementById('panel-store');
  if (!panel) return;
  const criticalItems = NEXUS.inventory.filter(i => i.status === 'critical');
  const lowItems = NEXUS.inventory.filter(i => i.status === 'low');
  const pendingMRs = NEXUS.materialRequests.filter(m => m.status === 'pending');

  panel.innerHTML = `
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--purple)">
        <div class="stat-icon" style="background:var(--purple-dim)">📦</div>
        <div class="stat-label">Total SKUs</div>
        <div class="stat-value">${NEXUS.inventory.length}</div>
        <div class="stat-delta">Active items</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">🔴</div>
        <div class="stat-label">Critical Stock</div>
        <div class="stat-value">${criticalItems.length}</div>
        <div class="stat-delta delta-dn">Immediate reorder needed</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-dim)">📥</div>
        <div class="stat-label">Receipts (MTD)</div>
        <div class="stat-value">28</div>
        <div class="stat-delta delta-up">GRNs processed</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--accent)">
        <div class="stat-icon" style="background:var(--accent-dim)">📤</div>
        <div class="stat-label">Pending MRs</div>
        <div class="stat-value">${pendingMRs.length}</div>
        <div class="stat-delta">Awaiting issue</div>
      </div>
    </div>

    <div class="grid-2 gap-b">
      <!-- MATERIAL REQUESTS -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Material Requests</div></div>
          <button class="btn btn-primary btn-sm" onclick="openModal('mr-modal')">+ New MR</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>MR No.</th><th>Item</th><th>Qty</th><th>From</th><th>Status</th></tr></thead>
            <tbody>
              ${NEXUS.materialRequests.map(mr => \`
                <tr>
                  <td class="td-main td-mono">\${mr.id}</td>
                  <td>\${mr.item}</td>
                  <td>\${mr.qty}</td>
                  <td><span class="badge badge-gray">\${mr.from}</span></td>
                  <td>\${NEXUS.getStatusBadge(mr.status)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- LOW / CRITICAL STOCK -->
      <div class="card">
        <div class="card-header"><div class="card-title">Stock Alerts</div></div>
        ${[...criticalItems, ...lowItems].map(item => \`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;margin-bottom:8px;background:\${item.status==='critical'?'rgba(239,68,68,0.05)':'rgba(245,158,11,0.05)'};border:1px solid \${item.status==='critical'?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.2)'};border-radius:8px">
            <div>
              <div style="font-size:12px;color:var(--text);font-weight:500">\${item.desc}</div>
              <div style="font-size:10px;color:var(--text3)">Min: \${item.minStock} \${item.unit} · Current: \${item.onHand} \${item.unit} · \${item.location}</div>
            </div>
            \${NEXUS.getStatusBadge(item.status)}
          </div>
        \`).join('')}
      </div>
    </div>

    <!-- FULL INVENTORY -->
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Inventory Register</div></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>SKU</th><th>Description</th><th>Category</th><th>On Hand</th><th>Min</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            ${NEXUS.inventory.map(i => \`
              <tr>
                <td class="td-main td-mono">\${i.id}</td>
                <td>\${i.desc}</td>
                <td><span class="badge badge-gray">\${i.category}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:\${Math.min(100,(i.onHand/i.maxStock)*100)}%;background:\${i.status==='critical'?'var(--red)':i.status==='low'?'var(--amber)':'var(--green)'}"></div></div>
                    <span style="font-family:var(--font-mono);font-size:11px">\${i.onHand} \${i.unit}</span>
                  </div>
                </td>
                <td class="td-mono">\${i.minStock} \${i.unit}</td>
                <td>\${i.location}</td>
                <td>\${NEXUS.getStatusBadge(i.status)}</td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
