import React, { useState, useEffect, useRef } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { Search, Bell, Clock, Settings, Folder, Package, ClipboardCheck, Users } from 'lucide-react';
import useGlobalSearch from '../hooks/useGlobalSearch';
import type { SearchResult } from '../hooks/useGlobalSearch';

const Topbar: React.FC = () => {
  const { currentRole, addToast } = useNexusStore();
  const [time, setTime] = useState(new Date());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchResults = useGlobalSearch(searchQuery);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    addToast(`Navigating to ${result.type}: ${result.title}`, 'info');
    setSearchQuery('');
    setShowResults(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project': return <Folder size={14} style={{ color: 'var(--blue)' }} />;
      case 'pr': return <Package size={14} style={{ color: 'var(--amber)' }} />;
      case 'ir': return <ClipboardCheck size={14} style={{ color: 'var(--green)' }} />;
      case 'vendor': return <Users size={14} style={{ color: '#8b5cf6' }} />;
      default: return <Search size={14} />;
    }
  };
// ... rest of breadcrumb logic kept ...

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
        <div className="search-container" ref={searchRef}>
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search anything... (Ctrl+K)" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
          </div>

          {showResults && searchQuery.length >= 2 && (
            <div className="search-results-dropdown">
              {searchResults.all.length > 0 ? (
                searchResults.all.map((res) => (
                  <div 
                    key={`${res.type}-${res.id}`} 
                    className="search-result-item"
                    onClick={() => handleResultClick(res)}
                  >
                    <div className="res-icon-circle">
                      {getResultIcon(res.type)}
                    </div>
                    <div className="res-info">
                      <div className="res-title">{res.title}</div>
                      <div className="res-sub">{res.sub}</div>
                    </div>
                    <div className="res-tag">{res.type.toUpperCase()}</div>
                  </div>
                ))
              ) : (
                <div className="search-no-results">
                  No matches for "{searchQuery}"
                </div>
              )}
            </div>
          )}
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
