import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  progress: number;
  color?: string;
  showValue?: boolean;
  showLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'var(--accent)', 
  showValue = false,
  showLabel,
  size = 'md',
  className
}) => {
  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-6'
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || showValue) && (
        <div className="flex justify-between mb-2">
          {showLabel && <span className="text-xs font-medium text-[var(--text-muted)]">{showLabel}</span>}
          {showValue && <span className="text-xs font-semibold text-[var(--text)]">{progress}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-[#f4f4f4] rounded-full overflow-hidden", heights[size])}>
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
