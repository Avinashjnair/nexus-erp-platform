import React from 'react';
import { createPortal } from 'react-dom';
import { useNexusStore } from '../../store/useNexusStore';
import ToastItem from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNexusStore();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
