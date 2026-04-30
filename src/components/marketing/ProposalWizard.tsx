import React, { useState } from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { FileText, CheckCircle2, AlertCircle, Clock, Download, Send } from 'lucide-react';
import Badge from '../ui/Badge';

interface ProposalWizardProps {
  projectId: string;
}

export const ProposalWizard: React.FC<ProposalWizardProps> = ({ projectId }) => {
  const [_activeStep, _setActiveStep] = useState(1);
  const [mappings, _setMappings] = useState([
    { id: 'm1', name: 'Technical Scope', source: 'Engineering', status: 'mapped', data: '12-Page Fabrication Spec' },
    { id: 'm2', name: 'Commercial Estimation', source: 'Engineering', status: 'mapped', data: 'AED 18.4M Total' },
    { id: 'm3', name: 'Legal Terms & Conditions', source: 'Legal', status: 'pending' },
    { id: 'm4', name: 'Client Profile & Site Data', source: 'CRM', status: 'mapped', data: 'ADNOC Offshore Ph A' },
    { id: 'm5', name: 'Payment Milestones', source: 'Finance', status: 'pending' },
  ]);

  const generateProposal = useNexusStore(state => state.generateProposal);

  const allMapped = mappings.every(m => m.status === 'mapped');

  return (
    <div className="proposal-wizard grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
      {/* Left Column: Data Mapping Checklist */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="card flex-1 flex flex-col">
          <div className="card-header border-b border-border">
            <div className="flex-between w-full">
              <div>
                <h3 className="text-sm font-bold uppercase">Proposal Assembler</h3>
                <p className="text-[10px] text-text-secondary">Syncing departmental data modules</p>
              </div>
              <Badge variant={allMapped ? 'success' : 'warning'}>
                {mappings.filter(m => m.status === 'mapped').length}/{mappings.length} Ready
              </Badge>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {mappings.map(m => (
              <div key={m.id} className={`p-3 rounded-lg border transition-all ${m.status === 'mapped' ? 'bg-bg-card/50 border-green-500/20' : 'bg-bg-main/50 border-border'}`}>
                <div className="flex-between mb-1">
                  <div className="flex items-center gap-2">
                    {m.status === 'mapped' ? <CheckCircle2 size={14} className="text-green-500" /> : <Clock size={14} className="text-amber-500" />}
                    <span className="text-xs font-semibold">{m.name}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary px-1.5 py-0.5 bg-bg-main rounded">
                    {m.source}
                  </span>
                </div>
                {m.status === 'mapped' ? (
                  <div className="text-[11px] text-text-secondary ml-6 italic">
                    Source: {m.data}
                  </div>
                ) : (
                  <div className="flex-between ml-6 mt-1">
                    <span className="text-[10px] text-amber-500 flex items-center gap-1">
                      <AlertCircle size={10} /> Awaiting manual mapping
                    </span>
                    <button className="text-[10px] text-neon-blue font-bold hover:underline">Sync Module</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-bg-main/30">
            <button 
              className={`btn w-full flex items-center justify-center gap-2 ${allMapped ? 'btn-primary' : 'bg-border text-text-secondary cursor-not-allowed'}`}
              disabled={!allMapped}
              onClick={() => generateProposal(projectId)}
            >
              <FileText size={14} /> Generate Master Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview Pane */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="card flex-1 bg-bg-main/50 border-dashed border-2 border-border flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest opacity-50">
            <FileText size={14} /> Live PDF Preview
          </div>
          
          <div className="w-[80%] aspect-[1/1.414] bg-white rounded shadow-2xl p-8 flex flex-col gap-4 transform hover:scale-105 transition-transform duration-500 cursor-zoom-in">
             {/* Simulated PDF Content */}
             <div className="w-16 h-16 bg-indigo-600 self-end opacity-20"></div>
             <div className="h-1 bg-gray-200 w-1/2"></div>
             <div className="h-1 bg-gray-200 w-full"></div>
             <div className="h-8 bg-gray-100 w-full mt-8 flex items-center px-4 text-[10px] text-gray-400">ADNOC OFFSHORE PLATFORM A</div>
             <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="space-y-2">
                   <div className="h-0.5 bg-gray-200 w-full"></div>
                   <div className="h-0.5 bg-gray-200 w-full"></div>
                   <div className="h-0.5 bg-gray-200 w-full"></div>
                </div>
                <div className="space-y-2">
                   <div className="h-0.5 bg-gray-200 w-full"></div>
                   <div className="h-0.5 bg-gray-200 w-full"></div>
                   <div className="h-0.5 bg-gray-200 w-full"></div>
                </div>
             </div>
             <div className="mt-auto pt-8 border-t border-gray-100 flex-between">
                <div className="text-[8px] text-gray-300">CONFIDENTIAL · VELTRIX ERP GEN</div>
                <div className="text-[8px] text-gray-300 font-bold">PAGE 1 OF 32</div>
             </div>
          </div>

          <div className="absolute bottom-6 flex gap-2">
            <button className="bg-bg-card/80 backdrop-blur px-4 py-2 rounded-full border border-border flex items-center gap-2 text-xs font-bold hover:bg-bg-card transition-colors">
              <Download size={14} /> Download Draft
            </button>
            <button className="bg-indigo-600/80 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/50 flex items-center gap-2 text-xs font-bold hover:bg-indigo-600 transition-colors">
              <Send size={14} /> Send for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
