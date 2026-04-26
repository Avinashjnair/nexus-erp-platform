import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  /** Height as CSS string e.g. "6px" OR as number (treated as px) */
  height?: string | number;
  className?: string;
  showValue?: boolean;
  /** Alias for showValue — some pages use showLabel */
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'var(--accent)',
  height = '6px',
  className = '',
  showValue = false,
  showLabel = false,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const heightStr = typeof height === 'number' ? `${height}px` : height;
  const shouldShowValue = showValue || showLabel;

  return (
    <div className={`progress-container ${className}`} style={{ width: '100%' }}>
      {shouldShowValue && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color }}>{clampedProgress}%</span>
        </div>
      )}
      <div className="progress-bar" style={{ height: heightStr }}>
        <div
          className="progress-fill"
          style={{ width: `${clampedProgress}%`, background: color }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
