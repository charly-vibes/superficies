import { resolveHeroContent } from './state.ts';
import { deriveDesignTokens } from './tokens.ts';
import type { CatalogState } from './types.ts';

export type ExportTab = 'full' | 'minimum' | 'tokens';

export interface ExportArtifact {
  tab: ExportTab;
  label: string;
  content: string;
}

const exportTabs: Array<{ tab: ExportTab; label: string }> = [
  { tab: 'full', label: 'Full brief' },
  { tab: 'minimum', label: 'Minimum brief' },
  { tab: 'tokens', label: 'Token JSON' },
];

export function listExportArtifacts(state: CatalogState): ExportArtifact[] {
  return exportTabs.map(({ tab, label }) => ({ tab, label, content: getExportText(state, tab) }));
}

export function getExportArtifact(state: CatalogState, tab: ExportTab): ExportArtifact {
  const definition = exportTabs.find((candidate) => candidate.tab === tab) ?? exportTabs[0];
  return {
    ...definition,
    content: getExportText(state, definition.tab),
  };
}

export function getExportText(state: CatalogState, tab: ExportTab): string {
  const content = resolveHeroContent(state);
  const tokens = deriveDesignTokens(state);

  if (tab === 'minimum') {
    return [
      `Design a ${state.archetype} landing page in a ${state.preset} direction.`,
      `Visual direction: ${state.live.typography} typography, ${state.live.color} color, ${state.live.spacing} spacing, ${state.live.radius} radius, ${state.live.surface} surface.`,
      `Preview mode: ${state.mode}; hero layout: ${state.heroLayout}.`,
      `Headline: ${content.title}`,
      'Stack: vanilla TypeScript, HTML, CSS, Vite single-file delivery.',
      'State handling: URL-hash-only state, deterministic rerendering, no backend persistence.',
      'Accessibility target: WCAG 2.2 AA with visible focus, disabled, loading, and contrast states.',
      'Deliver a hero, specimen strip, and token panel with clear contrast and strong hierarchy.',
    ].join('\n');
  }

  if (tab === 'tokens') {
    return JSON.stringify(
      {
        preset: state.preset,
        archetype: state.archetype,
        mode: state.mode,
        heroLayout: state.heroLayout,
        live: state.live,
        typography: tokens.typography,
        color: tokens.color,
        spacing: tokens.spacing,
        radius: tokens.radius,
        shadow: tokens.shadow,
      },
      null,
      2,
    );
  }

  return [
    '<design-brief>',
    `  <preset>${state.preset}</preset>`,
    `  <archetype>${state.archetype}</archetype>`,
    `  <mode>${state.mode}</mode>`,
    `  <hero-layout>${state.heroLayout}</hero-layout>`,
    '  <live-dimensions>',
    `    <typography>${state.live.typography}</typography>`,
    `    <color>${state.live.color}</color>`,
    `    <spacing>${state.live.spacing}</spacing>`,
    `    <density>${state.live.density}</density>`,
    `    <radius>${state.live.radius}</radius>`,
    `    <surface>${state.live.surface}</surface>`,
    '  </live-dimensions>',
    '  <accessibility-target>WCAG 2.2 AA</accessibility-target>',
    '  <anti-defaults>avoid generic SaaS sameness, low contrast, missing states, and non-shareable configuration</anti-defaults>',
    `  <eyebrow>${escapeXml(content.eyebrow)}</eyebrow>`,
    `  <headline>${escapeXml(content.title)}</headline>`,
    `  <body>${escapeXml(content.copy)}</body>`,
    `  <supporting-copy>${escapeXml(content.body)}</supporting-copy>`,
    `  <cta>${escapeXml(content.cta)}</cta>`,
    `  <features>${content.features.map((feature) => `<feature>${escapeXml(feature)}</feature>`).join('')}</features>`,
    '  <preview-shell>hero, specimen-strip, token-panel</preview-shell>',
    '</design-brief>',
  ].join('\n');
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
