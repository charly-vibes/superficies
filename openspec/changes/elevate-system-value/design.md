# Design: Elevate System Value

## Architectural Reasoning

### Modular Scale Engine
Currently, tokens are static arrays in `src/tokens.ts`. We will transition to a generator-based approach:
- **State:** Add `scaleRatio` (e.g., 1.2, 1.25, 1.33) and `baseSize` (e.g., 1rem) to the `LiveDimensions` state.
- **Derivation:** The `deriveDesignTokens` function will calculate the typography ladder and spacing scale using `baseSize * (ratio ^ index)`.
- **Constraint:** We will keep a few "Preset Ratios" (Minor Second, Major Second, Perfect Fourth, etc.) to ensure users stay within harmonious bounds while still having control.

### High-Fidelity "Ghost" UI
To increase fidelity without adding a framework, we will use "Ghost UI" patterns:
- **Technique:** CSS Grid and Flexbox combined with stylized `:before`/`:after` elements.
- **Definition:** "Ghost UI" refers to abstract, representative components (like simplified dashboard charts or magazine spreads) built purely with CSS primitives rather than real assets or loading skeletons.
- **No Assets:** We will avoid images and SVG icons initially, using CSS-only shapes (rectangles, circles, lines) to represent charts, avatars, and buttons.
- **Token Bound:** All "Ghost" elements must use the system tokens (radius, surface, color) to prove the system's versatility.

### Visual Sidebar Controls
We will extend the `renderApp` logic to support custom control types:
- **Swatches:** `color` and `surface` controls will render as clickable buttons showing the actual visual result.
- **Specimens:** `typography` controls will render the label in the target font.
- **Transitions:** We will add a global "fade-in" transition or CSS `transition: all 0.2s ease-out` on token-bound properties to make design changes feel fluid and professional.

### Export Enrichment
- **Brief Injection:** The `getExportText` function will be updated to traverse the `DesignTokens` object and include key computed values in the output text.
- **CSS Export:** A new `ExportTab` called `css` will be added to `src/export.ts` to output a `:root` block of CSS variables.

## Constraints & Edge Cases
- **Safe Scale Range:** To prevent layout breakage, the modular scale ratio will be constrained between **1.05** and **1.618** (The Golden Ratio).
- **URL Hash Efficiency:** New state keys will use ultra-short aliases (`sr` for scaleRatio, `bs` for baseSize) to preserve shareable, human-readable URLs.
