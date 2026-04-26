import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface GaugeChartProps {
  value: number; // 0 to 1 or 0 to 100
  min?: number;
  max?: number;
  label: string;
  color?: string;
  target?: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, min = 0, max = 1.5, label, color = 'var(--neon)', target = 1.0 
}) => {
  // Map value to 180 degrees
  const normalizedValue = Math.min(Math.max(value, min), max);
  const data = [
    { value: normalizedValue },
    { value: max - normalizedValue }
  ];

  return (
    <div className="flex-col items-center justify-center" style={{ height: '140px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={45}
            outerRadius={65}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={normalizedValue < target ? 'var(--red)' : color} />
            <Cell fill="var(--bg4)" />
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="card-tooltip">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-0)' }}>{label}: {value.toFixed(2)}</span>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex-col items-center" style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: normalizedValue < target ? 'var(--red)' : 'var(--text-0)' }}>
          {value.toFixed(2)}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
