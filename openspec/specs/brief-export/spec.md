# brief-export Specification

## Purpose
Define how the catalog exports deterministic design-brief artifacts from the current state.

## Requirements

### Requirement: Export flow is accessible from the main UI
The system SHALL expose an export action from the primary control chrome.

#### Scenario: User opens export tools
- **WHEN** the user activates the export control
- **THEN** the application opens an export interface without leaving the current catalog session

### Requirement: Export UI provides three artifact tabs
The system SHALL provide full brief, minimum-viable brief, and token JSON export views.

#### Scenario: Export interface opens
- **WHEN** the export interface is displayed
- **THEN** it includes a full brief tab
- **AND** a minimum-viable brief tab
- **AND** a token JSON tab

### Requirement: Full brief exports current state deterministically
The system SHALL build a full design brief from the current state and current content.

#### Scenario: User views full brief output
- **WHEN** the full brief tab is active
- **THEN** the output reflects the current preset context, live dimensions, accessibility target, content, and anti-default constraints
- **AND** repeated exports from the same state produce equivalent content

### Requirement: Full brief supports XML and Markdown wrappers
The system SHALL support XML and Markdown forms for the full brief while preserving the same semantic content.

#### Scenario: User switches full brief format
- **WHEN** the user changes the full-brief format toggle
- **THEN** the export updates between XML and Markdown presentation
- **AND** preserves the same underlying brief information

### Requirement: Minimum brief summarizes generation intent
The system SHALL provide a compact brief suitable for rapid in-chat generation guidance.

#### Scenario: User views minimum brief
- **WHEN** the minimum-viable brief tab is active
- **THEN** the output summarizes audience, visual direction, stack, tokens, state handling expectations, and accessibility target in a short prompt

### Requirement: Token JSON exports design tokens
The system SHALL provide a machine-readable design-token artifact derived from the current state.

#### Scenario: User views token JSON
- **WHEN** the token JSON tab is active
- **THEN** the output includes color, spacing, radius, typography, and shadow tokens derived from the current state

### Requirement: Export-only fields enrich briefs without restyling preview
The system SHALL support export-only context fields that affect generated brief content but do not change preview visuals.

#### Scenario: User edits brief context
- **WHEN** the user edits audience, jobs-to-be-done, anti-references, motion intent, accessibility level, content sample, anti-defaults, or export format
- **THEN** subsequent exports reflect those values
- **AND** the preview styling remains unchanged unless preview-controlled fields were also edited

### Requirement: Copy actions provide immediate feedback
The system SHALL let users copy each export artifact and confirm success.

#### Scenario: User copies an export artifact
- **WHEN** the user activates the copy action for the active tab
- **THEN** the application copies the artifact text to the clipboard
- **AND** briefly indicates success to the user
