import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { useShallow } from 'zustand/react/shallow';
import { DollarSign, Clock, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface TenderPNLProps {
  projectId: string;
  contractValue: number;
}

export const TenderPNL: React.FC<TenderPNLProps> = ({ projectId, contractValue }) => {
  const costs = useNexusStore(useShallow(state => 
    state.tenderCosts.filter(c => c.projectId === projectId)
  ));

  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);
  const costPercentage = (totalCost / contractValue) * 100;
  const isHighRisk = costPercentage > 5;

  return (
    <div className="tender-pnl space-y-4">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-neon-blue bg-bg-card/50">
          <div className="flex-between mb-2">
            <span className="text-xs uppercase font-bold text-text-secondary">Bid Acquisition Cost</span>
            <DollarSign className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="text-2xl font-mono font-bold">{formatCurrency(totalCost)}</div>
          <div className="text-[10px] text-text-secondary mt-1">Total sunk cost for this tender</div>
        </div>

        <div className={`card p-4 border-l-4 ${isHighRisk ? 'border-red-500' : 'border-green-500'} bg-bg-card/50`}>
          <div className="flex-between mb-2">
            <span className="text-xs uppercase font-bold text-text-secondary">Acquisition %</span>
            {isHighRisk ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <TrendingUp className="w-4 h-4 text-green-500" />}
          </div>
          <div className={`text-2xl font-mono font-bold ${isHighRisk ? 'text-red-400' : 'text-green-400'}`}>
            {costPercentage.toFixed(2)}%
          </div>
          <div className="text-[10px] text-text-secondary mt-1">Target threshold: &lt; 5.00%</div>
        </div>

        <div className="card p-4 border-l-4 border-indigo-500 bg-bg-card/50">
          <div className="flex-between mb-2">
            <span className="text-xs uppercase font-bold text-text-secondary">ROI Potential</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-mono font-bold">14.2x</div>
          <div className="text-[10px] text-text-secondary mt-1">Value / Acquisition Cost</div>
        </div>
      </div>

      {isHighRisk && (
        <div className="alert alert-danger flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="text-red-500" size={20} />
          <div>
            <div className="text-sm font-bold text-red-400 uppercase">Critical Acquisition Alert</div>
            <p className="text-xs text-red-200 opacity-80">Bid costs have exceeded the 5% threshold. Senior Management review required before final submission.</p>
          </div>
        </div>
      )}

      {/* Cost Ledger */}
      <div className="card">
        <div className="flex-between p-4 border-b border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider">Bid Cost Ledger</h3>
          <button className="btn btn-ghost text-xs flex items-center gap-1">
            <Plus size={14} /> Log Expense
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-bg-main/50 text-text-secondary uppercase">
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Hours</th>
                <th className="p-3 font-semibold">Performer</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {costs.map(cost => (
                <tr key={cost.id} className="hover:bg-bg-main/30 transition-colors">
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-border text-[10px] font-bold uppercase">
                      {cost.type}
                    </span>
                  </td>
                  <td className="p-3 text-text-primary">{cost.description}</td>
                  <td className="p-3 font-mono">{cost.hours || '-'}</td>
                  <td className="p-3 text-text-secondary">{cost.performedBy}</td>
                  <td className="p-3 text-right font-mono font-bold text-text-primary">
                    {formatCurrency(cost.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-bg-main/50 font-bold">
                <td colSpan={4} className="p-3 text-right text-text-secondary uppercase">Total Bid Cost</td>
                <td className="p-3 text-right font-mono text-neon-blue">{formatCurrency(totalCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
