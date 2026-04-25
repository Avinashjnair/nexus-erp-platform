import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: ReactNode;
  accentColor?: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon, 
  accentColor = 'var(--primary)',
  trend
}) => {
  return (
    <div className="bg-card p-10 rounded-3xl border border-border-subtle shadow-sm flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-1 animate-in relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: accentColor }} />
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-inner" 
        style={{ 
          backgroundColor: `${accentColor}10`, 
          color: accentColor 
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div>
        <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-3xl font-black text-text-primary tracking-tighter">{value}</div>
      </div>
      {(subValue || trend) && (
        <div className="flex items-center gap-3 mt-1">
          {trend && (
            <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
              trend.type === 'up' ? 'bg-success/10 text-success' : 
              trend.type === 'down' ? 'bg-error/10 text-error' : 
              'bg-text-tertiary/10 text-text-tertiary'
            }`}>
              {trend.type === 'up' ? '↑' : trend.type === 'down' ? '↓' : '→'} {trend.value}
            </div>
          )}
          {subValue && <span className="text-xs text-text-tertiary font-medium">{subValue}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
