import test from 'node:test';
import assert from 'node:assert/strict';

import { archetypeContent } from './data.ts';
import { defaultState, resolveHeroContent, updateContentOverride } from './state.ts';

const layouts = ['hero+features', 'bento', 'magazine', 'sidebar+main'] as const;

test('all supported hero layouts remain renderable state values', () => {
  for (const heroLayout of layouts) {
    assert.equal({ ...defaultState, heroLayout }.heroLayout, heroLayout);
  }
});

test('resolveHeroContent reads archetype defaults', () => {
  assert.deepEqual(resolveHeroContent(defaultState), archetypeContent.saas.hero);
});

test('resolveHeroContent lets non-null overrides win over archetype defaults', () => {
  const state = updateContentOverride('title', 'A custom headline', defaultState);

  assert.equal(resolveHeroContent(state).title, 'A custom headline');
  assert.equal(resolveHeroContent(state).eyebrow, archetypeContent.saas.hero.eyebrow);
});

test('null content overrides fall back to archetype defaults', () => {
  const state = {
    ...defaultState,
    contentOverrides: { ...defaultState.contentOverrides, title: null },
  };

  assert.equal(resolveHeroContent(state).title, archetypeContent.saas.hero.title);
});
