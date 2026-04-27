import React, { useState } from 'react';
import { FileText, Download, UploadCloud, History, ChevronUp, Clock, User } from 'lucide-react';
import type { ProjectDocument } from '../../types/erp';
import UploadRevisionModal from '../modals/UploadRevisionModal';

const CAT_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  'Drawing':           { label: 'DWG',  badgeClass: 'badge-violet'  },
  'Specification':     { label: 'SPEC', badgeClass: 'badge-blue'    },
  'MOM':               { label: 'MOM',  badgeClass: 'badge-amber'   },
  'Contract':          { label: 'CTR',  badgeClass: 'badge-neon'    },
  'Deviation Request': { label: 'DEV',  badgeClass: 'badge-red'     },
  'Approval Copies':   { label: 'APR',  badgeClass: 'badge-teal'    },
  'Scope Additions':   { label: 'SCO',  badgeClass: 'badge-purple'  },
};

interface Props {
  documents: ProjectDocument[];
}

const DocumentHistoryList: React.FC<Props> = ({ documents }) => {
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const uploadingDoc = uploadingDocId
    ? documents.find(d => d.id === uploadingDocId) ?? null
    : null;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {documents.map(doc => {
          const cat        = CAT_CONFIG[doc.category] ?? { label: doc.category.slice(0,3).toUpperCase(), badgeClass: 'badge-gray' };
          const isExpanded = expandedId === doc.id;
          const hasHistory = doc.history.length > 0;

          return (
            <div key={doc.id} className="doc-row">

              {/* ── Main row ── */}
              <div className="doc-row-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div className="doc-row-icon">
                    <FileText size={15} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                      <span className={`badge ${cat.badgeClass}`}>{cat.label}</span>
                      <span className="doc-row-title">{doc.title}</span>
                      <span className="rev-badge">{doc.currentVersion.revisionName}</span>
                    </div>

                    <div className="doc-row-meta">
                      <span>{doc.currentVersion.fileName}</span>
                      <span className="doc-meta-sep">·</span>
                      <span>{doc.currentVersion.fileSize}</span>
                      <span className="doc-meta-sep">·</span>
                      <Clock size={9} />
                      <span>{doc.currentVersion.uploadedAt}</span>
                      <span className="doc-meta-sep">·</span>
                      <User size={9} />
                      <span>{doc.currentVersion.uploadedBy}</span>
                      {doc.currentVersion.remarks && (
                        <>
                          <span className="doc-meta-sep">·</span>
                          <span style={{ fontStyle: 'italic' }}>"{doc.currentVersion.remarks}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <button
                    className="action-btn-sm"
                    title="Upload New Revision"
                    onClick={() => setUploadingDocId(doc.id)}
                  >
                    <UploadCloud size={13} />
                  </button>

                  <button className="action-btn-sm" title="Download Latest">
                    <Download size={13} />
                  </button>

                  <button
                    className={`action-btn-sm ${isExpanded ? 'active-hist' : ''}`}
                    title={isExpanded ? 'Collapse history' : 'View revision history'}
                    onClick={() => hasHistory && setExpandedId(isExpanded ? null : doc.id)}
                    style={!hasHistory ? { opacity: 0.35, cursor: 'default' } : {}}
                  >
                    {isExpanded ? <ChevronUp size={13} /> : <History size={13} />}
                  </button>

                  {hasHistory && (
                    <span className="doc-history-count">{doc.history.length}</span>
                  )}
                </div>
              </div>

              {/* ── Expandable history panel ── */}
              <div className={`doc-history-panel ${isExpanded ? 'expanded' : ''}`}>
                <div className="doc-history-inner">
                  <div className="doc-history-header">
                    <span>Revision History</span>
                    <span>{doc.history.length} prior version{doc.history.length !== 1 ? 's' : ''}</span>
                  </div>

                  {doc.history.map((ver, idx) => (
                    <div
                      key={ver.versionId}
                      className={`doc-history-item ${idx === doc.history.length - 1 ? 'last' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                        {/* Timeline indicator */}
                        <div className="doc-hist-line-indicator">
                          <div className="doc-hist-dot" />
                          {idx < doc.history.length - 1 && <div className="doc-hist-line" />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span className="rev-badge rev-badge-sm">{ver.revisionName}</span>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-1)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {ver.fileName}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-3)', flexShrink: 0 }}>{ver.fileSize}</span>
                          </div>

                          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px', display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Clock size={9} />
                            <span>{ver.uploadedAt}</span>
                            <span>·</span>
                            <User size={9} />
                            <span>{ver.uploadedBy}</span>
                            {ver.remarks && (
                              <>
                                <span>·</span>
                                <span style={{ fontStyle: 'italic' }}>"{ver.remarks}"</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button className="action-btn-sm" title="Download this revision" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <Download size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Upload modal — rendered at this level to escape stacking context */}
      {uploadingDoc && (
        <UploadRevisionModal
          document={uploadingDoc}
          onClose={() => setUploadingDocId(null)}
        />
      )}
    </>
  );
};

export default DocumentHistoryList;
