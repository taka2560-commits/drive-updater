/**
 * LocalUpdater — Theme tokens
 *
 * TypeScript からトークンを参照したい場合のヘルパー。
 * 通常は CSS 変数 `var(--color-*)` を直接使うことを推奨。
 * このファイルは「条件分岐で色をハードコードしたい時」用。
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
    primary:   '#31658F',
    secondary: '#246169',
    accent:    '#F5993D',
    bg:        '#2B3036',
    surface:   '#33383E',
    surface2:  '#2F3439',
    border:    '#3A4046',
    text:      '#FAFBFB',
    headText:  '#7FB4D9',
    secText:   '#5DA8B0',
    muted:     '#8C9298',
    disabled:  '#5A6066',
  },
  night: {
    primary:   '#1F74C1',
    secondary: '#183095',
    accent:    '#F5CD3D',
    bg:        '#181B1E',
    surface:   '#22262A',
    surface2:  '#1E2125',
    border:    '#2A2E32',
    text:      '#FAFBFB',
    headText:  '#7FBFE6',
    secText:   '#6082C6',
    muted:     '#8C9298',
    disabled:  '#4A5056',
  },
  light: {
    primary:   '#5DCFAF',
    secondary: '#39BAC1',
    accent:    '#F5563D',
    bg:        '#FAFBFB',
    surface:   '#FFFFFF',
    surface2:  '#F1F4F2',
    border:    '#DCE3E0',
    text:      '#2A3F39',
    headText:  '#2A8B85',
    secText:   '#2A8B85',
    muted:     '#6A7C75',
    disabled:  '#B5C0BB',
  },
};

export const THEME_LABELS: Record<ThemeName, string> = {
  earth: 'Earth (アース)',
  night: 'Night (ナイト)',
  light: 'Light (ライト)',
};

/**
 * 設定で選んだテーマを適用する（root に data-theme をセット）。
 * 起動時に App.tsx の useEffect から呼ぶ。
 */
export function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

/**
 * 起動時に保存テーマを読み込む。
 */
export function loadSavedTheme(): ThemeName {
  const saved = localStorage.getItem('theme') as ThemeName | null;
  return saved && saved in THEMES ? saved : 'earth';
}
