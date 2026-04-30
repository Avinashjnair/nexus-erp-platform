import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message,
  onRetry,
}) => (
  <div className="error-state">
    <div className="error-state-icon">
      <AlertTriangle size={28} strokeWidth={1.5} />
    </div>
    <div className="error-state-title">{title}</div>
    {message && <div className="error-state-msg">{message}</div>}
    {onRetry && (
      <button className="btn btn-ghost btn-sm" onClick={onRetry}>
        <RefreshCw size={14} />
        Retry
      </button>
    )}
  </div>
);

/** Compact inline error for inside table bodies. */
export const ErrorTableRow: React.FC<{ cols?: number; message?: string; onRetry?: () => void }> = ({
  cols = 5,
  message,
  onRetry,
}) => (
  <tbody>
    <tr>
      <td colSpan={cols} style={{ padding: 0, border: 'none' }}>
        <ErrorState message={message} onRetry={onRetry} />
      </td>
    </tr>
  </tbody>
);
