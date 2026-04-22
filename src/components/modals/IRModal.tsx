import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Send, ClipboardCheck } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';

interface IRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IRModal: React.FC<IRModalProps> = ({ isOpen, onClose }) => {
  const { projects, currentUser, addIR, _log, addToast } = useNexusStore();
  
  const [formData, setFormData] = useState({
    activity: '',
    type: 'Hold Point',
    project: projects[0]?.id || '',
    itp: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    drawingRef: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIR = {
      id: `IR-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      status: 'pending' as const,
      requestedBy: currentUser?.name || 'Unknown'
    };

    addIR(newIR);
    _log({
      type: 'info',
      title: `${newIR.id} Requested`,
      text: `${newIR.activity} — Requested by ${newIR.requestedBy}`,
      time: 'Just now',
      dept: 'QAQC'
    });
    addToast(`Inspection ${newIR.id} scheduled`, 'success');
    onClose();
  };

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleSubmit} style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
        <Send size={14} />
        Schedule Inspection
      </button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Request QC Inspection (IR)"
      footer={footer}
      size="lg"
    >
      <form className="pr-form" onSubmit={handleSubmit}>
        <FormInput 
          label="Inspection Activity"
          placeholder="e.g. Hydro Test — Manifold Spool MS-07"
          value={formData.activity}
          onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
          required
        />

        <div className="form-grid-2">
          <FormSelect 
            label="Inspection Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'Hold Point', label: 'Hold Point (Must Inspect)' },
              { value: 'Witness Point', label: 'Witness Point' },
              { value: 'Review Point', label: 'Review Point' },
            ]}
          />
          <FormInput 
            label="ITP Reference"
            placeholder="e.g. ITP-001 §4.8"
            value={formData.itp}
            onChange={(e) => setFormData({ ...formData, itp: e.target.value })}
            required
          />
        </div>

        <div className="form-grid-3">
          <FormSelect 
            label="Project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            options={projects.map(p => ({ value: p.id, label: p.title }))}
          />
          <FormInput 
            label="Date of Inspection"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <FormInput 
            label="Drawing Reference"
            placeholder="DWG-..."
            value={formData.drawingRef}
            onChange={(e) => setFormData({ ...formData, drawingRef: e.target.value })}
            required
          />
        </div>

        <FormInput 
          label="Inspection Location"
          placeholder="e.g. Bay 4 — Test bench"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />

        <div className="notif-item" style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginTop: '20px', cursor: 'default' }}>
          <div className="notif-item-title" style={{ fontSize: '11px' }}>
            <ClipboardCheck size={14} style={{ color: 'var(--accent)', marginRight: '8px' }} />
            QA/QC Requirements
          </div>
          <div className="notif-item-text" style={{ fontSize: '10px' }}>
            Please ensure all fabrication works are completed and surface is cleaned before the inspector arrives. Related calibration certificates for gauges must be available at the location.
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default IRModal;
