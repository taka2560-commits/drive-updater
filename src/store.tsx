import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { applyTheme, loadSavedTheme, type ThemeName } from './theme/tokens';
import { matchesType } from './lib/fileType';
import { toDateKey } from './lib/format';
import { dateRangeStart } from './lib/grouping';
import {
  buildSampleFiles,
  DEFAULT_STARRED,
  EXCLUDE_KEYWORDS,
  FOLDERS as SAMPLE_FOLDERS,
} from './data/sampleData';
import { StoreContext, type Store } from './storeContext';

// window.localUpdater type
interface LocalUpdaterAPI {
  openPath: (p: string) => Promise<void>;
  showInFolder: (p: string) => Promise<void>;
  getDefaultPaths: () => Promise<{ desktop: string; documents: string; downloads: string }>;
  selectFolder: () => Promise<{ name: string; path: string } | null>;
  scanFolders: (
    folders: { key: string; path: string }[],
    recursive: boolean,
    excludeKeywords: string[],
  ) => Promise<FileEntry[]>;
  readImage: (path: string) => Promise<string | null>;
  startWatch: (paths: string[], recursive: boolean) => void;
  onFilesChanged: (cb: () => void) => () => void;
}

function getAPI(): LocalUpdaterAPI | null {
  return (window as unknown as { localUpdater?: LocalUpdaterAPI }).localUpdater ?? null;
}

// localStorage helpers
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const K = {
  starred: 'localUpdater.starred',
  exclude: 'localUpdater.excludeKeywords',
  sortKey: 'localUpdater.sortKey',
  sortDir: 'localUpdater.sortDir',
  customFolders: 'localUpdater.customFolders',
  recursive: 'localUpdater.recursive',
  viewMode: 'localUpdater.viewMode',
  layout: 'localUpdater.layout',
} as const;

/** Merge two file lists, de-duplicating by path (later wins). */
function mergeByPath(base: FileEntry[], extra: FileEntry[]): FileEntry[] {
  const map = new Map<string, FileEntry>();
  for (const f of base) map.set(f.path, f);
  for (const f of extra) map.set(f.path, f);
  return [...map.values()];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(loadSavedTheme);
  const [screen, setScreen] = useState<Screen>('main');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('appearance');
  const [layout, setLayoutState] = useState<Layout>(() => loadJSON<Layout>(K.layout, 'A'));
  const [activeFolder, setActiveFolderState] = useState<FolderKey>('desktop');

  const [folders, setFolders] = useState<FolderDef[]>(() => [
    ...SAMPLE_FOLDERS,
    ...loadJSON<FolderDef[]>(K.customFolders, []).filter(
      (cf) => !SAMPLE_FOLDERS.find((f) => f.key === cf.key),
    ),
  ]);

  // Sub-folder navigation (null = root of active folder)
  const [browsePath, setBrowsePath] = useState<string | null>(null);

  const [allFiles, setAllFiles] = useState<FileEntry[]>(() => buildSampleFiles());
  const [isScanning, setIsScanning] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');
  const [filterByDate, setFilterByDate] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [recursive, setRecursiveState] = useState<boolean>(() =>
    loadJSON<boolean>(K.recursive, false),
  );
  const [viewMode, setViewModeState] = useState<ViewMode>(() =>
    loadJSON<ViewMode>(K.viewMode, 'list'),
  );

  const [sortKey, setSortKey] = useState<SortKey>(() =>
    loadJSON<SortKey>(K.sortKey, 'modified'),
  );
  const [sortDir, setSortDir] = useState<SortDir>(() =>
    loadJSON<SortDir>(K.sortDir, 'desc'),
  );

  const [selectedPath, setSelected] = useState<string | null>(null);

  const [starred, setStarred] = useState<Set<string>>(
    () => new Set(loadJSON<string[]>(K.starred, DEFAULT_STARRED)),
  );
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>(() =>
    loadJSON<string[]>(K.exclude, EXCLUDE_KEYWORDS),
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (t: ThemeName) => setThemeState(t);

  const setLayout = (l: Layout) => {
    setLayoutState(l);
    saveJSON(K.layout, l);
  };

  // Refs to keep latest values in scan/watch closures (synced in effects).
  const excludeRef = useRef(excludeKeywords);
  const foldersRef = useRef(folders);
  const recursiveRef = useRef(recursive);
  const activeFolderRef = useRef(activeFolder);
  // Folders the user has drilled into — re-scanned on every rescan so the
  // hierarchy stays populated (and watch refreshes keep them current).
  const expandedRef = useRef<Set<string>>(new Set());
  useEffect(() => { excludeRef.current = excludeKeywords; }, [excludeKeywords]);
  useEffect(() => { foldersRef.current = folders; }, [folders]);
  useEffect(() => { recursiveRef.current = recursive; }, [recursive]);
  useEffect(() => { activeFolderRef.current = activeFolder; }, [activeFolder]);

  // Unified scan: roots (+ expanded sub-folders), then merge.
  const doScan = useCallback(() => {
    const api = getAPI();
    if (!api) {
      setIsScanning(true);
      window.setTimeout(() => {
        setAllFiles(buildSampleFiles());
        setIsScanning(false);
      }, 400);
      return;
    }
    setIsScanning(true);
    const rec = recursiveRef.current;
    const exclude = excludeRef.current;
    const rootList = foldersRef.current.map((f) => ({ key: f.key, path: f.path }));

    api
      .scanFolders(rootList, rec, exclude)
      .then(async (rootFiles) => {
        let result = rootFiles;
        // Lazily-loaded sub-folders (only needed in non-recursive mode).
        if (!rec && expandedRef.current.size > 0) {
          const subList = [...expandedRef.current].map((p) => ({
            key: foldersRef.current.find((f) => p.startsWith(f.path))?.key ?? 'desktop',
            path: p,
          }));
          const subFiles = await api.scanFolders(subList, false, exclude);
          result = mergeByPath(rootFiles, subFiles);
        }
        setAllFiles(result);
        setIsScanning(false);
      })
      .catch(() => {
        setAllFiles(buildSampleFiles());
        setIsScanning(false);
      });
  }, []);

  const rescan = useCallback(() => doScan(), [doScan]);

  const setActiveFolder = (k: FolderKey) => {
    setActiveFolderState(k);
    setBrowsePath(null);
    setSelected(null);
    setSearchQuery('');
    setTypeFilter('all');
    setFilterByDate(null);
    setDateRange('all');
    setSizeFilter('all');
  };

  // Drill into a sub-folder: remember it, lazy-scan its contents, then show it.
  const browseInto = useCallback(
    (path: string) => {
      setBrowsePath(path);
      setSelected(null);
      setSearchQuery('');
      setTypeFilter('all');
      setFilterByDate(null);
      setDateRange('all');
      setSizeFilter('all');
      const api = getAPI();
      if (api && !recursiveRef.current) {
        expandedRef.current.add(path);
        const key = foldersRef.current.find((f) => path.startsWith(f.path))?.key ?? 'desktop';
        setIsScanning(true);
        api
          .scanFolders([{ key, path }], false, excludeRef.current)
          .then((sub) => {
            setAllFiles((prev) => mergeByPath(prev, sub));
            setIsScanning(false);
          })
          .catch(() => setIsScanning(false));
      }
    },
    [],
  );

  const browseUp = useCallback(() => {
    setBrowsePath((prev) => {
      if (!prev) return null;
      const root = foldersRef.current.find((f) => f.key === activeFolderRef.current)?.path ?? '';
      const sep = prev.includes('\\') ? '\\' : '/';
      const parent = prev.slice(0, prev.lastIndexOf(sep));
      // If parent is the root folder (or above), go to root (null = top of active folder).
      return parent && parent !== root ? parent : null;
    });
    setSelected(null);
  }, []);

  const setRecursive = (v: boolean) => {
    setRecursiveState(v);
    recursiveRef.current = v;
    saveJSON(K.recursive, v);
    doScan();
  };

  const setViewMode = (v: ViewMode) => {
    setViewModeState(v);
    saveJSON(K.viewMode, v);
  };

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) {
      const dir = sortDir === 'asc' ? 'desc' : 'asc';
      setSortDir(dir);
      saveJSON(K.sortDir, dir);
    } else {
      setSortKey(k);
      setSortDir('desc');
      saveJSON(K.sortKey, k);
      saveJSON(K.sortDir, 'desc');
    }
  };

  const isStarred = (path: string) => starred.has(path);
  const toggleStar = (path: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      saveJSON(K.starred, [...next]);
      return next;
    });
  };

  const addExclude = (kw: string) => {
    const v = kw.trim();
    if (!v) return;
    setExcludeKeywords((prev) => {
      if (prev.includes(v)) return prev;
      const next = [...prev, v];
      saveJSON(K.exclude, next);
      return next;
    });
  };
  const removeExclude = (kw: string) => {
    setExcludeKeywords((prev) => {
      const next = prev.filter((x) => x !== kw);
      saveJSON(K.exclude, next);
      return next;
    });
  };

  const addCustomFolder = useCallback((name: string, path: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const key: FolderKey = `custom:${slug || 'folder'}`;
    const newFolder: FolderDef = { key, label: name, path, icon: 'folder', isStandard: false };
    setFolders((prev) => {
      if (prev.find((f) => f.path === path)) return prev;
      const next = [...prev, newFolder];
      saveJSON(K.customFolders, next.filter((f) => !f.isStandard));
      return next;
    });
  }, []);

  const removeCustomFolder = useCallback((key: FolderKey) => {
    setFolders((prev) => {
      const next = prev.filter((f) => f.key !== key);
      saveJSON(K.customFolders, next.filter((f) => !f.isStandard));
      return next;
    });
  }, []);

  // On mount: fetch real OS paths, do initial scan, start watching.
  useEffect(() => {
    const api = getAPI();
    if (!api) return;

    api.getDefaultPaths().then(({ desktop, documents, downloads }) => {
      const updated = [
        { key: 'desktop' as FolderKey, path: desktop },
        { key: 'documents' as FolderKey, path: documents },
        { key: 'downloads' as FolderKey, path: downloads },
      ];
      setFolders((prev) =>
        prev.map((f) => {
          const u = updated.find((x) => x.key === f.key);
          return u ? { ...f, path: u.path } : f;
        }),
      );
      foldersRef.current = foldersRef.current.map((f) => {
        const u = updated.find((x) => x.key === f.key);
        return u ? { ...f, path: u.path } : f;
      });

      doScan();

      // Watch all root folders for changes → debounced rescan (handled in main).
      const watchPaths = foldersRef.current.map((f) => f.path);
      api.startWatch(watchPaths, recursiveRef.current);
    });

    const unsub = api.onFilesChanged(doScan);
    return unsub;
  }, [doScan]);

  // Re-arm the watcher when the folder set changes.
  useEffect(() => {
    const api = getAPI();
    if (!api) return;
    api.startWatch(folders.map((f) => f.path), recursive);
  }, [folders, recursive]);

  // Derived: entries at current browsePath or active folder root.
  const folderFiles = useMemo(() => {
    const kw = excludeKeywords;
    const notExcluded = (f: FileEntry) =>
      !kw.some((k) => f.path.toLowerCase().includes(k.toLowerCase()));

    if (browsePath) {
      const sep = browsePath.includes('\\') ? '\\' : '/';
      const prefix = browsePath + sep;
      return allFiles.filter((f) => {
        if (!f.path.startsWith(prefix)) return false;
        if (!notExcluded(f)) return false;
        if (recursive) return !f.isDir; // flatten: files only
        const relative = f.path.slice(prefix.length);
        return !relative.includes('\\') && !relative.includes('/'); // direct children
      });
    }

    // Root of the active folder.
    if (recursive) {
      return allFiles.filter((f) => f.folder === activeFolder && !f.isDir && notExcluded(f));
    }
    return allFiles.filter((f) => {
      if (f.folder !== activeFolder || !notExcluded(f)) return false;
      // In non-recursive scans every entry is already a direct child, but guard
      // against recursive leftovers in allFiles after toggling the option.
      const root = folders.find((fd) => fd.key === activeFolder)?.path;
      if (!root) return true;
      const sep = root.includes('\\') ? '\\' : '/';
      const relative = f.path.startsWith(root + sep) ? f.path.slice(root.length + sep.length) : f.name;
      return !relative.includes('\\') && !relative.includes('/');
    });
  }, [allFiles, activeFolder, browsePath, excludeKeywords, recursive, folders]);

  const searchMatched = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q ? folderFiles.filter((f) => f.name.toLowerCase().includes(q)) : folderFiles;
  }, [folderFiles, searchQuery]);

  const countByType = useMemo(() => {
    const counts = {
      all: searchMatched.filter((f) => !f.isDir).length,
      docs: 0,
      sheets: 0,
      pdf: 0,
      image: 0,
      slides: 0,
      cad: 0,
      other: 0,
    } as Record<FileTypeFilter, number>;
    for (const f of searchMatched) {
      if (f.isDir) continue;
      (['docs', 'sheets', 'pdf', 'image', 'slides', 'cad', 'other'] as const).forEach((t) => {
        if (matchesType(f.ext, t)) counts[t]++;
      });
    }
    return counts;
  }, [searchMatched]);

  const filteredFiles = useMemo(() => {
    const rangeStart = dateRangeStart(dateRange);
    const sizeMin =
      sizeFilter === 'gt1mb' ? 1_048_576
        : sizeFilter === 'gt10mb' ? 10_485_760
          : sizeFilter === 'gt100mb' ? 104_857_600
            : 0;
    const out = searchMatched.filter((f) => {
      if (!(f.isDir || matchesType(f.ext, typeFilter))) return false;
      if (filterByDate && toDateKey(f.modifiedAt) !== filterByDate) return false;
      // Quick filters apply to files only; folders always pass through.
      if (!f.isDir) {
        if (rangeStart && f.modifiedAt < rangeStart) return false;
        if (sizeMin && f.sizeBytes < sizeMin) return false;
      }
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    out.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1; // dirs first
      const cmp =
        sortKey === 'name'
          ? a.name.localeCompare(b.name, 'ja')
          : sortKey === 'size'
            ? a.sizeBytes - b.sizeBytes
            : a.modifiedAt - b.modifiedAt;
      return cmp * dir;
    });
    return out;
  }, [searchMatched, typeFilter, sortKey, sortDir, filterByDate, dateRange, sizeFilter]);

  const selectedFile = useMemo(
    () => allFiles.find((f) => f.path === selectedPath) ?? null,
    [allFiles, selectedPath],
  );

  const value: Store = {
    theme,
    setTheme,
    screen,
    setScreen,
    settingsTab,
    setSettingsTab,
    layout,
    setLayout,
    folders,
    addCustomFolder,
    removeCustomFolder,
    activeFolder,
    setActiveFolder,
    browsePath,
    browseInto,
    browseUp,
    allFiles,
    folderFiles,
    filteredFiles,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    recursive,
    setRecursive,
    viewMode,
    setViewMode,
    filterByDate,
    setFilterByDate,
    dateRange,
    setDateRange,
    sizeFilter,
    setSizeFilter,
    sortKey,
    sortDir,
    toggleSort,
    selectedPath,
    setSelected,
    selectedFile,
    starred,
    isStarred,
    toggleStar,
    excludeKeywords,
    addExclude,
    removeExclude,
    isScanning,
    rescan,
    countByType,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
