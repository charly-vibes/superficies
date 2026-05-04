import type { Archetype, ArchetypeContent, BodyFont, Preset, PresetDefinition, Typography } from './types.ts';

export const validBodyFonts: Record<Typography, BodyFont[]> = {
  chunky: ['system'],
  system: ['system', 'serif'],
  serif: ['serif', 'system'],
};

export const defaultBodyFonts: Record<Typography, BodyFont> = {
  chunky: 'system',
  system: 'system',
  serif: 'serif',
};

export const presets: Record<Preset, PresetDefinition> = {
  neobrutalist: {
    id: 'neobrutalist',
    label: 'Neobrutalist',
    live: {
      typography: 'chunky',
      bodyFont: 'system',
      color: 'acid',
      spacing: 'balanced',
      density: 'comfortable',
      radius: 'sharp',
      surface: 'outlined',
    },
  },
  softSaas: {
    id: 'softSaas',
    label: 'Soft SaaS',
    live: {
      typography: 'system',
      bodyFont: 'system',
      color: 'sky',
      spacing: 'loose',
      density: 'roomy',
      radius: 'soft',
      surface: 'elevated',
    },
  },
  warmEditorial: {
    id: 'warmEditorial',
    label: 'Warm Editorial',
    live: {
      typography: 'serif',
      bodyFont: 'serif',
      color: 'sepia',
      spacing: 'loose',
      density: 'comfortable',
      radius: 'soft',
      surface: 'flat',
    },
  },
};

export const archetypeContent: Record<Archetype, ArchetypeContent> = {
  saas: {
    hero: {
      eyebrow: 'SaaS dashboard',
      title: 'Operate your product with a clearer visual system.',
      copy: 'Preview a thin vertical slice of a token-driven interface with exportable design context.',
      cta: 'Export brief',
      body: 'A command center for teams that need fast decisions, reliable telemetry, and a brand system that can scale beyond a first pass.',
      features: ['Operational clarity', 'Token-aware UI', 'Fast launch path'],
    },
  },
  restaurant: {
    hero: {
      eyebrow: 'Neighborhood restaurant',
      title: 'Shape a memorable dining brand before a full redesign.',
      copy: 'Compare layout tone, specimen styling, and token direction in one compact preview.',
      cta: 'View menu system',
      body: 'A warm, tactile surface for menus, reservations, events, and hospitality moments that need to feel local and polished.',
      features: ['Menu storytelling', 'Reservation flow', 'Seasonal campaigns'],
    },
  },
  editorial: {
    hero: {
      eyebrow: 'Editorial platform',
      title: 'Tune hierarchy, rhythm, and reading surfaces with confidence.',
      copy: 'Use the catalog shell to sanity-check a visual direction before generating a full brief.',
      cta: 'Review issue package',
      body: 'A publishing surface for long reads, opinion packages, newsletters, and archive browsing with deliberate type rhythm.',
      features: ['Reading rhythm', 'Issue packaging', 'Archive depth'],
    },
  },
};
