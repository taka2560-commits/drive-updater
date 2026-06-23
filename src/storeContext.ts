import { createContext, useContext } from 'react';
import type {
  FileEntry,
  FileTypeFilter,
  FolderDef,
  FolderKey,
  Screen,
  SettingsTab,
  SortDir,
  SortKey,
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
