import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import MarketingProjectDetail from '../components/marketing/MarketingProjectDetail';
import { 
  FileText, TrendingUp, Briefcase, Star, Clock, 
  Layers, CheckSquare, Target, Users, Search, 
  Filter, Plus, Download, History, Shield, 
  MessageSquare, FileCode, FileUp, CheckCircle, Eye,
  Sparkles, Zap
} from 'lucide-react';

const MarketingPage: React.FC = () => {
  const { 
    tenders = [], quotations = [], projects = [], feedback = [], documents = [], 
    openModal, addToast 
  } = useNexusStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tenders' | 'quotes' | 'projects' | 'feedback' | 'docs'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const openTenders = tenders.filter(t => t.status === 'submitted' || t.status === 'drafting');
  const totalTenderValue = openTenders.reduce((sum, t) => sum + t.value, 0);
  const readyForProduction = projects.filter(p => p.currentPhase === 1).length;
  const completedProjects = projects.filter(p => p.progress === 100).length;

  const renderDashboard = () => (
    <div className="animate-in">
      {/* SECTOR INTEL HEADER */}
      <div className="card gap-b" style={{ 
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-base) 100%)',
        borderLeft: '4px solid var(--primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-dim)', color: 'var(--primary)', marginBottom: 0 }}>
            <Target size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Market Pipeline Intelligence</h3>
            <p className="card-sub">Sector: North Emirates | Forecast: Optimized</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Badge variant="info">Q3 STRATEGY ACTIVE</Badge>
          </div>
        </div>
        
        <div className="grid-3">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>Submission Window</div>
            <p style={{ fontSize: '13px', margin: 0 }}><strong>3 high-value tenders</strong> closing within 72 hours. Review of technical specs required.</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '4px' }}>Conversion Velocity</div>
            <p style={{ fontSize: '13px', margin: 0 }}>Quotation-to-PO conversion up <strong>14%</strong>. Vendor pricing is within optimized bounds.</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '4px' }}>Customer Sentiment</div>
            <p style={{ fontSize: '13px', margin: 0 }}>Intelligence briefing indicates <strong>Positive</strong> outlook for upcoming infrastructure bids.</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Open Tenders" value={openTenders.length} subValue={`AED ${(totalTenderValue / 1000000).toFixed(1)}M`} icon={<FileText size={18} />} accentColor="#3b82f6" />
        <StatCard label="Active Quotes" value={quotations.length} trend={{ value: '+2 New', type: 'up' }} icon={<FileCode size={18} />} accentColor="#8b5cf6" />
        <StatCard label="Production Ready" value={readyForProduction} trend={{ value: 'Critical', type: 'down' }} icon={<FileUp size={18} />} accentColor="#ef4444" />
        <StatCard label="Live Execution" value={projects.length - completedProjects} icon={<Briefcase size={18} />} accentColor="#f59e0b" />
      </div>

      <div className="grid-2">
        {/* DEADLINE COUNTDOWN */}
        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Critical Deadlines</h4>
              <p className="card-sub">High-priority tender submissions</p>
            </div>
            <Zap size={18} color="var(--error)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tenders.filter(t => t.status === 'drafting').slice(0, 4).map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', borderLeft: '4px solid var(--error)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{t.client}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: 'var(--error)' }}>{t.deadline}</div>
                  <Badge variant="ghost" style={{ fontSize: '10px' }}>FINAL REVIEW</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PIPELINE VISUAL */}
        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Conversion Pipeline</h4>
              <p className="card-sub">Sales lifecycle velocity</p>
            </div>
            <Layers size={18} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Phase 01: Submitted</span>
                <span style={{ color: 'var(--primary)' }}>{tenders.filter(t => t.status === 'submitted').length} UNITS</span>
              </div>
              <ProgressBar progress={100} color="var(--primary)" />
            </div>
            <div style={{ paddingLeft: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Phase 02: Active Quotes</span>
                <span style={{ color: 'var(--secondary)' }}>{quotations.length} UNITS</span>
              </div>
              <ProgressBar progress={75} color="var(--primary-container)" />
            </div>
            <div style={{ paddingLeft: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Phase 03: Secured</span>
                <span style={{ color: 'var(--success)' }}>{tenders.filter(t => t.status === 'won').length} UNITS</span>
              </div>
              <ProgressBar progress={40} color="var(--success)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedProjectId) {
    const project = projects.find(p => p.id === selectedProjectId);
    return (
      <MarketingProjectDetail 
        project={project} 
        onBack={() => setSelectedProjectId(null)}
        onSaveFeedback={(comment, rating) => {
          addToast(`Intelligence Saved: Rating ${rating}/5`, 'success');
          setSelectedProjectId(null);
        }}
      />
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Badge variant="primary" style={{ marginBottom: '8px' }}>Business Intelligence</Badge>
          <h1 style={{ margin: 0 }}>Market Portal</h1>
          <p className="card-sub">Managing regional tenders, client quotations, and lifecycle conversion</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="theme-toggle" style={{ width: 'auto', padding: '0 16px', gap: '8px' }} onClick={() => openModal('feedback_invite')}>
            <Users size={16} /> Customer Health
          </button>
          <button className="btn-primary" onClick={() => openModal('tender_create')}>
            <Plus size={18} style={{ marginRight: '8px' }} /> New Tender
          </button>
        </div>
      </div>

      <div className="tabs-integrated">
        <button className={`tab-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Target size={16} /> DASHBOARD
        </button>
        <button className={`tab-item ${activeTab === 'tenders' ? 'active' : ''}`} onClick={() => setActiveTab('tenders')}>
          <FileText size={16} /> TENDERS
        </button>
        <button className={`tab-item ${activeTab === 'quotes' ? 'active' : ''}`} onClick={() => setActiveTab('quotes')}>
          <FileCode size={16} /> QUOTATIONS
        </button>
        <button className={`tab-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <Briefcase size={16} /> PROJECTS
        </button>
        <button className={`tab-item ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
          <MessageSquare size={16} /> FEEDBACK
        </button>
        <button className={`tab-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>
          <Shield size={16} /> VAULT
        </button>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      
      {activeTab === 'tenders' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h4 className="card-title">Tender Registry</h4>
              <p className="card-sub">Active regional and international bids</p>
            </div>
            <div className="topbar-search" style={{ width: '240px', backgroundColor: 'var(--bg-base)' }}>
              <Search size={14} color="var(--text-tertiary)" />
              <input type="text" placeholder="Search tenders..." />
            </div>
          </div>
          <Table data={tenders} columns={[
            { header: 'Ref', render: (t: any) => <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>{t.ref}</span> },
            { header: 'Client / Title', render: (t: any) => (
              <div>
                <div style={{ fontWeight: 700 }}>{t.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{t.client}</div>
              </div>
            ), width: '40%' },
            { header: 'Value', render: (t: any) => `AED ${t.value.toLocaleString()}` },
            { header: 'Deadline', render: (t: any) => t.deadline },
            { header: 'Status', render: (t: any) => (
              <Badge variant={t.status === 'won' ? 'success' : t.status === 'lost' ? 'danger' : t.status === 'submitted' ? 'info' : 'warning'}>
                {t.status.toUpperCase()}
              </Badge>
            )},
            { header: 'Win Probability', render: (t: any) => (
              <div style={{ width: '80px' }}>
                <ProgressBar progress={t.probability} color="var(--primary)" />
              </div>
            )}
          ]} />
        </div>
      )}

      {/* Other tabs follow the same Slab table pattern */}
      {(activeTab === 'quotes' || activeTab === 'projects' || activeTab === 'feedback' || activeTab === 'docs') && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">{activeTab.toUpperCase()} OVERVIEW</h4>
            <Badge variant="ghost">MANAGED DATA</Badge>
          </div>
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            This section is being synchronized with the new "Industrial Curator" Slab view.
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingPage;
