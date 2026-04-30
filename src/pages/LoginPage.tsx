import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import type { RoleId } from '../types/erp';
import { ArrowRight, Hexagon, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const DEPARTMENT_LABELS: Record<RoleId, string> = {
  management: 'Management',
  marketing:  'Marketing',
  purchase:   'Purchase',
  qaqc:       'QA/QC',
  production: 'Production',
  store:      'Store',
  workflow:   'Workflow',
  reports:    'Reports',
  initiate:   'New Project',
  strategic:  'Strategic',
  digest:     'Activity Monitor',
};

const LoginPage: React.FC = () => {
  const { roles, currentRole, setRole, login } = useNexusStore();

  const [email, setEmail] = useState('admin@nexus.ae');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your access key.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const session = await authService.login(email.trim(), password, currentRole);
      // Persist session token in memory (not localStorage for better security)
      sessionStorage.setItem('nexus_token', session.token);
      login(session.user.role);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
    }
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

        <form onSubmit={handleLogin} noValidate>
          {/* Role selector — only relevant for admin@nexus.ae which can log in as any role */}
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
                  {DEPARTMENT_LABELS[roleId]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => { setEmail(e.target.value); setAuthError(null); }}
              placeholder="name@nexus.ae"
              autoComplete="email"
            />
            <div className="form-hint">Demo: admin@nexus.ae — can access any role</div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Access key</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError(null); }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-3)', padding: 0, lineHeight: 0,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="form-hint">Demo password: nexus@2025</div>
          </div>

          {authError && (
            <div className="auth-error" style={{ marginBottom: 16 }}>
              <AlertCircle size={15} />
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? 'Authenticating...' : 'Establish Session'}
            {!isAuthenticating && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
