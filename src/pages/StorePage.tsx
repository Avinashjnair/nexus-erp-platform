import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import Badge from '../components/ui/Badge';
import { 
  Box, AlertTriangle, ArrowDownToLine, ArrowUpFromLine,
  ScanLine, Truck, Activity, MapPin, Navigation,
  Search, Filter, Plus
} from 'lucide-react';

const MOCK_DELIVERIES = [
  { id: 'PO-4412', vendor: 'Gulf Steel Trading', payload: '18 Tons Steel', eta: 'Arrived (Gate 2)', status: 'action' },
  { id: 'PO-4410', vendor: 'ABB Gulf FZE', payload: 'Electrical Spares', eta: 'En Route (25km)', status: 'transit' },
];

const MOCK_MOVEMENTS = [
  { id: 'MV-891', type: 'ISSUE', ref: 'MR-0527', item: 'Bolts M20×80 Gr.8.8', qty: 500, time: '10:42 AM', user: 'Rajan Pillai' },
  { id: 'MV-890', type: 'RECEIPT', ref: 'GRN-204', item: 'Safety Helmets Class E', qty: 50, time: '09:15 AM', user: 'Rajan Pillai' },
];

const StorePage: React.FC = () => {
  const store = useNexusStore();
  const inventory = store.inventory || [];
  const materialRequests = store.materialRequests || [];
  const activeStoreSection = store.activeStoreSection || 'dashboard';
  const { addToast, issueMR } = store;

  const triggerScan = () => {
    addToast('Scanner activated. Awaiting telemetry...', 'info');
  };

  const processGRN = (poId: string) => {
    addToast(`Telemetry synced. GRN generated for ${poId}.`, 'success');
  };

  const fulfillMR = (mrId: string) => {
    issueMR(mrId);
    addToast(`Material Request ${mrId} fulfilled and issued to floor.`, 'success');
  };

  const renderDashboard = () => (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      <div className="grid grid-cols-12 gap-6 min-h-[340px]">
        <div className="col-span-12 lg:col-span-8 card relative overflow-hidden flex flex-col justify-between p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--violet) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-dim blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-row justify-between items-center">
            <div>
              <div className="text-[10px] text-violet uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-violet rounded-full animate-pulse"></div>
                Live Facility Node
              </div>
              <h2 className="text-2xl font-extrabold text-white">Central Fabrication Yard</h2>
            </div>
            <button className="bg-bg-surface border border-white/10 px-4 py-2 rounded text-xs text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
              <MapPin size={14} /> View Layout
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 lg:mt-auto">
             <div>
               <div className="text-[10px] text-text-3 uppercase tracking-widest mb-2">Total Capacity</div>
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                   <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="20" cy="20" r="16" fill="none" stroke="var(--violet)" strokeWidth="4" strokeDasharray="75 100" className="drop-shadow-[0_0_8px_rgba(124,92,252,0.5)]"></circle>
                   </svg>
                   <span className="text-[10px] font-bold text-white">72%</span>
                 </div>
                 <div>
                   <div className="text-lg font-bold text-white">8,420 <span className="text-[10px] text-text-3 font-normal">m²</span></div>
                   <div className="text-xs text-violet font-mono">+120m² today</div>
                 </div>
               </div>
             </div>

             <div>
               <div className="text-[10px] text-text-3 uppercase tracking-widest mb-2">Inbound Velocity</div>
               <div className="text-2xl font-bold text-white">4.2 <span className="text-sm text-text-3 font-normal">Tons/Hr</span></div>
               <div className="text-xs text-neon font-mono mt-1 flex items-center gap-1"><ArrowDownToLine size={12}/> +0.4 vs avg</div>
             </div>

             <div>
               <div className="text-[10px] text-text-3 uppercase tracking-widest mb-2">Stock Value</div>
               <div className="text-2xl font-bold text-white">AED 1.2M</div>
               <div className="text-xs text-amber font-mono mt-1">AED 45k at risk</div>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 card p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[10px] text-red uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
            <AlertTriangle size={14} /> System Alerts
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 max-h-[200px]">
            {inventory.filter(i => i.status === 'critical').slice(0, 3).map((item, i) => (
              <div key={item.id || i} className="p-3 rounded-lg border-l-2 border-red relative overflow-hidden group cursor-pointer hover:bg-red/5 transition-all" style={{ background: 'rgba(255, 79, 110, 0.05)' }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs font-bold text-white">{item.desc}</div>
                  <div className="text-[10px] text-text-3">Just now</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger">CRITICAL</Badge>
                  <span className="text-[10px] font-mono text-text-2">{item.location}</span>
                </div>
              </div>
            ))}
            {inventory.filter(i => i.status === 'critical').length === 0 && (
              <div className="text-xs text-text-3 italic">No critical alerts</div>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-bg-surface border border-white/5 rounded text-xs text-text-3 hover:text-white transition-colors">
            View All Diagnostics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 card p-6" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2">
              <Truck size={16} className="text-amber" /> Active Logistics
            </div>
            <button onClick={triggerScan} className="bg-violet/10 text-violet border border-violet/20 px-3 py-1.5 rounded text-xs flex items-center gap-2 hover:bg-violet/20 transition-colors">
              <ScanLine size={14} /> Scan
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_DELIVERIES.map(log => (
              <div key={log.id} className="p-4 rounded-xl bg-bg-surface border border-white/5 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center border border-white/10">
                    <Navigation size={16} className={log.status === 'action' ? 'text-neon' : 'text-text-3'} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">{log.vendor}</div>
                    <div className="text-xs text-text-2 font-mono">{log.id} • {log.payload}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold mb-1 ${log.status === 'action' ? 'text-neon' : 'text-amber'}`}>{log.eta}</div>
                  {log.status === 'action' && (
                    <button onClick={() => processGRN(log.id)} className="text-[10px] uppercase font-bold text-bg-base bg-neon px-3 py-1 rounded hover:opacity-80 transition-opacity">
                      Process
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 card p-6 flex flex-col h-[300px]" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[12px] uppercase tracking-wider font-bold text-white flex items-center gap-2 mb-6">
            <Activity size={16} className="text-violet" /> Material Flow Velocity
          </div>
          
          <div className="flex-1 relative flex items-end">
            <svg viewBox="0 0 100 40" className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
              <path 
                d="M0,35 Q10,20 20,30 T40,15 T60,25 T80,10 T100,20 L100,40 L0,40 Z" 
                fill="rgba(124, 92, 252, 0.1)" 
              />
              <path 
                d="M0,35 Q10,20 20,30 T40,15 T60,25 T80,10 T100,20" 
                fill="none" 
                stroke="var(--violet)" 
                strokeWidth="1" 
              />
            </svg>

            <div className="absolute inset-0 flex justify-between items-end px-2 pb-1 text-[9px] font-mono text-text-3">
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" size={14} />
          <input 
            type="text" 
            placeholder="SEARCH SKU..."
            className="w-full bg-bg-base border border-white/10 rounded px-10 py-2.5 text-xs font-mono focus:border-violet outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center p-2.5 bg-bg-base border border-white/10 rounded hover:bg-bg-surface text-text-2">
            <Filter size={16} />
          </button>
          <button className="bg-violet text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14} /> NEW SKU</button>
        </div>
      </div>

      <div className="card overflow-hidden" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="grid grid-cols-12 gap-4 text-[10px] uppercase font-bold text-text-3 px-6 py-4 bg-bg-surface border-b border-white/5">
          <div className="col-span-2">SKU ID</div>
          <div className="col-span-4">Item Description</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Available</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {inventory.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
              <div className="col-span-2">
                <div className="text-xs font-mono font-bold text-violet">{item.id}</div>
                <div className="text-[10px] text-text-3 uppercase mt-0.5">{item.location}</div>
              </div>
              <div className="col-span-4">
                <div className="text-sm font-bold text-text-1 group-hover:text-violet transition-colors">{item.desc}</div>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase tracking-wider text-text-3 px-2 py-1 rounded bg-white/5 border border-white/5">{item.category}</span>
              </div>
              <div className="col-span-2 text-right">
                <div className="text-sm font-mono font-bold">{item.onHand}</div>
                <div className="text-[10px] text-text-3 uppercase">{item.unit}</div>
              </div>
              <div className="col-span-2 text-right">
                <Badge variant={item.status === 'critical' ? 'danger' : item.status === 'low' ? 'warning' : 'success'}>
                  {(item.status || 'ok').toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
          {inventory.length === 0 && (
            <div className="p-12 text-center text-text-3 uppercase text-xs tracking-widest">No inventory data</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="card overflow-hidden" style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {MOCK_MOVEMENTS.map(mov => (
          <div key={mov.id} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-full ${
                mov.type === 'RECEIPT' ? 'bg-neon/10 text-neon' : 'bg-violet/10 text-violet'
              }`}>
                {mov.type === 'RECEIPT' ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="text-[10px] font-bold text-text-3 uppercase">{mov.type}</span>
                  <span className="text-[10px] font-mono font-bold text-violet px-1.5 rounded bg-violet/5">{mov.ref}</span>
                </div>
                <div className="text-sm font-bold text-white">{mov.item}</div>
                <div className="text-[10px] text-text-3 mt-1 uppercase tracking-wider">Processed by {mov.user} • {mov.time}</div>
              </div>
            </div>
            <div className={`text-lg font-mono font-bold ${mov.qty > 0 ? 'text-neon' : 'text-red'}`}>
              {mov.qty > 0 ? '+' : ''}{mov.qty}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOutbound = () => (
    <div className="flex flex-col gap-4 animate-fade-in">
      {materialRequests.filter(m => m.status === 'pending').map(mr => (
        <div key={mr.id} className="card p-4 flex justify-between items-center border border-white/5 bg-bg-base group hover:border-violet/30 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center text-text-3 group-hover:text-violet group-hover:border-violet/30 transition-all">
              <Box size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-mono font-bold text-text-1">{mr.id}</span>
                <Badge variant="warning">AWAITING PICK</Badge>
              </div>
              <div className="text-sm font-bold text-white">{mr.item}</div>
              <div className="text-[10px] text-text-3 mt-1 uppercase font-bold text-violet">FROM: {mr.from}</div>
            </div>
          </div>
          <button 
            onClick={() => fulfillMR(mr.id)} 
            className="px-6 py-3 border border-violet/50 text-violet text-[10px] font-bold uppercase tracking-widest rounded hover:bg-violet hover:text-bg-base transition-all"
          >
            Fulfill & Issue
          </button>
        </div>
      ))}
      {materialRequests.filter(m => m.status === 'pending').length === 0 && (
        <div className="card p-12 text-center text-text-3 uppercase text-xs tracking-widest bg-bg-base border border-white/5">No pending requests</div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-white uppercase">
            {activeStoreSection === 'dashboard' && 'Operations Center'}
            {activeStoreSection === 'inventory' && 'Inventory Master'}
            {activeStoreSection === 'inbound'   && 'Inbound Logistics'}
            {activeStoreSection === 'outbound'  && 'Material Issues'}
            {activeStoreSection === 'audit'     && 'Telemetry Log'}
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-violet font-bold uppercase tracking-[0.2em] border border-violet/30 px-2 py-0.5 rounded">STORE CORE v4.2.0</span>
            <span className="text-[10px] text-text-3 font-mono uppercase">NODE: {activeStoreSection.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-text-3 font-mono border border-white/10 px-4 py-2 rounded bg-bg-surface flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse"></div> 
            FACILITY ONLINE
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {activeStoreSection === 'dashboard' && renderDashboard()}
        {activeStoreSection === 'inventory' && renderInventory()}
        {activeStoreSection === 'inbound'   && renderDashboard()} 
        {activeStoreSection === 'outbound'  && renderOutbound()}
        {activeStoreSection === 'audit'     && renderAudit()}
        {!['dashboard', 'inventory', 'inbound', 'outbound', 'audit'].includes(activeStoreSection) && renderDashboard()}
      </div>
    </div>
  );
};

export default StorePage;
