import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
  className?: string;
  showValue?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'var(--accent)', 
  height = '4px',
  className = '',
  showValue = false
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`progress-container ${className}`} style={{ width: '100%' }}>
      {showValue && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color }}>{clampedProgress}%</span>
        </div>
      )}
      <div className="progress-bar" style={{ height }}>
        <div 
          className="progress-fill" 
          style={{ 
            width: `${clampedProgress}%`, 
            background: color 
          }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;
