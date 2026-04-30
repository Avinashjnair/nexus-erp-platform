import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { useShallow } from 'zustand/react/shallow';
import { Trophy, TrendingDown } from 'lucide-react';

interface CompetitorMatrixProps {
  tenderId: string;
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({ tenderId }) => {
  const competitorBids = useNexusStore(useShallow(state => 
    state.competitorBids.filter(b => b.tenderId === tenderId)
  ));

  return (
    <div className="competitor-matrix card p-4">
      <div className="flex-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Competitor Intelligence Matrix
        </h3>
        <button className="back-btn px-3 py-1 text-xs">Log Lost Tender</button>
      </div>

      {competitorBids.length > 0 ? (
        <div className="space-y-4">
          {competitorBids.map(bid => (
            <div key={bid.id} className="bid-analysis-card border border-border/50 rounded-lg p-3 bg-bg-card/30">
              <div className="flex-between mb-2">
                <span className="font-bold text-neon-blue">{bid.competitorName}</span>
                <span className="text-sm font-mono text-text-secondary">{bid.date}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="stat-mini">
                  <span className="text-[10px] uppercase text-text-secondary">Winning Bid</span>
                  <div className="text-sm font-semibold text-green-400">
                    {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(bid.winningBid)}
                  </div>
                </div>
                <div className="stat-mini">
                  <span className="text-[10px] uppercase text-text-secondary">Loss Severity</span>
                  <div className="text-sm font-semibold text-amber-400">Competitive</div>
                </div>
              </div>

              <div className="p-2 rounded bg-red-400/10 border border-red-400/20 flex gap-2">
                <TrendingDown className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-red-400 font-semibold block mb-0.5">Primary Reason for Loss</span>
                  <p className="text-text-secondary italic">"{bid.reasonForLoss}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center opacity-50 border-2 border-dashed border-border rounded-lg">
          <TrendingDown className="w-10 h-10 mb-2" />
          <p className="text-sm">No competitor data logged for this tender.</p>
          <p className="text-xs text-text-secondary">Loss analysis helps improve future win rates.</p>
        </div>
      )}
    </div>
  );
};
