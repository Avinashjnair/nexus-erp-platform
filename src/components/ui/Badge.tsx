import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost';
  className?: string;
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  style 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success': 
        return 'bg-success/10 text-success border-success/20';
      case 'warning': 
        return 'bg-warning/10 text-warning border-warning/20';
      case 'danger': 
        return 'bg-error/10 text-error border-error/20';
      case 'info': 
        return 'bg-primary/10 text-primary border-primary/20';
      case 'secondary': 
        return 'bg-surface text-text-tertiary border-border-subtle';
      default: 
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <span 
      className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getVariantStyles()} ${className}`} 
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
