import './styles/app.css';

import { createCatalogController, type StateUpdate } from './app.ts';
import { attachExportInteractions, renderApp } from './render.ts';
import { applyPreset, updateContentOverride, updateLiveDimension } from './state.ts';
import type { Archetype, HeroLayout, HeroOverrideKey, LiveDimensionKey, Mode, Preset } from './types.ts';

const target = document.querySelector<HTMLElement>('#app');

if (!target) {
  throw new Error('Missing #app root');
}

const appRoot = target;
const controller = createCatalogController({
  getHash: () => window.location.hash,
  replaceHash: (hash) => history.replaceState(null, '', hash),
  render: (state) => renderApp(appRoot, state),
  attachExportInteractions: (state) => attachExportInteractions(appRoot, state),
  bindControls: (onPatch) => bindControls(appRoot, onPatch),
});

controller.initialize();
window.addEventListener('hashchange', () => controller.onHashChange());

function bindControls(target: HTMLElement, onPatch: (patch: StateUpdate) => void): void {
  const presetSelect = target.querySelector<HTMLSelectElement>('select[name="preset"]');
  const archetypeSelect = target.querySelector<HTMLSelectElement>('select[name="archetype"]');
  const modeSelect = target.querySelector<HTMLSelectElement>('select[name="mode"]');
  const heroLayoutSelect = target.querySelector<HTMLSelectElement>('select[name="heroLayout"]');
  const contentControls = target.querySelectorAll<HTMLInputElement>('input[name="title"], input[name="copy"]');
  const liveControls = target.querySelectorAll<HTMLSelectElement>(
    'select[name="typography"], select[name="color"], select[name="spacing"], select[name="density"], select[name="radius"], select[name="surface"]',
  );

  presetSelect?.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as Preset;
    onPatch((current) => applyPreset(value, current));
  });

  archetypeSelect?.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as Archetype;
    onPatch({ archetype: value });
  });

  modeSelect?.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as Mode;
    onPatch({ mode: value });
  });

  heroLayoutSelect?.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as HeroLayout;
    onPatch({ heroLayout: value });
  });

  contentControls.forEach((control) => {
    control.addEventListener('change', (event) => {
      const element = event.currentTarget as HTMLInputElement;
      onPatch((current) =>
        updateContentOverride(element.name as HeroOverrideKey, element.value, current),
      );
    });
  });

  liveControls.forEach((control) => {
    control.addEventListener('change', (event) => {
      const element = event.currentTarget as HTMLSelectElement;
      onPatch((current) =>
        updateLiveDimension(element.name as LiveDimensionKey, element.value as never, current),
      );
    });
  });
}
