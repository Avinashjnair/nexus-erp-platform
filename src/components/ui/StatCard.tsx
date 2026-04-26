import React from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  accentColor?: string;
  delta?: string | number;
  deltaType?: 'up' | 'down' | 'neutral';
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon, 
  accentColor,
  delta,
  deltaType,
  trend,
  className
}) => {
  const dType = deltaType || trend?.type || 'neutral';
  const dVal = delta || trend?.value;

  return (
    <div className={cn(
      "bg-white rounded-[2rem] border border-[var(--border)] p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] group",
      className
    )}>
      {icon && (
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ 
            backgroundColor: accentColor ? `${accentColor}15` : 'var(--bg3)', 
            color: accentColor || 'var(--text)' 
          }}
        >
          {icon}
        </div>
      )}

      <div>
        <p className="text-xs text-[var(--text-muted)] font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-display font-semibold tracking-tight">{value}</h3>
      </div>

      {(dVal || subValue) && (
        <div className="flex items-center gap-2 mt-3">
          {dVal && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold",
              dType === 'up' ? 'text-[var(--green)]' : 
              dType === 'down' ? 'text-[var(--red)]' : 
              'text-[var(--text-muted)]'
            )}>
              <div className={cn(
                "p-1 rounded-full",
                dType === 'up' ? 'bg-[var(--accent)] text-black' : 'bg-[#f0f0f0]'
              )}>
                {dType === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
              </div>
              <span>{dVal}</span>
            </div>
          )}
          {subValue && <span className="text-xs text-[var(--text-muted)]">{subValue}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
