import { type RefObject } from 'react';
import { LayoutList } from 'lucide-react';
import { Window } from '../components/Window';
import { TopNav } from '../components/TopNav';
import { FilterBar } from '../components/FilterBar';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { FileGroupList } from '../components/FileGroupList';
import { StatusBar } from '../components/StatusBar';
import { EmptyState } from '../components/EmptyState';
import { useStore } from '../storeContext';

/** B layout: top tabs + time-grouped accordion cards (no sidebar / detail pane). */
export function MainScreenB({ searchRef }: { searchRef: RefObject<HTMLInputElement | null> }) {
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
          <LayoutList size={11} />
          LocalUpdater — {folder?.label}
        </>
      }
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopNav />
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
          <FileGroupList />
        )}
        <StatusBar />
      </div>
    </Window>
  );
}
