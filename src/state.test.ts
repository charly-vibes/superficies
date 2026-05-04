import test from 'node:test';
import assert from 'node:assert/strict';

import { presets } from './data.ts';
import { applyPreset, defaultState, updateExportContext, updateLiveDimension, updateTypography } from './state.ts';

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

test('export-only context edits do not restyle preview dimensions', () => {
  const next = updateExportContext('audience', 'boutique hotels', defaultState);

  assert.equal(next.exportContext.audience, 'boutique hotels');
  assert.equal(next.preset, defaultState.preset);
  assert.deepEqual(next.live, defaultState.live);
  assert.equal(next.departedFromPreset, defaultState.departedFromPreset);
});

test('updateTypography resets body font when new display font invalidates current pairing', () => {
  // system display allows serif body; switching to chunky display does not
  const withSerifBody = updateLiveDimension('bodyFont', 'serif', {
    ...defaultState,
    live: { ...defaultState.live, typography: 'system', bodyFont: 'system' },
  });
  assert.equal(withSerifBody.live.bodyFont, 'serif');

  const switched = updateTypography('chunky', withSerifBody);
  assert.equal(switched.live.typography, 'chunky');
  assert.equal(switched.live.bodyFont, 'system'); // serif is invalid for chunky; reset to default
  assert.equal(switched.departedFromPreset, true);
});

test('updateTypography preserves body font when pairing remains valid', () => {
  // system display allows serif body; switching to serif display also allows serif body
  const withSerifBody = { ...defaultState, live: { ...defaultState.live, typography: 'system' as const, bodyFont: 'serif' as const } };
  const switched = updateTypography('serif', withSerifBody);
  assert.equal(switched.live.typography, 'serif');
  assert.equal(switched.live.bodyFont, 'serif'); // still valid for serif display
});

test('updateTypography marks departure only when something actually changed', () => {
  const current = { ...defaultState, departedFromPreset: false };
  const result = updateTypography('chunky', current);
  // typography was already chunky, bodyFont was already system — no change
  assert.equal(result.departedFromPreset, false);
});
