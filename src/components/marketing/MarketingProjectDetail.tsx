import React, { useState } from 'react';
import {
  MessageSquare, Star, Shield,
  ArrowLeft, Send, Trophy, Calculator, Activity,
  DollarSign, FileText
} from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';
import { useShallow } from 'zustand/react/shallow';
import type { Project } from '../../types/erp';
import DocumentHistoryList from './DocumentHistoryList';
import { CompetitorMatrix } from './CompetitorMatrix';
import { InternalApprovals } from './InternalApprovals';
import { MarketingActivityLog } from './MarketingActivityLog';
import { TenderPNL } from './TenderPNL';
import { ProposalWizard } from './ProposalWizard';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onSaveFeedback: (feedback: string, rating: number) => void;
}

const MarketingProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onSaveFeedback }) => {
  const { projectDocuments } = useNexusStore(useShallow(state => ({
    projectDocuments: state.projectDocuments
  })));
  const [feedback, setFeedback] = useState('');
  const [rating, setRating]     = useState(5);
  const [activeTab, setActiveTab] = useState<'overview' | 'competitor' | 'approvals' | 'pnl' | 'proposal'>('overview');

  return (
    <div className="page-fade-in">

      {/* Back nav */}
      <button
        onClick={onBack}
        className="back-btn"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Project header */}
      <div className="proj-header">
        <div>
          <div className="proj-title-row">
            <h1 className="proj-title">
              {project.title.toUpperCase()}
            </h1>
            <span className="badge badge-amber">
              PHASE: {project.phases[project.currentPhase]?.toUpperCase()}
            </span>
          </div>
          <p className="proj-meta">
            PROJECT_ID: {project.id.toUpperCase()} | CLIENT: {project.client.toUpperCase()}
          </p>
        </div>
        <div className="proj-status-block">
          <div className="proj-status-label">
            Project Status
          </div>
          <div className="proj-status-value">IN PROGRESS</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button 
          className={`pb-2 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'overview' ? 'text-neon-blue' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('overview')}
        >
          <div className="flex items-center gap-2">
            <Shield size={14} /> Overview & Documents
          </div>
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_8px_var(--neon-blue)]"></div>}
        </button>
        <button 
          className={`pb-2 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'competitor' ? 'text-amber-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('competitor')}
        >
          <div className="flex items-center gap-2">
            <Trophy size={14} /> Competitor Matrix
          </div>
          {activeTab === 'competitor' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 shadow-[0_0_8px_var(--amber-400)]"></div>}
        </button>
        <button 
          className={`pb-2 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'approvals' ? 'text-indigo-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('approvals')}
        >
          <div className="flex items-center gap-2">
            <Calculator size={14} /> Internal Approvals
          </div>
          {activeTab === 'approvals' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 shadow-[0_0_8px_var(--indigo-400)]"></div>}
        </button>
        <button 
          className={`pb-2 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'pnl' ? 'text-red-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('pnl')}
        >
          <div className="flex items-center gap-2">
            <DollarSign size={14} /> Tender P&L
          </div>
          {activeTab === 'pnl' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 shadow-[0_0_8px_var(--red-400)]"></div>}
        </button>
        <button 
          className={`pb-2 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'proposal' ? 'text-green-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('proposal')}
        >
          <div className="flex items-center gap-2">
            <FileText size={14} /> Proposal Assembler
          </div>
          {activeTab === 'proposal' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_8px_var(--green-400)]"></div>}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Document Vault */}
          <div className="card gap-b2" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={15} style={{ color: 'var(--violet-2)' }} />
                  Project Document Vault
                </div>
                <div className="card-sub">
                  Full revision history · Click <strong style={{ color: 'var(--text-2)' }}>History</strong> to expand prior versions
                </div>
              </div>
              <div className="proj-status-block" style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                <div style={{ fontWeight: 700 }}>{projectDocuments.length} documents</div>
                <div style={{ marginTop: '2px' }}>
                  {projectDocuments.reduce((sum, d) => sum + d.history.length, 0)} total revisions
                </div>
              </div>
            </div>

            <DocumentHistoryList documents={projectDocuments} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Customer Feedback Loop */}
            <div className="card h-full">
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={15} style={{ color: 'var(--neon)' }} />
                  Customer Feedback Loop
                </div>
              </div>

              <div className="feedback-box">
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Active Intelligence Rating</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onClick={() => setRating(s)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Star
                          size={20}
                          fill={s <= rating ? 'var(--violet-2)' : 'transparent'}
                          stroke={s <= rating ? 'var(--violet-2)' : 'var(--text-3)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Intelligence Commentary</label>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="form-textarea"
                    placeholder="Enter client feedback, adjustments, or strategic concerns…"
                    style={{ minHeight: '100px', marginTop: '6px' }}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { onSaveFeedback(feedback, rating); setFeedback(''); }}
                >
                  <Send size={14} /> Save Transmission
                </button>
              </div>

              <p className="feedback-hint">
                All feedback is timestamped and synced with the Project Lifecycle.
              </p>
            </div>

            {/* Client Activity Log */}
            <MarketingActivityLog projectId={project.id} />
          </div>
        </>
      )}

      {activeTab === 'competitor' && <CompetitorMatrix tenderId={project.id === 'p1' ? 'TND-2501' : project.id} />}
      {activeTab === 'approvals' && <InternalApprovals projectId={project.id} />}
      {activeTab === 'pnl' && <TenderPNL projectId={project.id} contractValue={project.contractValue} />}
      {activeTab === 'proposal' && <ProposalWizard projectId={project.id} />}

    </div>
  );
};

export default MarketingProjectDetail;
