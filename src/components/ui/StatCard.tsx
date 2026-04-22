import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  accentColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  delta, 
  deltaType = 'neutral', 
  icon, 
  accentColor 
}) => {
  const getDeltaClass = () => {
    if (deltaType === 'up') return 'delta-up';
    if (deltaType === 'down') return 'delta-dn';
    return '';
  };

  return (
    <div className="stat-card" style={{ '--accent-color': accentColor } as any}>
      <div 
        className="stat-icon" 
        style={{ 
          background: `${accentColor}20`, // 20 hex is ~12% opacity
          color: accentColor 
        }}
      >
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {delta && (
        <div className={`stat-delta ${getDeltaClass()}`}>
          {delta}
        </div>
      )}
    </div>
  );
};

export default StatCard;
