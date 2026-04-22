import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Send, AlertCircle } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';

interface PRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import FormTextarea from '../ui/FormTextarea';

const PRModal: React.FC<PRModalProps> = ({ isOpen, onClose }) => {
  const { projects, currentUser, addPR, _log, addToast } = useNexusStore();
  
  const [formData, setFormData] = useState({
    item: '',
    qty: '',
    unit: 'pcs',
    project: projects[0]?.id || '',
    priority: 'normal' as 'normal' | 'urgent',
    justification: '',
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPR = {
      id: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      status: 'pending' as const,
      raised: new Date().toISOString().split('T')[0],
      raisedBy: currentUser?.name || 'Unknown',
      dept: currentUser?.title?.split(' ')[0] || 'Production'
    };

    addPR(newPR);
    _log({
      type: 'warning',
      title: `${newPR.id} Raised`,
      text: `${newPR.item} — ${newPR.qty} requested by ${newPR.raisedBy}`,
      time: 'Just now',
      dept: newPR.dept
    });
    addToast(`${newPR.id} raised successfully`, 'success');
    onClose();
  };

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleSubmit}>
        <Send size={14} />
        Raise Purchase Request
      </button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Raise New Purchase Request"
      footer={footer}
      size="lg"
    >
      <form className="pr-form" onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <FormInput 
            label="Material / Item Description"
            placeholder='e.g. SS Pipe 4" SCH40'
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            required
          />
          <div className="form-grid-2">
            <FormInput 
              label="Quantity"
              placeholder="24"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
              required
            />
            <FormSelect 
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={[
                { value: 'pcs', label: 'Pieces (pcs)' },
                { value: 'mtr', label: 'Meters (mtr)' },
                { value: 'tons', label: 'Tons (tons)' },
                { value: 'spools', label: 'Spools' },
                { value: 'packs', label: 'Packs' },
              ]}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <FormSelect 
            label="Charge to Project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            options={projects.map(p => ({ value: p.id, label: p.title }))}
          />
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div className="role-pills" style={{ marginTop: '4px' }}>
              <button 
                type="button"
                className={`role-pill ${formData.priority === 'normal' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, priority: 'normal' })}
              >
                Normal
              </button>
              <button 
                type="button"
                className={`role-pill ${formData.priority === 'urgent' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, priority: 'urgent' })}
              >
                <AlertCircle size={10} style={{ marginRight: '4px' }} />
                Urgent
              </button>
            </div>
          </div>
        </div>

        <FormTextarea 
          label="Justification / Reason for Purchase"
          placeholder="Why is this material required now?"
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          required
        />

        <FormInput 
          label="Additional Remarks"
          placeholder="e.g. Specific brand preference or delivery location"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
        />

        <div className="notif-item" style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginTop: '20px', cursor: 'default' }}>
          <div className="notif-item-title" style={{ fontSize: '11px' }}>
            <span className="notif-dot" style={{ background: 'var(--accent)' }}></span>
            Workflow Information
          </div>
          <div className="notif-item-text" style={{ fontSize: '10px' }}>
            This request will be routed to <strong>Ahmed Mansouri (Project Manager)</strong> for approval before Procurement can proceed.
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PRModal;
