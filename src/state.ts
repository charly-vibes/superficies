import type { CatalogState } from './types';

export const defaultState: CatalogState = {
  preset: 'neobrutalist',
  archetype: 'saas',
  mode: 'both',
};

export function mergeState(patch: Partial<CatalogState>, current: CatalogState): CatalogState {
  return { ...current, ...patch };
}
