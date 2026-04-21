/* ═══════════════════════════════════
   NEXUS ERP — Core Utilities
═══════════════════════════════════ */

const NEXUS_CORE = {
  /* ── TOAST NOTIFICATIONS ── */
  toastTimer: null,
  showToast(msg, type = 'info') {
    let toast = document.getElementById('nexus-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nexus-toast';
      document.body.appendChild(toast);
    }
    
    // Industrial styles
    const colors = {
      success: { bg: '#0d2e1c', border: '#10b981', color: '#10b981' },
      warning: { bg: '#2e2000', border: '#f59e0b', color: '#f59e0b' },
      danger:  { bg: '#2e0000', border: '#ef4444', color: '#ef4444' },
      info:    { bg: '#0d1e3a', border: '#3b82f6', color: '#3b82f6' }
    };
    
    const theme = colors[type] || colors.info;
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      padding: 12px 20px; border-radius: 10px; font-family: var(--font-body);
      font-size: 13px; font-weight: 500; min-width: 240px;
      background: ${theme.bg}; border: 1px solid ${theme.border}; color: ${theme.color};
      box-shadow: 0 12px 40px rgba(0,0,0,0.6);
      transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      transform: translateY(0); opacity: 1;
    `;
    
    toast.textContent = msg;
    
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
    }, 3500);
  },

  /* ── ACTIVITY LOGGING ── */
  addActivity(type, title, text, time, dept) {
    if (!NEXUS || !NEXUS.activityLog) return;
    NEXUS.activityLog.unshift({ type, title, text, time, dept });
    if (NEXUS.activityLog.length > 20) NEXUS.activityLog.pop();
    
    // Auto-refresh current view if it's the dashboard
    if (typeof showPanel === 'function' && document.querySelector('.panel-management.active')) {
        renderManagementPanel();
    }
  },

  /* ── FORMATTERS ── */
  formatCurrency(val, cur = 'AED') {
    if (typeof val !== 'number') return val;
    if (val >= 1000000) return `${cur} ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${cur} ${(val / 1000).toFixed(0)}K`;
    return `${cur} ${val.toLocaleString()}`;
  },

  getStatusBadge(status) {
    const map = {
      'pending':      '<span class="badge badge-amber">Pending</span>',
      'approved':     '<span class="badge badge-blue">Approved</span>',
      'po-issued':    '<span class="badge badge-teal">PO Issued</span>',
      'delivered':    '<span class="badge badge-green">Delivered ✓</span>',
      'rejected':     '<span class="badge badge-red">Rejected</span>',
      'on-track':     '<span class="badge badge-green">On Track</span>',
      'delayed':      '<span class="badge badge-amber">Delayed</span>',
      'near-complete':'<span class="badge badge-teal">Near Complete</span>',
      'scheduled':    '<span class="badge badge-blue">Scheduled</span>',
      'closed':       '<span class="badge badge-gray">Closed</span>',
      'open':         '<span class="badge badge-red">Open</span>',
      'in-progress':  '<span class="badge badge-blue">In Progress</span>',
      'ahead':        '<span class="badge badge-green">Ahead</span>',
      'behind':       '<span class="badge badge-red">Behind</span>',
      'pass':         '<span class="badge badge-green">Pass</span>',
      'fail':         '<span class="badge badge-red">Fail</span>'
    };
    return map[status?.toLowerCase()] || `<span class="badge badge-gray">${status || ''}</span>`;
  }
};

// Global Exposure
window.showToast = NEXUS_CORE.showToast.bind(NEXUS_CORE);
window.addActivity = NEXUS_CORE.addActivity.bind(NEXUS_CORE);
window.formatCurrency = NEXUS_CORE.formatCurrency.bind(NEXUS_CORE);
window.getStatusBadge = NEXUS_CORE.getStatusBadge.bind(NEXUS_CORE);
