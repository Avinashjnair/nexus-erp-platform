import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { useShallow } from 'zustand/react/shallow';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const ClientHealthMatrix: React.FC = () => {
  const clients = useNexusStore(useShallow(state => state.clients));

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-amber-400';
      case 'High': return 'text-orange-400';
      case 'Critical': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="client-health-matrix card p-4">
      <div className="flex-between mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider">Client Health & Risk Matrix</h3>
          <p className="text-[10px] text-text-secondary">Ideal (Top-Right) vs. Toxic (Bottom-Left)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-text-secondary">IDEAL</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[10px] font-bold text-text-secondary">TOXIC</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Plot Visualization (Simplified for UI) */}
        <div className="lg:col-span-8 relative aspect-video bg-bg-main/30 rounded border border-border overflow-hidden">
          {/* Quadrant Labels */}
          <div className="absolute top-4 right-4 text-[9px] font-black text-green-500/30 uppercase">Strategic Partners</div>
          <div className="absolute top-4 left-4 text-[9px] font-black text-indigo-500/30 uppercase">Growth Potential</div>
          <div className="absolute bottom-4 left-4 text-[9px] font-black text-red-500/30 uppercase">Toxic / High Risk</div>
          <div className="absolute bottom-4 right-4 text-[9px] font-black text-amber-500/30 uppercase">Cash Cows</div>

          {/* Axes */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border/40"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border/40"></div>

          {/* Clients as Points */}
          {clients.map((client) => {
            // Mapping score to position
            const left = `${client.winRate}%`;
            const bottom = `${client.healthScore}%`;
            
            return (
              <div 
                key={client.clientId}
                className="absolute w-3 h-3 rounded-full border-2 border-bg-card shadow-lg cursor-pointer group"
                style={{ 
                  left, 
                  bottom, 
                  backgroundColor: client.healthScore > 70 ? 'var(--green)' : client.healthScore > 40 ? 'var(--amber)' : 'var(--red)',
                  transform: 'translate(-50%, 50%)'
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                  <div className="bg-bg-card border border-border p-2 rounded shadow-2xl min-w-[120px]">
                    <div className="text-[10px] font-bold">{client.clientName}</div>
                    <div className="flex-between text-[9px] mt-1">
                      <span className="text-text-secondary">Health:</span>
                      <span className="font-mono">{client.healthScore}%</span>
                    </div>
                    <div className="flex-between text-[9px]">
                      <span className="text-text-secondary">Win Rate:</span>
                      <span className="font-mono">{client.winRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-2 right-2 text-[8px] text-text-secondary italic">
            X-Axis: Win Rate | Y-Axis: Health Score
          </div>
        </div>

        {/* Client List with Details */}
        <div className="lg:col-span-4 space-y-2 overflow-y-auto max-h-[300px] pr-2">
          {clients.sort((a, b) => b.healthScore - a.healthScore).map(client => (
            <div key={client.clientId} className="p-2 rounded bg-bg-main/50 border border-border/50 hover:border-border transition-colors">
              <div className="flex-between mb-1">
                <span className="text-[11px] font-bold truncate">{client.clientName}</span>
                <span className={`text-[10px] font-black uppercase ${getRiskColor(client.riskLevel)}`}>
                  {client.riskLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-[8px] text-text-secondary uppercase">Win Rate</div>
                  <div className="text-[10px] font-mono font-bold flex items-center gap-1">
                    {client.winRate}% {client.winRate > 50 ? <TrendingUp size={10} className="text-green-500" /> : <TrendingDown size={10} className="text-red-500" />}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-text-secondary uppercase">Pay Delay</div>
                  <div className="text-[10px] font-mono font-bold flex items-center gap-1">
                    {client.avgPaymentDelay}d {client.avgPaymentDelay < 45 ? <Minus size={10} className="text-green-500" /> : <TrendingUp size={10} className="text-red-500" />}
                  </div>
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-border/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${client.healthScore > 70 ? 'bg-green-500' : client.healthScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${client.healthScore}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
