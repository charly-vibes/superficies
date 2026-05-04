import { defaultState } from './state';
import type { Archetype, CatalogState, Mode } from './types';

const archetypes: Archetype[] = ['saas', 'restaurant', 'editorial'];
const modes: Mode[] = ['light', 'dark', 'both'];

export function readStateFromHash(hash: string): CatalogState {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const archetype = params.get('a');
  const mode = params.get('m');

  return {
    preset: 'neobrutalist',
    archetype: isArchetype(archetype) ? archetype : defaultState.archetype,
    mode: isMode(mode) ? mode : defaultState.mode,
  };
}

export function writeStateToHash(state: CatalogState): string {
  const params = new URLSearchParams();
  params.set('a', state.archetype);
  params.set('m', state.mode);
  return `#${params.toString()}`;
}

function isArchetype(value: string | null): value is Archetype {
  return value !== null && archetypes.includes(value as Archetype);
}

function isMode(value: string | null): value is Mode {
  return value !== null && modes.includes(value as Mode);
}
