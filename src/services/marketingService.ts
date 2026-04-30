import type { Tender, Quotation, ClientHealth, CompetitorBid, InternalApproval, ClientActivity, TenderCostEntry } from '../types/erp';
import { mockGet, mockMutate } from './api';
import { useNexusStore } from '../store/useNexusStore';

export const marketingService = {
  async getAllTenders(): Promise<Tender[]> {
    return mockGet(() => useNexusStore.getState().tenders);
  },

  async getAllQuotations(): Promise<Quotation[]> {
    return mockGet(() => useNexusStore.getState().quotations);
  },

  async getAllClients(): Promise<ClientHealth[]> {
    return mockGet(() => useNexusStore.getState().clients);
  },

  async updateClientHealth(id: string, updates: Partial<ClientHealth>): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().updateClientHealth(id, updates);
    });
  },

  async getAllCompetitorBids(): Promise<CompetitorBid[]> {
    return mockGet(() => useNexusStore.getState().competitorBids);
  },

  async addCompetitorBid(bid: CompetitorBid): Promise<CompetitorBid> {
    return mockMutate(() => {
      useNexusStore.getState().addCompetitorBid(bid);
      return bid;
    });
  },

  async getAllInternalApprovals(): Promise<InternalApproval[]> {
    return mockGet(() => useNexusStore.getState().internalApprovals);
  },

  async updateInternalApproval(id: string, updates: Partial<InternalApproval>): Promise<void> {
    return mockMutate(() => {
      useNexusStore.getState().updateInternalApproval(id, updates);
    });
  },

  async getAllClientActivities(): Promise<ClientActivity[]> {
    return mockGet(() => useNexusStore.getState().clientActivities);
  },

  async addClientActivity(activity: ClientActivity): Promise<ClientActivity> {
    return mockMutate(() => {
      useNexusStore.getState().addClientActivity(activity);
      return activity;
    });
  },

  async getTenderCosts(projectId?: string): Promise<TenderCostEntry[]> {
    return mockGet(() => {
      const costs = useNexusStore.getState().tenderCosts;
      return projectId ? costs.filter(c => c.projectId === projectId) : costs;
    });
  },
};
