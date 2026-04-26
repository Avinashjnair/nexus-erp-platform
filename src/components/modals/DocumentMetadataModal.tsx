import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface DocumentMetadataModalProps {
  fileName: string;
  category: string;
  onConfirm: (metadata: { revision: string; remarks: string }) => void;
  onCancel: () => void;
}

const DocumentMetadataModal: React.FC<DocumentMetadataModalProps> = ({ 
  fileName, 
  category, 
  onConfirm, 
  onCancel 
}) => {
  const [revision, setRevision] = useState('Rev 0');
  const [remarks, setRemarks] = useState('');

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="sidebar-brand-icon" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
              <FileText size={16} />
            </div>
            <div>
              <div className="modal-title">Document Metadata</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' }}>
                {category}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onCancel}><X size={16} /></button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            background: 'var(--bg-input)', 
            padding: '12px', 
            borderRadius: 'var(--r-sm)', 
            border: '1px solid var(--border)',
            marginBottom: '16px',
            fontSize: '12px',
            color: 'var(--text-2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText size={14} className="text-violet" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Revision Number</label>
            <input 
              className="form-input" 
              value={revision} 
              onChange={(e) => setRevision(e.target.value)}
              placeholder="e.g. Rev 0"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks (Optional)</label>
            <textarea 
              className="form-textarea" 
              value={remarks} 
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any internal notes..."
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm({ revision, remarks })}>
            <Check size={14} /> Verify & Attach
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentMetadataModal;
