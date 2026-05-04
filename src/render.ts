import { archetypeContent } from './data';
import { getExportText, type ExportTab } from './export';
import type { CatalogState } from './types';

export function renderApp(target: HTMLElement, state: CatalogState): void {
  const content = archetypeContent[state.archetype];
  const appMode = state.mode;
  const exportText = getExportText(state, 'full');

  target.innerHTML = `
    <div class="shell" data-mode="${appMode}">
      <header class="topbar">
        <div>
          <p class="kicker">superficies</p>
          <h1>Design catalog tracer bullet</h1>
        </div>
        <div class="actions">
          <label>
            <span>Archetype</span>
            <select name="archetype">
              <option value="saas" ${state.archetype === 'saas' ? 'selected' : ''}>SaaS</option>
              <option value="restaurant" ${state.archetype === 'restaurant' ? 'selected' : ''}>Restaurant</option>
              <option value="editorial" ${state.archetype === 'editorial' ? 'selected' : ''}>Editorial</option>
            </select>
          </label>
          <label>
            <span>Mode</span>
            <select name="mode">
              <option value="light" ${state.mode === 'light' ? 'selected' : ''}>Light</option>
              <option value="dark" ${state.mode === 'dark' ? 'selected' : ''}>Dark</option>
              <option value="both" ${state.mode === 'both' ? 'selected' : ''}>Both</option>
            </select>
          </label>
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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
