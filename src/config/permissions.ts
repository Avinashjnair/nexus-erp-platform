import type { RoleId } from '../types/erp';

export const ROLE_PERMISSIONS: Record<RoleId, RoleId[]> = {
  management: ['management', 'strategic', 'qaqc', 'purchase', 'production', 'store', 'marketing', 'workflow', 'reports', 'initiate'],
  strategic:  ['strategic', 'management', 'reports'],
  qaqc:       ['qaqc', 'reports'],
  purchase:   ['purchase', 'reports'],
  production: ['production', 'reports'],
  store:      ['store', 'reports'],
  marketing:  ['marketing', 'reports'],
  workflow:   ['workflow', 'reports'],
  reports:    ['reports'],
  initiate:   ['initiate', 'reports']
};
