import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { useShallow } from 'zustand/react/shallow';
import { CheckCircle2, Clock, AlertCircle, Calculator, FileText } from 'lucide-react';
import Badge from '../ui/Badge';

interface InternalApprovalsProps {
  projectId: string;
}

export const InternalApprovals: React.FC<InternalApprovalsProps> = ({ projectId }) => {
  const approvals = useNexusStore(useShallow(state => 
    state.internalApprovals.filter(a => a.projectId === projectId)
  ));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Rejected': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="internal-approvals card p-4">
      <div className="flex-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          Pre-Bid Gate Approvals
        </h3>
        <button className="back-btn px-3 py-1 text-xs">Request Costing</button>
      </div>

      <div className="space-y-6">
        {approvals.map(approval => (
          <div key={approval.id} className="approval-stage border-l-2 border-border pl-4 relative pb-4">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg-card border-2 border-border flex items-center justify-center">
              {getStatusIcon(approval.status)}
            </div>
            
            <div className="flex-between mb-2">
              <span className="font-semibold text-sm">{approval.stage} Stage</span>
              <Badge variant={approval.status === 'Approved' ? 'success' : approval.status === 'Pending' ? 'warning' : 'danger'}>
                {approval.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="stat-mini">
                <span className="text-[10px] uppercase text-text-secondary">Assigned To</span>
                <div className="text-sm">{approval.assignedTo}</div>
              </div>
              <div className="stat-mini">
                <span className="text-[10px] uppercase text-text-secondary">Updated At</span>
                <div className="text-sm font-mono">{approval.updatedAt}</div>
              </div>
            </div>

            {approval.estimationCost && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-3 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase text-indigo-300 font-bold">Est. Project Cost</span>
                  <div className="text-lg font-mono font-bold text-indigo-400">
                    {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(approval.estimationCost)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-indigo-300 font-bold">Gross Margin</span>
                  <div className="text-lg font-mono font-bold text-green-400">
                    {approval.grossMargin}%
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-text-secondary bg-bg-main/50 p-2 rounded">
              <span className="font-semibold text-[10px] uppercase block mb-1">Remarks</span>
              "{approval.remarks}"
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/20 flex gap-3 items-center">
        <FileText className="w-8 h-8 text-neon-blue opacity-50" />
        <div>
          <span className="text-xs font-bold block">Bid Submission Readiness</span>
          <p className="text-[11px] text-text-secondary">All technical and costing gates must be approved before generating final proposal.</p>
        </div>
      </div>
    </div>
  );
};
