/* ════════════════════════
   NEXUS ERP — Marketing
════════════════════════ */
function renderMarketingPanel() {
  const panel = document.getElementById('panel-marketing');
  if (!panel) return;
  const active = NEXUS.tenders.filter(t => t.status==='drafting'||t.status==='submitted');
  const won = NEXUS.tenders.filter(t => t.status==='won');
  const pipeline = NEXUS.tenders.reduce((s,t) => s + (t.status==='drafting'||t.status==='submitted' ? t.value : 0), 0);
  const statusBadge = { drafting:'badge-gray', submitted:'badge-blue', won:'badge-green', lost:'badge-red' };

  panel.innerHTML = `
    <div class="stats-grid gap-b">
      <div class="stat-card" style="--accent-color:var(--blue)">
        <div class="stat-icon" style="background:var(--blue-dim)">📄</div>
        <div class="stat-label">Active Tenders</div>
        <div class="stat-value">${active.length}</div>
        <div class="stat-delta delta-up">↑ 2 submitted this month</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-dim)">🏆</div>
        <div class="stat-label">Win Rate</div>
        <div class="stat-value">38%</div>
        <div class="stat-delta delta-up">↑ 5% vs last quarter</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--accent)">
        <div class="stat-icon" style="background:var(--accent-dim)">💰</div>
        <div class="stat-label">Pipeline Value</div>
        <div class="stat-value">${NEXUS.formatCurrency(pipeline)}</div>
        <div class="stat-delta">${active.length} bids active</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-dim)">⏰</div>
        <div class="stat-label">Closing Soon</div>
        <div class="stat-value">2</div>
        <div class="stat-delta delta-dn">Within 2 weeks</div>
      </div>
    </div>

    <div class="card gap-b">
      <div class="card-header">
        <div><div class="card-title">Tender Pipeline</div><div class="card-sub">Track bid status and deadlines</div></div>
        <button class="btn btn-primary btn-sm" onclick="addTender()">+ New Bid</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Ref</th><th>Client</th><th>Description</th><th>Value (AED)</th><th>Deadline</th><th>Probability</th><th>Status</th></tr></thead>
          <tbody>
            ${NEXUS.tenders.map(t => `
              <tr>
                <td class="td-main td-mono">${t.id}</td>
                <td>${t.client}</td>
                <td>${t.title}</td>
                <td class="td-mono">${NEXUS.formatCurrency(t.value)}</td>
                <td>${t.deadline}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;min-width:80px">
                    <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${t.probability}%;background:var(--blue)"></div></div>
                    <span style="font-size:11px;color:var(--text3)">${t.probability}%</span>
                  </div>
                </td>
                <td><span class="badge ${statusBadge[t.status]||'badge-gray'}">${t.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Bid Performance</div></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { label:'Tenders Submitted (YTD)', value: 8, max: 10, color: 'var(--blue)' },
            { label:'Tenders Won (YTD)', value: 3, max: 8, color: 'var(--green)' },
            { label:'Value Won (AED)', value: 'AED 8.7M', max: null, color: null }
          ].map(item => `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
                <span style="color:var(--text2)">${item.label}</span>
                <span style="color:var(--text);font-weight:600">${item.max ? item.value : item.value}</span>
              </div>
              ${item.max ? `<div class="progress-bar"><div class="progress-fill" style="width:${(item.value/item.max)*100}%;background:${item.color}"></div></div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Top Clients</div></div>
        ${[
          { name:'ADNOC Offshore', projects:3, value:'AED 34.1M', badge:'badge-green' },
          { name:'TAQA Arabia', projects:1, value:'AED 9.2M', badge:'badge-blue' },
          { name:'KIZAD Authority', projects:2, value:'AED 9.1M', badge:'badge-teal' }
        ].map(c => `
          <div class="vendor-card">
            <div style="flex:1">
              <div class="vendor-name">${c.name}</div>
              <div class="vendor-cat">${c.projects} project${c.projects>1?'s':''} · ${c.value}</div>
            </div>
            <span class="badge ${c.badge}">Active</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function addTender() {
  showToast('Tender creation form coming soon', 'info');
}
