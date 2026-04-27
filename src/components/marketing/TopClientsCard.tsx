import React from 'react';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';

interface Client {
  name: string;
  projects: number;
  value: number;
  badge: 'success' | 'info' | 'ghost';
}

interface TopClientsCardProps {
  clients: Client[];
}

const TopClientsCard: React.FC<TopClientsCardProps> = ({ clients }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Top clients</div>
          <div className="card-sub">By total contract value</div>
        </div>
      </div>

      {clients.map(c => (
        <div key={c.name} className="vendor-card" style={{ marginBottom: '10px' }}>
          <div className="client-avatar">
            {c.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div className="vendor-name">{c.name}</div>
            <div className="vendor-cat">
              {c.projects} project{c.projects !== 1 ? 's' : ''} · {formatCurrency(c.value)}
            </div>
          </div>
          <Badge variant={c.badge}>Active</Badge>
        </div>
      ))}
    </div>
  );
};

export default TopClientsCard;
