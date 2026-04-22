import { useMemo } from 'react';
import { useNexusStore } from '../store/useNexusStore';

export interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'pr' | 'ir' | 'vendor';
  sub: string;
}

const useGlobalSearch = (query: string) => {
  const { projects, purchaseRequests, inspectionRequests, vendors } = useNexusStore();

  const results = useMemo(() => {
    if (!query || query.length < 2) return { projects: [], prs: [], irs: [], vendors: [], all: [] };

    const q = query.toLowerCase();

    const filteredProjects = projects
      .filter(p => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      .map(p => ({ id: p.id, title: p.title, type: 'project' as const, sub: `Project ID: ${p.id}` }));

    const filteredPRs = purchaseRequests
      .filter(p => p.item.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      .map(p => ({ id: p.id, title: p.item, type: 'pr' as const, sub: `${p.id} — ${p.status}` }));

    const filteredIRs = inspectionRequests
      .filter(i => i.activity.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
      .map(i => ({ id: i.id, title: i.activity, type: 'ir' as const, sub: `${i.id} — ${i.status}` }));

    const filteredVendors = vendors
      .filter(v => v.name.toLowerCase().includes(q))
      .map(v => ({ id: v.id, title: v.name, type: 'vendor' as const, sub: v.category }));

    const all = [...filteredProjects, ...filteredPRs, ...filteredIRs, ...filteredVendors];

    return {
      projects: filteredProjects,
      prs: filteredPRs,
      irs: filteredIRs,
      vendors: filteredVendors,
      all: all.slice(0, 8) // Limit global results
    };
  }, [query, projects, purchaseRequests, inspectionRequests, vendors]);

  return results;
};

export default useGlobalSearch;
