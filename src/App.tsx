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
import { HeatmapSection } from './components/HeatmapSection';
import { FilterContextBar } from './components/FilterContextBar';
import { FileListC } from './components/FileListC';
import { BulkActionBar } from './components/BulkActionBar';
import { DetailPane } from './components/DetailPane';
import { DetailModal } from './components/DetailModal';
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

      if ((e.key === 'Delete' || e.key === 'Backspace') && store.screen === 'main') {
        const targets =
          store.selectedPaths.size > 0 ? [...store.selectedPaths]
            : store.selectedPath ? [store.selectedPath]
              : [];
        if (targets.length > 0) {
          e.preventDefault();
          store.requestDelete(targets);
        }
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
    setTypeFilter,
    filterByDate,
    setFilterByDate,
    rescan,
    selectedFile,
    selectedPaths,
  } = useStore();

  const isEmpty = filteredFiles.length === 0;
  const emptyVariant = filterByDate ? 'search' : folderFiles.length === 0 ? 'folder' : 'search';

  return (
    <>
      <FilterBar />
      <BreadcrumbBar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {viewMode === 'calendar' && <HeatmapSection />}
          {viewMode === 'calendar' && <FilterContextBar />}
          {isEmpty ? (
            <EmptyState
              variant={emptyVariant}
              query={filterByDate ? `${filterByDate} のファイル` : searchQuery}
              onPrimary={
                filterByDate
                  ? () => setFilterByDate(null)
                  : folderFiles.length === 0
                    ? rescan
                    : () => setSearchQuery('')
              }
              onSecondary={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setFilterByDate(null);
              }}
            />
          ) : viewMode === 'list' ? (
            <FileTable />
          ) : viewMode === 'timeline' ? (
            <FileGroupList />
          ) : (
            <FileListC />
          )}
          <BulkActionBar />
        </div>
        {viewMode === 'list' && <DetailPane />}
      </div>
      {viewMode === 'calendar' && selectedFile && selectedPaths.size <= 1 && (
        <DetailModal file={selectedFile} />
      )}
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
