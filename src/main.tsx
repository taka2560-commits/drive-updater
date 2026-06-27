import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Locally-bundled fonts (offline; no CDN). Latin = Inter / JetBrains Mono,
// Japanese = Noto Sans JP. Vite bundles the woff2 into the build.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/500.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './theme/themes.css';
import { applyTheme, loadSavedTheme } from './theme/tokens';
import App from './App';

// Apply saved theme before mount to avoid FOUC (spec §9.2).
applyTheme(loadSavedTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
