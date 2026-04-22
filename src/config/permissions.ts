import type { RoleId } from '../types/erp';

export const ROLE_PERMISSIONS: Record<RoleId, RoleId[]> = {
  management: ['management', 'qaqc', 'purchase', 'production', 'store', 'marketing', 'workflow', 'reports', 'initiate'],
  qaqc:       ['management', 'qaqc', 'reports'],
  purchase:   ['management', 'purchase', 'store', 'reports'],
  production: ['management', 'production', 'store'],
  store:      ['store', 'reports'],
  marketing:  ['marketing', 'management'],
  workflow:   ['workflow', 'management', 'reports'],
  reports:    ['reports', 'management'],
  initiate:   ['initiate', 'management', 'workflow']
};
