# url-state-sharing Specification

## Purpose
Define state management, URL serialization, defaults, and deterministic sharing behavior for the catalog.

## Requirements

### Requirement: Single state object drives rendering
The system SHALL represent catalog behavior through one typed state object that is the source of truth for preview, export, and URL state.

#### Scenario: State changes drive rendering
- **WHEN** any control changes a state field
- **THEN** the application updates the state object
- **AND** rerenders the preview from the new state

### Requirement: URL hash persists shareable state
The system SHALL persist catalog state in the URL hash instead of server storage or local storage.

#### Scenario: User changes catalog state
- **WHEN** the user changes state in the catalog
- **THEN** the application serializes the current state into the URL hash
- **AND** updates browser history without a full page reload

#### Scenario: User opens a shared URL
- **WHEN** the application loads with a valid encoded hash
- **THEN** the application reconstructs the encoded state
- **AND** renders the preview and controls from that state

### Requirement: Human-readable compact hash is the default encoding
The system SHALL use a compact key-value URL hash as the default serialization format.

#### Scenario: Encoded state fits within normal hash size
- **WHEN** the serialized state remains within the supported readable-hash threshold
- **THEN** the application encodes state as compact key-value pairs
- **AND** uses compact aliases for enumerated values

### Requirement: Long state falls back to compact base64 payload
The system SHALL fall back to a base64-encoded JSON payload when the normal hash becomes too long.

#### Scenario: Export or content fields exceed readable hash budget
- **WHEN** the serialized hash exceeds the configured threshold
- **THEN** the application serializes state as JSON
- **AND** base64-encodes the JSON under a dedicated compressed hash key

### Requirement: Invalid URL state fails safely
The system SHALL recover gracefully from missing, malformed, or unsupported URL state.

#### Scenario: Hash is missing or unparsable
- **WHEN** the application cannot parse the current hash into a valid state
- **THEN** it falls back to the default state
- **AND** renders a usable preview without crashing

### Requirement: Cold load starts from a vivid default
The system SHALL default to the neobrutalist preset with the SaaS archetype on cold load.

#### Scenario: Application opens without encoded state
- **WHEN** the application loads without a recognized hash
- **THEN** it initializes state from the default preset configuration
- **AND** sets the archetype to `saas`

### Requirement: Preset application resets departure state
The system SHALL reset preset departure tracking when a new preset is selected.

#### Scenario: User switches to another preset
- **WHEN** the user selects a different preset
- **THEN** the system reapplies that preset's live-dimension values
- **AND** clears any prior departure flag

### Requirement: Font pairing rules remain valid
The system SHALL constrain body-font choices to the allowed pairing matrix for the selected display font.

#### Scenario: Selected body font is not allowed after display-font change
- **WHEN** the user changes the display font and the current body font becomes invalid
- **THEN** the application resets the body font to a valid default pairing for the new display font

### Requirement: Render pipeline updates deterministic outputs
The system SHALL derive preview, controls, and URL state from each committed state change.

#### Scenario: State commit triggers render pipeline
- **WHEN** the application commits a state change
- **THEN** it recomputes derived CSS variables
- **AND** updates preview data attributes and classes
- **AND** updates font loading if required
- **AND** updates archetype copy if required
- **AND** synchronizes the URL hash
