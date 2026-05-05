# catalog-preview Spec Delta

## MODIFIED Requirements

### Requirement: Hero zone supports four layout patterns
The system SHALL support `hero+features`, `bento`, `magazine`, and `sidebar+main` hero layouts **using high-fidelity representative UI components**.

#### Scenario: User selects SaaS archetype
- **WHEN** the user selects the SaaS archetype
- **THEN** the hero zone renders a representative dashboard layout
- **AND** the layout includes mock data visualizations and activity lists styled with system tokens

#### Scenario: User selects Editorial archetype
- **WHEN** the user selects the Editorial archetype
- **THEN** the hero zone renders a magazine-style multi-column layout
- **AND** the typography ladder is applied to distinct editorial elements (headlines, subheads, drop-caps)

### Requirement: Token panel exposes computed design tokens
The system SHALL display computed typography, color, spacing, radius, and shadow tokens **derived from an algorithmic modular scale**.

#### Scenario: User changes modular scale ratio
- **WHEN** the user updates the scale ratio control
- **THEN** the spacing scale and typography ladder update dynamically
- **AND** the preview reflects the new rhythmic consistency across all zones

#### Scenario: Scale ratio is constrained to safe bounds
- **WHEN** the user attempts to set a scale ratio outside the [1.05, 1.618] range
- **THEN** the system clamps the value to the nearest safe bound
- **AND** the layout remains functional

### Requirement: Responsive editing chrome supports desktop and mobile
The system SHALL provide **visual** sidebar-based controls on desktop and modal-based controls on mobile.

#### Scenario: User explores colors in the sidebar
- **WHEN** the user views the color controls
- **THEN** each option is rendered as a visual swatch showing the actual OKLCH color
- **AND** the active selection is clearly highlighted

#### Scenario: User explores typography in the sidebar
- **WHEN** the user views typography controls
- **THEN** each option includes a mini-specimen rendered in the target font family
