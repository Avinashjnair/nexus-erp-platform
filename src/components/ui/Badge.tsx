import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'lime';
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
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  return (
    <span className={cn('badge', variantMap[variant] || 'badge-gray', className)}>
      {children}
    </span>
  );
};

export default Badge;
