import { resolveHeroContent } from './state.ts';
import { deriveDesignTokens } from './tokens.ts';
import type { CatalogState } from './types.ts';

export type ExportTab = 'full' | 'minimum' | 'tokens' | 'css';

export interface ExportArtifact {
  tab: ExportTab;
  label: string;
  content: string;
}

const exportTabs: Array<{ tab: ExportTab; label: string }> = [
  { tab: 'full', label: 'Full brief' },
  { tab: 'css', label: 'CSS Variables' },
  { tab: 'tokens', label: 'Token JSON' },
  { tab: 'minimum', label: 'Minimum' },
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

  if (tab === 'css') {
    return 'superficies-tokens.css';
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

  if (tab === 'css') {
    return 'text/css';
  }

  return 'text/plain';
}

export function getExportText(state: CatalogState, tab: ExportTab): string {
  const content = resolveHeroContent(state);
  const tokens = deriveDesignTokens(state);

  if (tab === 'css') {
    return [
      ':root {',
      `  /* System rhythm (Ratio: ${state.live.scaleRatio}, Base: ${state.live.baseSize}) */`,
      `  --font-display: ${tokens.typography.family};`,
      `  --font-body: ${state.live.bodyFont === 'serif' ? 'Georgia, serif' : 'Inter, system-ui, sans-serif'};`,
      '',
      '  /* Typography ladder */',
      ...tokens.typography.ladder.map((step) => `  --size-${step.name}: ${step.size};`),
      ...tokens.typography.ladder.map((step) => `  --lh-${step.name}: ${step.lineHeight};`),
      '',
      '  /* Colors (OKLCH) */',
      ...tokens.color.semantic.map((swatch) => `  --color-${swatch.name}: ${swatch.oklch}; /* ${swatch.hex} */`),
      '',
      '  /* Spacing & Shapes */',
      ...tokens.spacing.scale.map((val, i) => `  --space-${i}: ${val};`),
      `  --radius: ${tokens.radius.scale[1]};`,
      `  --shadow: ${tokens.shadow.scale[0]};`,
      '}',
    ].join('\n');
  }

  if (tab === 'minimum') {
    return [
      `Design a ${state.archetype} landing page in a ${state.preset} direction for ${state.exportContext.audience}.`,
      `Job: ${state.exportContext.jobsToBeDone}.`,
      `Visual direction: ${state.live.typography} typography, ${state.live.color} color, ${state.live.spacing} spacing, ${state.live.radius} radius, ${state.live.surface} surface.`,
      `Technical specs: scale ratio ${state.live.scaleRatio}, base size ${state.live.baseSize}.`,
      `Accent color: ${tokens.color.semantic.find((s) => s.name === 'accent')?.oklch}.`,
      `Headline: ${content.title}`,
      'Stack: vanilla TypeScript, HTML, CSS, Vite single-file delivery.',
      `Accessibility target: ${state.exportContext.accessibilityLevel} with visible focus, disabled, loading, and contrast states.`,
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
      `- Technical Rhythm: Ratio ${state.live.scaleRatio}, Base ${state.live.baseSize}`,
      `- Live dimensions: ${state.live.typography}, ${state.live.color}, ${state.live.spacing}, ${state.live.density}, ${state.live.radius}, ${state.live.surface}`,
      '- Computed Tokens:',
      `  - Display Font: ${tokens.typography.family}`,
      `  - Accent Color: ${tokens.color.semantic.find((s) => s.name === 'accent')?.oklch}`,
      `  - Surface Color: ${tokens.color.semantic.find((s) => s.name === 'surface')?.oklch}`,
      `  - Ink Color: ${tokens.color.semantic.find((s) => s.name === 'ink')?.oklch}`,
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
    '  <technical-specs>',
    `    <scale-ratio>${state.live.scaleRatio}</scale-ratio>`,
    `    <base-size>${state.live.baseSize}</base-size>`,
    `    <display-font>${tokens.typography.family}</display-font>`,
    ...tokens.color.semantic.map((s) => `    <color-${s.name}>${s.oklch}</color-${s.name}>`),
    '  </technical-specs>',
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
