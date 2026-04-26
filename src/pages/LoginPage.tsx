import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import type { RoleId } from '../types/erp';
import { LogIn, Building2, User, Lock, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

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
    }, 1200);
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
    <div className="min-h-screen bg-[var(--bg0)] text-[var(--text)] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      
      {/* Starburst Background Effect */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-60 pointer-events-none overflow-hidden hidden lg:block">
        <div className="login-starburst">
          {Array.from({ length: 36 }).map((_, i) => (
            <div 
              key={i} 
              className="login-ray"
              style={{ 
                transform: `translateX(-50%) translateY(-100%) rotate(${i * 10}deg)`,
              }}
            />
          ))}
          <div className="login-ray-center" />
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10 lg:mr-auto lg:ml-[15%]"
      >
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--border)]">
          {/* Logo */}
          <div className="mb-10">
            <div className="w-12 h-12 bg-black text-[var(--accent)] rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Hexagon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold text-center mb-2">Welcome back</h2>
            <p className="text-[var(--text-muted)] text-sm text-center">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Department Select */}
            <div>
              <label className="form-label-s3">
                <Building2 className="w-4 h-4" />
                Department Access
              </label>
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value as RoleId)}
                  disabled={isAuthenticating}
                  className="form-input-s3 appearance-none cursor-pointer"
                >
                  {(Object.keys(roles) as RoleId[]).map(roleId => (
                    <option key={roleId} value={roleId}>
                      {departmentLabels[roleId] || roleId} Department
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="form-label-s3">
                <User className="w-4 h-4" />
                User ID
              </label>
              <input
                type="text"
                className="form-input-s3"
                placeholder="Enter user ID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isAuthenticating}
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-label-s3">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                className="form-input-s3"
                placeholder="••••••••"
                disabled={isAuthenticating}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isAuthenticating || !userId}
              className={cn(
                "w-full bg-black text-white hover:bg-[#222] font-semibold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50",
              )}
            >
              {isAuthenticating ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  </motion.div>
                  Authenticating
                </span>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
