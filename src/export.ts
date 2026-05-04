import { resolveHeroContent } from './state.ts';
import { deriveDesignTokens } from './tokens.ts';
import type { CatalogState } from './types.ts';

export type ExportTab = 'full' | 'minimum' | 'tokens';

export function getExportText(state: CatalogState, tab: ExportTab): string {
  const content = resolveHeroContent(state);
  const tokens = deriveDesignTokens(state);

  if (tab === 'minimum') {
    return [
      `Design a ${state.archetype} landing page in a ${state.preset} direction.`,
      `Preview mode: ${state.mode}.`,
      `Headline: ${content.title}`,
      'Deliver a hero, specimen strip, and token panel with clear contrast and strong hierarchy.',
    ].join('\n');
  }

  if (tab === 'tokens') {
    return JSON.stringify(
      {
        preset: state.preset,
        mode: state.mode,
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
    `  <eyebrow>${escapeXml(content.eyebrow)}</eyebrow>`,
    `  <headline>${escapeXml(content.title)}</headline>`,
    `  <body>${escapeXml(content.copy)}</body>`,
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
