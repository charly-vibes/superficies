import type { Archetype, ArchetypeContent } from './types';

export const archetypeContent: Record<Archetype, ArchetypeContent> = {
  saas: {
    eyebrow: 'SaaS dashboard',
    title: 'Operate your product with a clearer visual system.',
    copy: 'Preview a thin vertical slice of a token-driven interface with exportable design context.',
    cta: 'Export brief',
  },
  restaurant: {
    eyebrow: 'Neighborhood restaurant',
    title: 'Shape a memorable dining brand before a full redesign.',
    copy: 'Compare layout tone, specimen styling, and token direction in one compact preview.',
    cta: 'View menu system',
  },
  editorial: {
    eyebrow: 'Editorial platform',
    title: 'Tune hierarchy, rhythm, and reading surfaces with confidence.',
    copy: 'Use the catalog shell to sanity-check a visual direction before generating a full brief.',
    cta: 'Review issue package',
  },
};
