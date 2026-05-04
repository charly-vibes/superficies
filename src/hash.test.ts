import test from 'node:test';
import assert from 'node:assert/strict';

import { readStateFromHash, writeStateToHash } from './hash.ts';
import { defaultState } from './state.ts';
import type { CatalogState } from './types.ts';

test('writeStateToHash serializes supported state deterministically with compact aliases', () => {
  const state: CatalogState = {
    ...defaultState,
    archetype: 'restaurant',
    mode: 'dark',
  };

  assert.equal(writeStateToHash(state), '#p=n&a=r&m=d&hl=hf&ty=c&co=a&sp=b&de=m&ra=h&su=o&cu=0');
});

test('readStateFromHash round-trips valid supported fields', () => {
  const original: CatalogState = {
    ...defaultState,
    archetype: 'editorial',
    mode: 'light',
    live: { ...defaultState.live, density: 'compact', radius: 'pill' },
    departedFromPreset: true,
    exportContext: {
      ...defaultState.exportContext,
      audience: 'municipal teams',
      jobsToBeDone: 'explain permit status clearly',
      antiReferences: 'opaque enterprise portals',
      motionIntent: 'reduced motion first',
      accessibilityLevel: 'WCAG 2.2 AAA',
      contentSample: 'Permit 4421 is ready for review',
      antiDefaults: 'avoid gray admin tables',
      exportFormat: 'markdown',
    },
  };

  assert.deepEqual(readStateFromHash(writeStateToHash(original)), original);
});

test('readStateFromHash accepts compact aliases', () => {
  assert.deepEqual(readStateFromHash('#p=n&a=e&m=l&hl=hf&ty=c&co=a&sp=b&de=m&ra=h&su=o&cu=0'), {
    ...defaultState,
    archetype: 'editorial',
    mode: 'light',
  });
});

test('readStateFromHash falls back to defaults for unsupported values', () => {
  assert.deepEqual(readStateFromHash('#p=unknown&a=unknown&m=glow'), defaultState);
});

test('readStateFromHash falls back to defaults when the hash is missing', () => {
  assert.deepEqual(readStateFromHash(''), defaultState);
});
