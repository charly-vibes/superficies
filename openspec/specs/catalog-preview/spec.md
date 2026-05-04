# catalog-preview Specification

## Purpose
Define the interactive preview experience for the design catalog, including the fixed three-zone preview, live dimensions, curated presets, and content archetypes.

## Requirements

### Requirement: Three-zone preview
The system SHALL render a fixed reference preview composed of a hero zone, a specimen strip, and a token panel.

#### Scenario: Desktop preview renders all zones
- **WHEN** the application loads on a supported browser
- **THEN** the preview displays a hero zone
- **AND** the preview displays a specimen strip
- **AND** the preview displays a token panel

#### Scenario: Preview remains reference-based across style changes
- **WHEN** the user changes any live design dimension
- **THEN** the same reference preview structure remains in place
- **AND** only the preview styling, layout, or copy updates according to state

### Requirement: Hero zone supports four layout patterns
The system SHALL support `hero+features`, `bento`, `magazine`, and `sidebar+main` hero layouts.

#### Scenario: User selects a hero layout
- **WHEN** the user selects one of the supported layout patterns
- **THEN** the hero zone updates to the selected layout pattern
- **AND** the specimen strip and token panel remain present below the hero zone

### Requirement: Specimen strip demonstrates component states
The system SHALL render a specimen strip that demonstrates component anatomy and interaction states.

#### Scenario: Specimen strip shows required component groups
- **WHEN** the preview renders
- **THEN** the specimen strip includes buttons, inputs, card, dialog trigger, form group, and loading and feedback examples

#### Scenario: Forced states are visible simultaneously
- **WHEN** the specimen strip is shown
- **THEN** hover, focus-visible, active, disabled, and loading examples can be displayed without relying on live pointer state alone

### Requirement: Token panel exposes computed design tokens
The system SHALL display computed typography, color, spacing, radius, and shadow tokens in the token panel.

#### Scenario: Token panel shows typography ladder
- **WHEN** the token panel renders
- **THEN** it shows the type ladder with sample text and computed sizes

#### Scenario: Token panel shows semantic color data
- **WHEN** the token panel renders
- **THEN** it shows semantic color swatches
- **AND** each swatch includes OKLCH and computed hex values
- **AND** foreground/background pairs show contrast results

### Requirement: Live dimensions restyle the preview
The system SHALL let users modify the preview through independently editable live dimensions.

#### Scenario: User changes a visual dimension
- **WHEN** the user changes layout, typography, color, spacing, density, radius, surface treatment, or mode
- **THEN** the preview updates immediately to reflect the new state

#### Scenario: Dark comparison mode is enabled
- **WHEN** the user selects `both` mode
- **THEN** the preview shows light and dark variants side by side

### Requirement: Curated presets seed coherent states
The system SHALL provide curated presets that overwrite preset-controlled dimensions with coherent starting values.

#### Scenario: User selects a preset
- **WHEN** the user selects a preset from the preset control
- **THEN** all preset-controlled live dimensions update to that preset's values
- **AND** the current content archetype remains unchanged

#### Scenario: Preset-specific styling is applied
- **WHEN** the selected preset includes preset-specific visual treatment
- **THEN** the preview applies that treatment in addition to the shared dimensions

### Requirement: Manual edits preserve preset provenance
The system SHALL track whether the current state has departed from its originating preset.

#### Scenario: User edits a preset-controlled dimension after selecting a preset
- **WHEN** the user manually changes a preset-controlled dimension
- **THEN** the system marks the state as departed from the selected preset
- **AND** the UI identifies the state as custom while preserving the original preset reference

### Requirement: Archetypes provide default content
The system SHALL provide `saas`, `restaurant`, and `editorial` archetypes with predefined hero content.

#### Scenario: User selects an archetype
- **WHEN** the user selects an archetype
- **THEN** the hero content updates to the archetype's brand, headline, supporting copy, CTA, body copy, and feature content

#### Scenario: User overrides archetype content
- **WHEN** the user provides a non-null content override for a supported field
- **THEN** the preview uses the override instead of the archetype default for that field

### Requirement: Responsive editing chrome supports desktop and mobile
The system SHALL provide sidebar-based controls on desktop and modal-based controls on mobile.

#### Scenario: Desktop controls render persistently
- **WHEN** the viewport is at least 900 pixels wide
- **THEN** the application shows a fixed-width sidebar with collapsible sections
- **AND** the preview remains visible beside it

#### Scenario: Mobile controls render on demand
- **WHEN** the viewport is narrower than 900 pixels
- **THEN** the application hides the full control sidebar by default
- **AND** exposes edit and export actions through a bottom bar
- **AND** opens editing controls in a full-screen modal
