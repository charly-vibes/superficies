import { archetypeContent, archetypeLabels, presets } from './data.ts';
import { getExportArtifact, getExportFilename, getExportMimeType, listExportArtifacts, type ExportTab } from './export.ts';
import { resolveHeroContent } from './state.ts';
import { deriveDesignTokens, type DesignTokens } from './tokens.ts';
import type { CatalogState } from './types.ts';

export function renderApp(target: HTMLElement, state: CatalogState): void {
  const content = resolveHeroContent(state);
  const tokens = deriveDesignTokens(state);
  const appMode = state.mode;
  const exportArtifacts = listExportArtifacts(state);
  const exportText = exportArtifacts[0]?.content ?? '';
  const presetStatus = state.departedFromPreset
    ? `Custom from ${presets[state.preset].label}`
    : presets[state.preset].label;

  const previewGrid = `
        <main class="preview-grid">
          <section class="zone hero-zone" data-archetype="${state.archetype}">
            <p class="zone-label">Hero zone</p>
            ${renderHeroByArchetype(state, content)}
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
        </main>`;

  const canQuery = typeof target.querySelector === 'function';
  const sidebarScroll = canQuery ? (target.querySelector('.sidebar')?.scrollTop ?? 0) : 0;
  const mainScroll = canQuery ? (target.querySelector('.main-area')?.scrollTop ?? 0) : 0;

  target.innerHTML = `
    <div class="shell" data-mode="${appMode}" data-hero-layout="${state.heroLayout}" data-typography="${state.live.typography}" data-color="${state.live.color}" data-spacing="${state.live.spacing}" data-density="${state.live.density}" data-radius="${state.live.radius}" data-surface="${state.live.surface}">
      <nav class="sidebar" aria-label="Design controls">
        <div class="sidebar-header">
          <p class="kicker">Controls</p>
          <button type="button" class="sidebar-close" aria-label="Close controls">Close</button>
        </div>

        <details class="sidebar-section about-section">
          <summary>About</summary>
          <div class="sidebar-section-body about-body">
            <p>Superficies is a design-token catalog for generating a deterministic visual brief. Adjust the controls to define a typographic, color, and spatial system, then export the brief as structured context for an AI design agent or a hand-off document.</p>
            <p>The <strong>hero zone</strong> previews your archetype layout. The <strong>specimen strip</strong> stress-tests components against your tokens. The <strong>token panel</strong> shows computed values and contrast diagnostics.</p>
            <p>Use <strong>Both</strong> mode to compare light and dark simultaneously. Use <strong>Export brief</strong> to copy the output.</p>
          </div>
        </details>

        <details class="sidebar-section" open>
          <summary>Preset &amp; mode</summary>
          <div class="sidebar-section-body">
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
                ${Object.keys(archetypeContent)
                  .map((id) => option(id, archetypeLabels[id as keyof typeof archetypeLabels], state.archetype))
                  .join('')}
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
                ${option('terminal', 'Terminal', state.heroLayout)}
              </select>
            </label>
            <p class="preset-status" aria-live="polite">${presetStatus}</p>
          </div>
        </details>

        <details class="sidebar-section" open>
          <summary>System rhythm</summary>
          <div class="sidebar-section-body">
            <p class="token-meta">Tune the mathematical relationship between typographic levels and spatial increments.</p>
            <label>
              <span>Scale ratio: ${state.live.scaleRatio}</span>
              <input type="range" name="scaleRatio" min="1.05" max="1.618" step="0.01" value="${state.live.scaleRatio}" />
            </label>
            <label>
              <span>Base size (rem)</span>
              <input type="text" name="baseSize" value="${escapeAttribute(state.live.baseSize)}" />
            </label>
          </div>
        </details>

        <details class="sidebar-section" open>
          <summary>Typography</summary>
          <div class="sidebar-section-body">
            <div class="visual-control-grid">
              ${['chunky', 'system', 'serif']
                .map((id) => renderTypographySpecimen(id as any, state.live.typography === id))
                .join('')}
            </div>
          </div>
        </details>

        <details class="sidebar-section" open>
          <summary>Color &amp; surface</summary>
          <div class="sidebar-section-body">
            <p class="kicker">Colorway</p>
            <div class="visual-control-grid">
              ${['acid', 'sky', 'sepia', 'vinyl']
                .map((id) => renderColorSwatch(id as any, state.live.color === id))
                .join('')}
            </div>
            <p class="kicker">Surface</p>
            <div class="visual-control-grid">
              ${['flat', 'outlined', 'elevated']
                .map((id) => renderSurfaceSwatch(id as any, state.live.surface === id))
                .join('')}
            </div>
          </div>
        </details>

        <details class="sidebar-section" open>
          <summary>Spacing</summary>
          <div class="sidebar-section-body">
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
          </div>
        </details>

        <details class="sidebar-section" open>
          <summary>Content</summary>
          <div class="sidebar-section-body">
            <label>
              <span>Headline override</span>
              <input name="title" value="${escapeAttribute(state.contentOverrides.title ?? '')}" placeholder="Use archetype headline" />
            </label>
            <label>
              <span>Copy override</span>
              <input name="copy" value="${escapeAttribute(state.contentOverrides.copy ?? '')}" placeholder="Use archetype copy" />
            </label>
          </div>
        </details>

        <div class="sidebar-footer">
          <button type="button" data-export-open>Export</button>
        </div>
      </nav>

      <div class="main-area">
        <header class="topbar">
          <div>
            <p class="kicker">superficies</p>
            <h1>Visual system workbench</h1>
          </div>
          <button type="button" data-export-open class="export-cta">Export brief</button>
        </header>

        ${appMode === 'both'
          ? `<div class="mode-split">
              <div class="preview-pane" data-scheme="light">
                <p class="kicker pane-label">Light</p>
                ${previewGrid}
              </div>
              <div class="preview-pane" data-scheme="dark">
                <p class="kicker pane-label">Dark</p>
                ${previewGrid}
              </div>
            </div>`
          : previewGrid}
      </div>

      <div class="bottom-bar">
        <button type="button" data-edit-open>Edit</button>
        <button type="button" data-export-open>Export</button>
      </div>

      <dialog class="export-dialog">
        <form method="dialog" class="export-panel">
          <div class="export-header">
            <div>
              <p class="kicker">Export</p>
              <h2>Deterministic brief shell</h2>
            </div>
            <button value="cancel" class="secondary">Close</button>
          </div>
          <div class="export-context-grid">
            <label>
              <span>Audience</span>
              <input name="audience" value="${escapeAttribute(state.exportContext.audience)}" />
            </label>
            <label>
              <span>Jobs to be done</span>
              <textarea name="jobsToBeDone">${escapeHtml(state.exportContext.jobsToBeDone)}</textarea>
            </label>
            <label>
              <span>Anti-references</span>
              <textarea name="antiReferences">${escapeHtml(state.exportContext.antiReferences)}</textarea>
            </label>
            <label>
              <span>Motion intent</span>
              <input name="motionIntent" value="${escapeAttribute(state.exportContext.motionIntent)}" />
            </label>
            <label>
              <span>Accessibility level</span>
              <input name="accessibilityLevel" value="${escapeAttribute(state.exportContext.accessibilityLevel)}" />
            </label>
            <label>
              <span>Content sample</span>
              <textarea name="contentSample">${escapeHtml(state.exportContext.contentSample)}</textarea>
            </label>
            <label>
              <span>Anti-defaults</span>
              <textarea name="antiDefaults">${escapeHtml(state.exportContext.antiDefaults)}</textarea>
            </label>
            <label>
              <span>Full brief format</span>
              <select name="exportFormat">
                ${option('xml', 'XML', state.exportContext.exportFormat)}
                ${option('markdown', 'Markdown', state.exportContext.exportFormat)}
              </select>
            </label>
          </div>
          <div class="tab-row">
            ${exportArtifacts
              .map(
                (artifact) =>
                  `<button type="button" data-export-tab="${artifact.tab}" class="${artifact.tab === exportArtifacts[0].tab ? 'is-active' : ''}">${escapeHtml(artifact.label)}</button>`,
              )
              .join('')}
          </div>
          <pre class="export-output">${escapeHtml(exportText)}</pre>
          <div class="export-footer">
            <div class="export-actions">
              <button type="button" data-copy>Copy</button>
              <button type="button" data-download-export="full">Download brief</button>
              <button type="button" data-download-export="css">Download CSS</button>
              <button type="button" data-download-export="tokens">Download JSON</button>
            </div>
            <span class="copy-feedback" aria-live="polite"></span>
          </div>
        </form>
      </dialog>
    </div>
  `;

  if (canQuery) {
    const sidebar = target.querySelector<HTMLElement>('.sidebar');
    const mainArea = target.querySelector<HTMLElement>('.main-area');
    if (sidebar) sidebar.scrollTop = sidebarScroll;
    if (mainArea) mainArea.scrollTop = mainScroll;
  }
}

export function attachExportInteractions(target: HTMLElement, state: CatalogState): void {
  const dialog = target.querySelector<HTMLDialogElement>('.export-dialog');
  const output = target.querySelector<HTMLElement>('.export-output');
  const feedback = target.querySelector<HTMLElement>('.copy-feedback');
  const openButtons = target.querySelectorAll<HTMLButtonElement>('[data-export-open]');
  const tabButtons = target.querySelectorAll<HTMLButtonElement>('[data-export-tab]');
  const copyButton = target.querySelector<HTMLButtonElement>('[data-copy]');
  const downloadButtons = target.querySelectorAll<HTMLButtonElement>('[data-download-export]');

  if (!dialog || !output || !feedback || openButtons.length === 0 || !copyButton) {
    return;
  }

  let activeTab: ExportTab = (
    target.querySelector<HTMLButtonElement>('[data-export-tab].is-active')?.dataset.exportTab as ExportTab | undefined
  ) ?? 'full';

  openButtons.forEach((btn) => btn.addEventListener('click', () => dialog.showModal()));

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTab = button.dataset.exportTab as ExportTab;
      activeTab = nextTab;
      output.textContent = getExportArtifact(state, nextTab).content;
      feedback.textContent = '';
      tabButtons.forEach((candidate) => {
        candidate.classList.toggle('is-active', candidate === button);
      });
    });
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getExportArtifact(state, activeTab).content);
      feedback.textContent = 'Copied.';
      window.setTimeout(() => {
        feedback.textContent = '';
      }, 1500);
    } catch {
      feedback.textContent = 'Copy unavailable.';
    }
  });

  downloadButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.downloadExport as ExportTab;
      downloadExportArtifact(state, tab);
      const label = tab === 'tokens' ? 'JSON' : tab === 'css' ? 'CSS' : 'brief';
      feedback.textContent = `Downloaded ${label}.`;
      window.setTimeout(() => {
        feedback.textContent = '';
      }, 1500);
    });
  });
}

function downloadExportArtifact(state: CatalogState, tab: ExportTab): void {
  const artifact = getExportArtifact(state, tab);
  const blob = new Blob([artifact.content], { type: `${getExportMimeType(state, tab)};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = getExportFilename(state, tab);
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
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

function renderHeroByArchetype(state: CatalogState, content: HeroContent): string {
  if (state.archetype === 'saas') {
    return `
      <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
      <h2>${escapeHtml(content.title)}</h2>
      <div class="ghost-chrome">
        <div class="ghost-sidebar">
          <div class="ghost-nav-item is-active"></div>
          <div class="ghost-nav-item"></div>
          <div class="ghost-nav-item"></div>
        </div>
        <div class="ghost-main">
          <div class="ghost-stats-grid">
            <div class="ghost-stat-card">${ghostChart('accent')}</div>
            <div class="ghost-stat-card">${ghostChart('muted')}</div>
            <div class="ghost-stat-card">${ghostChart('accent')}</div>
          </div>
          <div class="ghost-list-panel">
            <h3>Activity</h3>
            ${ghostActivity(4)}
          </div>
        </div>
      </div>
      <p>${escapeHtml(content.copy)}</p>
      <div class="hero-actions">
        <button type="button">${escapeHtml(content.cta)}</button>
      </div>
    `;
  }

  if (state.archetype === 'editorial') {
    return `
      <div class="ghost-magazine">
        <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
        <h2 class="ghost-drop-cap">${escapeHtml(content.title)}</h2>
        <div class="ghost-editorial-grid">
          <div class="ghost-col-main">
            <p class="hero-body">${escapeHtml(content.body)}</p>
            <p>${escapeHtml(content.copy)}</p>
          </div>
          <div class="ghost-col-side">
            <div class="ghost-pull-quote">"${content.features[0]}"</div>
            <ul class="feature-list">
              ${content.features.slice(1).map((f: string) => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="hero-actions">
          <button type="button">${escapeHtml(content.cta)}</button>
        </div>
      </div>
    `;
  }

  if (state.archetype === 'cli' || state.archetype === 'tui') {
    return `
      <div class="ghost-terminal">
        <div class="terminal-chrome">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
        <div class="terminal-body">
          <div class="terminal-line"><span class="prompt">$</span> superficies init --archetype ${state.archetype}</div>
          <div class="terminal-line success">✓ System rhythm initialized (ratio: ${state.live.scaleRatio})</div>
          <div class="terminal-line"><span class="prompt">$</span> superficies preview</div>
          <div class="terminal-output">
            <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
            <h2>${escapeHtml(content.title)}</h2>
            <p>${escapeHtml(content.copy)}</p>
            <ul class="feature-list">
              ${content.features.map((f: string) => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
          </div>
          <div class="terminal-line"><span class="cursor">_</span></div>
        </div>
      </div>
    `;
  }

  // Fallback to default layout
  return `
    <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
    <h2>${escapeHtml(content.title)}</h2>
    <p>${escapeHtml(content.copy)}</p>
    <p class="hero-body">${escapeHtml(content.body)}</p>
    <ul class="feature-list">
      ${content.features.map((feature: any) => `<li>${escapeHtml(feature)}</li>`).join('')}
    </ul>
    <div class="hero-actions">
      <button type="button">${escapeHtml(content.cta)}</button>
      <button type="button" class="secondary">Compare tokens</button>
    </div>
  `;
}

function ghostChart(colorClass: string): string {
  return `
    <div class="ghost-chart ${colorClass}">
      <div class="bar" style="height: 40%"></div>
      <div class="bar" style="height: 70%"></div>
      <div class="bar" style="height: 50%"></div>
      <div class="bar" style="height: 90%"></div>
      <div class="bar" style="height: 60%"></div>
    </div>
  `;
}

function ghostActivity(count: number): string {
  return `
    <div class="ghost-activity-list">
      ${Array.from({ length: count }).map(() => `
        <div class="ghost-activity-item">
          <div class="avatar"></div>
          <div class="lines">
            <div class="line"></div>
            <div class="line short"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderColorSwatch(id: string, active: boolean): string {
  const colors: Record<string, string> = {
    acid: 'oklch(74% 0.18 85)',
    sky: 'oklch(68% 0.14 235)',
    sepia: 'oklch(63% 0.12 52)',
    vinyl: 'oklch(62% 0.22 32)',
  };

  return `
    <button type="button" class="visual-swatch ${active ? 'is-active' : ''}" data-live-control="color" data-value="${id}" title="${id}">
      <div class="swatch-preview" style="background: ${colors[id]}"></div>
      <span class="swatch-label">${id}</span>
    </button>
  `;
}

function renderSurfaceSwatch(id: string, active: boolean): string {
  const styles: Record<string, string> = {
    flat: 'border: none',
    outlined: 'border: 2px solid currentColor',
    elevated: 'box-shadow: 4px 4px 10px rgba(0,0,0,0.2)',
  };

  return `
    <button type="button" class="visual-swatch ${active ? 'is-active' : ''}" data-live-control="surface" data-value="${id}" title="${id}">
      <div class="swatch-preview" style="background: var(--panel); ${styles[id]}"></div>
      <span class="swatch-label">${id}</span>
    </button>
  `;
}

function renderTypographySpecimen(id: string, active: boolean): string {
  const families: Record<string, string> = {
    chunky: 'Arial Black, Impact, sans-serif',
    system: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
  };

  return `
    <button type="button" class="visual-specimen ${active ? 'is-active' : ''}" data-live-control="typography" data-value="${id}">
      <span class="font-preview" style="font-family: ${families[id]}">Aa</span>
      <div class="font-info">
        <span class="font-label">${id}</span>
      </div>
    </button>
  `;
}
