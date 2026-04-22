import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { Toast } from '../../store/useNexusStore';

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={18} className="text-green" />;
      case 'error': return <AlertCircle size={18} className="text-red" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber" />;
      case 'info': return <Info size={18} className="text-blue" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'var(--green)';
      case 'error': return 'var(--red)';
      case 'warning': return 'var(--amber)';
      case 'info': return 'var(--blue)';
    }
  };

  return (
    <div 
      className={`toast-item ${isVisible ? 'visible' : ''}`}
      style={{ 
        borderLeft: `4px solid ${getBorderColor()}`,
      }}
    >
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        {toast.message}
      </div>
      <button 
        className="toast-close"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastItem;
