import { archetypeContent, presets } from './data.ts';
import { getExportText, type ExportTab } from './export.ts';
import type { CatalogState } from './types.ts';

export function renderApp(target: HTMLElement, state: CatalogState): void {
  const content = archetypeContent[state.archetype];
  const appMode = state.mode;
  const exportText = getExportText(state, 'full');
  const presetStatus = state.departedFromPreset
    ? `Custom from ${presets[state.preset].label}`
    : presets[state.preset].label;

  target.innerHTML = `
    <div class="shell" data-mode="${appMode}" data-typography="${state.live.typography}" data-color="${state.live.color}" data-spacing="${state.live.spacing}" data-density="${state.live.density}" data-radius="${state.live.radius}" data-surface="${state.live.surface}">
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
          <button type="button" data-export-open>Export</button>
        </div>
      </header>

      <main class="preview-grid">
        <section class="zone hero-zone">
          <p class="zone-label">Hero zone</p>
          <p class="eyebrow">${content.eyebrow}</p>
          <h2>${content.title}</h2>
          <p>${content.copy}</p>
          <div class="hero-actions">
            <button type="button">${content.cta}</button>
            <button type="button" class="secondary">Compare tokens</button>
          </div>
        </section>

        <section class="zone specimen-zone">
          <p class="zone-label">Specimen strip</p>
          <div class="specimen-row">
            <button type="button">Default</button>
            <button type="button" class="secondary">Secondary</button>
            <button type="button" disabled>Disabled</button>
            <span class="chip">Loading…</span>
          </div>
          <div class="specimen-card">
            <strong>Component anatomy</strong>
            <p>Inputs, cards, and feedback states will expand from this shell.</p>
          </div>
        </section>

        <section class="zone token-zone">
          <p class="zone-label">Token panel</p>
          <div class="token-grid">
            <article>
              <h3>Typography</h3>
              <p>Display / Body / Caption</p>
            </article>
            <article>
              <h3>Color</h3>
              <p>Surface / Ink / Accent</p>
            </article>
            <article>
              <h3>Spacing</h3>
              <p>4 / 8 / 16 / 24 / 32</p>
            </article>
          </div>
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

function option(value: string, label: string, selectedValue: string): string {
  return `<option value="${value}" ${selectedValue === value ? 'selected' : ''}>${label}</option>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
