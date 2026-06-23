/**
 * LocalUpdater — Theme tokens helper.
 *
 * Prefer CSS variables `var(--color-*)` in components. This module is for
 * the few places that need a color value in JS (e.g. the activity strip
 * gradient, theme swatches in Settings).
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

export const THEMES: Record<ThemeName, ThemeTokens> = {
  earth: {
    primary: '#31658F',
    secondary: '#246169',
    accent: '#F5993D',
    bg: '#222629',
    surface: '#2B3036',
    surface2: '#262B2F',
    border: '#3A4046',
    text: '#EFF2F5',
    headText: '#7FB4D9',
    secText: '#7FCBD4',
    muted: '#9AA4AD',
    disabled: '#5A636B',
  },
  night: {
    primary: '#1F74C1',
    secondary: '#183095',
    accent: '#F5CD3D',
    bg: '#181B1E',
    surface: '#24292E',
    surface2: '#1F2428',
    border: '#30363D',
    text: '#E0E5EA',
    headText: '#7FB0E0',
    secText: '#9DB3F0',
    muted: '#8B949E',
    disabled: '#586069',
  },
  light: {
    primary: '#5DCFAF',
    secondary: '#39BAC1',
    accent: '#F5563D',
    bg: '#FAFBFB',
    surface: '#FFFFFF',
    surface2: '#F1F4F2',
    border: '#DCE3E0',
    text: '#2A3F39',
    headText: '#2A8B85',
    secText: '#2A8B85',
    muted: '#6A7C75',
    disabled: '#B5C0BB',
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
