import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Check } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';
import type { ProjectDocument, DocumentVersion } from '../../types/erp';

/** Auto-suggest the next logical revision label. */
function suggestNextRevision(current: string): string {
  if (current === 'Rev 0') return 'Rev A';
  const revLetter = current.match(/^Rev ([A-Z])$/);
  if (revLetter) return `Rev ${String.fromCharCode(revLetter[1].charCodeAt(0) + 1)}`;
  const vNum = current.match(/^V(\d+)$/i);
  if (vNum) return `V${parseInt(vNum[1]) + 1}`;
  const drNum = current.match(/^DR-(\d+)$/i);
  if (drNum) return `DR-${String(parseInt(drNum[1]) + 1).padStart(2, '0')}`;
  const apcNum = current.match(/^APC-(\d+)$/i);
  if (apcNum) return `APC-${String(parseInt(apcNum[1]) + 1).padStart(2, '0')}`;
  return `${current} Rev A`;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  document: ProjectDocument;
  onClose: () => void;
}

const UploadRevisionModal: React.FC<Props> = ({ document: doc, onClose }) => {
  const { currentUser, uploadDocumentRevision, addToast } = useNexusStore();
  const [revName, setRevName]         = useState(suggestNextRevision(doc.currentVersion.revisionName));
  const [remarks, setRemarks]         = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => setSelectedFile(file);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleConfirm = () => {
    if (!selectedFile) { addToast('Please select a file to upload', 'warning'); return; }
    if (!revName.trim()) { addToast('Revision name is required', 'warning'); return; }

    const newVersion: DocumentVersion = {
      versionId:    `v${Date.now()}`,
      revisionName: revName.trim(),
      fileName:     selectedFile.name,
      fileSize:     fmtSize(selectedFile.size),
      uploadedAt:   new Date().toISOString().split('T')[0],
      uploadedBy:   currentUser?.name ?? 'Unknown',
      remarks:      remarks.trim(),
    };

    uploadDocumentRevision(doc.id, newVersion);
    addToast(`"${doc.title}" updated to ${revName.trim()}`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal modal-sm">

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="sidebar-brand-icon" style={{ width: '32px', height: '32px' }}>
              <UploadCloud size={16} />
            </div>
            <div>
              <div className="modal-title">Upload New Revision</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {doc.title}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Drop zone */}
        <div
          className="upload-zone"
          style={{ marginBottom: '16px', minHeight: '90px', background: dragging ? 'var(--violet-dim)' : undefined }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef} type="file" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          {selectedFile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <FileText size={20} style={{ color: 'var(--violet-2)' }} />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-0)', fontWeight: 600 }}>{selectedFile.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>{fmtSize(selectedFile.size)}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-zone-icon">📎</div>
              <div className="upload-zone-text">Drop file here or click to browse</div>
              <div className="upload-zone-sub">Any file type accepted</div>
            </>
          )}
        </div>

        {/* Revision name */}
        <div className="form-group">
          <label className="form-label">Revision Name</label>
          <input
            className="form-input"
            value={revName}
            onChange={e => setRevName(e.target.value)}
            placeholder="e.g. Rev B"
            autoFocus
          />
        </div>

        {/* Remarks */}
        <div className="form-group">
          <label className="form-label">Remarks (Optional)</label>
          <textarea
            className="form-textarea"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="Describe what changed in this revision…"
            style={{ minHeight: '72px' }}
          />
        </div>

        {/* Uploaded by (read-only) */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Uploaded By</label>
          <input
            className="form-input"
            value={currentUser?.name ?? '—'}
            readOnly
            style={{ opacity: 0.55, cursor: 'not-allowed' }}
          />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            <Check size={14} /> Upload Revision
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadRevisionModal;
