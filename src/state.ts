import { presets } from './data.ts';
import type { CatalogState, LiveDimensionKey, LiveDimensions, Preset } from './types.ts';

export const defaultState: CatalogState = {
  preset: 'neobrutalist',
  archetype: 'saas',
  mode: 'both',
  live: presets.neobrutalist.live,
  departedFromPreset: false,
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
