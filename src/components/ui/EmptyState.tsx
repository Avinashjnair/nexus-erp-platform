import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <Icon size={32} strokeWidth={1.2} />
    </div>
    <div className="empty-state-title">{title}</div>
    {description && <div className="empty-state-desc">{description}</div>}
    {action && <div className="empty-state-action">{action}</div>}
  </div>
);

/** Convenience wrapper for empty table bodies. */
export const EmptyTableRow: React.FC<{ cols?: number; title: string; description?: string }> = ({
  cols = 5,
  title,
  description,
}) => (
  <tbody>
    <tr>
      <td colSpan={cols} style={{ padding: 0, border: 'none' }}>
        <EmptyState title={title} description={description} />
      </td>
    </tr>
  </tbody>
);
