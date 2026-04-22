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
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'badge-secondary';
      case 'success': return 'badge-green';
      case 'warning': return 'badge-amber';
      case 'danger': return 'badge-red';
      case 'info': return 'badge-blue';
      case 'ghost': return 'badge-ghost';
      default: return 'badge-primary';
    }
  };

  return (
    <span 
      className={`badge ${getVariantClass()} ${className}`} 
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
