# brief-export Spec Delta

## MODIFIED Requirements

### Requirement: Export UI provides three artifact tabs
The system SHALL provide full brief, **CSS variables**, and token JSON export views.

#### Scenario: User views CSS variables
- **WHEN** the CSS variables tab is active
- **THEN** the output includes a `:root` block with all design tokens mapped to CSS custom properties

### Requirement: Full brief exports current state deterministically
The system SHALL build a full design brief **including precise computed token values** from the current state and current content.

#### Scenario: Full brief includes technical specs
- **WHEN** the full brief is exported
- **THEN** it includes specific OKLCH color strings
- **AND** it includes the modular scale ratio used for typography and spacing
- **AND** it includes absolute rem/px values for the typography ladder
