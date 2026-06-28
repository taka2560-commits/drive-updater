/**
 * LocalUpdater — Theme tokens helper.
 *
 * Prefer CSS custom properties in components. This module is for
 * the few places that need a color value in JS (e.g. theme swatches
 * in Settings).
 */

export type ThemeName = 'earth' | 'night' | 'light';

export interface ThemeTokens {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  headText: string;
  secText: string;
  muted: string;
  disabled: string;
}

// Values mirror the canonical handoff tokens (tokens/colors.css). Used only
// where a color is needed in JS — the theme swatches in Settings, etc.
// `primary` = brand, `secondary` = mid surface (for a representative swatch).
export const THEMES: Record<ThemeName, ThemeTokens> = {
  earth: {
    primary: '#7BA9CE',
    secondary: '#2A3543',
    accent: '#E8A05A',
    bg: '#1B232C',
    surface: '#232D38',
    surface2: '#2A3543',
    border: '#303B4A',
    text: '#E6E9EF',
    headText: '#7BA9CE',
    secText: '#7BA9CE',
    muted: '#9AA4B0',
    disabled: '#6B7585',
  },
  night: {
    primary: '#5286FF',
    secondary: '#1A2553',
    accent: '#FFD23F',
    bg: '#0E1530',
    surface: '#131C3D',
    surface2: '#1A2553',
    border: '#2A335A',
    text: '#ECEFFB',
    headText: '#5286FF',
    secText: '#82A6FF',
    muted: '#9AA6C9',
    disabled: '#6A769B',
  },
  light: {
    primary: '#2EAE92',
    secondary: '#F1F3F6',
    accent: '#FF7A69',
    bg: '#FAFBFC',
    surface: '#FFFFFF',
    surface2: '#F1F3F6',
    border: '#DCE3E0',
    text: '#1B232C',
    headText: '#2EAE92',
    secText: '#2EAE92',
    muted: '#5A6573',
    disabled: '#8A95A2',
  },
};

export const THEME_LABELS: Record<ThemeName, string> = {
  earth: 'Earth (アース)',
  night: 'Night (ナイト)',
  light: 'Light (ライト)',
};

export const THEME_SUBTITLES: Record<ThemeName, string> = {
  earth: 'スチールブルー · 暗色',
  night: 'ブライトブルー · 深暗色',
  light: 'ミント · コーラル · 白基調',
};

const STORAGE_KEY = 'localUpdater.theme';

/** Apply a theme: set data-theme on <html> and persist to localStorage. */
export function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

/** Read saved theme at startup (defaults to Earth). */
export function loadSavedTheme(): ThemeName {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && saved in THEMES) return saved;
  } catch {
    /* ignore */
  }
  return 'earth';
}
