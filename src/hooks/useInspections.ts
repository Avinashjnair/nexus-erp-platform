import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InspectionRequest, InspectionReport, NCR } from '../types/erp';
import { qaqcService } from '../services/qaqcService';

export const qaqcKeys = {
  irs: ['inspection-requests'] as const,
  ncrs: ['ncrs'] as const,
  reports: ['inspection-reports'] as const,
};

export function useInspectionRequests() {
  return useQuery({
    queryKey: qaqcKeys.irs,
    queryFn: qaqcService.getAllIRs,
    staleTime: 30_000,
  });
}

export function useNCRs() {
  return useQuery({
    queryKey: qaqcKeys.ncrs,
    queryFn: qaqcService.getAllNCRs,
    staleTime: 30_000,
  });
}

export function useInspectionReports() {
  return useQuery({
    queryKey: qaqcKeys.reports,
    queryFn: qaqcService.getAllReports,
    staleTime: 60_000,
  });
}

export function useCreateIR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ir: InspectionRequest) => qaqcService.createIR(ir),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qaqcKeys.irs }),
  });
}

export function useCreateNCR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ncr: NCR) => qaqcService.createNCR(ncr),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qaqcKeys.ncrs }),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (report: InspectionReport) => qaqcService.createReport(report),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qaqcKeys.reports }),
  });
}

export function useUpdateIRStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InspectionRequest['status'] }) =>
      qaqcService.updateIRStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qaqcKeys.irs }),
  });
}
