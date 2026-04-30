import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project } from '../types/erp';
import { projectService } from '../services/projectService';

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: projectService.getAll,
    staleTime: 60_000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectService.getById(id),
    staleTime: 60_000,
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Project) => projectService.create(project),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
