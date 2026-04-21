import React, { useState, useEffect } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { Search, Bell, Clock, Settings } from 'lucide-react';

const Topbar: React.FC = () => {
  const { currentRole } = useNexusStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getBreadcrumb = () => {
    const map: Record<string, { title: string, bread: string }> = {
      management: { title: 'Dashboard Overview', bread: 'Management' },
      initiate:   { title: 'Initiate Project', bread: 'Projects' },
      workflow:   { title: 'Workflow & Processes', bread: 'Workflow' },
      marketing:  { title: 'Marketing Dashboard', bread: 'Marketing' },
      purchase:   { title: 'Purchase Dashboard', bread: 'Purchase' },
      qaqc:       { title: 'QA / QC Dashboard', bread: 'QA/QC' },
      production: { title: 'Production Dashboard', bread: 'Production' },
      store:      { title: 'Store Dashboard', bread: 'Store' },
      reports:    { title: 'Reports & Documents', bread: 'Reports' }
    };
    return map[currentRole] || { title: 'Nexus Platform', bread: 'Dashboard' };
  };

  const { title, bread } = getBreadcrumb();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">{bread}</div>
        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-center">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input type="text" className="search-input" placeholder="Search project data, docs, or entities... (Ctrl+K)" />
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-time">
          <Clock size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          {time.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
        
        <button className="icon-btn">
          <Bell size={18} />
          <span className="notif-count">3</span>
        </button>

        <button className="icon-btn">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
