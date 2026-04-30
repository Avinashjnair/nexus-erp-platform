import type { InspectionRequest, InspectionReport, NCR } from '../types/erp';
import { mockGet, mockMutate } from './api';
import { useNexusStore } from '../store/useNexusStore';

export const qaqcService = {
  async getAllIRs(): Promise<InspectionRequest[]> {
    return mockGet(() => useNexusStore.getState().inspectionRequests);
  },

  async createIR(ir: InspectionRequest): Promise<InspectionRequest> {
    return mockMutate(() => {
      useNexusStore.getState().addIR(ir);
      return ir;
    });
  },

  async updateIRStatus(id: string, status: InspectionRequest['status']): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().updateIRStatus(id, status);
    });
  },

  async getAllNCRs(): Promise<NCR[]> {
    return mockGet(() => useNexusStore.getState().ncrs);
  },

  async createNCR(ncr: NCR): Promise<NCR> {
    return mockMutate(() => {
      useNexusStore.getState().addNCR(ncr);
      return ncr;
    });
  },

  async getAllReports(): Promise<InspectionReport[]> {
    return mockGet(() => useNexusStore.getState().reports);
  },

  async createReport(report: InspectionReport): Promise<InspectionReport> {
    return mockMutate(() => {
      useNexusStore.getState().addReport(report);
      return report;
    });
  },
};
