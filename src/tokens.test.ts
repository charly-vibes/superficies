import test from 'node:test';
import assert from 'node:assert/strict';

import { deriveDesignTokens } from './tokens.ts';
import { defaultState } from './state.ts';

test('deriveDesignTokens returns typography, spacing, radius, shadow, and semantic colors from state', () => {
  const tokens = deriveDesignTokens(defaultState);

  assert.deepEqual(
    tokens.typography.ladder.map((step) => step.name),
    ['display', 'heading', 'body', 'caption'],
  );
  assert.equal(tokens.typography.ladder[0].size, '3.5rem');
  assert.deepEqual(tokens.spacing.scale, ['0.25rem', '0.5rem', '1rem', '1.5rem', '2rem']);
  assert.deepEqual(tokens.radius.scale, ['0rem', '0.125rem', '0.25rem']);
  assert.deepEqual(tokens.shadow.scale, ['4px 4px 0 rgb(20 20 20 / 0.85)']);
  assert.deepEqual(
    tokens.color.semantic.map((swatch) => swatch.name),
    ['surface', 'ink', 'accent', 'muted'],
  );
  assert.match(tokens.color.semantic[0].hex, /^#[0-9a-f]{6}$/);
  assert.equal(tokens.color.semantic[0].oklch, 'oklch(97% 0.03 95)');
});

test('deriveDesignTokens computes foreground/background contrast diagnostics', () => {
  const tokens = deriveDesignTokens(defaultState);

  assert.deepEqual(
    tokens.color.contrastPairs.map((pair) => pair.name),
    ['ink on surface', 'accent on surface', 'surface on ink'],
  );
  assert.ok(tokens.color.contrastPairs[0].ratio >= 4.5);
  assert.equal(tokens.color.contrastPairs[0].passesAA, true);
  assert.equal(tokens.color.contrastPairs[1].passesAA, false);
});

test('deriveDesignTokens changes computed values when live dimensions change', () => {
  const tokens = deriveDesignTokens({
    ...defaultState,
    live: {
      typography: 'serif',
      bodyFont: 'serif',
      color: 'sepia',
      spacing: 'loose',
      density: 'roomy',
      radius: 'pill',
      surface: 'elevated',
    },
  });

  assert.equal(tokens.typography.family, 'Georgia, Cambria, Times New Roman, serif');
  assert.equal(tokens.typography.ladder[0].size, '3.25rem');
  assert.deepEqual(tokens.spacing.scale, ['0.5rem', '1rem', '1.5rem', '2rem', '3rem']);
  assert.deepEqual(tokens.radius.scale, ['999px', '999px', '999px']);
  assert.equal(tokens.color.semantic[0].oklch, 'oklch(98% 0.02 88)');
  assert.equal(tokens.shadow.scale[0], '0 18px 40px rgb(76 55 31 / 0.18)');
});
