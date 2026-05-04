import { archetypeContent } from './data.ts';
import type { CatalogState } from './types.ts';

export type ExportTab = 'full' | 'minimum' | 'tokens';

export function getExportText(state: CatalogState, tab: ExportTab): string {
  const content = archetypeContent[state.archetype].hero;

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
        color: {
          surface: 'oklch(97% 0.03 95)',
          ink: 'oklch(26% 0.03 260)',
          accent: 'oklch(74% 0.18 85)',
        },
        spacing: ['0.25rem', '0.5rem', '1rem', '1.5rem', '2rem'],
        radius: ['0.25rem', '0.75rem'],
        shadow: ['4px 4px 0 rgb(20 20 20 / 0.85)'],
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
    `  <eyebrow>${content.eyebrow}</eyebrow>`,
    `  <headline>${content.title}</headline>`,
    `  <body>${content.copy}</body>`,
    '  <preview-shell>hero, specimen-strip, token-panel</preview-shell>',
    '</design-brief>',
  ].join('\n');
}
