# Project Context

## Purpose
Build a design-catalog tool for exploring orthogonal web-design dimensions with live preview and deterministic export to plain-text design briefs for Claude, GPT, or Gemini.

Primary goals:
- let users explore independent design axes with immediate visual feedback
- export a reusable design brief from the current state
- keep the app shareable and revertable via URL state only
- ship as a single self-contained `dist/index.html`

## Tech Stack
- TypeScript
- Vite
- `vite-plugin-singlefile`
- Vanilla HTML, CSS, and TS
- OKLCH-based design tokens
- `wai` for project context and handoffs
- `bd` for issue/dependency tracking
- `openspec` for spec-driven change management

## Project Conventions

### Code Style
- Prefer strict TypeScript with literal unions for finite state dimensions.
- Keep render logic simple and explicit; direct DOM writes are preferred over framework abstractions.
- Use pure functions for state transforms, hash serialization, and export generation.
- Keep preview styling token-driven through CSS custom properties.
- Favor small modules grouped by concern: state, URL hash, render, export, data, styles.

### Architecture Patterns
- Single state object is the source of truth.
- Render is a pure function of state.
- URL hash is the persistence/share mechanism; no backend and no localStorage.
- Deliverable is a single compiled `index.html`, but source remains split for maintainability.
- Presets bootstrap coherent states; dimensions must remain independently editable afterward.

### Testing Strategy
- Gate builds with `tsc --noEmit`.
- Verify production bundling with `vite build`.
- Manually validate:
  - URL parse/serialize round-trips
  - preset application and departure tracking
  - export output formats
  - light, dark, and both preview modes
  - core interactions in current target browsers

### Git Workflow
- Use OpenSpec for substantial changes, new capabilities, and architectural decisions.
- Track implementation work in bd when tasks/issues need dependency management.
- Use wai artifacts to capture research, design rationale, plans, and handoffs.
- Keep commits atomic and aligned with a single change or setup step.

## Domain Context
This project is a design exploration and prompt-generation tool, not a runtime site generator. The preview exists to make visual dimensions legible; the exported brief is the artifact used in downstream LLM page-generation workflows.

The preview is composed of three fixed zones:
- hero zone with one of four layout patterns
- specimen strip for components and interaction states
- token panel for typography, color, spacing, radius, and shadow tokens

## Important Constraints
- Final deliverable must be a single self-contained `index.html`.
- No framework, no Tailwind, no React, and no backend.
- No package install or build requirement for the end user; build step is authoring-time only.
- URL state must be the only persistence mechanism.
- Target modern browsers with OKLCH support; older-browser fallbacks are out of scope for v1.

## External Dependencies
- Google Fonts for display/body font loading in preview
- `vite-plugin-singlefile` for inlining JS/CSS into one HTML artifact
- OpenSpec CLI for specs and change proposals
- bd / beads for issue tracking
- wai CLI for workflow and context management
