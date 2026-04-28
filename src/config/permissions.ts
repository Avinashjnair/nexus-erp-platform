import type { RoleId } from '../types/erp';

// Define exactly which navigation IDs each role is allowed to see in the Sidebar.
export const ROLE_PERMISSIONS: Record<RoleId, RoleId[]> = {
  // Management only sees high-level dashboards, project initiation, and analytics
  management: ['management', 'strategic', 'initiate', 'workflow', 'reports'],
  
  // Departmental Roles are strictly siloed to their module + reports
  marketing:  ['marketing', 'reports'],
  purchase:   ['purchase', 'reports'],
  qaqc:       ['qaqc', 'reports'],
  production: ['production', 'reports'],
  store:      ['store', 'reports'],
  
  // Specialized Data Roles
  strategic:  ['strategic', 'reports'],
  workflow:   ['workflow', 'reports'],
  reports:    ['reports'],
  initiate:   ['initiate', 'reports']
};
