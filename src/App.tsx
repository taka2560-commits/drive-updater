import { useEffect, useRef } from 'react';
import { StoreProvider } from './store';
import { useStore } from './storeContext';
import { MainScreen } from './screens/MainScreen';
import { MainScreenB } from './screens/MainScreenB';
import { MainScreenC } from './screens/MainScreenC';
import { StarredScreen } from './screens/StarredScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function Shell() {
  const store = useStore();
  const searchRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts (spec §4.2).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;

      // Escape works everywhere (incl. while typing): clear → deselect → close.
      if (e.key === 'Escape') {
        if (store.searchQuery) store.setSearchQuery('');
        else if (store.selectedPath) store.setSelected(null);
        (document.activeElement as HTMLElement)?.blur?.();
        return;
      }

      if (mod && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        store.setScreen('main');
        searchRef.current?.focus();
        return;
      }
      if (mod && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        store.rescan();
        return;
      }
      if (mod && e.key === ',') {
        e.preventDefault();
        store.setScreen('settings');
        return;
      }

      if (typing) return;

      if (e.key === '/') {
        e.preventDefault();
        store.setScreen('main');
        searchRef.current?.focus();
        return;
      }

      if (mod && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (store.selectedPath) store.toggleStar(store.selectedPath);
        return;
      }

      // Arrow/Space navigation is A-layout only; B (accordion) and C (modal)
      // handle these keys inside their own components.
      if (store.layout !== 'A') return;

      // Arrow navigation only on the main file list.
      if (store.screen === 'main' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const list = store.filteredFiles;
        if (list.length === 0) return;
        const idx = list.findIndex((f) => f.path === store.selectedPath);
        let next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
        if (idx === -1) next = 0;
        next = Math.max(0, Math.min(list.length - 1, next));
        store.setSelected(list[next].path);
        return;
      }

      if (e.key === ' ' && store.screen === 'main') {
        e.preventDefault();
        store.setSelected(store.selectedPath ? null : (store.filteredFiles[0]?.path ?? null));
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [store]);

  if (store.screen === 'starred') return <StarredScreen />;
  if (store.screen === 'settings') return <SettingsScreen />;
  if (store.layout === 'B') return <MainScreenB searchRef={searchRef} />;
  if (store.layout === 'C') return <MainScreenC searchRef={searchRef} />;
  return <MainScreen searchRef={searchRef} />;
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
