import { useQuery } from '@tanstack/react-query';
import { storeService } from '../services/storeService';

export const inventoryKeys = {
  all: ['inventory'] as const,
  critical: ['inventory', 'critical'] as const,
  low: ['inventory', 'low'] as const,
};

export function useInventory() {
  return useQuery({
    queryKey: inventoryKeys.all,
    queryFn: storeService.getAllSKUs,
    staleTime: 60_000,
  });
}

export function useCriticalStock() {
  return useQuery({
    queryKey: inventoryKeys.critical,
    queryFn: storeService.getCriticalSKUs,
    staleTime: 60_000,
  });
}
