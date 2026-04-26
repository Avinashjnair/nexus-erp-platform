import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  /** Subtitle or detail text */
  sub?: string;
  /** Lucide icon component */
  icon?: ReactNode;
  /** CSS color variable for accent e.g. "var(--violet)" */
  accentColor?: string;
  /** CSS color variable for background e.g. "var(--violet-dim)" */
  dimColor?: string;
  /** Trend/delta object */
  trend?: {
    label: string;
    up: boolean;
  };
  /** Legacy prop support for Sprint 3 compatibility */
  delta?: string | number;
  deltaType?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon,
  accentColor = 'var(--violet)',
  dimColor,
  trend,
  delta,
  deltaType
}) => {
  const accent = accentColor;
  const dim = dimColor || `${accentColor}15`;
  
  // Normalize trend/delta
  const showTrend = trend || delta;
  const trendLabel = trend?.label || delta;
  const isUp = trend ? trend.up : deltaType === 'up';
  const isDown = trend ? !trend.up : deltaType === 'down';

  return (
    <div className="stat-card" style={{ '--stat-accent': accent } as React.CSSProperties}>
      {icon && (
        <div className="stat-icon-wrap" style={{ background: dim, color: accent }}>
          {icon}
        </div>
      )}
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-delta">
        {showTrend ? (
          <span className={isUp ? 'delta-up' : isDown ? 'delta-down' : 'delta-neu'}>
            {isUp ? '↑ ' : isDown ? '↓ ' : ''}{trendLabel}
          </span>
        ) : (
          <span className="delta-neu">{sub}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
