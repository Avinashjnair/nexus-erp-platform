import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PurchaseRequest } from '../types/erp';
import { purchaseService } from '../services/purchaseService';

export const purchaseKeys = {
  prs: ['purchase-requests'] as const,
  vendors: ['vendors'] as const,
};

export function usePurchaseRequests() {
  return useQuery({
    queryKey: purchaseKeys.prs,
    queryFn: purchaseService.getAllPRs,
    staleTime: 30_000,
  });
}

export function useVendors() {
  return useQuery({
    queryKey: purchaseKeys.vendors,
    queryFn: purchaseService.getAllVendors,
    staleTime: 120_000,
  });
}

export function useCreatePR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pr: PurchaseRequest) => purchaseService.createPR(pr),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseKeys.prs }),
  });
}

export function useApprovePR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseService.approvePR(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseKeys.prs }),
  });
}

export function useRejectPR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseService.rejectPR(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseKeys.prs }),
  });
}
