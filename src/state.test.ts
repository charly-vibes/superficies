import test from 'node:test';
import assert from 'node:assert/strict';

import { presets } from './data.ts';
import { applyPreset, defaultState, updateLiveDimension } from './state.ts';

test('default state starts from the neobrutalist preset dimensions', () => {
  assert.deepEqual(defaultState.live, presets.neobrutalist.live);
  assert.equal(defaultState.departedFromPreset, false);
});

test('applyPreset preserves the current archetype and clears departure tracking', () => {
  const custom = updateLiveDimension('radius', 'pill', { ...defaultState, archetype: 'editorial' });

  assert.deepEqual(applyPreset('warmEditorial', custom), {
    ...custom,
    preset: 'warmEditorial',
    archetype: 'editorial',
    live: presets.warmEditorial.live,
    departedFromPreset: false,
  });
});

test('manual edits mark state as custom while preserving preset provenance', () => {
  const next = updateLiveDimension('density', 'compact', defaultState);

  assert.equal(next.preset, 'neobrutalist');
  assert.equal(next.departedFromPreset, true);
  assert.equal(next.live.density, 'compact');
});
