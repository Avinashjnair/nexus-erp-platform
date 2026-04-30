import type { Project } from '../types/erp';
import { mockGet, mockMutate } from './api';
import { useNexusStore } from '../store/useNexusStore';

export const projectService = {
  async getAll(): Promise<Project[]> {
    return mockGet(() => useNexusStore.getState().projects);
  },

  async getById(id: string): Promise<Project | null> {
    return mockGet(() => useNexusStore.getState().projects.find(p => p.id === id) ?? null);
  },

  async create(project: Project): Promise<Project> {
    return mockMutate(() => {
      useNexusStore.getState().addProject(project);
      return project;
    });
  },
};
