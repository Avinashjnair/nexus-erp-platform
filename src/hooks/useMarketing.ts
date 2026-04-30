import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CompetitorBid, ClientHealth, InternalApproval, ClientActivity } from '../types/erp';
import { marketingService } from '../services/marketingService';

export const marketingKeys = {
  tenders: ['tenders'] as const,
  quotations: ['quotations'] as const,
  clients: ['clients'] as const,
  competitorBids: ['competitor-bids'] as const,
  internalApprovals: ['internal-approvals'] as const,
  clientActivities: ['client-activities'] as const,
};

export function useTenders() {
  return useQuery({
    queryKey: marketingKeys.tenders,
    queryFn: marketingService.getAllTenders,
    staleTime: 60_000,
  });
}

export function useClients() {
  return useQuery({
    queryKey: marketingKeys.clients,
    queryFn: marketingService.getAllClients,
    staleTime: 60_000,
  });
}

export function useCompetitorBids() {
  return useQuery({
    queryKey: marketingKeys.competitorBids,
    queryFn: marketingService.getAllCompetitorBids,
    staleTime: 120_000,
  });
}

export function useInternalApprovals() {
  return useQuery({
    queryKey: marketingKeys.internalApprovals,
    queryFn: marketingService.getAllInternalApprovals,
    staleTime: 30_000,
  });
}

export function useClientActivities() {
  return useQuery({
    queryKey: marketingKeys.clientActivities,
    queryFn: marketingService.getAllClientActivities,
    staleTime: 30_000,
  });
}

export function useUpdateInternalApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InternalApproval> }) =>
      marketingService.updateInternalApproval(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: marketingKeys.internalApprovals }),
  });
}

export function useAddCompetitorBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bid: CompetitorBid) => marketingService.addCompetitorBid(bid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: marketingKeys.competitorBids }),
  });
}

export function useAddClientActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activity: ClientActivity) => marketingService.addClientActivity(activity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: marketingKeys.clientActivities }),
  });
}

export function useUpdateClientHealth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ClientHealth> }) =>
      marketingService.updateClientHealth(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: marketingKeys.clients }),
  });
}
