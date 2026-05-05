import test from 'node:test';
import assert from 'node:assert/strict';

import { getExportArtifact, getExportFilename, getExportMimeType, getExportText, listExportArtifacts } from './export.ts';
import { defaultState } from './state.ts';
import type { CatalogState } from './types.ts';

test('getExportText exports resolved current content overrides', () => {
  const state = {
    ...defaultState,
    contentOverrides: {
      ...defaultState.contentOverrides,
      title: 'Custom exported headline',
      copy: 'Custom exported supporting copy',
    },
  };

  assert.match(getExportText(state, 'full'), /<headline>Custom exported headline<\/headline>/);
  assert.match(getExportText(state, 'full'), /<body>Custom exported supporting copy<\/body>/);
  assert.match(getExportText(state, 'minimum'), /Headline: Custom exported headline/);
});

test('getExportText token JSON is derived from current state', () => {
  const state: CatalogState = {
    ...defaultState,
    live: { ...defaultState.live, typography: 'serif', color: 'sepia', radius: 'pill' },
  };

  const parsed = JSON.parse(getExportText(state, 'tokens'));

  assert.equal(parsed.typography.family, 'Georgia, Cambria, Times New Roman, serif');
  assert.equal(parsed.color.semantic[0].oklch, 'oklch(98% 0.02 88)');
  assert.deepEqual(parsed.radius.scale, ['999px', '999px', '999px']);
  assert.equal(parsed.color.contrastPairs[0].passesAA, true);
});

test('listExportArtifacts exposes the three required tabs in stable order', () => {
  const artifacts = listExportArtifacts(defaultState);

  assert.deepEqual(
    artifacts.map((artifact) => [artifact.tab, artifact.label]),
    [
      ['full', 'Full brief'],
      ['minimum', 'Minimum brief'],
      ['tokens', 'Token JSON'],
    ],
  );
  assert.equal(artifacts[0].content, getExportText(defaultState, 'full'));
});

test('getExportText full brief supports XML and Markdown wrappers with semantic parity', () => {
  const xmlState: CatalogState = {
    ...defaultState,
    exportContext: {
      ...defaultState.exportContext,
      audience: 'independent bookstores',
      jobsToBeDone: 'launch a high-converting seasonal catalog',
      antiReferences: 'generic dashboard chrome',
      motionIntent: 'quiet page transitions only',
      accessibilityLevel: 'WCAG 2.2 AAA where practical',
      contentSample: 'Rare editions, staff picks, and pickup windows',
      antiDefaults: 'no blue SaaS gradients',
      exportFormat: 'xml',
    },
  };
  const markdownState: CatalogState = {
    ...xmlState,
    exportContext: { ...xmlState.exportContext, exportFormat: 'markdown' },
  };

  const xml = getExportText(xmlState, 'full');
  const markdown = getExportText(markdownState, 'full');

  for (const value of [
    'independent bookstores',
    'launch a high-converting seasonal catalog',
    'generic dashboard chrome',
    'quiet page transitions only',
    'WCAG 2.2 AAA where practical',
    'Rare editions, staff picks, and pickup windows',
    'no blue SaaS gradients',
  ]) {
    assert.match(xml, new RegExp(value));
    assert.match(markdown, new RegExp(value));
  }
  assert.match(xml, /^<design-brief>/);
  assert.match(markdown, /^# Design brief/);
});

test('getExportArtifact returns deterministic tab-specific content from current state', () => {
  const state: CatalogState = {
    ...defaultState,
    archetype: 'editorial',
    mode: 'both',
    live: { ...defaultState.live, spacing: 'loose', surface: 'elevated' },
  };

  assert.deepEqual(getExportArtifact(state, 'full'), getExportArtifact(state, 'full'));
  assert.match(getExportArtifact(state, 'full').content, /<typography>chunky<\/typography>/);
  assert.match(getExportArtifact(state, 'full').content, /<spacing>loose<\/spacing>/);
  assert.match(getExportArtifact(state, 'minimum').content, /Accessibility target: WCAG 2\.2 AA/);
  assert.match(getExportArtifact(state, 'minimum').content, /URL-hash-only state/);
  assert.equal(JSON.parse(getExportArtifact(state, 'tokens').content).live.surface, 'elevated');
});

test('export artifacts expose deterministic download filenames and MIME types', () => {
  const markdownState: CatalogState = {
    ...defaultState,
    exportContext: { ...defaultState.exportContext, exportFormat: 'markdown' },
  };

  assert.equal(getExportFilename(defaultState, 'full'), 'superficies-full-brief.xml');
  assert.equal(getExportFilename(markdownState, 'full'), 'superficies-full-brief.md');
  assert.equal(getExportFilename(defaultState, 'tokens'), 'superficies-token-json.json');
  assert.equal(getExportMimeType(defaultState, 'full'), 'application/xml');
  assert.equal(getExportMimeType(markdownState, 'full'), 'text/markdown');
  assert.equal(getExportMimeType(defaultState, 'tokens'), 'application/json');
});
