import React from 'react';
import { X, CheckCircle, XCircle, Package, Tag, Calendar, Briefcase, User, Hash, FileText, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNexusStore } from '../../store/useNexusStore';
import type { PurchaseRequest } from '../../types/erp';

interface Props { isOpen: boolean; onClose: () => void; pr: PurchaseRequest | null; }


const STATUS_COLOR: Record<string, string> = {
  pending:    'var(--amber)',
  approved:   'var(--neon)',
  rejected:   'var(--red)',
  'po-issued':'var(--teal)',
  delivered:  'var(--neon)',
};

export const ViewPRModal: React.FC<Props> = ({ isOpen, onClose, pr }) => {
  const { approvePR, rejectPR, currentRole, projects, addToast } = useNexusStore();

  if (!isOpen || !pr) return null;

  const canAction = (currentRole === 'management' || currentRole === 'purchase') && pr.status === 'pending';
  const project = projects.find(p => p.id === pr.project);

  const handleApprove = () => {
    approvePR(pr.id);
    addToast(`${pr.id} approved successfully`, 'success');
    onClose();
  };

  const handleReject = () => {
    rejectPR(pr.id);
    addToast(`${pr.id} has been rejected`, 'error');
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 580 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 'var(--r-sm)',
              background: 'var(--violet-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={18} color="var(--violet-2)" />
            </div>
            <div>
              <div className="modal-title">{pr.id}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Purchase Request Detail</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Status Banner */}
        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--r-sm)',
          background: `${STATUS_COLOR[pr.status] || 'var(--text-3)'}12`,
          border: `1px solid ${STATUS_COLOR[pr.status] || 'var(--text-3)'}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[pr.status] || 'var(--text-3)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[pr.status] || 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {pr.status.replace('-', ' ')}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Raised {pr.raised}</span>
        </div>

        {/* Item + Qty hero */}
        <div style={{
          padding: '16px 18px',
          background: 'var(--bg-raised)',
          borderRadius: 'var(--r)',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Item Description</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)', marginBottom: 6 }}>{pr.item}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--violet-2)', fontWeight: 600 }}>
              {pr.qty} {pr.unit}
            </span>
            <span className={`badge badge-${pr.priority === 'urgent' ? 'red' : 'blue'}`}>
              {pr.priority === 'urgent' && <AlertTriangle size={9} />} {pr.priority}
            </span>
          </div>
        </div>

        {/* Meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { icon: <User size={13} />, label: 'Raised By', value: pr.raisedBy },
            { icon: <Briefcase size={13} />, label: 'Department', value: pr.dept },
            { icon: <Hash size={13} />, label: 'Project', value: project?.title || pr.project },
            { icon: <Calendar size={13} />, label: 'Date Raised', value: pr.raised },
            ...(pr.poNo ? [{ icon: <Tag size={13} />, label: 'PO Number', value: pr.poNo }] : []),
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              padding: '10px 12px',
              background: 'var(--bg-card-2)',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--text-3)' }}>
                {icon}
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-0)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Justification */}
        {pr.justification && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: 'var(--text-3)' }}>
              <FileText size={12} />
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Justification</span>
            </div>
            <div style={{
              padding: '10px 14px',
              background: 'var(--bg-raised)',
              borderRadius: 'var(--r-sm)',
              fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6,
              borderLeft: '3px solid var(--violet)',
            }}>
              {pr.justification}
            </div>
          </div>
        )}

        {/* Remarks */}
        {pr.remarks && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 6 }}>Remarks</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{pr.remarks}</div>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          {canAction && (
            <>
              <button className="btn btn-danger" onClick={handleReject}>
                <XCircle size={14} /> Reject
              </button>
              <button className="btn btn-success" onClick={handleApprove}>
                <CheckCircle size={14} /> Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewPRModal;
