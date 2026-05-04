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

  assert.equal(writeStateToHash(state), '#p=n&a=r&m=d&hl=hf&ty=c&bf=s&co=a&sp=b&de=m&ra=h&su=o&cu=0');
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

test('readStateFromHash accepts compact aliases without bf param and derives bodyFont from typography', () => {
  assert.deepEqual(readStateFromHash('#p=n&a=e&m=l&hl=hf&ty=c&co=a&sp=b&de=m&ra=h&su=o&cu=0'), {
    ...defaultState,
    archetype: 'editorial',
    mode: 'light',
  });
});

test('readStateFromHash accepts explicit bf param', () => {
  const result = readStateFromHash('#p=n&a=s&m=l&hl=hf&ty=s&bf=f&co=a&sp=b&de=m&ra=h&su=o&cu=0');
  assert.equal(result.live.bodyFont, 'serif');
});

test('readStateFromHash falls back to defaults for unsupported values', () => {
  assert.deepEqual(readStateFromHash('#p=unknown&a=unknown&m=glow'), defaultState);
});

test('readStateFromHash falls back to defaults when the hash is missing', () => {
  assert.deepEqual(readStateFromHash(''), defaultState);
});

test('writeStateToHash falls back to base64 when readable hash exceeds threshold', () => {
  const longText = 'a'.repeat(450);
  const state: CatalogState = {
    ...defaultState,
    contentOverrides: { ...defaultState.contentOverrides, copy: longText },
  };

  const hash = writeStateToHash(state);
  assert.match(hash, /^#b64=/);
});

test('readStateFromHash round-trips fallback base64 hash back to original state', () => {
  const longText = 'a'.repeat(450);
  const state: CatalogState = {
    ...defaultState,
    contentOverrides: { ...defaultState.contentOverrides, copy: longText },
  };

  assert.deepEqual(readStateFromHash(writeStateToHash(state)), state);
});

test('readStateFromHash returns default state for malformed base64 fallback', () => {
  assert.deepEqual(readStateFromHash('#b64=!!!notbase64!!!'), defaultState);
});
