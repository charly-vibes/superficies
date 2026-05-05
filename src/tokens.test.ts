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
  // Default is neobrutalist: base 1rem, ratio 1.5. display = 1 * 1.5^2 = 2.25rem
  assert.equal(tokens.typography.ladder[0].size, '2.25rem');
  // Spacing: base 1rem * 0.25 * 1.0 (balanced) = 0.25rem. scale = [0.25, 0.375, 0.563, 0.844, 1.266]
  assert.deepEqual(tokens.spacing.scale, ['0.25rem', '0.375rem', '0.563rem', '0.844rem', '1.266rem']);
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
      scaleRatio: 1.25,
      baseSize: '1.25rem',
    },
  });

  assert.equal(tokens.typography.family, 'Georgia, Cambria, Times New Roman, serif');
  // base 1.25, ratio 1.25. display = 1.25 * 1.25^2 = 1.953rem
  assert.equal(tokens.typography.ladder[0].size, '1.953rem');
  // Spacing: base 1.25 * 0.25 * 1.5 (loose) = 0.46875. scale = [0.469, 0.586, 0.732, 0.916, 1.144]
  assert.deepEqual(tokens.spacing.scale, ['0.469rem', '0.586rem', '0.732rem', '0.916rem', '1.144rem']);
  assert.deepEqual(tokens.radius.scale, ['999px', '999px', '999px']);
  assert.equal(tokens.color.semantic[0].oklch, 'oklch(98% 0.02 88)');
  assert.equal(tokens.shadow.scale[0], '0 18px 40px rgb(76 55 31 / 0.18)');
});
