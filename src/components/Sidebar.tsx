import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { 
  LayoutDashboard, ClipboardCheck, ShoppingCart, Factory, 
  Warehouse, TrendingUp, FileText, Workflow, PlusCircle,
  LogOut, ChevronLeft
} from 'lucide-react';
import type { RoleId } from '../types/erp';
import { ROLE_PERMISSIONS } from '../config/permissions';
import { cn } from '../lib/utils';

const Sidebar: React.FC = () => {
  const { currentRole, currentUser, setRole, logout } = useNexusStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const allNavItems = [
    { id: 'management', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
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
    <aside className={cn(
      "h-screen sticky top-0 flex flex-col bg-white/80 backdrop-blur-xl border-r border-[var(--border)] transition-all duration-300",
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-[var(--accent)] rounded-xl flex items-center justify-center text-lg font-bold">⬡</div>
            <div>
              <div className="text-sm font-display font-bold text-[var(--text)] tracking-tight">NEXUS</div>
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Intelligence</div>
            </div>
          </div>
        )}
        {isCollapsed && <div className="w-8 h-8 bg-black text-[var(--accent)] rounded-xl flex items-center justify-center text-lg font-bold mx-auto">⬡</div>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">
            Modules
          </div>
        )}
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setRole(item.id as RoleId)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all group text-left",
              currentRole === item.id 
                ? 'bg-[var(--accent)] text-black shadow-[0_4px_12px_-4px_rgba(212,255,0,0.4)] font-semibold' 
                : 'text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            )}
          >
            <span className={cn(
              currentRole === item.id ? 'text-black' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
            )}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 p-2 rounded-2xl">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0" 
            style={{ 
              background: currentUser ? `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}CC)` : '#111' 
            }}
          >
            {currentUser?.initials || '??'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text)] truncate">{currentUser?.name || 'Guest'}</div>
              <div className="text-[10px] font-medium text-[var(--text-muted)] uppercase truncate">{currentUser?.title || 'Unknown'}</div>
            </div>
          )}
          <button 
            onClick={logout}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--red)] hover:bg-[var(--red-dim)] rounded-xl transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] shadow-sm z-50 transition-transform"
        style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
      >
        <ChevronLeft size={14} />
      </button>
    </aside>
  );
};

export default Sidebar;
