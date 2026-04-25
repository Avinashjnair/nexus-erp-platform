import React, { useState } from 'react';
import { 
  FileText, Download, FileUp, MessageSquare, 
  Star, Shield, ArrowLeft, Send
} from 'lucide-react';
import Badge from '../ui/Badge';

interface ProjectDetailProps {
  project: any;
  onBack: () => void;
  onSaveFeedback: (feedback: string, rating: number) => void;
}

const MarketingProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onSaveFeedback }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  return (
    <div className="page-fade-in">
      <button 
        onClick={onBack}
        className="flex-align gap-2 mb-6 text-text-tertiary hover:text-primary transition-colors uppercase text-[11px] font-bold tracking-widest"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div className="flex-between mb-8 pb-6" style={{ borderBottom: '1px solid var(--border-ghost)' }}>
        <div>
          <div className="flex-align gap-3 mb-2">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {project.title.toUpperCase()}
            </h1>
            <Badge variant="warning">PHASE: {project.phases[project.currentPhase].toUpperCase()}</Badge>
          </div>
          <p className="text-xs text-text-tertiary font-mono">
            PROJECT_ID: {project.id.toUpperCase()} | CLIENT: {project.client.toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold opacity-40 mb-1">Project Status</div>
          <div className="text-sm font-bold" style={{ color: 'var(--warning)' }}>IN PROGRESS</div>
        </div>
      </div>

      <div className="grid-2 gap-6">
        {/* Drawings & Specifications Vault */}
        <div className="card" style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-ghost)' }}>
          <div className="card-header flex-between mb-6">
            <h2 className="card-title flex-align gap-2 text-[12px] uppercase tracking-wider">
              <Shield size={16} style={{ color: 'var(--primary)' }} />
              Drawings & Specifications
            </h2>
            <button className="btn-premium" style={{ padding: '6px 12px', fontSize: '10px' }}>
              <FileUp size={12} /> UPLOAD
            </button>
          </div>
          
          <div className="flex-column gap-3">
            {[
              { name: 'Main_Blueprint_V2.dwg', size: '12.4 MB', type: 'CAD' },
              { name: 'Technical_Specs_Final.pdf', size: '2.1 MB', type: 'PDF' },
              { name: 'Structural_Analysis_Q3.xlsx', size: '840 KB', type: 'XLSX' }
            ].map((doc, i) => (
              <div key={i} className="flex-between p-3 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-ghost)' }}>
                <div className="flex-align gap-3">
                  <div className="p-2 rounded bg-bg-deep" style={{ color: 'var(--primary)' }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{doc.name}</div>
                    <div className="text-[10px] opacity-50 uppercase font-mono">{doc.type} | {doc.size}</div>
                  </div>
                </div>
                <button className="action-btn-sm">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Feedback Loop */}
        <div className="card" style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-ghost)' }}>
          <div className="card-header mb-6">
            <h2 className="card-title flex-align gap-2 text-[12px] uppercase tracking-wider">
              <MessageSquare size={16} style={{ color: 'var(--secondary)' }} />
              Customer Feedback Loop
            </h2>
          </div>

          <div className="p-5 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-ghost)' }}>
            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold opacity-40 mb-2 block tracking-widest">Active Intelligence Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      size={18} 
                      fill={s <= rating ? 'var(--primary)' : 'transparent'} 
                      stroke={s <= rating ? 'var(--primary)' : 'var(--text-tertiary)'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold opacity-40 mb-2 block tracking-widest">Intelligence Commentary</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-bg-deep border border-border-ghost rounded p-3 text-sm text-text-primary outline-none focus:border-primary transition-colors min-h-[100px]"
                placeholder="Enter client feedback, adjustments, or strategic concerns..."
              />
            </div>

            <button 
              className="btn-premium w-full justify-center"
              onClick={() => {
                onSaveFeedback(feedback, rating);
                setFeedback('');
              }}
            >
              <Send size={16} /> SAVE TRANSMISSION
            </button>
          </div>
          
          <div className="mt-4 p-3 rounded italic text-[11px] text-text-tertiary text-center opacity-60">
            Note: All feedback is timestamped and synced with the Project Lifecycle.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingProjectDetail;
