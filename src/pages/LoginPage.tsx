import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import type { RoleId } from '../types/erp';
import { ArrowRight, Hexagon } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { roles, currentRole, setRole, login } = useNexusStore();
  const [userId, setUserId] = useState('admin@nexus.ae');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      login(currentRole);
    }, 1000);
  };

  const departmentLabels: Record<string, string> = {
    management: 'Management',
    marketing: 'Marketing',
    purchase: 'Purchase',
    qaqc: 'QA/QC',
    production: 'Production',
    store: 'Store',
    workflow: 'Workflow',
    reports: 'Reports',
    initiate: 'New Project',
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
             <Hexagon size={24} fill="white" />
          </div>
          <div>
            <div className="login-logo-text">NEXUS ERP</div>
            <div className="login-logo-sub">Industrial intelligence</div>
          </div>
        </div>

        <h1 className="login-title">Access portal</h1>
        <p className="login-subtitle">Authenticate to access the operational environment</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Operational department</label>
            <div className="role-pills">
              {(Object.keys(roles) as RoleId[]).map(roleId => (
                <button
                  key={roleId}
                  type="button"
                  className={`role-pill${currentRole === roleId ? ' active' : ''}`}
                  onClick={() => setRole(roleId)}
                >
                  {departmentLabels[roleId] || roleId}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">User identity</label>
            <input
              type="text"
              className="form-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="name@nexus.ae"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 28 }}>
            <label className="form-label">Access key</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              defaultValue="password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? 'Authenticating...' : 'Establish Session'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
