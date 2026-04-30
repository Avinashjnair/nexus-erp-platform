import type { RoleId, UserRole } from '../types/erp';
import { mockMutate, ApiError } from './api';

export interface AuthSession {
  user: UserRole;
  token: string; // JWT placeholder — replace with real token from server
  expiresAt: number;
}

/** Credential registry. Replace this map with a real POST /auth/login call. */
const CREDENTIALS: Record<string, { password: string; role: RoleId }> = {
  'ahmed@nexus.ae':  { password: 'nexus@2025', role: 'management' },
  'sara@nexus.ae':   { password: 'nexus@2025', role: 'marketing' },
  'khalid@nexus.ae': { password: 'nexus@2025', role: 'purchase' },
  'priya@nexus.ae':  { password: 'nexus@2025', role: 'qaqc' },
  'omar@nexus.ae':   { password: 'nexus@2025', role: 'production' },
  'rajan@nexus.ae':  { password: 'nexus@2025', role: 'store' },
  'system@nexus.ae': { password: 'nexus@2025', role: 'workflow' },
  'analyst@nexus.ae':{ password: 'nexus@2025', role: 'reports' },
  'pmo@nexus.ae':    { password: 'nexus@2025', role: 'initiate' },
  'intel@nexus.ae':  { password: 'nexus@2025', role: 'strategic' },
  'monitor@nexus.ae':{ password: 'nexus@2025', role: 'digest' },
  // Universal demo account — works with any role selector
  'admin@nexus.ae':  { password: 'nexus@2025', role: 'management' },
};

const USER_PROFILES: Record<RoleId, Omit<UserRole, 'role'>> = {
  management: { name: 'Ahmed Mansouri',   initials: 'AM', title: 'Project Manager',       color: '#e8a020' },
  marketing:  { name: 'Sara Al Hashimi',  initials: 'SH', title: 'Marketing Lead',        color: '#3b82f6' },
  purchase:   { name: 'Khalid Ibrahim',   initials: 'KI', title: 'Procurement Officer',   color: '#f59e0b' },
  qaqc:       { name: 'Priya Nair',       initials: 'PN', title: 'QC Engineer',           color: '#10b981' },
  production: { name: 'Omar Al Suwaidi', initials: 'OS', title: 'Production Supervisor', color: '#f97316' },
  store:      { name: 'Rajan Pillai',     initials: 'RP', title: 'Store Keeper',          color: '#8b5cf6' },
  workflow:   { name: 'System Automator', initials: 'SA', title: 'Workflow Engine',        color: '#14b8a6' },
  reports:    { name: 'Data Analyst',     initials: 'DA', title: 'Intelligence Lead',     color: '#4f7cff' },
  initiate:   { name: 'Ahmed Mansouri',   initials: 'AM', title: 'Project Manager',       color: '#e8a020' },
  strategic:  { name: 'Data Analyst',     initials: 'DA', title: 'Intelligence Lead',     color: '#4f7cff' },
  digest:     { name: 'System Monitor',   initials: 'SM', title: 'Activity Monitor',      color: '#06b6d4' },
};

function generateToken(email: string, role: RoleId): string {
  // Simulated token. In production: server returns a signed JWT.
  const payload = btoa(JSON.stringify({ email, role, iat: Date.now() }));
  return `nexus.mock.${payload}`;
}

export const authService = {
  async login(email: string, password: string, selectedRole?: RoleId): Promise<AuthSession> {
    return mockMutate(() => {
      const entry = CREDENTIALS[email.toLowerCase().trim()];

      if (!entry) {
        throw new ApiError(401, 'No account found for this email address.');
      }
      if (entry.password !== password) {
        throw new ApiError(401, 'Incorrect password. Please try again.');
      }

      // admin@nexus.ae can log in as any selected role
      const role = (email === 'admin@nexus.ae' && selectedRole) ? selectedRole : entry.role;
      const profile = USER_PROFILES[role];

      return {
        user: { ...profile, role },
        token: generateToken(email, role),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8-hour session
      };
    });
  },

  async logout(): Promise<void> {
    await mockMutate(() => {
      // In production: POST /auth/logout to invalidate server-side session
    });
  },

  /** Validate a stored token (replace with real introspection/refresh endpoint). */
  validateSession(token: string): boolean {
    try {
      const [, payload] = token.split('.');
      const { iat } = JSON.parse(atob(payload));
      return Date.now() - iat < 8 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  },
};
