import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import Badge from '../components/ui/Badge';
import {
  Filter, Calendar, AlertTriangle,
  CheckCircle, Info, ShieldAlert, LayoutDashboard
} from 'lucide-react';

const ActivityDigestPage: React.FC = () => {
  const { activityLog } = useNexusStore();
  const [filterDept, setFilterDept] = useState<string>('All');

  // Derive active departments from the log
  const departments = ['All', ...Array.from(new Set(activityLog.map(log => log.dept)))];

  // Filter logs
  const filteredLogs = filterDept === 'All' 
    ? activityLog 
    : activityLog.filter(log => log.dept === filterDept);

  // Group filtered logs by Department for the masonry/grid view
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.dept]) acc[log.dept] = [];
    acc[log.dept].push(log);
    return acc;
  }, {} as Record<string, typeof activityLog>);

  const getIconForType = (type: string) => {
    switch(type) {
      case 'danger': return <ShieldAlert size={14} className="text-[#ef4444]" />;
      case 'warning': return <AlertTriangle size={14} className="text-[#f59e0b]" />;
      case 'success': return <CheckCircle size={14} className="text-[#10b981]" />;
      default: return <Info size={14} className="text-[#8b5cf6]" />;
    }
  };

  return (
    <div className="page-fade-in">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">Daily Operations Digest</h1>
          <p className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-2 uppercase tracking-[0.2em]">
             <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></span>
             TRAILING 24-HOUR ACTIVITY FEED
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-[#1a1a1a] border border-white/5 rounded flex items-center px-3 py-1.5">
            <Filter size={14} className="text-gray-500 mr-2" />
            <select 
              className="bg-transparent text-[11px] font-bold uppercase tracking-wider text-white outline-none cursor-pointer"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              {departments.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d.toUpperCase()}</option>)}
            </select>
          </div>
          <button className="bg-[#1a1a1a] border border-white/5 rounded px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            <Calendar size={14} /> View Archive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {Object.entries(groupedLogs).map(([dept, logs]) => (
          <div key={dept} className="card flex flex-col gap-0 overflow-hidden" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Department Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white flex items-center gap-2">
                <LayoutDashboard size={14} className="text-gray-500" /> {dept}
              </div>
              <Badge variant="ghost">{logs.length} EVENTS</Badge>
            </div>

            {/* Event Timeline */}
            <div className="p-4 flex flex-col gap-4">
              {logs.map((log, idx) => (
                <div key={idx} className="relative pl-6 group">
                  {/* Timeline connecting line */}
                  {idx !== logs.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-16px] w-px bg-white/5 group-hover:bg-[#8b5cf633] transition-colors"></div>
                  )}
                  
                  {/* Event Node */}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110">
                    {getIconForType(log.type)}
                  </div>

                  {/* Event Content */}
                  <div className="bg-[#0f0f0f] border border-transparent group-hover:border-white/5 rounded-lg p-3.5 transition-all">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-[11px] font-bold text-white leading-tight">{log.title}</div>
                      <div className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter whitespace-nowrap ml-2">{log.time}</div>
                    </div>
                    <div className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      {log.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="col-span-full h-64 flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-gray-600 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
            No activity logged for this filter in the last 24 hours.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDigestPage;
