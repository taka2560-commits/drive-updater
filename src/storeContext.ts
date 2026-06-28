import { createContext, useContext } from 'react';
import type {
  DateRange,
  FileEntry,
  FileTypeFilter,
  FolderDef,
  FolderKey,
  PeriodFilter,
  Screen,
  SettingsTab,
  SizeFilter,
  SortDir,
  SortKey,
  ViewMode,
} from './types';
import type { ThemeName } from './theme/tokens';

export interface Store {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;

  screen: Screen;
  setScreen: (s: Screen) => void;
  settingsTab: SettingsTab;
  setSettingsTab: (t: SettingsTab) => void;

  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;

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
  folderFiles: FileEntry[];
  filteredFiles: FileEntry[];

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: FileTypeFilter;
  setTypeFilter: (f: FileTypeFilter) => void;

  // Scan options
  recursive: boolean;
  setRecursive: (v: boolean) => void;

  // Period filter (sidebar: how far back to show files)
  periodFilter: PeriodFilter;
  setPeriodFilter: (p: PeriodFilter) => void;

  // Date filter (heatmap cell / activity bar click). null = no date filter.
  filterByDate: string | null;
  setFilterByDate: (d: string | null) => void;

  // Quick filters
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

  // Multi-selection
  selectedPaths: Set<string>;
  selectOne: (path: string | null) => void;
  toggleInSelection: (path: string) => void;
  selectRange: (path: string, ordered: string[]) => void;
  clearSelection: () => void;

  starred: Set<string>;
  isStarred: (path: string) => boolean;
  toggleStar: (path: string) => void;
  starMany: (paths: string[], on: boolean) => void;

  // Delete (trash)
  pendingDelete: string[] | null;
  requestDelete: (paths: string[]) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
  renameFile: (path: string, newName: string) => void;
  editingPath: string | null;
  setEditingPath: (p: string | null) => void;

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
