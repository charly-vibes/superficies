import { defaultBodyFonts } from './data.ts';
import { defaultState } from './state.ts';
import type {
  Archetype,
  BodyFont,
  CatalogState,
  Colorway,
  Density,
  HeroLayout,
  Mode,
  Preset,
  Radius,
  Spacing,
  ExportFormat,
  Surface,
  Typography,
} from './types.ts';

const HASH_THRESHOLD = 500;

const presetAliases = {
  neobrutalist: 'n',
  softSaas: 's',
  warmEditorial: 'w',
} as const satisfies Record<Preset, string>;

const archetypeAliases = {
  saas: 's',
  restaurant: 'r',
  editorial: 'e',
} as const satisfies Record<Archetype, string>;

const modeAliases = {
  light: 'l',
  dark: 'd',
  both: 'b',
} as const satisfies Record<Mode, string>;

const heroLayoutAliases = {
  'hero+features': 'hf',
  bento: 'be',
  magazine: 'ma',
  'sidebar+main': 'sm',
} as const satisfies Record<HeroLayout, string>;

const typographyAliases = {
  chunky: 'c',
  system: 's',
  serif: 'f',
} as const satisfies Record<Typography, string>;

const bodyFontAliases = {
  system: 's',
  serif: 'f',
} as const satisfies Record<BodyFont, string>;

const colorAliases = {
  acid: 'a',
  sky: 's',
  sepia: 'p',
} as const satisfies Record<Colorway, string>;

const spacingAliases = {
  tight: 't',
  balanced: 'b',
  loose: 'l',
} as const satisfies Record<Spacing, string>;

const densityAliases = {
  compact: 'c',
  comfortable: 'm',
  roomy: 'r',
} as const satisfies Record<Density, string>;

const radiusAliases = {
  sharp: 'h',
  soft: 's',
  pill: 'p',
} as const satisfies Record<Radius, string>;

const surfaceAliases = {
  flat: 'f',
  outlined: 'o',
  elevated: 'e',
} as const satisfies Record<Surface, string>;

const exportFormatAliases = {
  xml: 'x',
  markdown: 'md',
} as const satisfies Record<ExportFormat, string>;

export function readStateFromHash(hash: string): CatalogState {
  const params = new URLSearchParams(hash.replace(/^#/, ''));

  if (params.has('b64')) {
    try {
      const json = fromBase64(params.get('b64')!);
      const parsed: unknown = JSON.parse(json);
      if (isCatalogState(parsed)) {
        return parsed;
      }
    } catch {
      // fall through
    }
    return defaultState;
  }

  if (!params.has('p') && !params.has('a') && !params.has('m')) {
    return defaultState;
  }

  const preset = decodeAlias(params.get('p'), presetAliases);
  const archetype = decodeAlias(params.get('a'), archetypeAliases);
  const mode = decodeAlias(params.get('m'), modeAliases);
  const heroLayout = decodeAlias(params.get('hl'), heroLayoutAliases);
  const typography = decodeAlias(params.get('ty'), typographyAliases);
  const color = decodeAlias(params.get('co'), colorAliases);
  const spacing = decodeAlias(params.get('sp'), spacingAliases);
  const density = decodeAlias(params.get('de'), densityAliases);
  const radius = decodeAlias(params.get('ra'), radiusAliases);
  const surface = decodeAlias(params.get('su'), surfaceAliases);
  const departedFromPreset = decodeBoolean(params.get('cu'));
  const exportFormat = decodeAlias(params.get('ef') ?? exportFormatAliases.xml, exportFormatAliases);

  if (
    !preset ||
    !archetype ||
    !mode ||
    !heroLayout ||
    !typography ||
    !color ||
    !spacing ||
    !density ||
    !radius ||
    !surface ||
    departedFromPreset === null ||
    !exportFormat
  ) {
    return defaultState;
  }

  const bodyFont = decodeAlias(params.get('bf'), bodyFontAliases) ?? defaultBodyFonts[typography];

  return {
    preset,
    archetype,
    mode,
    heroLayout,
    live: { typography, bodyFont, color, spacing, density, radius, surface },
    departedFromPreset,
    contentOverrides: {
      eyebrow: params.get('ey'),
      title: params.get('ti'),
      copy: params.get('cp'),
      cta: params.get('ct'),
      body: params.get('bo'),
    },
    exportContext: {
      ...defaultState.exportContext,
      audience: params.get('ea') ?? defaultState.exportContext.audience,
      jobsToBeDone: params.get('ej') ?? defaultState.exportContext.jobsToBeDone,
      antiReferences: params.get('er') ?? defaultState.exportContext.antiReferences,
      motionIntent: params.get('em') ?? defaultState.exportContext.motionIntent,
      accessibilityLevel: params.get('el') ?? defaultState.exportContext.accessibilityLevel,
      contentSample: params.get('ec') ?? defaultState.exportContext.contentSample,
      antiDefaults: params.get('ed') ?? defaultState.exportContext.antiDefaults,
      exportFormat,
    },
  };
}

export function writeStateToHash(state: CatalogState): string {
  const readable = buildReadableHash(state);
  if (readable.length <= HASH_THRESHOLD) {
    return readable;
  }
  return `#b64=${toBase64(JSON.stringify(state))}`;
}

function buildReadableHash(state: CatalogState): string {
  const params = new URLSearchParams();
  params.set('p', presetAliases[state.preset]);
  params.set('a', archetypeAliases[state.archetype]);
  params.set('m', modeAliases[state.mode]);
  params.set('hl', heroLayoutAliases[state.heroLayout]);
  params.set('ty', typographyAliases[state.live.typography]);
  params.set('bf', bodyFontAliases[state.live.bodyFont]);
  params.set('co', colorAliases[state.live.color]);
  params.set('sp', spacingAliases[state.live.spacing]);
  params.set('de', densityAliases[state.live.density]);
  params.set('ra', radiusAliases[state.live.radius]);
  params.set('su', surfaceAliases[state.live.surface]);
  params.set('cu', state.departedFromPreset ? '1' : '0');
  setOptionalParam(params, 'ey', state.contentOverrides.eyebrow);
  setOptionalParam(params, 'ti', state.contentOverrides.title);
  setOptionalParam(params, 'cp', state.contentOverrides.copy);
  setOptionalParam(params, 'ct', state.contentOverrides.cta);
  setOptionalParam(params, 'bo', state.contentOverrides.body);
  setChangedParam(params, 'ea', state.exportContext.audience, defaultState.exportContext.audience);
  setChangedParam(params, 'ej', state.exportContext.jobsToBeDone, defaultState.exportContext.jobsToBeDone);
  setChangedParam(params, 'er', state.exportContext.antiReferences, defaultState.exportContext.antiReferences);
  setChangedParam(params, 'em', state.exportContext.motionIntent, defaultState.exportContext.motionIntent);
  setChangedParam(params, 'el', state.exportContext.accessibilityLevel, defaultState.exportContext.accessibilityLevel);
  setChangedParam(params, 'ec', state.exportContext.contentSample, defaultState.exportContext.contentSample);
  setChangedParam(params, 'ed', state.exportContext.antiDefaults, defaultState.exportContext.antiDefaults);
  setChangedParam(params, 'ef', exportFormatAliases[state.exportContext.exportFormat], exportFormatAliases[defaultState.exportContext.exportFormat]);
  return `#${params.toString()}`;
}

function setOptionalParam(params: URLSearchParams, key: string, value: string | null): void {
  if (value) {
    params.set(key, value);
  }
}

function setChangedParam(params: URLSearchParams, key: string, value: string, defaultValue: string): void {
  if (value && value !== defaultValue) {
    params.set(key, value);
  }
}

function decodeAlias<T extends string>(
  value: string | null,
  aliases: Record<T, string>,
): T | null {
  if (value === null) {
    return null;
  }

  const match = Object.entries<string>(aliases).find(
    ([name, alias]) => value === alias || value === name,
  );

  return match ? (match[0] as T) : null;
}

function decodeBoolean(value: string | null): boolean | null {
  if (value === '1' || value === 'true') {
    return true;
  }
  if (value === '0' || value === 'false') {
    return false;
  }
  return null;
}

function isCatalogState(value: unknown): value is CatalogState {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.preset === 'string' &&
    typeof s.archetype === 'string' &&
    typeof s.mode === 'string' &&
    typeof s.heroLayout === 'string' &&
    typeof s.live === 'object' && s.live !== null &&
    typeof s.departedFromPreset === 'boolean' &&
    typeof s.contentOverrides === 'object' && s.contentOverrides !== null &&
    typeof s.exportContext === 'object' && s.exportContext !== null
  );
}

function toBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/gi, (_, p1: string) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  );
}

function fromBase64(str: string): string {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  );
}
