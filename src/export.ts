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

export function getExportFilename(state: CatalogState, tab: ExportTab): string {
  if (tab === 'full') {
    return `superficies-full-brief.${state.exportContext.exportFormat === 'markdown' ? 'md' : 'xml'}`;
  }

  if (tab === 'tokens') {
    return 'superficies-token-json.json';
  }

  return 'superficies-minimum-brief.txt';
}

export function getExportMimeType(state: CatalogState, tab: ExportTab): string {
  if (tab === 'full') {
    return state.exportContext.exportFormat === 'markdown' ? 'text/markdown' : 'application/xml';
  }

  if (tab === 'tokens') {
    return 'application/json';
  }

  return 'text/plain';
}

export function getExportText(state: CatalogState, tab: ExportTab): string {
  const content = resolveHeroContent(state);
  const tokens = deriveDesignTokens(state);

  if (tab === 'minimum') {
    return [
      `Design a ${state.archetype} landing page in a ${state.preset} direction for ${state.exportContext.audience}.`,
      `Job: ${state.exportContext.jobsToBeDone}.`,
      `Visual direction: ${state.live.typography} typography, ${state.live.color} color, ${state.live.spacing} spacing, ${state.live.radius} radius, ${state.live.surface} surface.`,
      `Preview mode: ${state.mode}; hero layout: ${state.heroLayout}.`,
      `Headline: ${content.title}`,
      'Stack: vanilla TypeScript, HTML, CSS, Vite single-file delivery.',
      'State handling: URL-hash-only state, deterministic rerendering, no backend persistence.',
      `Accessibility target: ${state.exportContext.accessibilityLevel} with visible focus, disabled, loading, and contrast states.`,
      `Avoid: ${state.exportContext.antiDefaults}.`,
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
        exportContext: state.exportContext,
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

  if (state.exportContext.exportFormat === 'markdown') {
    return [
      '# Design brief',
      '',
      `- Preset: ${state.preset}`,
      `- Archetype: ${state.archetype}`,
      `- Mode: ${state.mode}`,
      `- Hero layout: ${state.heroLayout}`,
      `- Live dimensions: ${state.live.typography}, ${state.live.color}, ${state.live.spacing}, ${state.live.density}, ${state.live.radius}, ${state.live.surface}`,
      `- Audience: ${state.exportContext.audience}`,
      `- Jobs to be done: ${state.exportContext.jobsToBeDone}`,
      `- Anti-references: ${state.exportContext.antiReferences}`,
      `- Motion intent: ${state.exportContext.motionIntent}`,
      `- Accessibility target: ${state.exportContext.accessibilityLevel}`,
      `- Content sample: ${state.exportContext.contentSample}`,
      `- Anti-defaults: ${state.exportContext.antiDefaults}`,
      '',
      `## Content`,
      `Eyebrow: ${content.eyebrow}`,
      `Headline: ${content.title}`,
      `Body: ${content.copy}`,
      `Supporting copy: ${content.body}`,
      `CTA: ${content.cta}`,
      `Features: ${content.features.join(', ')}`,
      '',
      'Preview shell: hero, specimen-strip, token-panel',
    ].join('\n');
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
    `  <audience>${escapeXml(state.exportContext.audience)}</audience>`,
    `  <jobs-to-be-done>${escapeXml(state.exportContext.jobsToBeDone)}</jobs-to-be-done>`,
    `  <anti-references>${escapeXml(state.exportContext.antiReferences)}</anti-references>`,
    `  <motion-intent>${escapeXml(state.exportContext.motionIntent)}</motion-intent>`,
    `  <accessibility-target>${escapeXml(state.exportContext.accessibilityLevel)}</accessibility-target>`,
    `  <content-sample>${escapeXml(state.exportContext.contentSample)}</content-sample>`,
    `  <anti-defaults>${escapeXml(state.exportContext.antiDefaults)}</anti-defaults>`,
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
