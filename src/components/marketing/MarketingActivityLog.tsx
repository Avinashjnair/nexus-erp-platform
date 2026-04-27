import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { useShallow } from 'zustand/react/shallow';
import { MessageSquare, Mail, Phone, MapPin, Send, User } from 'lucide-react';

interface MarketingActivityLogProps {
  projectId: string;
}

export const MarketingActivityLog: React.FC<MarketingActivityLogProps> = ({ projectId }) => {
  const activities = useNexusStore(useShallow(state => 
    state.clientActivities.filter(a => a.projectId === projectId)
  ));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Meeting': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'Email': return <Mail className="w-4 h-4 text-blue-400" />;
      case 'Call': return <Phone className="w-4 h-4 text-amber-400" />;
      case 'Visit': return <MapPin className="w-4 h-4 text-rose-400" />;
      case 'Drawing Send': return <Send className="w-4 h-4 text-indigo-400" />;
      default: return <User className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="activity-log-container card p-4">
      <div className="flex-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Client Relationship Log (CRM)
        </h3>
        <button className="back-btn px-3 py-1 text-xs">Log Activity</button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item group">
            <div className="flex gap-3">
              <div className="mt-1 w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-neon-blue/50 transition-colors">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{activity.type}</span>
                  <span className="text-[10px] font-mono text-text-secondary">{activity.date}</span>
                </div>
                <p className="text-sm text-text-primary mb-1">{activity.description}</p>
                {activity.attendees && (
                  <div className="flex items-center gap-1.5 text-[11px] text-text-secondary italic">
                    <User className="w-3 h-3" />
                    With: {activity.attendees}
                  </div>
                )}
                <div className="mt-2 text-[10px] text-text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50"></span>
                  Logged by: {activity.performedBy}
                </div>
              </div>
            </div>
            <div className="ml-4 h-4 border-l border-border mt-1"></div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-[11px] text-text-secondary text-center italic">
          "Relationship continuity ensures higher repeat order probability."
        </div>
      </div>
    </div>
  );
};
