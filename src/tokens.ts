import type { CatalogState, Colorway, Radius, Spacing, Surface, Typography } from './types.ts';

export interface TypographyTokenStep {
  name: 'display' | 'heading' | 'body' | 'caption';
  size: string;
  lineHeight: string;
  sample: string;
}

export interface ColorSwatch {
  name: 'surface' | 'ink' | 'accent' | 'muted';
  oklch: string;
  hex: string;
}

export interface ContrastPair {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
}

export interface DesignTokens {
  typography: {
    family: string;
    ladder: TypographyTokenStep[];
  };
  color: {
    semantic: ColorSwatch[];
    contrastPairs: ContrastPair[];
  };
  spacing: {
    scale: string[];
  };
  radius: {
    scale: string[];
  };
  shadow: {
    scale: string[];
  };
}

const typographyFamilies: Record<Typography, string> = {
  chunky: 'Arial Black, Impact, system-ui, sans-serif',
  system: 'Inter, ui-sans-serif, system-ui, sans-serif',
  serif: 'Georgia, Cambria, Times New Roman, serif',
};

const typographySamples: Record<TypographyTokenStep['name'], string> = {
  display: 'Launch faster',
  heading: 'Visual system',
  body: 'Preview production rhythm.',
  caption: 'Token note',
};

const typographyLineHeights: Record<Typography, Record<TypographyTokenStep['name'], string>> = {
  chunky: { display: '0.95', heading: '1.05', body: '1.55', caption: '1.35' },
  system: { display: '1', heading: '1.12', body: '1.6', caption: '1.4' },
  serif: { display: '1.02', heading: '1.12', body: '1.65', caption: '1.45' },
};

const colorTokens: Record<Colorway, Record<ColorSwatch['name'], string>> = {
  acid: {
    surface: 'oklch(97% 0.03 95)',
    ink: 'oklch(26% 0.03 260)',
    accent: 'oklch(74% 0.18 85)',
    muted: 'oklch(90% 0.05 95)',
  },
  sky: {
    surface: 'oklch(98% 0.02 235)',
    ink: 'oklch(28% 0.05 255)',
    accent: 'oklch(68% 0.14 235)',
    muted: 'oklch(91% 0.04 235)',
  },
  sepia: {
    surface: 'oklch(98% 0.02 88)',
    ink: 'oklch(30% 0.04 62)',
    accent: 'oklch(63% 0.12 52)',
    muted: 'oklch(90% 0.04 78)',
  },
  vinyl: {
    surface: 'oklch(97% 0.02 285)',
    ink: 'oklch(23% 0.15 278)',
    accent: 'oklch(62% 0.22 32)',
    muted: 'oklch(88% 0.05 280)',
  },
};

const radiusScales: Record<Radius, string[]> = {
  sharp: ['0rem', '0.125rem', '0.25rem'],
  soft: ['0.375rem', '0.75rem', '1.25rem'],
  pill: ['999px', '999px', '999px'],
};

const shadowScales: Record<Surface, string[]> = {
  flat: ['none'],
  outlined: ['4px 4px 0 rgb(20 20 20 / 0.85)'],
  elevated: ['0 18px 40px rgb(76 55 31 / 0.18)'],
};

const darkModeAccents: Record<Colorway, string> = {
  acid: 'oklch(82% 0.20 85)',
  sky: 'oklch(78% 0.15 235)',
  sepia: 'oklch(74% 0.14 52)',
  vinyl: 'oklch(74% 0.24 32)',
};

export function deriveDesignTokens(state: CatalogState): DesignTokens {
  const { scaleRatio, baseSize, typography: typogType, spacing: spacingPref } = state.live;
  const baseNum = parseFloat(baseSize);

  const lightTokens = colorTokens[state.live.color];
  const effectiveTokens: Record<ColorSwatch['name'], string> =
    state.mode === 'dark'
      ? {
          surface: 'oklch(18% 0.02 255)',
          ink: 'oklch(96% 0.01 95)',
          muted: 'oklch(78% 0.02 95)',
          accent: darkModeAccents[state.live.color],
        }
      : lightTokens;

  const semantic = (Object.entries(effectiveTokens) as Array<[ColorSwatch['name'], string]>).map(
    ([name, oklch]) => ({ name, oklch, hex: oklchToHex(oklch) }),
  );
  const byName = Object.fromEntries(semantic.map((swatch) => [swatch.name, swatch])) as Record<
    ColorSwatch['name'],
    ColorSwatch
  >;

  const steps: Array<TypographyTokenStep['name']> = ['display', 'heading', 'body', 'caption'];
  const stepPowers: Record<TypographyTokenStep['name'], number> = {
    display: 2,
    heading: 1,
    body: 0,
    caption: -1,
  };

  const ladder: TypographyTokenStep[] = steps.map((name) => ({
    name,
    size: `${round(baseNum * Math.pow(scaleRatio, stepPowers[name]), 3)}rem`,
    lineHeight: typographyLineHeights[typogType][name],
    sample: typographySamples[name],
  }));

  const spacingMultiplier = spacingPref === 'tight' ? 0.75 : spacingPref === 'loose' ? 1.5 : 1.0;
  const spacingBase = baseNum * 0.25 * spacingMultiplier;
  const spacingScale = [0, 1, 2, 3, 4].map(
    (power) => `${round(spacingBase * Math.pow(scaleRatio, power), 3)}rem`,
  );

  return {
    typography: {
      family: typographyFamilies[typogType],
      ladder,
    },
    color: {
      semantic,
      contrastPairs: [
        contrastPair('ink on surface', byName.ink, byName.surface),
        contrastPair('accent on surface', byName.accent, byName.surface),
        contrastPair('surface on ink', byName.surface, byName.ink),
      ],
    },
    spacing: {
      scale: spacingScale,
    },
    radius: {
      scale: radiusScales[state.live.radius],
    },
    shadow: {
      scale: shadowScales[state.live.surface],
    },
  };
}

function contrastPair(name: string, foreground: ColorSwatch, background: ColorSwatch): ContrastPair {
  const ratio = contrastRatio(foreground.hex, background.hex);
  return {
    name,
    foreground: foreground.hex,
    background: background.hex,
    ratio,
    passesAA: ratio >= 4.5,
  };
}

function oklchToHex(oklch: string): string {
  const match = /^oklch\((\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)$/.exec(oklch);
  if (!match) {
    throw new Error(`Unsupported OKLCH color: ${oklch}`);
  }

  const l = Number(match[1]) / 100;
  const c = Number(match[2]);
  const h = (Number(match[3]) * Math.PI) / 180;
  const a = Math.cos(h) * c;
  const b = Math.sin(h) * c;

  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

  const lCubed = lPrime ** 3;
  const mCubed = mPrime ** 3;
  const sCubed = sPrime ** 3;

  const r = +4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed;
  const g = -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed;
  const bl = -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed;

  return `#${[r, g, bl].map((channel) => toHex(srgbChannel(channel))).join('')}`;
}

function srgbChannel(linear: number): number {
  const clamped = Math.min(1, Math.max(0, linear));
  const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(encoded * 255);
}

function toHex(channel: number): string {
  return channel.toString(16).padStart(2, '0');
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return round((lighter + 0.05) / (darker + 0.05), 2);
}

function relativeLuminance(hex: string): number {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((pair) => {
    const encoded = Number.parseInt(pair, 16) / 255;
    return encoded <= 0.03928 ? encoded / 12.92 : ((encoded + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
