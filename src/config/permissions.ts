import type { RoleId } from '../types/erp';

export const ROLE_PERMISSIONS: Record<RoleId, RoleId[]> = {
  management: ['management', 'qaqc', 'purchase', 'production', 'store', 'marketing', 'workflow', 'reports', 'initiate'],
  qaqc:       ['qaqc', 'reports'],
  purchase:   ['purchase', 'reports'],
  production: ['production', 'reports'],
  store:      ['store', 'reports'],
  marketing:  ['marketing', 'reports'],
  workflow:   ['workflow', 'reports'],
  reports:    ['reports'],
  initiate:   ['initiate', 'reports']
};
