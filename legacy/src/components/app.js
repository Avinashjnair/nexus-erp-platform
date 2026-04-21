/* ═══════════════════════════════════
   NEXUS ERP — Central Orchestrator
═══════════════════════════════════ */

const PANELS = {
  management: { title: 'Dashboard Overview', breadcrumb: 'Management', render: typeof renderManagementPanel === 'function' ? renderManagementPanel : () => console.error('renderManagementPanel missing') },
  initiate:   { title: 'Initiate Project', breadcrumb: 'Projects', render: typeof renderInitiatePanel === 'function' ? renderInitiatePanel : () => {} },
  workflow:   { title: 'Workflow & Processes', breadcrumb: 'Workflow', render: typeof renderWorkflowPanel === 'function' ? renderWorkflowPanel : () => {} },
  marketing:  { title: 'Marketing Dashboard', breadcrumb: 'Marketing', render: typeof renderMarketingPanel === 'function' ? renderMarketingPanel : () => {} },
  purchase:   { title: 'Purchase Dashboard', breadcrumb: 'Purchase', render: typeof renderPurchasePanel === 'function' ? renderPurchasePanel : () => {} },
  qaqc:       { title: 'QA / QC Dashboard', breadcrumb: 'QA/QC', render: typeof renderQAQCPanel === 'function' ? renderQAQCPanel : () => {} },
  production: { title: 'Production Dashboard', breadcrumb: 'Production', render: typeof renderProductionPanel === 'function' ? renderProductionPanel : () => {} },
  store:      { title: 'Store Dashboard', breadcrumb: 'Store', render: typeof renderStorePanel === 'function' ? renderStorePanel : () => {} },
  reports:    { title: 'Reports & Documents', breadcrumb: 'Reports', render: typeof renderReportsPanel === 'function' ? renderReportsPanel : () => {} }
};

const NEXUS_APP = {
  selectedRole: 'management',
  
  /* ── BOOTSTRAP ── */
  init() {
    console.log('NEXUS: Bootstrapping system...');
    this.initPanels();
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    
    // Check for existing session
    const savedRole = localStorage.getItem('nexus_role');
    if (savedRole && NEXUS.roles[savedRole]) {
        this.selectedRole = savedRole;
        // Optional: auto-login if token logic exists
    }
    
    console.log('NEXUS: Ready.');
  },

  initPanels() {
    const container = document.getElementById('panels-container');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(PANELS).forEach(id => {
      const el = document.createElement('div');
      el.className = 'panel';
      el.id = `panel-${id}`;
      container.appendChild(el);
    });
  },

  setupEventListeners() {
    // Global search
    document.getElementById('global-search')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q.length > 2) {
          showToast(`Searching for "${q}"...`, 'info');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && typeof closeModal === 'function') closeModal();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    });
  },

  updateClock() {
    const el = document.getElementById('topbar-time');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-AE', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
  },

  /* ── AUTH ── */
  setRole(role, btn) {
    this.selectedRole = role;
    localStorage.setItem('nexus_role', role);
    document.querySelectorAll('.role-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  doLogin() {
    const btn = document.querySelector('.login-btn');
    const span = btn?.querySelector('span');
    if (btn) btn.disabled = true;
    if (span) span.textContent = 'Authenticating...';
    
    setTimeout(() => {
      try {
        const user = NEXUS.roles[this.selectedRole];
        if (!user) throw new Error('Invalid Role');
        
        NEXUS.currentRole = this.selectedRole;
        NEXUS.currentUser = user;

        // UI Updates
        document.getElementById('sb-avatar').textContent = user.initials;
        document.getElementById('sb-avatar').style.background = `linear-gradient(135deg, ${user.color}, ${user.color}88)`;
        document.getElementById('sb-user-name').textContent = user.name;
        document.getElementById('sb-user-role').textContent = user.title;

        // Transitions
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');

        // Route
        const target = this.selectedRole === 'management' ? 'management' : this.selectedRole;
        this.showPanel(target);
        
        if (btn) btn.disabled = false;
        if (span) span.textContent = 'Enter Platform';
        showToast(`Welcome back, ${user.name}`, 'success');
      } catch (err) {
        console.error('Login Failed:', err);
        if (btn) btn.disabled = false;
        if (span) span.textContent = 'Enter Platform';
        showToast('Login Failed. Please try again.', 'danger');
      }
    }, 800);
  },

  /* ── NAVIGATION ── */
  showPanel(name, linkEl) {
    const performSwitch = () => {
      // Deactivate current
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));

      // Activate target
      const panel = document.getElementById(`panel-${name}`);
      if (panel) {
          panel.classList.add('active');
          const config = PANELS[name];
          if (config) {
            document.getElementById('topbar-title').textContent = config.title;
            document.getElementById('topbar-breadcrumb').textContent = config.breadcrumb;
            try {
                if (typeof config.render === 'function') config.render();
            } catch (e) {
                console.error(`Render failed for panel "${name}":`, e);
                panel.innerHTML = `<div class="card" style="padding:40px; text-align:center"><h3>Error loading dashboard</h3><p>${e.message}</p></div>`;
            }
          }
      }

      // Sidebar link
      if (linkEl) {
        linkEl.classList.add('active');
      } else {
        const link = document.querySelector(`.sb-link[data-panel="${name}"]`);
        if (link) link.classList.add('active');
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => performSwitch());
    } else {
      performSwitch();
    }
  }
};

/* ── GLOBAL EXPOSURE ── */
window.setRole = NEXUS_APP.setRole.bind(NEXUS_APP);
window.doLogin = NEXUS_APP.doLogin.bind(NEXUS_APP);
window.showPanel = NEXUS_APP.showPanel.bind(NEXUS_APP);
window.toggleSidebar = () => document.getElementById('sidebar').classList.toggle('collapsed');
window.changeProject = (id) => {
    NEXUS.currentProject = id;
    showToast(`Project context switched to ${NEXUS.getProject(id).title}`, 'info');
    const activePanel = document.querySelector('.panel.active');
    if (activePanel) {
        const panelName = activePanel.id.replace('panel-', '');
        NEXUS_APP.showPanel(panelName);
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => NEXUS_APP.init());
