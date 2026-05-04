import { archetypeContent, presets } from './data.ts';
import type {
  CatalogState,
  ExportContext,
  ExportContextKey,
  HeroContent,
  HeroOverrideKey,
  LiveDimensionKey,
  LiveDimensions,
  Preset,
} from './types.ts';

export const emptyContentOverrides = {
  eyebrow: null,
  title: null,
  copy: null,
  cta: null,
  body: null,
};

export const defaultExportContext: ExportContext = {
  audience: 'product teams shipping a vivid first web surface',
  jobsToBeDone: 'choose a visual direction, inspect core states, and export implementation guidance',
  antiReferences: 'generic blue SaaS dashboards and low-contrast template sections',
  motionIntent: 'responsive micro-interactions only; no motion required for comprehension',
  accessibilityLevel: 'WCAG 2.2 AA',
  contentSample: 'Use the resolved hero copy and specimen states as the source content sample',
  antiDefaults: 'avoid generic SaaS sameness, low contrast, missing states, and non-shareable configuration',
  exportFormat: 'xml',
};

export const defaultState: CatalogState = {
  preset: 'neobrutalist',
  archetype: 'saas',
  mode: 'both',
  heroLayout: 'hero+features',
  live: presets.neobrutalist.live,
  departedFromPreset: false,
  contentOverrides: emptyContentOverrides,
  exportContext: defaultExportContext,
};

export function mergeState(patch: Partial<CatalogState>, current: CatalogState): CatalogState {
  return { ...current, ...patch };
}

export function applyPreset(preset: Preset, current: CatalogState): CatalogState {
  return {
    ...current,
    preset,
    live: presets[preset].live,
    departedFromPreset: false,
  };
}

export function updateLiveDimension<K extends LiveDimensionKey>(
  key: K,
  value: LiveDimensions[K],
  current: CatalogState,
): CatalogState {
  return {
    ...current,
    live: {
      ...current.live,
      [key]: value,
    },
    departedFromPreset: current.live[key] === value ? current.departedFromPreset : true,
  };
}

export function updateContentOverride(
  key: HeroOverrideKey,
  value: string | null,
  current: CatalogState,
): CatalogState {
  const normalized = value === '' ? null : value;
  return {
    ...current,
    contentOverrides: {
      ...current.contentOverrides,
      [key]: normalized,
    },
  };
}

export function updateExportContext<K extends ExportContextKey>(
  key: K,
  value: ExportContext[K],
  current: CatalogState,
): CatalogState {
  return {
    ...current,
    exportContext: {
      ...current.exportContext,
      [key]: value,
    },
  };
}

export function resolveHeroContent(state: CatalogState): HeroContent {
  const defaults = archetypeContent[state.archetype].hero;
  return {
    ...defaults,
    eyebrow: state.contentOverrides.eyebrow ?? defaults.eyebrow,
    title: state.contentOverrides.title ?? defaults.title,
    copy: state.contentOverrides.copy ?? defaults.copy,
    cta: state.contentOverrides.cta ?? defaults.cta,
    body: state.contentOverrides.body ?? defaults.body,
  };
}
