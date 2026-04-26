import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'lime' | 'ghost' | 'neon' | 'blue' | 'green' | 'red' | 'amber' | 'teal' | 'orange' | 'violet' | 'gray';
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<string, string> = {
  default: 'badge-gray',
  success: 'badge-green',
  warning: 'badge-amber',
  danger: 'badge-red',
  info: 'badge-blue',
  accent: 'badge-lime',
  lime: 'badge-lime',
  ghost: 'badge-ghost',
  neon: 'badge-neon',
  blue: 'badge-blue',
  green: 'badge-green',
  red: 'badge-red',
  amber: 'badge-amber',
  teal: 'badge-teal',
  orange: 'badge-orange',
  violet: 'badge-violet',
  gray: 'badge-gray',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  return (
    <span className={cn('badge', variantMap[variant] || `badge-${variant}`, className)}>
      {children}
    </span>
  );
};

export default Badge;
