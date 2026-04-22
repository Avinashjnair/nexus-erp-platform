import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  ShoppingCart, 
  Factory, 
  Warehouse, 
  TrendingUp, 
  FileText, 
  Workflow, 
  PlusCircle,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import type { RoleId } from '../types/erp';
import { ROLE_PERMISSIONS } from '../config/permissions';

const Sidebar: React.FC = () => {
  const { currentRole, currentUser, roles, projects, currentProject, setCurrentProject, setRole, logout } = useNexusStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const allNavItems = [
    { id: 'management', label: 'Management', icon: <LayoutDashboard size={18} /> },
    { id: 'qaqc', label: 'QA / QC', icon: <ClipboardCheck size={18} /> },
    { id: 'purchase', label: 'Purchase', icon: <ShoppingCart size={18} /> },
    { id: 'production', label: 'Production', icon: <Factory size={18} /> },
    { id: 'store', label: 'Store', icon: <Warehouse size={18} /> },
    { id: 'marketing', label: 'Marketing', icon: <TrendingUp size={18} /> },
    { id: 'workflow', label: 'Workflow', icon: <Workflow size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'initiate', label: 'New Project', icon: <PlusCircle size={18} /> },
  ];

  // Robust permission check: handle cases where currentUser might be rehydrated without a role property
  const effectiveRole = currentUser?.role || (Object.keys(roles) as RoleId[]).find(r => roles[r].name === currentUser?.name) || currentRole;
  const allowedModules = ROLE_PERMISSIONS[effectiveRole] || [];
  const navItems = allNavItems.filter(item => allowedModules.includes(item.id as RoleId));

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sb-logo">
          <div className="sb-logo-icon">⬡</div>
          {!isCollapsed && (
            <div>
              <div className="sb-logo-name">NEXUS ERP</div>
              <div className="sb-logo-sub">v2.5 Industrial</div>
            </div>
          )}
        </div>
        <button className="sb-collapse" onClick={() => setIsCollapsed(!isCollapsed)}>
          <ChevronLeft size={18} />
        </button>
      </div>

      {!isCollapsed && (
        <div className="sb-project-selector">
          <div className="sb-proj-label">Active Project</div>
          <select 
            className="sb-proj-select" 
            value={currentProject}
            onChange={(e) => setCurrentProject(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}

      <nav className="sb-nav">
        <div className="sb-section-label">Modules</div>
        {navItems.map(item => (
          <a 
            key={item.id} 
            className={`sb-link ${currentRole === item.id ? 'active' : ''}`}
            onClick={() => setRole(item.id as RoleId)}
          >
            <span className="sb-icon">{item.icon}</span>
            <span className="sb-text">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-user">
          <div 
            className="sb-avatar" 
            style={{ 
              background: currentUser ? `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}88)` : 'var(--accent)' 
            }}
          >
            {currentUser?.initials || '??'}
          </div>
          {!isCollapsed && (
            <div className="sb-user-info">
              <div className="sb-user-name">{currentUser?.name || 'Guest'}</div>
              <div className="sb-user-role">{currentUser?.title || 'Unknown'}</div>
            </div>
          )}
          <button className="sb-logout" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
