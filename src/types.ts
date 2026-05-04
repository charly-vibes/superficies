export type Mode = 'light' | 'dark' | 'both';
export type Archetype = 'saas' | 'restaurant' | 'editorial';

export interface CatalogState {
  preset: 'neobrutalist';
  archetype: Archetype;
  mode: Mode;
}

export interface ArchetypeContent {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
}
