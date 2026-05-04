import test from 'node:test';
import assert from 'node:assert/strict';

import { presets } from './data.ts';
import { renderApp } from './render.ts';
import { defaultState } from './state.ts';

test('renderApp exposes preset and independently editable live controls', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, { ...defaultState, departedFromPreset: true });

  assert.match(target.innerHTML, /name="preset"/);
  assert.match(target.innerHTML, /name="typography"/);
  assert.match(target.innerHTML, /name="color"/);
  assert.match(target.innerHTML, /name="spacing"/);
  assert.match(target.innerHTML, /name="density"/);
  assert.match(target.innerHTML, /name="radius"/);
  assert.match(target.innerHTML, /name="surface"/);
  assert.match(target.innerHTML, /Custom from Neobrutalist/);
});

test('renderApp includes all curated preset options', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  for (const preset of Object.values(presets)) {
    assert.match(target.innerHTML, new RegExp(`>${preset.label}<`));
  }
});

test('renderApp renders the selected hero layout without dropping other preview zones', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, { ...defaultState, heroLayout: 'bento' });

  assert.match(target.innerHTML, /name="heroLayout"/);
  assert.match(target.innerHTML, /data-hero-layout="bento"/);
  assert.match(target.innerHTML, /Hero zone/);
  assert.match(target.innerHTML, /Specimen strip/);
  assert.match(target.innerHTML, /Token panel/);
});

test('renderApp specimen strip includes required component groups', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  for (const group of ['Buttons', 'Inputs', 'Card', 'Dialog trigger', 'Form group', 'Loading', 'Feedback']) {
    assert.match(target.innerHTML, new RegExp(group));
  }
});

test('renderApp specimen strip exposes forced states simultaneously', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  for (const state of ['hover', 'focus-visible', 'active', 'disabled', 'loading']) {
    assert.match(target.innerHTML, new RegExp(`data-forced-state="${state}"`));
  }
});
