import { useEffect, useRef } from 'react';
import { StoreProvider } from './store';
import { useStore } from './storeContext';
import { Window } from './components/Window';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { FilterBar } from './components/FilterBar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { StatusBar } from './components/StatusBar';
import { ConfirmDialog } from './components/ConfirmDialog';

import { FileTable } from './components/FileTable';
import { FileGroupList } from './components/FileGroupList';
import { CalendarView } from './components/CalendarView';
import { BulkActionBar } from './components/BulkActionBar';
import { DetailPane } from './components/DetailPane';
import { EmptyState } from './components/EmptyState';
import { StarredContent } from './screens/StarredScreen';
import { SettingsContent } from './screens/SettingsScreen';

function Shell() {
  const store = useStore();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;

      // While the delete dialog is open it owns the keyboard.
      if (store.pendingDelete) return;

      if (e.key === 'Escape') {
        if (store.searchQuery) store.setSearchQuery('');
        else if (store.selectedPaths.size > 0) store.clearSelection();
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

      // Backspace = delete is a macOS habit; on Windows it's too easy to hit by accident.
      if ((e.key === 'Delete' || (store.isMac && e.key === 'Backspace')) && store.screen === 'main') {
        const targets = [...store.selectedPaths];
        if (targets.length > 0) {
          e.preventDefault();
          store.requestDelete(targets);
        }
        return;
      }

      // Enter opens the selected file (skipped when a button has focus: Enter should press it).
      if (
        e.key === 'Enter' &&
        target.tagName !== 'BUTTON' &&
        store.screen === 'main' &&
        store.viewMode === 'list' &&
        store.selectedFile &&
        store.selectedPaths.size === 1
      ) {
        e.preventDefault();
        if (store.selectedFile.isDir) store.browseInto(store.selectedFile.path);
        else window.localUpdater?.openPath(store.selectedFile.path);
        return;
      }

      if (e.key === 'F2' && store.selectedPath && store.viewMode === 'list') {
        e.preventDefault();
        store.setEditingPath(store.selectedPath);
        return;
      }

      if (store.viewMode !== 'list') return;

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

  return (
    <>
      <Window title="LocalUpdater">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
          <Toolbar searchRef={searchRef} />
          {store.screen === 'main' && <MainContent />}
          {store.screen === 'starred' && <StarredContent />}
          {store.screen === 'settings' && <SettingsContent />}
          <StatusBar />
        </main>
      </Window>
      <ConfirmDialog />
    </>
  );
}

function MainContent() {
  const {
    viewMode,
    folderFiles,
    filteredFiles,
    searchQuery,
    setSearchQuery,
    resetFilters,
    selectedFile,
    rescan,
  } = useStore();

  const isEmpty = filteredFiles.length === 0;
  const emptyVariant = folderFiles.length === 0
    ? 'folder' as const
    : searchQuery
      ? 'search' as const
      : 'filter' as const;

  return (
    <>
      <FilterBar />
      <BreadcrumbBar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {isEmpty ? (
            <EmptyState
              variant={emptyVariant}
              query={searchQuery}
              onPrimary={
                emptyVariant === 'folder' ? rescan
                  : emptyVariant === 'search' ? () => setSearchQuery('')
                    : resetFilters
              }
              onSecondary={emptyVariant === 'search' ? resetFilters : undefined}
            />
          ) : viewMode === 'list' ? (
            <FileTable />
          ) : viewMode === 'timeline' ? (
            <FileGroupList />
          ) : (
            <CalendarView />
          )}
          {viewMode !== 'calendar' && <BulkActionBar />}
        </div>
        {/* The detail pane only takes space while a file is selected. */}
        {viewMode === 'list' && selectedFile && <DetailPane />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
