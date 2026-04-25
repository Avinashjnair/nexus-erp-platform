import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md' 
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-5xl' : 'max-w-2xl';

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[1000] animate-in" onClick={onClose}>
      <div 
        className={`bg-card w-full ${sizeClasses} mx-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface/30">
          <h2 className="text-xl font-black text-text-primary tracking-tight">{title}</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-text-secondary hover:bg-error/10 hover:text-error transition-colors" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-border-subtle flex justify-end gap-4 bg-surface/30">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
