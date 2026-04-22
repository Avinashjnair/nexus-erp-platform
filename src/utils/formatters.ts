export const formatCurrency = (val: number, cur: string = 'AED') => {
  if (typeof val !== 'number') return val;
  if (val >= 1000000) return `${cur} ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${cur} ${(val / 1000).toFixed(0)}K`;
  return `${cur} ${val.toLocaleString()}`;
};

export const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    'pending': 'badge-amber',
    'approved': 'badge-blue',
    'po-issued': 'badge-teal',
    'delivered': 'badge-green',
    'rejected': 'badge-red',
    'on-track': 'badge-green',
    'delayed': 'badge-amber',
    'near-complete': 'badge-teal',
    'scheduled': 'badge-blue',
    'closed': 'badge-gray',
    'open': 'badge-red',
    'in-progress': 'badge-blue',
    'ahead': 'badge-green',
    'behind': 'badge-red',
    'pass': 'badge-green',
    'fail': 'badge-red'
  };
  return map[status.toLowerCase()] || 'badge-gray';
};

export const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'pending': 'Pending',
    'approved': 'Approved',
    'po-issued': 'PO Issued',
    'delivered': 'Delivered ✓',
    'rejected': 'Rejected',
    'on-track': 'On Track',
    'delayed': 'Delayed',
    'near-complete': 'Near Complete',
    'scheduled': 'Scheduled',
    'closed': 'Closed',
    'open': 'Open',
    'in-progress': 'In Progress',
    'ahead': 'Ahead',
    'behind': 'Behind',
    'pass': 'Pass',
    'fail': 'Fail'
  };
  return map[status.toLowerCase()] || status;
};

export const formatStatus = getStatusLabel;
