import type { SKU } from '../types/erp';
import { mockGet } from './api';
import { useNexusStore } from '../store/useNexusStore';

export const storeService = {
  async getAllSKUs(): Promise<SKU[]> {
    return mockGet(() => useNexusStore.getState().inventory);
  },

  async getCriticalSKUs(): Promise<SKU[]> {
    return mockGet(() =>
      useNexusStore.getState().inventory.filter(s => s.status === 'critical')
    );
  },

  async getLowSKUs(): Promise<SKU[]> {
    return mockGet(() =>
      useNexusStore.getState().inventory.filter(s => s.status !== 'ok')
    );
  },
};
