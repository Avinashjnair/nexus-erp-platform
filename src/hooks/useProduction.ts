import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MaterialRequest } from '../types/erp';
import { productionService } from '../services/productionService';

export const productionKeys = {
  activities: ['production-activities'] as const,
  materialRequests: ['material-requests'] as const,
};

export function useProductionActivities() {
  return useQuery({
    queryKey: productionKeys.activities,
    queryFn: productionService.getAllActivities,
    staleTime: 30_000,
  });
}

export function useMaterialRequests() {
  return useQuery({
    queryKey: productionKeys.materialRequests,
    queryFn: productionService.getAllMaterialRequests,
    staleTime: 30_000,
  });
}

export function useCreateMR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mr: MaterialRequest) => productionService.createMR(mr),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productionKeys.materialRequests }),
  });
}

export function useIssueMR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productionService.issueMR(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productionKeys.materialRequests }),
  });
}

export function useUpdateActivityProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      productionService.updateActivityProgress(id, progress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productionKeys.activities }),
  });
}
