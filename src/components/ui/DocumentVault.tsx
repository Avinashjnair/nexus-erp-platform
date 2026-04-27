import React, { useState } from 'react';
import { Upload, CheckCircle, FileText, Trash2 } from 'lucide-react';
import DocumentMetadataModal from '../modals/DocumentMetadataModal';
import type { VaultDocument } from '../../types/erp';

export type { VaultDocument };

interface DocumentVaultProps {
  documents: VaultDocument[];
  onUpload: (categoryId: string, file: File, metadata: { revision: string; remarks: string }) => void;
  onRemove: (categoryId: string) => void;
}

const DocumentVault: React.FC<DocumentVaultProps> = ({ documents, onUpload, onRemove }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<{ file: File; categoryId: string } | null>(null);

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setActiveCategory(id);
  };

  const handleDragLeave = () => {
    setActiveCategory(null);
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setActiveCategory(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPendingFile({ file, categoryId: id });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile({ file, categoryId: id });
    }
  };

  const confirmMetadata = (metadata: { revision: string; remarks: string }) => {
    if (pendingFile) {
      onUpload(pendingFile.categoryId, pendingFile.file, metadata);
      setPendingFile(null);
    }
  };

  return (
    <div className="card vault-section">
      <div className="card-header">
        <div>
          <div className="card-title">Initial Project Documentation</div>
          <div className="card-sub">Enforce structured file uploads before project activation</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)' }}></span> Mandatory
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid var(--border-2)' }}></span> Optional
          </div>
        </div>
      </div>

      <div className="vault-grid">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`vault-tile ${doc.verified ? 'verified' : ''} ${activeCategory === doc.id ? 'active' : ''}`}
            onDragOver={(e) => handleDragOver(e, doc.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, doc.id)}
            onClick={() => !doc.verified && document.getElementById(`file-${doc.id}`)?.click()}
          >
            {doc.mandatory ? (
              <span className="vault-tile-mandatory">Mandatory</span>
            ) : (
              <span className="vault-tile-optional">Optional</span>
            )}

            <div className="vault-tile-icon">
              {doc.verified ? (
                <CheckCircle size={24} className="text-neon" />
              ) : (
                <Upload size={22} />
              )}
            </div>

            <div className="vault-tile-label">{doc.category}</div>

            {doc.verified ? (
              <>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'var(--neon)', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  <CheckCircle size={12} /> Verified
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: 'var(--text-2)', 
                  marginTop: '4px',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {doc.fileName} ({doc.revision})
                </div>
                <button 
                  className="btn-icon" 
                  style={{ 
                    position: 'absolute', 
                    bottom: '8px', 
                    right: '8px', 
                    width: '24px', 
                    height: '24px',
                    background: 'var(--red-dim)',
                    color: 'var(--red)',
                    border: '1px solid var(--red-border)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(doc.id);
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </>
            ) : (
              <div className="vault-tile-status" style={{ color: 'var(--text-3)' }}>
                Drag & Drop or Click
              </div>
            )}

            <input
              type="file"
              id={`file-${doc.id}`}
              style={{ display: 'none' }}
              onChange={(e) => handleFileInput(e, doc.id)}
            />
          </div>
        ))}
      </div>

      {pendingFile && (
        <DocumentMetadataModal
          fileName={pendingFile.file.name}
          category={documents.find(d => d.id === pendingFile.categoryId)?.category || ''}
          onConfirm={confirmMetadata}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </div>
  );
};

export default DocumentVault;
