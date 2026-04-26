import React, { useState, useRef, useEffect } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { Search, Bell, Settings, Sun, Moon, Monitor, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const META: Record<string, { bread: string; title: string }> = {
  management: { bread: 'Management',  title: 'Dashboard Overview' },
  initiate:   { bread: 'Projects',    title: 'Initiate New Project' },
  workflow:   { bread: 'Workflow',    title: 'Process & Workflow' },
  marketing:  { bread: 'Marketing',   title: 'Market Intelligence' },
  purchase:   { bread: 'Purchase',    title: 'Procurement Control' },
  qaqc:       { bread: 'QA / QC',     title: 'Quality & Compliance' },
  production: { bread: 'Production',  title: 'Execution Tracking' },
  store:      { bread: 'Store',       title: 'Inventory Control' },
  reports:    { bread: 'Reports',     title: 'Data & Analytics' },
  strategic:  { bread: 'Boardroom',   title: 'Strategic Oversight' },
};

const Topbar: React.FC = () => {
  const { currentRole, notifications, markAsRead, openModal } = useNexusStore();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const { bread, title } = META[currentRole] || { bread: 'NEXUS', title: 'Dashboard' };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const typeIcon = (type: string) => {
    if (type === 'success') return <CheckCircle size={13} color="var(--neon)" />;
    if (type === 'danger')  return <AlertCircle size={13}  color="var(--red)" />;
    if (type === 'warning') return <AlertTriangle size={13} color="var(--amber)" />;
    return <Info size={13} color="var(--blue)" />;
  };

  return (
    <header className="topbar">
      <div style={{ marginRight: 20 }}>
        <div className="topbar-breadcrumb">{bread}</div>
        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-search">
        <Search size={14} color="var(--text-3)" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects, PRs, IRs…"
        />
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" onClick={cycleTheme} title={`Theme: ${theme}`}>
          {theme === 'system' ? <Monitor size={15} /> : theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button className="topbar-icon-btn" onClick={() => openModal('SETTINGS_MODAL')}>
          <Settings size={15} />
        </button>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className={`topbar-icon-btn${showNotif ? ' active' : ''}`}
            onClick={() => setShowNotif(!showNotif)}
          >
            <Bell size={15} />
            {unreadCount > 0 && <span className="notif-badge" />}
          </button>

          {showNotif && (
            <div className="notif-panel">
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-0)' }}>Neural Intelligence Feed</span>
                <button className="btn-link-sm" onClick={() => notifications.forEach(n => markAsRead(n.id))}>Mark all as read</button>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-3)', fontSize: 11 }}>No active alerts</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notif-item${n.read ? ' read' : ''}`} onClick={() => markAsRead(n.id)}>
                      <div className="notif-item-title">{typeIcon(n.type)}{n.title}</div>
                      <div className="notif-item-text">{n.text}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
