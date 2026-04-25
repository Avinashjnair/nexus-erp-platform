import { useMemo } from 'react';
import { useNexusStore } from '../store/useNexusStore';

export interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'pr' | 'ir' | 'vendor' | 'tender' | 'quotation';
  sub: string;
}

const useGlobalSearch = (query: string) => {
  const { 
    projects, purchaseRequests, inspectionRequests, 
    vendors, tenders, quotations, currentRole 
  } = useNexusStore();

  const results = useMemo(() => {
    if (!query || query.length < 2) return { projects: [], prs: [], irs: [], vendors: [], tenders: [], quotes: [], all: [] };

    const q = query.toLowerCase();
    const isManager = currentRole === 'management';
    const isMarketing = currentRole === 'marketing';

    const filteredProjects = projects
      .filter(p => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      .map(p => ({ id: p.id, title: p.title, type: 'project' as const, sub: `Project ID: ${p.id}` }));

    const filteredPRs = (isManager || currentRole === 'purchase') 
      ? purchaseRequests
          .filter(p => p.item.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
          .map(p => ({ id: p.id, title: p.item, type: 'pr' as const, sub: `${p.id} — ${p.status}` }))
      : [];

    const filteredIRs = (isManager || currentRole === 'qaqc' || currentRole === 'production') 
      ? inspectionRequests
          .filter(i => i.activity.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
          .map(i => ({ id: i.id, title: i.activity, type: 'ir' as const, sub: `${i.id} — ${i.status}` }))
      : [];

    const filteredVendors = (isManager || currentRole === 'purchase')
      ? vendors
          .filter(v => v.name.toLowerCase().includes(q))
          .map(v => ({ id: v.id, title: v.name, type: 'vendor' as const, sub: v.category }))
      : [];

    // Marketing specific searches
    const filteredTenders = (isManager || isMarketing)
      ? tenders
          .filter(t => t.title.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q))
          .map(t => ({ id: t.id, title: t.title, type: 'tender' as const, sub: `${t.ref} — ${t.client}` }))
      : [];

    const filteredQuotes = (isManager || isMarketing)
      ? (quotations || [])
          .filter(quote => quote.title.toLowerCase().includes(q) || quote.id.toLowerCase().includes(q))
          .map(quote => ({ id: quote.id, title: quote.title, type: 'quotation' as const, sub: `${quote.client} — AED ${quote.value.toLocaleString()}` }))
      : [];

    const all = [...filteredProjects, ...filteredPRs, ...filteredIRs, ...filteredVendors, ...filteredTenders, ...filteredQuotes];

    return {
      projects: filteredProjects,
      prs: filteredPRs,
      irs: filteredIRs,
      vendors: filteredVendors,
      tenders: filteredTenders,
      quotes: filteredQuotes,
      all: all.slice(0, 10)
    };
  }, [query, projects, purchaseRequests, inspectionRequests, vendors, tenders, quotations, currentRole]);

  return results;
};

export default useGlobalSearch;
