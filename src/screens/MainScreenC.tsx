import { type RefObject } from 'react';
import { CalendarRange } from 'lucide-react';
import { Window } from '../components/Window';
import { Sidebar } from '../components/Sidebar';
import { FilterBar } from '../components/FilterBar';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { HeatmapSection } from '../components/HeatmapSection';
import { FilterContextBar } from '../components/FilterContextBar';
import { FileListC } from '../components/FileListC';
import { DetailModal } from '../components/DetailModal';
import { StatusBar } from '../components/StatusBar';
import { EmptyState } from '../components/EmptyState';
import { useStore } from '../storeContext';

/** C layout: sidebar + heatmap calendar + card list + modal detail. */
export function MainScreenC({ searchRef }: { searchRef: RefObject<HTMLInputElement | null> }) {
  const {
    activeFolder,
    folders,
    folderFiles,
    filteredFiles,
    searchQuery,
    setSearchQuery,
    setTypeFilter,
    filterByDate,
    setFilterByDate,
    rescan,
    selectedFile,
  } = useStore();

  const folder = folders.find((f) => f.key === activeFolder);
  const isEmpty = filteredFiles.length === 0;
  // 日付絞り込みで0件のときは専用メッセージ
  const emptyVariant = filterByDate ? 'search' : folderFiles.length === 0 ? 'folder' : 'search';

  return (
    <Window
      title={
        <>
          <CalendarRange size={11} />
          LocalUpdater — {folder?.label}
        </>
      }
    >
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <FilterBar files={folderFiles} searchRef={searchRef} />
        <BreadcrumbBar />
        <HeatmapSection />
        <FilterContextBar />
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
        ) : (
          <FileListC />
        )}
        <StatusBar />
      </div>

      {selectedFile && <DetailModal file={selectedFile} />}
    </Window>
  );
}
