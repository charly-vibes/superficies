# single-file-delivery Specification

## Purpose
Define the implementation and delivery constraints for shipping the catalog as a self-contained browser artifact.

## Requirements

### Requirement: Deliverable is a single self-contained HTML file
The system SHALL produce a single `dist/index.html` artifact containing all code and styles needed to run in supported browsers.

#### Scenario: Production build completes
- **WHEN** the project is built for distribution
- **THEN** the output includes a self-contained `dist/index.html`
- **AND** the artifact does not require separate JavaScript, CSS, or asset files to run

### Requirement: Authoring stack uses TypeScript with Vite single-file bundling
The implementation SHALL use TypeScript, Vite, and `vite-plugin-singlefile` for authoring and packaging.

#### Scenario: Build configuration is defined
- **WHEN** the authoring toolchain is configured
- **THEN** TypeScript is used for source authoring
- **AND** Vite performs development and build orchestration
- **AND** the single-file plugin inlines the final artifact

### Requirement: Runtime is framework-free
The implementation SHALL use vanilla HTML, CSS, and TypeScript-generated JavaScript without React, Tailwind, or a backend runtime.

#### Scenario: Runtime architecture is inspected
- **WHEN** the project source is reviewed
- **THEN** the preview and controls are implemented without framework runtime dependencies
- **AND** no backend service is required for normal operation

### Requirement: Source organization remains modular
The implementation SHALL keep source files separated by concern even though the final output is bundled into one file.

#### Scenario: Developer reviews source tree
- **WHEN** the source code is inspected
- **THEN** state, rendering, URL handling, export generation, data, and styles are organized into separate modules or files by concern

### Requirement: Build is type-checked before bundling
The implementation SHALL fail builds on TypeScript type errors before producing the final artifact.

#### Scenario: Type errors exist during build
- **WHEN** production build is invoked with invalid TypeScript state
- **THEN** type checking fails the build
- **AND** the final distribution artifact is not produced

### Requirement: Browser support targets modern OKLCH-capable engines
The implementation SHALL target modern browsers with baseline OKLCH support and may exclude older browsers from v1 support.

#### Scenario: User opens app in supported browser
- **WHEN** the browser meets the declared support floor
- **THEN** the app renders and behaves as designed using OKLCH-native styling
