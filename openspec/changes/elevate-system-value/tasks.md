# Tasks: Elevate System Value

## Phase 1: Algorithmic Core
- [ ] Add `scaleRatio` and `baseSize` to `CatalogState` in `src/types.ts`
- [ ] Update `defaultState` and `presets` with scale values in `src/state.ts` and `src/data.ts`
- [ ] Refactor `deriveDesignTokens` in `src/tokens.ts` to calculate scales dynamically
- [ ] Update `hash.ts` with short aliases (`sr`, `bs`) and update `isCatalogState` validation
- [ ] Implement safe range constraints (1.05 - 1.618) in state update logic
- [ ] **Validation:** Verify that changing the scale ratio updates the token panel values correctly and invalid hashes are rejected.

## Phase 2: High-Fidelity Components
- [ ] Create `GhostUI` helper functions for rendering CSS-only charts and lists in `src/render.ts`
- [ ] Update archetype layouts in `src/render.ts` to use "Ghost" components
- [ ] Refine `src/styles/app.css` to support complex layouts (Dashboard, Magazine) without external assets
- [ ] **Validation:** Visual check of each archetype/layout combination to ensure they look like "real" UI skeletons.

## Phase 3: Visual Sidebar
- [ ] Implement `renderVisualSwatch` and `renderTypographySpecimen` helpers in `src/render.ts`
- [ ] Update sidebar rendering to use visual controls instead of standard `<select>` where applicable
- [ ] Add smooth CSS transitions (`all 0.2s ease-out`) to token-bound properties in `src/styles/app.css`
- [ ] Refactor `renderApp` to minimize DOM thrashing (targeted updates or transition class)
- [ ] **Validation:** Verify that clicking a swatch updates the state and preview correctly with a smooth transition.

## Phase 4: Enriched Export
- [ ] Add `css` tab support to `src/export.ts`
- [ ] Update `getExportText` to include computed technical values in the full brief
- [ ] Update `renderApp` and `attachExportInteractions` in `src/render.ts` to handle the new CSS tab
- [ ] **Validation:** Verify that the "CSS Variables" output is valid CSS and matches the active tokens.
