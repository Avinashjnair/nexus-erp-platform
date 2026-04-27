import React from 'react';
import { Trophy } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/formatters';

interface BidPerformanceCardProps {
  wonValue: number;
}

const BidPerformanceCard: React.FC<BidPerformanceCardProps> = ({ wonValue }) => {
  const performanceData = [
    { label: 'Tenders submitted', value: 8,  max: 10, color: 'var(--blue)'  },
    { label: 'Tenders won',        value: 3,  max: 8,  color: 'var(--green)' },
    { label: 'In final evaluation',value: 2,  max: 8,  color: 'var(--amber)' },
    { label: 'Under review',        value: 2,  max: 8,  color: 'var(--teal)'  },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Bid performance (YTD)</div>
        </div>
      </div>

      {performanceData.map(row => (
        <div key={row.label} className="bid-row">
          <div className="bid-row-meta">
            <span className="bid-row-label">{row.label}</span>
            <span className="bid-row-value">{row.value}</span>
          </div>
          <ProgressBar progress={(row.value / row.max) * 100} color={row.color} height="5px" />
        </div>
      ))}

      <div className="won-summary">
        <div>
          <div className="won-summary-label">
            Total won value
          </div>
          <div className="won-summary-value">
            {formatCurrency(wonValue)}
          </div>
        </div>
        <Trophy size={28} style={{ color: 'var(--green)', opacity: 0.4 }} />
      </div>
    </div>
  );
};

export default BidPerformanceCard;
