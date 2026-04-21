import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import type { RoleId } from '../types/erp';
import { ArrowRight } from 'lucide-react';

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
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">⬡</div>
          <div>
            <div className="login-logo-text">NEXUS ERP</div>
            <div className="login-logo-sub">Project Intelligence Platform</div>
          </div>
        </div>
        <h1 className="login-title">Sign in to<br />your workspace</h1>
        
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" defaultValue="admin@nexus.ae" readOnly />
        </div>

        <div className="login-roles">
          <div className="login-roles-label">Quick access — select role:</div>
          <div className="role-pills">
            {(Object.keys(roles) as RoleId[]).map((roleId) => (
              <button
                key={roleId}
                className={`role-pill ${currentRole === roleId ? 'active' : ''}`}
                onClick={() => setRole(roleId)}
              >
                {roleId.charAt(0).toUpperCase() + roleId.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary login-btn" onClick={handleLogin}>
          <span>Enter Platform</span>
          <ArrowRight size={18} className="btn-arrow" />
        </button>

        <div className="login-footer">
          Industrial Grade Data Security Active
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
