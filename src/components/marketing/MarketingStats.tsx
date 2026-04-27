import React from 'react';
import { TrendingUp, Trophy, DollarSign, Clock } from 'lucide-react';
import StatCard from '../ui/StatCard';
import { formatCurrency } from '../../utils/formatters';
import type { Tender } from '../../types/erp';

interface MarketingStatsProps {
  activeCount: number;
  pipelineValue: number;
  closingSoonCount: number;
}

const MarketingStats: React.FC<MarketingStatsProps> = ({ activeCount, pipelineValue, closingSoonCount }) => {
  return (
    <div className="stats-grid gap-b">
      <StatCard
        label="Active Tenders"
        value={activeCount}
        delta="↑ 2 submitted this month"
        deltaType="up"
        icon={<TrendingUp size={18} />}
        accentColor="var(--blue)"
      />
      <StatCard
        label="Win Rate"
        value="38%"
        delta="↑ 5% vs last quarter"
        deltaType="up"
        icon={<Trophy size={18} />}
        accentColor="var(--green)"
      />
      <StatCard
        label="Pipeline Value"
        value={formatCurrency(pipelineValue)}
        delta={`${activeCount} bids active`}
        deltaType="neutral"
        icon={<DollarSign size={18} />}
        accentColor="var(--accent)"
      />
      <StatCard
        label="Closing Soon"
        value={closingSoonCount}
        delta="Within 14 days"
        deltaType={closingSoonCount > 0 ? 'down' : 'neutral'}
        icon={<Clock size={18} />}
        accentColor="var(--red)"
      />
    </div>
  );
};

export default MarketingStats;
