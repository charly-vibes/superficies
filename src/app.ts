import { readStateFromHash, writeStateToHash } from './hash.ts';
import { mergeState } from './state.ts';
import type { CatalogState } from './types.ts';

export type StateUpdate = Partial<CatalogState> | ((current: CatalogState) => CatalogState);

export interface CatalogControllerDeps {
  getHash: () => string;
  replaceHash: (hash: string) => void;
  render: (state: CatalogState) => void;
  attachExportInteractions: (state: CatalogState) => void;
  bindControls: (onPatch: (patch: StateUpdate) => void) => void;
}

export function resolveInitialState(hash: string): CatalogState {
  return readStateFromHash(hash);
}

export function createCatalogController(deps: CatalogControllerDeps) {
  let state = resolveInitialState(deps.getHash());

  function applyState(nextState: CatalogState, syncHash: boolean): void {
    state = nextState;
    deps.render(state);
    deps.attachExportInteractions(state);
    deps.bindControls((patch) => {
      const nextState = typeof patch === 'function' ? patch(state) : mergeState(patch, state);
      applyState(nextState, true);
    });

    if (!syncHash) {
      return;
    }

    const nextHash = writeStateToHash(state);
    if (deps.getHash() !== nextHash) {
      deps.replaceHash(nextHash);
    }
  }

  return {
    initialize(): void {
      applyState(state, true);
    },
    onHashChange(): void {
      applyState(resolveInitialState(deps.getHash()), false);
    },
  };
}
