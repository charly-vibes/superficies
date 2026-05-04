export type Mode = 'light' | 'dark' | 'both';
export type Archetype = 'saas' | 'restaurant' | 'editorial';
export type Preset = 'neobrutalist' | 'softSaas' | 'warmEditorial';
export type HeroLayout = 'hero+features' | 'bento' | 'magazine' | 'sidebar+main';

export type Typography = 'chunky' | 'system' | 'serif';
export type BodyFont = 'system' | 'serif';
export type Colorway = 'acid' | 'sky' | 'sepia';
export type Spacing = 'tight' | 'balanced' | 'loose';
export type Density = 'compact' | 'comfortable' | 'roomy';
export type Radius = 'sharp' | 'soft' | 'pill';
export type Surface = 'flat' | 'outlined' | 'elevated';

export interface LiveDimensions {
  typography: Typography;
  bodyFont: BodyFont;
  color: Colorway;
  spacing: Spacing;
  density: Density;
  radius: Radius;
  surface: Surface;
}

export type LiveDimensionKey = keyof LiveDimensions;

export interface HeroContent {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  body: string;
  features: string[];
}

export type HeroOverrideKey = 'eyebrow' | 'title' | 'copy' | 'cta' | 'body';
export type ContentOverrides = Record<HeroOverrideKey, string | null>;

export type ExportFormat = 'xml' | 'markdown';

export interface ExportContext {
  audience: string;
  jobsToBeDone: string;
  antiReferences: string;
  motionIntent: string;
  accessibilityLevel: string;
  contentSample: string;
  antiDefaults: string;
  exportFormat: ExportFormat;
}

export type ExportContextKey = keyof ExportContext;

export interface CatalogState {
  preset: Preset;
  archetype: Archetype;
  mode: Mode;
  heroLayout: HeroLayout;
  live: LiveDimensions;
  departedFromPreset: boolean;
  contentOverrides: ContentOverrides;
  exportContext: ExportContext;
}

export interface PresetDefinition {
  id: Preset;
  label: string;
  live: LiveDimensions;
}

export interface ArchetypeContent {
  hero: HeroContent;
}
