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

test('renderApp token panel includes computed token values and contrast results', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  assert.match(target.innerHTML, /3\.5rem/);
  assert.match(target.innerHTML, /oklch\(97% 0\.03 95\)/);
  assert.match(target.innerHTML, /#[0-9a-f]{6}/);
  assert.match(target.innerHTML, /ink on surface/);
  assert.match(target.innerHTML, /AA pass/);
  assert.match(target.innerHTML, /4px 4px 0 rgb\(20 20 20 \/ 0\.85\)/);
});

test('renderApp export workspace includes all artifact tabs and copy feedback region', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  assert.match(target.innerHTML, /data-export-open/);
  assert.match(target.innerHTML, /data-export-tab="full"/);
  assert.match(target.innerHTML, /data-export-tab="minimum"/);
  assert.match(target.innerHTML, /data-export-tab="tokens"/);
  assert.match(target.innerHTML, /data-copy/);
  assert.match(target.innerHTML, /copy-feedback" aria-live="polite"/);
});

test('renderApp exposes export-only context controls', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  for (const name of [
    'audience',
    'jobsToBeDone',
    'antiReferences',
    'motionIntent',
    'accessibilityLevel',
    'contentSample',
    'antiDefaults',
    'exportFormat',
  ]) {
    assert.match(target.innerHTML, new RegExp(`name="${name}"`));
  }
});

test('renderApp renders sidebar with collapsible sections for grouped controls', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  assert.match(target.innerHTML, /class="sidebar"/);
  assert.match(target.innerHTML, /sidebar-section/);
  assert.match(target.innerHTML, /<details /);
  assert.match(target.innerHTML, /<summary>/);
});

test('renderApp bottom bar exposes edit-open and export-open actions', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  assert.match(target.innerHTML, /class="bottom-bar"/);
  assert.match(target.innerHTML, /data-edit-open/);
  const exportCount = (target.innerHTML.match(/data-export-open/g) ?? []).length;
  assert.ok(exportCount >= 2, 'export reachable from sidebar and bottom bar');
});

test('renderApp sidebar includes close control for mobile dismiss', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, defaultState);

  assert.match(target.innerHTML, /sidebar-close/);
});

test('renderApp escapes user-provided content overrides before injecting markup', () => {
  const target = { innerHTML: '' };

  renderApp(target as HTMLElement, {
    ...defaultState,
    contentOverrides: {
      ...defaultState.contentOverrides,
      title: '<img src=x onerror=alert(1)>',
      copy: 'Use <script>alert(1)</script> safely',
    },
  });

  assert.doesNotMatch(target.innerHTML, /<img src=x/);
  assert.doesNotMatch(target.innerHTML, /<script>/);
  assert.match(target.innerHTML, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(target.innerHTML, /Use &lt;script&gt;alert\(1\)&lt;\/script&gt; safely/);
});
