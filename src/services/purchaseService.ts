import type { PurchaseRequest, Vendor } from '../types/erp';
import { mockGet, mockMutate } from './api';
import { useNexusStore } from '../store/useNexusStore';

export const purchaseService = {
  async getAllPRs(): Promise<PurchaseRequest[]> {
    return mockGet(() => useNexusStore.getState().purchaseRequests);
  },

  async getPRsByProject(projectId: string): Promise<PurchaseRequest[]> {
    return mockGet(() =>
      useNexusStore.getState().purchaseRequests.filter(pr => pr.project === projectId)
    );
  },

  async createPR(pr: PurchaseRequest): Promise<PurchaseRequest> {
    return mockMutate(() => {
      useNexusStore.getState().addPR(pr);
      return pr;
    });
  },

  async approvePR(id: string): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().approvePR(id);
    });
  },

  async rejectPR(id: string): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().rejectPR(id);
    });
  },

  async getAllVendors(): Promise<Vendor[]> {
    return mockGet(() => useNexusStore.getState().vendors);
  },
};
