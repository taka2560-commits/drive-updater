import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process entry → dist-electron/main.js (matches package.json "main").
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          // Reload the renderer when the preload script changes.
          args.reload();
        },
        vite: {
          build: {
            // Electron preload scripts run with sandbox enabled by default,
            // which requires CommonJS. Build as a CJS lib so it emits
            // preload.cjs with require() (not ESM import) under "type":"module".
            lib: {
              entry: 'electron/preload.ts',
              formats: ['cjs'],
              fileName: () => 'preload.cjs',
            },
          },
        },
      },
    ]),
    renderer(),
  ],
});
