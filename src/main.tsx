import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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
