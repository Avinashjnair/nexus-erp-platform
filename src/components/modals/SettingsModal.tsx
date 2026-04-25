import React from 'react';
import Modal from '../ui/Modal';
import { User, Shield, Bell, Globe, Database, HardDrive, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="System Configuration">
      <div className="grid-2" style={{ gap: 'var(--sp-6)' }}>
        <div className="card glass" style={{ padding: 'var(--sp-6)' }}>
          <h3 className="section-title">User Profile</h3>
          <div className="flex-center" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
              AM
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Ahmed Mansouri</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Lead Project Manager</div>
            </div>
          </div>
          
          <div className="stat-group">
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--sp-3)' }}>
              <User size={16} /> Edit Profile
            </button>
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--sp-3)' }}>
              <Shield size={16} /> Security & Passwords
            </button>
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--sp-3)' }}>
              <Bell size={16} /> Notification Settings
            </button>
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--sp-6)' }}>
          <h3 className="section-title">Global Settings</h3>
          
          <div className="stat-group">
            <div className="flex-between p-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex-center" style={{ gap: 'var(--sp-3)' }}><Globe size={16} /> Language</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>English (UAE)</div>
            </div>
            <div className="flex-between p-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex-center" style={{ gap: 'var(--sp-3)' }}><Database size={16} /> Region</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Middle East</div>
            </div>
            <div className="flex-between p-3">
              <div className="flex-center" style={{ gap: 'var(--sp-3)' }}><HardDrive size={16} /> Storage</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>42.8 GB / 500 GB</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex-center" style={{ gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
              <Cpu size={14} color="var(--primary)" />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Health</span>
            </div>
            <div style={{ height: 4, backgroundColor: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--success)' }} />
            </div>
            <div className="flex-between" style={{ marginTop: 'var(--sp-2)', fontSize: 10, color: 'var(--text-tertiary)' }}>
              <span>CPU: 12%</span>
              <span>Memory: 4.2GB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer" style={{ marginTop: 'var(--sp-6)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
        <button className="btn-secondary" onClick={onClose}>Close</button>
        <button className="btn-primary">Save Changes</button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
