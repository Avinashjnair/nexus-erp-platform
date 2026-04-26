import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { User, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Topbar: React.FC = () => {
  const { currentRole, currentUser } = useNexusStore();
  const { setTheme, resolvedTheme } = useTheme();

  const getBreadcrumb = () => {
    const map: Record<string, { title: string }> = {
      management: { title: 'Dashboard' },
      initiate:   { title: 'New Project' },
      workflow:   { title: 'Workflow' },
      marketing:  { title: 'Marketing' },
      purchase:   { title: 'Purchase' },
      qaqc:       { title: 'Quality Control' },
      production: { title: 'Production' },
      store:      { title: 'Inventory' },
      reports:    { title: 'Reports' }
    };
    return map[currentRole] || { title: 'Dashboard' };
  };

  const { title } = getBreadcrumb();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 flex items-center justify-between z-10 shrink-0 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--text)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <circle cx="12" cy="12" r="10"/>
            <path d="m4.93 4.93 4.24 4.24"/>
            <path d="m14.83 9.17 4.24-4.24"/>
            <path d="m14.83 14.83 4.24 4.24"/>
            <path d="m9.17 14.83-4.24 4.24"/>
          </svg>
        </div>
        <h1 className="text-xl font-display font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Switch */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-[var(--border)] text-xs font-semibold hover:shadow-md transition-all"
        >
          {resolvedTheme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Period Toggle */}
        <div className="hidden md:flex gap-1 p-1 bg-white rounded-full shadow-sm border border-[var(--border)]">
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-black shadow-sm">Monthly</button>
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--text-muted)] hover:text-black transition-colors">Daily</button>
        </div>
        
        {/* User Avatar */}
        <div 
          className="w-10 h-10 rounded-full shadow-sm border border-[var(--border)] flex items-center justify-center overflow-hidden cursor-pointer text-sm font-bold text-white"
          style={{ background: currentUser ? `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}CC)` : '#111' }}
        >
          {currentUser?.initials || <User className="w-5 h-5 text-[var(--text-muted)]" />}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
