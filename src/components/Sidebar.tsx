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
  ChevronLeft,
  Search
} from 'lucide-react';
import type { RoleId } from '../types/erp';
import { ROLE_PERMISSIONS } from '../config/permissions';

const Sidebar: React.FC = () => {
  const { currentRole, currentUser, roles, setRole, logout } = useNexusStore();
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

  const effectiveRole = currentUser?.role || currentRole;
  const allowedModules = ROLE_PERMISSIONS[effectiveRole as RoleId] || [];
  const navItems = allNavItems.filter(item => allowedModules.includes(item.id as RoleId));

  return (
    <aside className={`h-screen sticky top-0 flex flex-col bg-card/80 backdrop-blur-xl border-r border-border-subtle transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="text-2xl text-primary font-black tracking-tighter">⬡</div>
            <div>
              <div className="text-sm font-black text-text-primary tracking-tight">NEXUS</div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Intelligence</div>
            </div>
          </div>
        )}
        {isCollapsed && <div className="text-2xl text-primary font-black mx-auto">⬡</div>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-4">
            Intelligence Modules
          </div>
        )}
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setRole(item.id as RoleId)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              currentRole === item.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-text-secondary hover:bg-primary-dim hover:text-primary'
            }`}
          >
            <span className={`${currentRole === item.id ? 'text-white' : 'text-text-tertiary group-hover:text-primary'}`}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="text-sm font-semibold tracking-tight">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle bg-surface/30">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner" 
            style={{ 
              background: currentUser ? `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}CC)` : 'var(--primary)' 
            }}
          >
            {currentUser?.initials || '??'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-text-primary truncate">{currentUser?.name || 'Guest'}</div>
              <div className="text-[10px] font-medium text-text-tertiary uppercase truncate">{currentUser?.title || 'Unknown'}</div>
            </div>
          )}
          <button 
            onClick={logout}
            className="p-2 text-text-tertiary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border-subtle rounded-full flex items-center justify-center text-text-tertiary hover:text-primary shadow-sm z-50 transition-transform"
        style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
      >
        <ChevronLeft size={14} />
      </button>
    </aside>
  );
};

export default Sidebar;
