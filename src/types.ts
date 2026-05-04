export type Mode = 'light' | 'dark' | 'both';
export type Archetype = 'saas' | 'restaurant' | 'editorial';
export type Preset = 'neobrutalist' | 'softSaas' | 'warmEditorial';

export type Typography = 'chunky' | 'system' | 'serif';
export type Colorway = 'acid' | 'sky' | 'sepia';
export type Spacing = 'tight' | 'balanced' | 'loose';
export type Density = 'compact' | 'comfortable' | 'roomy';
export type Radius = 'sharp' | 'soft' | 'pill';
export type Surface = 'flat' | 'outlined' | 'elevated';

export interface LiveDimensions {
  typography: Typography;
  color: Colorway;
  spacing: Spacing;
  density: Density;
  radius: Radius;
  surface: Surface;
}

export type LiveDimensionKey = keyof LiveDimensions;

export interface CatalogState {
  preset: Preset;
  archetype: Archetype;
  mode: Mode;
  live: LiveDimensions;
  departedFromPreset: boolean;
}

export interface PresetDefinition {
  id: Preset;
  label: string;
  live: LiveDimensions;
}

export interface ArchetypeContent {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
}
