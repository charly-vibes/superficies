import { presets } from './data.ts';
import { getExportText, type ExportTab } from './export.ts';
import { resolveHeroContent } from './state.ts';
import { deriveDesignTokens, type DesignTokens } from './tokens.ts';
import type { CatalogState } from './types.ts';

export function renderApp(target: HTMLElement, state: CatalogState): void {
  const content = resolveHeroContent(state);
  const tokens = deriveDesignTokens(state);
  const appMode = state.mode;
  const exportText = getExportText(state, 'full');
  const presetStatus = state.departedFromPreset
    ? `Custom from ${presets[state.preset].label}`
    : presets[state.preset].label;

  target.innerHTML = `
    <div class="shell" data-mode="${appMode}" data-hero-layout="${state.heroLayout}" data-typography="${state.live.typography}" data-color="${state.live.color}" data-spacing="${state.live.spacing}" data-density="${state.live.density}" data-radius="${state.live.radius}" data-surface="${state.live.surface}">
      <header class="topbar">
        <div>
          <p class="kicker">superficies</p>
          <h1>Design catalog tracer bullet</h1>
        </div>
        <div class="actions">
          <label>
            <span>Preset</span>
            <select name="preset">
              ${Object.values(presets)
                .map((preset) => option(preset.id, preset.label, state.preset))
                .join('')}
            </select>
          </label>
          <label>
            <span>Archetype</span>
            <select name="archetype">
              ${option('saas', 'SaaS', state.archetype)}
              ${option('restaurant', 'Restaurant', state.archetype)}
              ${option('editorial', 'Editorial', state.archetype)}
            </select>
          </label>
          <label>
            <span>Mode</span>
            <select name="mode">
              ${option('light', 'Light', state.mode)}
              ${option('dark', 'Dark', state.mode)}
              ${option('both', 'Both', state.mode)}
            </select>
          </label>
          <label>
            <span>Hero layout</span>
            <select name="heroLayout">
              ${option('hero+features', 'Hero + features', state.heroLayout)}
              ${option('bento', 'Bento', state.heroLayout)}
              ${option('magazine', 'Magazine', state.heroLayout)}
              ${option('sidebar+main', 'Sidebar + main', state.heroLayout)}
            </select>
          </label>
          <label>
            <span>Typography</span>
            <select name="typography">
              ${option('chunky', 'Chunky', state.live.typography)}
              ${option('system', 'System', state.live.typography)}
              ${option('serif', 'Serif', state.live.typography)}
            </select>
          </label>
          <label>
            <span>Color</span>
            <select name="color">
              ${option('acid', 'Acid', state.live.color)}
              ${option('sky', 'Sky', state.live.color)}
              ${option('sepia', 'Sepia', state.live.color)}
            </select>
          </label>
          <label>
            <span>Spacing</span>
            <select name="spacing">
              ${option('tight', 'Tight', state.live.spacing)}
              ${option('balanced', 'Balanced', state.live.spacing)}
              ${option('loose', 'Loose', state.live.spacing)}
            </select>
          </label>
          <label>
            <span>Density</span>
            <select name="density">
              ${option('compact', 'Compact', state.live.density)}
              ${option('comfortable', 'Comfortable', state.live.density)}
              ${option('roomy', 'Roomy', state.live.density)}
            </select>
          </label>
          <label>
            <span>Radius</span>
            <select name="radius">
              ${option('sharp', 'Sharp', state.live.radius)}
              ${option('soft', 'Soft', state.live.radius)}
              ${option('pill', 'Pill', state.live.radius)}
            </select>
          </label>
          <label>
            <span>Surface</span>
            <select name="surface">
              ${option('flat', 'Flat', state.live.surface)}
              ${option('outlined', 'Outlined', state.live.surface)}
              ${option('elevated', 'Elevated', state.live.surface)}
            </select>
          </label>
          <p class="preset-status" aria-live="polite">${presetStatus}</p>
          <label>
            <span>Headline override</span>
            <input name="title" value="${escapeAttribute(state.contentOverrides.title ?? '')}" placeholder="Use archetype headline" />
          </label>
          <label>
            <span>Copy override</span>
            <input name="copy" value="${escapeAttribute(state.contentOverrides.copy ?? '')}" placeholder="Use archetype copy" />
          </label>
          <button type="button" data-export-open>Export</button>
        </div>
      </header>

      <main class="preview-grid">
        <section class="zone hero-zone">
          <p class="zone-label">Hero zone</p>
          <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
          <h2>${escapeHtml(content.title)}</h2>
          <p>${escapeHtml(content.copy)}</p>
          <p class="hero-body">${escapeHtml(content.body)}</p>
          <ul class="feature-list">
            ${content.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
          </ul>
          <div class="hero-actions">
            <button type="button">${escapeHtml(content.cta)}</button>
            <button type="button" class="secondary">Compare tokens</button>
          </div>
        </section>

        <section class="zone specimen-zone">
          <p class="zone-label">Specimen strip</p>
          <div class="specimen-grid">
            <article class="specimen-group">
              <h3>Buttons</h3>
              <div class="specimen-row">
                <button type="button">Default</button>
                <button type="button" data-forced-state="hover">Hover</button>
                <button type="button" data-forced-state="focus-visible">Focus visible</button>
                <button type="button" data-forced-state="active">Active</button>
                <button type="button" data-forced-state="disabled" disabled>Disabled</button>
                <button type="button" data-forced-state="loading" aria-busy="true">Loading…</button>
              </div>
            </article>
            <article class="specimen-group">
              <h3>Inputs</h3>
              <label class="field-example">
                <span>Email</span>
                <input value="merchant@example.com" />
              </label>
              <label class="field-example" data-forced-state="focus-visible">
                <span>Focused search</span>
                <input value="Brand tokens" />
              </label>
            </article>
            <article class="specimen-group specimen-card">
              <h3>Card</h3>
              <strong>Component anatomy</strong>
              <p>Reference card showing spacing, border, shadow, and copy rhythm.</p>
            </article>
            <article class="specimen-group">
              <h3>Dialog trigger</h3>
              <button type="button">Open settings dialog</button>
            </article>
            <article class="specimen-group">
              <h3>Form group</h3>
              <label class="field-example">
                <span>Business name</span>
                <input value="Northstar Studio" />
              </label>
              <button type="button" class="secondary">Save draft</button>
            </article>
            <article class="specimen-group">
              <h3>Loading</h3>
              <span class="chip" data-forced-state="loading" aria-busy="true">Generating preview…</span>
            </article>
            <article class="specimen-group">
              <h3>Feedback</h3>
              <p class="feedback success">Saved visual direction.</p>
              <p class="feedback warning">Contrast needs review.</p>
            </article>
          </div>
        </section>

        <section class="zone token-zone">
          <p class="zone-label">Token panel</p>
          ${renderTokenPanel(tokens)}
        </section>
      </main>

      <dialog class="export-dialog">
        <form method="dialog" class="export-panel">
          <div class="export-header">
            <div>
              <p class="kicker">Export</p>
              <h2>Deterministic brief shell</h2>
            </div>
            <button value="cancel" class="secondary">Close</button>
          </div>
          <div class="tab-row">
            <button type="button" data-export-tab="full" class="is-active">Full brief</button>
            <button type="button" data-export-tab="minimum">Minimum brief</button>
            <button type="button" data-export-tab="tokens">Token JSON</button>
          </div>
          <pre class="export-output">${escapeHtml(exportText)}</pre>
          <div class="export-footer">
            <button type="button" data-copy>Copy</button>
            <span class="copy-feedback" aria-live="polite"></span>
          </div>
        </form>
      </dialog>
    </div>
  `;
}

export function attachExportInteractions(target: HTMLElement, state: CatalogState): void {
  const dialog = target.querySelector<HTMLDialogElement>('.export-dialog');
  const output = target.querySelector<HTMLElement>('.export-output');
  const feedback = target.querySelector<HTMLElement>('.copy-feedback');
  const openButton = target.querySelector<HTMLButtonElement>('[data-export-open]');
  const tabButtons = target.querySelectorAll<HTMLButtonElement>('[data-export-tab]');
  const copyButton = target.querySelector<HTMLButtonElement>('[data-copy]');

  if (!dialog || !output || !feedback || !openButton || !copyButton) {
    return;
  }

  let activeTab: ExportTab = 'full';

  openButton.addEventListener('click', () => dialog.showModal());

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTab = button.dataset.exportTab as ExportTab;
      activeTab = nextTab;
      output.textContent = getExportText(state, nextTab);
      tabButtons.forEach((candidate) => {
        candidate.classList.toggle('is-active', candidate === button);
      });
    });
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getExportText(state, activeTab));
      feedback.textContent = 'Copied.';
      window.setTimeout(() => {
        feedback.textContent = '';
      }, 1500);
    } catch {
      feedback.textContent = 'Copy unavailable.';
    }
  });
}

function renderTokenPanel(tokens: DesignTokens): string {
  return `
    <div class="token-grid">
      <article>
        <h3>Typography</h3>
        <p class="token-meta">${escapeHtml(tokens.typography.family)}</p>
        <dl class="token-list">
          ${tokens.typography.ladder
            .map(
              (step) => `
                <div>
                  <dt>${escapeHtml(step.name)}</dt>
                  <dd><span style="font-size: ${escapeAttribute(step.size)}; line-height: ${escapeAttribute(step.lineHeight)}">${escapeHtml(step.sample)}</span></dd>
                  <dd>${escapeHtml(step.size)} / ${escapeHtml(step.lineHeight)}</dd>
                </div>`,
            )
            .join('')}
        </dl>
      </article>
      <article>
        <h3>Color</h3>
        <dl class="token-list">
          ${tokens.color.semantic
            .map(
              (swatch) => `
                <div class="color-token">
                  <dt><span class="swatch" style="background: ${escapeAttribute(swatch.hex)}"></span>${escapeHtml(swatch.name)}</dt>
                  <dd>${escapeHtml(swatch.oklch)}</dd>
                  <dd>${escapeHtml(swatch.hex)}</dd>
                </div>`,
            )
            .join('')}
        </dl>
        <h4>Contrast</h4>
        <ul class="contrast-list">
          ${tokens.color.contrastPairs
            .map(
              (pair) => `
                <li>
                  <strong>${escapeHtml(pair.name)}</strong>
                  <span>${pair.ratio.toFixed(2)}:1</span>
                  <span>${pair.passesAA ? 'AA pass' : 'AA fail'}</span>
                </li>`,
            )
            .join('')}
        </ul>
      </article>
      <article>
        <h3>Spacing</h3>
        <p>${tokens.spacing.scale.map(escapeHtml).join(' / ')}</p>
        <h3>Radius</h3>
        <p>${tokens.radius.scale.map(escapeHtml).join(' / ')}</p>
        <h3>Shadow</h3>
        <p>${tokens.shadow.scale.map(escapeHtml).join(' / ')}</p>
      </article>
    </div>
  `;
}

function option(value: string, label: string, selectedValue: string): string {
  return `<option value="${value}" ${selectedValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`;
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
