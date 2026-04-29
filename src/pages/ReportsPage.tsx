import React, { useState, useMemo } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { 
  BarChart3, PieChart, Activity, Filter, Calendar, 
  Download, TrendingDown, Target, ShieldAlert, DollarSign
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { projects, costVariance, quality, ncrs, projectControls, deptEfficiency, addToast } = useNexusStore();
  
  // Global Filters State
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-06-30' });

  // --- Filter Logic Simulation ---
  const filterModifier = useMemo(() => {
    let mod = 1;
    if (selectedProject !== 'all') mod *= 0.8;
    if (dateRange.from > '2025-03-01') mod *= 0.9;
    return mod;
  }, [selectedProject, dateRange]);

  const handleExport = () => {
    addToast('Compiling PDF Report... Download will begin shortly.', 'info');
  };

  // --- Custom SVG Chart Components ---

  const GaugeChart = ({ value, label, color }: { value: number, label: string, color: string }) => {
    const radius = 40;
    const circumference = Math.PI * radius; // Semi-circle
    const boundedValue = Math.min(Math.max(value, 0), 1.5); // Cap at 1.5 for SPI/CPI scale
    const percent = boundedValue / 1.5; 
    const offset = circumference - (percent * circumference);

    return (
      <div className="flex flex-col items-center group">
        <div className="relative w-32 h-20 overflow-hidden">
          {/* Background Track */}
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible drop-shadow-md">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--bg-surface)" strokeWidth="12" strokeLinecap="round" />
            {/* Value Track */}
            <path 
              d="M 10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke={color} 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
          </svg>
          <div className="absolute bottom-0 left-0 w-full text-center flex flex-col">
            <span className="text-xl font-extrabold text-white">{value.toFixed(2)}</span>
          </div>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">{label}</span>
      </div>
    );
  };

  const PassFailDonut = () => {
    const fpy = quality.fpy * filterModifier;
    const fail = 100 - fpy;
    const dashArray = `${fpy} ${fail}`;

    return (
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(40,224,160,0.1)]">
          {/* Fail Track (Red) */}
          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--red)" strokeWidth="3" opacity="0.8"></circle>
          {/* Pass Track (Green) */}
          <circle 
            cx="18" cy="18" r="15.915" 
            fill="transparent" 
            stroke="var(--neon)" 
            strokeWidth="4" 
            strokeDasharray={dashArray} 
            strokeDashoffset="25"
            className="transition-all duration-1000 ease-out"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-extrabold text-[#28e0a0] drop-shadow-[0_0_8px_rgba(40,224,160,0.4)]">{fpy.toFixed(1)}%</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-500">First Pass</span>
        </div>
      </div>
    );
  };

  return (
    <div className="page-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">Analytics Engine</h1>
          <p className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-2 uppercase tracking-widest">
             CROSS-MODULE INTELLIGENCE & REPORTING
          </p>
        </div>
        <button onClick={handleExport} className="bg-gradient-to-r from-[#7c5cfc] to-[#9b80ff] hover:from-[#6d4cf4] hover:to-[#8a6eff] text-white text-[10px] font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(124,92,252,0.2)] transition-all transform hover:scale-105 uppercase tracking-widest">
          <Download size={14} /> EXPORT REPORT
        </button>
      </div>

      {/* Global Filter Bar */}
      <div className="card p-4 mb-6 flex items-center gap-6 sticky top-4 z-20 backdrop-blur-xl" style={{ background: 'rgba(10, 10, 12, 0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 text-gray-500">
          <Filter size={16} className="text-[#7c5cfc]" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">Global Filters:</span>
        </div>
        
        <div className="flex-1 flex gap-4">
          {/* Project Selector */}
          <div className="flex-1 max-w-xs bg-[#050507] border border-white/10 rounded px-3 py-2 flex items-center focus-within:border-[#7c5cfc] transition-colors">
            <select 
              className="w-full bg-transparent text-sm text-white outline-none appearance-none cursor-pointer"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all" className="bg-[#050507]">All Active Projects (Portfolio)</option>
              {projects.map(p => <option key={p.id} value={p.id} className="bg-[#050507]">{p.title}</option>)}
            </select>
          </div>

          {/* Date Range Picker */}
          <div className="flex gap-2 items-center">
            <div className="bg-[#050507] border border-white/10 rounded px-3 py-2 flex items-center gap-2 focus-within:border-[#4facff] transition-colors">
              <Calendar size={14} className="text-gray-500" />
              <input 
                type="date" 
                className="bg-transparent text-sm text-white outline-none font-mono"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              />
            </div>
            <span className="text-gray-500 text-xs">to</span>
            <div className="bg-[#050507] border border-white/10 rounded px-3 py-2 flex items-center gap-2 focus-within:border-[#4facff] transition-colors">
              <Calendar size={14} className="text-gray-500" />
              <input 
                type="date" 
                className="bg-transparent text-sm text-white outline-none font-mono"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* 1. SPI / CPI Gauges */}
        <div className="col-span-4 card p-6 flex flex-col justify-between" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-6">
            <Target size={16} className="text-[#7c5cfc]" /> Performance Indices
          </div>
          <div className="flex justify-around w-full">
            <GaugeChart 
              value={projectControls.spi * filterModifier} 
              label="Schedule (SPI)" 
              color={(projectControls.spi * filterModifier) >= 1.0 ? 'var(--neon)' : 'var(--red)'} 
            />
            <GaugeChart 
              value={projectControls.cpi * filterModifier} 
              label="Cost (CPI)" 
              color={(projectControls.cpi * filterModifier) >= 1.0 ? 'var(--neon)' : 'var(--red)'} 
            />
          </div>
          <div className="text-[10px] text-gray-500 text-center mt-6 p-2 bg-white/[0.02] rounded border border-white/5">
            Values &lt; 1.0 indicate over-budget or behind-schedule conditions.
          </div>
        </div>

        {/* 2. Cost Variance Area Chart */}
        <div className="col-span-8 card p-6 flex flex-col" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
              <DollarSign size={16} className="text-[#f59e0b]" /> Budget vs Actual Spend
            </div>
            <div className="flex gap-4 text-[10px] uppercase font-bold text-gray-500">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/10"></div> Planned Budget</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Actual Spend</div>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[200px] flex items-end">
            {/* SVG Area Chart */}
            <svg viewBox="0 0 100 40" className="w-full h-full absolute bottom-0 drop-shadow-[0_0_12px_rgba(245,158,11,0.2)]" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient-budget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="gradient-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--amber)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              {/* Budget Path (Background) */}
              <path d="M0,40 L0,30 L25,25 L50,15 L75,10 L100,5 L100,40 Z" fill="url(#gradient-budget)" opacity="0.3" />
              <path d="M0,30 L25,25 L50,15 L75,10 L100,5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="1 1" />
              
              {/* Actual Spend Path (Foreground) */}
              <path d="M0,40 L0,35 L25,22 L50,18 L75,8 L100,2 L100,40 Z" fill="url(#gradient-actual)" opacity="0.5" className="transition-all duration-700" />
              <path d="M0,35 L25,22 L50,18 L75,8 L100,2" fill="none" stroke="var(--amber)" strokeWidth="0.8" className="transition-all duration-700" />
            </svg>
            
            {/* X-Axis Labels */}
            <div className="absolute inset-0 flex justify-between items-end px-2 pb-1 text-[9px] font-mono text-gray-500">
              {costVariance.map(cv => <span key={cv.phase}>{cv.phase}</span>)}
            </div>
          </div>
        </div>

        {/* 3. Pass/Fail Quality Donut */}
        <div className="col-span-4 card p-6 flex flex-col justify-between items-center" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
          <div className="w-full text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-4">
            <PieChart size={16} className="text-[#28e0a0]" /> First Pass Yield
          </div>
          <PassFailDonut />
          <div className="w-full grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/[0.02] border border-white/5 rounded p-3 text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Passed</div>
              <div className="text-sm font-mono font-bold text-[#28e0a0]">{(quality.fpy * filterModifier).toFixed(1)}%</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded p-3 text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Rework</div>
              <div className="text-sm font-mono font-bold text-[#ff4f6e]">{((100 - quality.fpy) * filterModifier).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* 4. NCR Trend Chart (CSS Bar Chart) */}
        <div className="col-span-4 card p-6 flex flex-col" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-[#ff4f6e]" /> NCR Frequency Trend
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-32 mt-4">
            {quality.ncrResolution.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  className="w-full bg-[#ff4f6e]/20 hover:bg-[#ff4f6e] transition-colors rounded-t cursor-pointer border border-[#ff4f6e]/30 border-b-0"
                  style={{ height: `${(data.days * filterModifier) * 4}px`, minHeight: '10px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0a0a0c] border border-white/10 px-2 py-1 text-[10px] font-mono text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                    {Math.round(data.days * filterModifier)} NCRs
                  </div>
                </div>
                <div className="text-[9px] text-gray-500 uppercase font-bold">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Department Efficiency (Radar / Multi-Bar Variant) */}
        <div className="col-span-4 card p-6 flex flex-col" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-6">
            <Activity size={16} className="text-[#4facff]" /> Dept Efficiency Matrix
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {deptEfficiency.slice(0,4).map((dept, idx) => (
              <div key={dept.name} className="group">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400 group-hover:text-white transition-colors font-bold">{dept.name}</span>
                  <span className="font-mono text-white">{(dept.utilization * filterModifier).toFixed(0)}% Utilized</span>
                </div>
                <div className="w-full bg-white/[0.02] rounded-full h-2 overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${dept.utilization * filterModifier}%`, 
                      backgroundColor: ['#7c5cfc', '#f59e0b', '#ff4f6e', '#28e0a0'][idx] 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;
