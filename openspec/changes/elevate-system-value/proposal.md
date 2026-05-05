# Proposal: Elevate System Value

Increase the utility and perceived value of "superficies" by moving from static presets to an algorithmic design system, enhancing preview fidelity, and providing more actionable export artifacts.

## Problem Statement

The current application feels like a "toy" because:
1.  **Static Choices:** Design tokens are hardcoded lists rather than a cohesive system.
2.  **Low-Fidelity Preview:** The preview is too abstract to judge real-world effectiveness.
3.  **Disconnected Controls:** Generic dropdowns lack the immediate visual context needed for design exploration.
4.  **Soft Briefs:** The exported briefs are descriptive but lack the technical precision (computed values) required for direct implementation.

## Proposed Changes

### Algorithmic Design System
- Replace hardcoded spacing and typography scales with a **Modular Scale** engine.
- Users can tune the "Rhythm" (base size + ratio) of the entire system.

### High-Fidelity Archetypes
- Upgrade "Hero Zone" layouts with abstract but representative UI components:
  - **SaaS:** Dashboard with mock charts and activity feeds.
  - **Editorial:** Magazine layout with multi-column rhythm and drop-caps.
  - **CLI/TUI:** Terminal-accurate rendering using the system's "Flat" surface and monospace tokens.

### Visual Workbench Controls
- Replace generic dropdowns in the sidebar with **Visual Swatches** and **Mini-Specimens**.
- Allow immediate visual identification of colors and typographic styles.

### Precision Export
- Inject computed token values (OKLCH strings, modular scale factors, absolute rem/px values) into the exported design briefs.
- Add a new "CSS Variables" export tab for direct developer utility.

## Success Criteria

1.  **Immediate Utility:** A developer can take the exported brief (or CSS) and build a matching UI without guesswork.
2.  **Design Coherence:** Changing the modular scale ratio updates both spacing and typography rhythm consistently.
3.  **Visual Proof:** The high-fidelity archetypes demonstrate that the tokens work for complex, real-world layouts.
