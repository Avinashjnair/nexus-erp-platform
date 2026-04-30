import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { 
  Factory, CalendarClock, Settings,
  AlertTriangle, CheckCircle, Wrench, HardHat, FileText
} from 'lucide-react';

const ProductionPage: React.FC = () => {
  const { activities, addToast, activeProductionSection } = useNexusStore();

  const behindActivities = (activities || []).filter(a => a.status === 'behind').length;
  const activeActivities = (activities || []).filter(a => a.status === 'in-progress' || a.status === 'ahead').length;

  const handleSubmitDPR = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Daily Production Report submitted successfully.', 'success');
  };

  const renderDashboard = () => (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        <StatCard label="Overall Efficiency (OEE)" value="88.4%" delta="Target: 85%" deltaType="up" icon={<Factory size={18} />} accentColor="var(--violet)" />
        <StatCard label="Active Workfronts" value={activeActivities} delta="Teams deployed" deltaType="neutral" icon={<HardHat size={18} />} accentColor="var(--teal)" />
        <StatCard label="Behind Schedule" value={behindActivities} delta="Requires expediting" deltaType={behindActivities > 0 ? 'down' : 'up'} icon={<AlertTriangle size={18} />} accentColor="var(--red)" />
        <StatCard label="Spools Completed" value="142" delta="This Week" deltaType="up" icon={<CheckCircle size={18} />} accentColor="var(--neon)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 card p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-6">
            <Wrench size={16} className="text-[#8b5cf6]" /> Shop Floor Workload
          </div>
          <div className="flex flex-col gap-6">
             {[
               { bay: 'Bay 1 - Heavy Structure', load: 92, color: 'var(--red)' },
               { bay: 'Bay 2 - Pipe Spooling', load: 75, color: 'var(--violet)' },
               { bay: 'Bay 3 - Exotic Welding', load: 45, color: 'var(--amber)' },
               { bay: 'Bay 4 - Painting / Blasting', load: 88, color: 'var(--teal)' },
             ].map(bay => (
               <div key={bay.bay}>
                 <div className="flex justify-between text-xs mb-2">
                   <span className="text-gray-400">{bay.bay}</span>
                   <span className="font-mono text-white">{bay.load}% Capacity</span>
                 </div>
                 <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden border border-white/5">
                   <div className="h-full rounded-full" style={{ width: `${bay.load}%`, backgroundColor: bay.color }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-4 card p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
           <div className="text-[12px] uppercase tracking-wider font-bold text-white mb-6">Quick Actions</div>
           <div className="flex flex-col gap-3">
             <button onClick={() => useNexusStore.getState().setProductionSection('dpr')} className="w-full py-3 rounded bg-[#1a1a1a] border border-white/5 text-xs text-[#8b5cf6] hover:border-[#8b5cf6] transition-colors font-bold">Log Daily Report (DPR)</button>
             <button className="w-full py-3 rounded bg-[#1a1a1a] border border-white/5 text-xs text-gray-400 hover:text-white transition-colors">Request Materials (MR)</button>
             <button className="w-full py-3 rounded bg-[#1a1a1a] border border-white/5 text-xs text-gray-400 hover:text-white transition-colors">Log Machine Breakdown</button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderGanttChart = () => {
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

    return (
      <div className="card h-full animate-fade-in" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="card-header border-b border-white/10 p-4 flex justify-between items-center">
          <div>
            <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
              <CalendarClock size={16} className="text-[#2dd4bf]" /> Master Production Schedule
            </div>
            <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Planned vs Actual Progress tracking</div>
          </div>
          <div className="flex gap-4 text-[9px] uppercase font-bold text-gray-500 tracking-wider">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#1a1a1a] border border-white/10 rounded-sm"></div> Planned</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#8b5cf6] rounded-sm"></div> Actual (On Track)</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#ef4444] rounded-sm"></div> Actual (Behind)</div>
          </div>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="flex mb-6">
              <div className="w-1/3 text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">Activity & Crew</div>
              <div className="w-2/3 flex border-b border-white/5 pb-2">
                {weeks.map(w => (
                  <div key={w} className="flex-1 text-center text-[10px] uppercase font-mono text-gray-500">{w}</div>
                ))}
              </div>
            </div>

            {/* Gantt Rows */}
            <div className="flex flex-col gap-8">
              {(activities || []).map(act => {
                const isBehind = act.actual < act.planned;
                return (
                  <div key={act.id} className="flex items-center group">
                    <div className="w-1/3 pr-6">
                      <div className="text-xs font-bold text-white mb-1 group-hover:text-[#8b5cf6] transition-colors leading-tight">{act.name}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{act.crew}</span>
                        <span className="text-[10px] font-mono text-white/80">{act.actual}% <span className="text-gray-600">/</span> {act.planned}%</span>
                      </div>
                    </div>
                    
                    <div className="w-2/3 relative h-10 border-l border-white/5 flex bg-black/10 rounded-sm">
                      {/* Grid lines */}
                      {weeks.map((_, i) => (
                        <div key={i} className="flex-1 border-r border-white/5 h-full"></div>
                      ))}
                      
                      {/* Planned Bar (Background) */}
                      <div className="absolute top-2 h-1.5 bg-[#1a1a1a] border border-white/5 rounded-full opacity-40" style={{ left: '5%', width: '85%' }}></div>
                      
                      {/* Actual Progress Bar */}
                      <div className="absolute top-5 h-2.5 rounded-full flex items-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-500" 
                        style={{ 
                          left: '5%', 
                          width: `${act.actual * 0.85}%`, 
                          backgroundColor: isBehind ? 'var(--red)' : 'var(--violet)',
                          boxShadow: isBehind ? '0 0 10px rgba(239, 68, 68, 0.2)' : '0 0 10px rgba(139, 92, 246, 0.2)'
                        }}>
                         {act.actual === 100 && <CheckCircle size={8} className="text-black ml-auto mr-1" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpoolTracker = () => {
    const MOCK_SPOOLS = [
      { id: 'SPL-441', project: 'ADNOC Platform A', iso: 'ISO-A-104', material: 'CS SCH40', size: '14"', stage: 'Painting', stages: { cut: true, fit: true, weld: true, ndt: true, paint: false } },
      { id: 'SPL-442', project: 'ADNOC Platform A', iso: 'ISO-A-105', material: 'CS SCH40', size: '14"', stage: 'NDT / Inspection', stages: { cut: true, fit: true, weld: true, ndt: false, paint: false } },
      { id: 'SPL-443', project: 'ADNOC Platform A', iso: 'ISO-A-106', material: 'SS SCH80', size: '8"', stage: 'Welding', stages: { cut: true, fit: true, weld: false, ndt: false, paint: false } },
      { id: 'SPL-444', project: 'Ruwais Expansion', iso: 'ISO-R-012', material: 'CS SCH40', size: '24"', stage: 'Fit-up', stages: { cut: true, fit: false, weld: false, ndt: false, paint: false } },
      { id: 'SPL-445', project: 'Ruwais Expansion', iso: 'ISO-R-013', material: 'CS SCH40', size: '24"', stage: 'Cutting', stages: { cut: false, fit: false, weld: false, ndt: false, paint: false } },
    ];

    return (
      <div className="card h-full animate-fade-in" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="card-header border-b border-white/5 p-4 flex justify-between items-center">
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
            <Settings size={16} className="text-[#f59e0b]" /> Fabrication Spool Tracker
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 px-3 py-1.5 rounded text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Filter: All Projects
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          {MOCK_SPOOLS.map(spool => (
            <div key={spool.id} className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 group hover:border-[#8b5cf633] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-white tracking-tight">{spool.id}</span>
                  <Badge variant="ghost">{spool.iso}</Badge>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{spool.material} • {spool.size}</span>
                </div>
                <Badge variant={spool.stage === 'Painting' ? 'success' : 'warning'}>{spool.stage.toUpperCase()}</Badge>
              </div>

              {/* Stepper Pipeline */}
              <div className="flex items-center w-full px-4 mb-2">
                {[
                  { key: 'cut', label: 'Cutting' },
                  { key: 'fit', label: 'Fit-up' },
                  { key: 'weld', label: 'Welding' },
                  { key: 'ndt', label: 'NDT/QC' },
                  { key: 'paint', label: 'Painting' }
                ].map((step, i, arr) => {
                  const isComplete = spool.stages[step.key as keyof typeof spool.stages];
                  const isNext = i > 0 && spool.stages[arr[i-1].key as keyof typeof spool.stages] && !isComplete;
                  
                  return (
                    <React.Fragment key={step.key}>
                      {/* Node */}
                      <div className="flex flex-col items-center relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-[#0a0a0a] transition-all duration-300
                          ${isComplete ? 'border-[#8b5cf6] bg-[#8b5cf61a] text-[#8b5cf6]' : isNext ? 'border-[#f59e0b] text-[#f59e0b] animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border-white/10 text-gray-600'}
                        `}>
                          {isComplete ? <CheckCircle size={12} /> : <div className="w-1 h-1 rounded-full bg-current"></div>}
                        </div>
                        <span className={`text-[8px] uppercase font-bold mt-2 absolute top-6 whitespace-nowrap tracking-tighter
                          ${isComplete ? 'text-[#8b5cf6]' : isNext ? 'text-[#f59e0b]' : 'text-gray-600'}
                        `}>{step.label}</span>
                      </div>
                      {/* Connecting Line */}
                      {i < arr.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-500 ${isComplete ? 'bg-[#8b5cf6]' : 'bg-white/5'}`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="h-6"></div> {/* Spacing for labels */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDPRForm = () => (
    <div className="card max-w-4xl mx-auto animate-fade-in" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="card-header border-b border-white/5 p-6">
        <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
          <FileText size={16} className="text-[#8b5cf6]" /> Daily Production Report (DPR)
        </div>
        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Submit end-of-shift metrics and blockers</div>
      </div>
      
      <form onSubmit={handleSubmitDPR} className="p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Date</label>
            <input type="date" className="w-full bg-[#1a1a1a] border border-white/5 rounded p-3.5 text-sm text-white focus:border-[#8b5cf6] outline-none transition-all" defaultValue={new Date().toISOString().split('T')[0]} required />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Shift & Crew</label>
            <select className="w-full bg-[#1a1a1a] border border-white/5 rounded p-3.5 text-sm text-white focus:border-[#8b5cf6] outline-none transition-all cursor-pointer" required>
              <option value="">Select Crew...</option>
              <option value="alpha">Team Alpha (Day)</option>
              <option value="beta">Team Beta (Day)</option>
              <option value="gamma">Team Gamma (Night)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Direct Manhours</label>
            <input type="number" placeholder="Total productive hours" className="w-full bg-[#1a1a1a] border border-white/5 rounded p-3.5 text-sm text-white focus:border-[#8b5cf6] outline-none transition-all" required />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Spools / Units Completed</label>
            <input type="number" placeholder="Quantity finished" className="w-full bg-[#1a1a1a] border border-white/5 rounded p-3.5 text-sm text-white focus:border-[#8b5cf6] outline-none transition-all" required />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Major Activities Accomplished</label>
          <textarea rows={4} placeholder="Describe main tasks completed during shift..." className="w-full bg-[#1a1a1a] border border-white/5 rounded p-3.5 text-sm text-white focus:border-[#8b5cf6] outline-none transition-all resize-none" required></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#f59e0b] tracking-widest mb-3">Blockers / Delays</label>
            <textarea rows={3} placeholder="E.g., Waiting on material, crane breakdown..." className="w-full bg-[#1a1a1a] border border-[#f59e0b26] rounded p-3.5 text-sm text-white focus:border-[#f59e0b] outline-none transition-all resize-none"></textarea>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#2dd4bf] tracking-widest mb-3">Safety Observations</label>
            <textarea rows={3} placeholder="Near misses, toolbox talk topics..." className="w-full bg-[#1a1a1a] border border-[#2dd4bf26] rounded p-3.5 text-sm text-white focus:border-[#2dd4bf] outline-none transition-all resize-none"></textarea>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex justify-end">
          <button type="submit" className="bg-[#8b5cf6] text-black font-extrabold uppercase tracking-[0.2em] text-[10px] px-8 py-4 rounded-md hover:bg-[#a78bfa] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            Submit DPR
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="page-fade-in">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">Production & Fabrication</h1>
          <p className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-2 uppercase tracking-[0.2em]">
             <Settings size={12} className="text-[#8b5cf6]" /> SCHEDULES, SHOP FLOOR TRACKING, AND DPR
          </p>
        </div>
        <div className="flex gap-3">
           <div className="bg-[#1a1a1a] border border-white/5 p-2 rounded flex flex-col items-end">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Efficiency</span>
              <span className="text-xs font-mono text-[#10b981]">88.4%</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {activeProductionSection === 'dashboard' && renderDashboard()}
        {activeProductionSection === 'gantt'     && renderGanttChart()}
        {activeProductionSection === 'spools'    && renderSpoolTracker()}
        {activeProductionSection === 'dpr'       && renderDPRForm()}
      </div>
    </div>
  );
};

export default ProductionPage;
