import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import {
  LayoutDashboard, ClipboardCheck, ShoppingCart, Factory,
  Warehouse, TrendingUp, FileText, GitBranch, PlusCircle, LogOut, ChevronLeft, ShieldCheck,
  Box, ArrowDownToLine, ArrowUpFromLine, History
} from 'lucide-react';
import type { RoleId } from '../types/erp';
import { ROLE_PERMISSIONS } from '../config/permissions';

const NAV = [
  { id: 'management', label: 'Management',  Icon: LayoutDashboard, section: 'CORE' },
  { id: 'strategic',  label: 'Strategic View', Icon: ShieldCheck,     section: 'CORE' },
  { id: 'initiate',   label: 'New Project', Icon: PlusCircle,      section: 'CORE' },
  { id: 'marketing',  label: 'Marketing',   Icon: TrendingUp,      section: 'MODULES' },
  { id: 'purchase',   label: 'Purchase',    Icon: ShoppingCart,    section: 'MODULES' },
  { id: 'qaqc',       label: 'QA / QC',     Icon: ClipboardCheck,  section: 'MODULES' },
  { id: 'production', label: 'Production',  Icon: Factory,         section: 'MODULES' },
  { id: 'store',      label: 'Store',       Icon: Warehouse,       section: 'MODULES',
    subItems: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'inventory', label: 'Inventory Master', icon: Box },
      { id: 'inbound',   label: 'Inbound (GRN)', icon: ArrowDownToLine },
      { id: 'outbound',  label: 'Outbound (Issues)', icon: ArrowUpFromLine },
      { id: 'audit',     label: 'Movement Audit', icon: History },
    ]
  },
  { id: 'workflow',   label: 'Workflow',    Icon: GitBranch,       section: 'ANALYTICS' },
  { id: 'reports',    label: 'Reports',     Icon: FileText,        section: 'ANALYTICS' },
];

const Sidebar: React.FC = () => {
  const { currentRole, currentUser, setRole, logout, activeStoreSection, setStoreSection } = useNexusStore();
  const [collapsed, setCollapsed] = useState(false);

  // Visibility is based on the user's initial role (login role)
  // If no user is logged in (e.g. testing), we default to management to see all links
  const userRole = currentUser?.role || 'management';
  const allowed = ROLE_PERMISSIONS[userRole as RoleId] || [];
  const visible = NAV.filter(n => allowed.includes(n.id as RoleId));
  const sections = ['CORE', 'MODULES', 'ANALYTICS'];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⬡</div>
        {!collapsed && (
          <div>
            <div className="sidebar-brand-name">NEXUS ERP</div>
            <div className="sidebar-brand-tagline">Industrial Platform</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {sections.map(sec => {
          const items = visible.filter(n => n.section === sec);
          if (!items.length) return null;
          return (
            <div key={sec}>
              {!collapsed && <div className="sidebar-section-label">{sec}</div>}
              {items.map(({ id, label, Icon }) => (
                <React.Fragment key={id}>
                  <button
                    className={`sidebar-link${currentRole === id ? ' active' : ''}`}
                    onClick={() => setRole(id as RoleId)}
                    title={collapsed ? label : undefined}
                  >
                    <span className="sidebar-link-icon"><Icon size={16} /></span>
                    {!collapsed && <span className="sidebar-link-text">{label}</span>}
                  </button>
                  
                  {/* Sub-items for Store */}
                  {id === 'store' && currentRole === 'store' && !collapsed && (NAV.find(n => n.id === 'store') as any).subItems && (
                    <div className="sidebar-subnav animate-fade-in" style={{ paddingLeft: '32px', marginBottom: '8px' }}>
                      {(NAV.find(n => n.id === 'store') as any).subItems.map((sub: any) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeStoreSection === sub.id;
                        return (
                          <button
                            key={sub.id}
                            className={`sidebar-sublink${isSubActive ? ' active' : ''}`}
                            onClick={() => setStoreSection(sub.id)}
                          >
                            <SubIcon size={14} opacity={isSubActive ? 1 : 0.5} />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: `linear-gradient(135deg, ${currentUser?.color || '#7c5cfc'}, ${currentUser?.color || '#7c5cfc'}99)` }}
          >
            {currentUser?.initials || '?'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{currentUser?.name || 'User'}</div>
              <div className="sidebar-user-role">{currentUser?.title || 'Guest'}</div>
            </div>
          )}
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4, borderRadius: 50, display: 'flex', transition: 'color .15s', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
      >
        <ChevronLeft size={12} />
      </button>
    </aside>
  );
};

export default Sidebar;
