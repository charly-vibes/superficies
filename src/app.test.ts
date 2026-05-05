import test from 'node:test';
import assert from 'node:assert/strict';

import { createCatalogController, resolveInitialState } from './app.ts';
import { defaultState } from './state.ts';
import type { CatalogState } from './types.ts';

test('resolveInitialState returns the vivid default when the hash is unrecognized', () => {
  assert.deepEqual(resolveInitialState('#bogus=true'), defaultState);
});

test('controller commits rerender and synchronize the hash deterministically', () => {
  const rendered: CatalogState[] = [];
  const attached: CatalogState[] = [];
  const bound: Array<(patch: Partial<CatalogState>) => void> = [];
  const synced: string[] = [];

  let hash = '';

  const controller = createCatalogController({
    getHash: () => hash,
    replaceHash: (nextHash) => {
      hash = nextHash;
      synced.push(nextHash);
    },
    render: (state) => rendered.push(state),
    attachExportInteractions: (state) => attached.push(state),
    bindControls: (onPatch) => bound.push(onPatch),
  });

  controller.initialize();
  bound.at(-1)?.({ mode: 'dark' });

  assert.deepEqual(rendered, [
    defaultState,
    { ...defaultState, mode: 'dark' },
  ]);
  assert.deepEqual(attached, rendered);
  assert.equal(synced.at(-1), '#p=n&a=s&m=d&hl=hf&ty=c&bf=s&co=a&sp=b&de=m&ra=h&su=o&sr=1.5&bs=1rem&cu=0');
});

test('controller hash changes recover safely to the default state without rewriting the hash', () => {
  const rendered: CatalogState[] = [];
  const synced: string[] = [];
  let hash = '#a=broken&m=nope';

  const controller = createCatalogController({
    getHash: () => hash,
    replaceHash: (nextHash) => synced.push(nextHash),
    render: (state) => rendered.push(state),
    attachExportInteractions: () => undefined,
    bindControls: () => undefined,
  });

  controller.onHashChange();

  assert.deepEqual(rendered, [defaultState]);
  assert.deepEqual(synced, []);
});
