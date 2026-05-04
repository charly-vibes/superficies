# superficies

Design catalog for exploring orthogonal web-design dimensions via live preview and exporting deterministic design briefs.

## Tooling
- `wai` for project context, research, plans, and handoffs
- `bd` for issue/dependency tracking
- `openspec` for spec-driven changes
- TypeScript + Vite + `vite-plugin-singlefile` for authoring and bundling

## Local development
1. Install dependencies: `npm install`
2. Start the local dev server: `just serve`
3. Build the single-file artifact: `npm run build`
4. Preview the production build locally: `just preview`

## Output
- Production build emits a self-contained `dist/index.html`
- Current tracer bullet includes:
  - labeled hero zone
  - labeled specimen strip
  - labeled token panel
  - export dialog with full brief, minimum brief, and token JSON tabs

## GitHub Pages
- Deployment is automated via `.github/workflows/deploy-pages.yml`
- After Pages is enabled in repository settings, pushes to `main` publish the `dist/` artifact
- Expected site URL: `https://<owner>.github.io/superficies/`

## Current repo setup
- `openspec/` initialized
- `.beads/` initialized
- `.wai/` workspace initialized
