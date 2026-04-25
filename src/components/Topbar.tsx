import React, { useState, useEffect, useRef } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { Search, Bell, Settings, Sun, Moon, Monitor, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import useGlobalSearch, { type SearchResult } from '../hooks/useGlobalSearch';
import Badge from './ui/Badge';

const Topbar: React.FC = () => {
  const { currentRole, activityLog, openModal, addToast } = useNexusStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchResults = useGlobalSearch(searchQuery);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    const map: Record<string, { title: string, bread: string }> = {
      management: { title: 'Intelligence Overview', bread: 'Management' },
      initiate:   { title: 'Project Initiation', bread: 'Projects' },
      workflow:   { title: 'Process Workflow', bread: 'Workflow' },
      marketing:  { title: 'Market Pipeline', bread: 'Marketing' },
      purchase:   { title: 'Procurement Dashboard', bread: 'Purchase' },
      qaqc:       { title: 'Quality & Compliance', bread: 'QA/QC' },
      production: { title: 'Execution Tracking', bread: 'Production' },
      store:      { title: 'Inventory Control', bread: 'Store' },
      reports:    { title: 'Data Analytics', bread: 'Reports' }
    };
    return map[currentRole] || { title: 'Nexus ERP', bread: 'Dashboard' };
  };

  const { title, bread } = getBreadcrumb();

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <header className="flex items-center justify-between mb-8 py-4">
      <div className="flex flex-col">
        <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mb-1">{bread}</div>
        <div className="text-2xl font-black text-text-primary tracking-tight">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group" ref={searchRef}>
          <div className="flex items-center gap-3 bg-surface/50 border border-border-subtle rounded-xl px-4 py-2.5 w-80 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <Search size={16} className="text-text-tertiary group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Quick command or search..." 
              className="bg-transparent border-none outline-none text-sm text-text-primary w-full placeholder:text-text-tertiary"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
            />
          </div>
        </div>

        <button 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:text-primary hover:bg-card hover:shadow-sm transition-all" 
          onClick={cycleTheme} 
          title={`Theme: ${theme}`}
        >
          {theme === 'system' ? <Monitor size={18} /> : theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button 
            className={`w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle transition-all relative ${
              showNotifications ? 'bg-card shadow-inner border-primary/30 text-primary' : 'text-text-secondary hover:text-primary hover:bg-card hover:shadow-sm'
            }`} 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {activityLog.length > 0 && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-card" />}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border-subtle rounded-2xl shadow-xl z-50 overflow-hidden animate-in">
              <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface/30">
                <h4 className="text-sm font-bold text-text-primary">Notifications</h4>
                <Badge variant="info">{activityLog.length} NEW</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {activityLog.map((item, i) => (
                  <div key={i} className="p-4 border-b border-border-subtle flex gap-3 hover:bg-surface/50 transition-colors cursor-pointer">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === 'success' ? 'bg-success/10 text-success' : 
                      item.type === 'danger' ? 'bg-error/10 text-error' : 
                      item.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      {item.type === 'success' ? <CheckCircle size={14} /> : 
                       item.type === 'danger' ? <AlertCircle size={14} /> : 
                       item.type === 'warning' ? <AlertTriangle size={14} /> : <Info size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-text-primary mb-0.5">{item.title}</div>
                      <div className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{item.text}</div>
                      <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mt-2">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-surface/30 text-center">
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All Activity</button>
              </div>
            </div>
          )}
        </div>

        <button 
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:text-primary hover:bg-card hover:shadow-sm transition-all"
          onClick={() => openModal('SETTINGS_MODAL')}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
