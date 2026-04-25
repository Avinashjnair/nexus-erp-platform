import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import type { RoleId } from '../types/erp';
import { ArrowRight, ShieldCheck, Hexagon } from 'lucide-react';
import Badge from '../components/ui/Badge';

const LoginPage: React.FC = () => {
  const { roles, currentRole, setRole, login } = useNexusStore();

  const handleLogin = () => {
    login(currentRole);
  };

  return (
    <div className="login-screen">
      <div className="login-bg">
        <div className="login-grid"></div>
      </div>
      
      <div className="login-card animate-in">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Hexagon size={32} fill="var(--primary)" color="var(--primary)" style={{ opacity: 0.2 }} />
            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '18px' }}>⬡</span>
          </div>
          <div>
            <div className="login-logo-text">NEXUS ERP</div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Intelligence Platform</div>
          </div>
        </div>

        <h1 className="login-title">Sign in to<br />Industrial Portal</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginBottom: '32px' }}>
          Select your departmental access role to begin.
        </p>
        
        <div className="form-group">
          <label className="form-label">Authorized Identity</label>
          <input className="form-input" type="email" defaultValue="admin@nexus.ae" readOnly />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Operational Sector
          </div>
          <div className="role-pills">
            {(Object.keys(roles) as RoleId[]).map((roleId) => (
              <button
                key={roleId}
                className={`role-pill ${currentRole === roleId ? 'active' : ''}`}
                onClick={() => setRole(roleId)}
              >
                {roleId.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary login-btn" onClick={handleLogin}>
          <span>ENTER PLATFORM</span>
          <ArrowRight size={18} />
        </button>

        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <ShieldCheck size={14} />
          <span>Industrial Grade Encryption Active</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
