import { type RefObject } from 'react';
import { FolderOpen } from 'lucide-react';
import { Window } from '../components/Window';
import { Sidebar } from '../components/Sidebar';
import { FilterBar } from '../components/FilterBar';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { FileTable } from '../components/FileTable';
import { DetailPane } from '../components/DetailPane';
import { StatusBar } from '../components/StatusBar';
import { EmptyState } from '../components/EmptyState';
import { useStore } from '../storeContext';

export function MainScreen({ searchRef }: { searchRef: RefObject<HTMLInputElement | null> }) {
  const {
    activeFolder,
    folders,
    folderFiles,
    filteredFiles,
    searchQuery,
    setSearchQuery,
    setTypeFilter,
    rescan,
  } = useStore();

  const folder = folders.find((f) => f.key === activeFolder);
  const isEmpty = filteredFiles.length === 0;
  const emptyVariant = folderFiles.length === 0 ? 'folder' : 'search';

  return (
    <Window
      title={
        <>
          <FolderOpen size={11} />
          LocalUpdater — {folder?.label}
        </>
      }
    >
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <FilterBar files={folderFiles} searchRef={searchRef} />
        <BreadcrumbBar />
        {isEmpty ? (
          <EmptyState
            variant={emptyVariant}
            query={searchQuery}
            onPrimary={emptyVariant === 'folder' ? rescan : () => setSearchQuery('')}
            onSecondary={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
          />
        ) : (
          <FileTable />
        )}
        <StatusBar />
      </div>

      <DetailPane />
    </Window>
  );
}
