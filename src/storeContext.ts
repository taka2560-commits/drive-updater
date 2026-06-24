import { createContext, useContext } from 'react';
import type {
  DateRange,
  FileEntry,
  FileTypeFilter,
  FolderDef,
  FolderKey,
  Layout,
  Screen,
  SettingsTab,
  SizeFilter,
  SortDir,
  SortKey,
  ViewMode,
} from './types';
import type { ThemeName } from './theme/tokens';

// Shape of the global app store (provided by StoreProvider in store.tsx).
export interface Store {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;

  screen: Screen;
  setScreen: (s: Screen) => void;
  settingsTab: SettingsTab;
  setSettingsTab: (t: SettingsTab) => void;

  // Layout switch (A: classic / B: timeline / C: calendar)
  layout: Layout;
  setLayout: (l: Layout) => void;

  // Folder list (dynamic — real paths in Electron, sample paths in browser)
  folders: FolderDef[];
  addCustomFolder: (name: string, path: string) => void;
  removeCustomFolder: (key: FolderKey) => void;

  activeFolder: FolderKey;
  setActiveFolder: (k: FolderKey) => void;

  // Sub-folder navigation within active folder (null = root)
  browsePath: string | null;
  browseInto: (path: string) => void;
  browseUp: () => void;

  allFiles: FileEntry[];
  folderFiles: FileEntry[]; // entries at current browsePath (post exclude)
  filteredFiles: FileEntry[]; // folderFiles ∩ search ∩ typeFilter, sorted

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: FileTypeFilter;
  setTypeFilter: (f: FileTypeFilter) => void;

  // Scan options
  recursive: boolean;
  setRecursive: (v: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;

  // Date filter (heatmap cell / activity bar click). null = no date filter.
  filterByDate: string | null;
  setFilterByDate: (d: string | null) => void;

  // Quick filters (FilterBar chips)
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
  sizeFilter: SizeFilter;
  setSizeFilter: (s: SizeFilter) => void;

  sortKey: SortKey;
  sortDir: SortDir;
  toggleSort: (k: SortKey) => void;

  selectedPath: string | null;
  setSelected: (p: string | null) => void;
  selectedFile: FileEntry | null;

  starred: Set<string>;
  isStarred: (path: string) => boolean;
  toggleStar: (path: string) => void;

  excludeKeywords: string[];
  addExclude: (kw: string) => void;
  removeExclude: (kw: string) => void;

  isScanning: boolean;
  rescan: () => void;

  countByType: Record<FileTypeFilter, number>;
}

export const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
