import './styles/app.css';

import { readStateFromHash, writeStateToHash } from './hash';
import { attachExportInteractions, renderApp } from './render';
import { defaultState, mergeState } from './state';
import type { Archetype, CatalogState, Mode } from './types';

const target = document.querySelector<HTMLElement>('#app');

if (!target) {
  throw new Error('Missing #app root');
}

const appRoot = target;

let state = initializeState();
commit(state);

window.addEventListener('hashchange', () => {
  state = readStateFromHash(window.location.hash);
  commit(state, false);
});

function initializeState(): CatalogState {
  const next = readStateFromHash(window.location.hash);
  return next.preset ? next : defaultState;
}

function commit(nextState: CatalogState, syncHash = true): void {
  state = nextState;
  renderApp(appRoot, state);
  attachExportInteractions(appRoot, state);
  bindControls();

  if (syncHash) {
    const nextHash = writeStateToHash(state);
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', nextHash);
    }
  }
}

function bindControls(): void {
  const archetypeSelect = appRoot.querySelector<HTMLSelectElement>('select[name="archetype"]');
  const modeSelect = appRoot.querySelector<HTMLSelectElement>('select[name="mode"]');

  archetypeSelect?.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as Archetype;
    commit(mergeState({ archetype: value }, state));
  });

  modeSelect?.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as Mode;
    commit(mergeState({ mode: value }, state));
  });
}
