import type { ProductionActivity, MaterialRequest } from '../types/erp';
import { mockGet, mockMutate } from './api';
import { useNexusStore } from '../store/useNexusStore';

export const productionService = {
  async getAllActivities(): Promise<ProductionActivity[]> {
    return mockGet(() => useNexusStore.getState().activities);
  },

  async updateActivityProgress(id: string, progress: number): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().updateActivityProgress(id, progress);
    });
  },

  async getAllMaterialRequests(): Promise<MaterialRequest[]> {
    return mockGet(() => useNexusStore.getState().materialRequests);
  },

  async createMR(mr: MaterialRequest): Promise<MaterialRequest> {
    return mockMutate(() => {
      useNexusStore.getState().addMR(mr);
      return mr;
    });
  },

  async issueMR(id: string): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().issueMR(id);
    });
  },
};
