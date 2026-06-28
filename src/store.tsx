import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { applyTheme, loadSavedTheme, type ThemeName } from './theme/tokens';
import { matchesType } from './lib/fileType';
import { toDateKey } from './lib/format';
import { dateRangeStart, periodFilterStart } from './lib/grouping';
import {
  buildSampleFiles,
  DEFAULT_STARRED,
  EXCLUDE_KEYWORDS,
  FOLDERS as SAMPLE_FOLDERS,
} from './data/sampleData';
import { StoreContext, type Store } from './storeContext';

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
  readText: (path: string) => Promise<string | null>;
  trashItem: (path: string) => Promise<boolean>;
  renameItem: (oldPath: string, newName: string) => Promise<string | null>;
  startWatch: (paths: string[], recursive: boolean) => void;
  onFilesChanged: (cb: () => void) => () => void;
}

function getAPI(): LocalUpdaterAPI | null {
  return (window as unknown as { localUpdater?: LocalUpdaterAPI }).localUpdater ?? null;
}

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
  periodFilter: 'localUpdater.periodFilter',
} as const;

function migrateViewMode(): ViewMode {
  // Migrate from old layout A/B/C → new viewMode list/timeline/calendar
  const oldLayout = loadJSON<string>('localUpdater.layout', '');
  if (oldLayout === 'B') return 'timeline';
  if (oldLayout === 'C') return 'calendar';
  if (oldLayout === 'A') return 'list';
  // Check for new key
  const saved = loadJSON<string>(K.viewMode, '');
  if (saved === 'timeline' || saved === 'calendar') return saved;
  return 'list';
}

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
  const [viewMode, setViewModeState] = useState<ViewMode>(migrateViewMode);
  const [activeFolder, setActiveFolderState] = useState<FolderKey>('desktop');

  const [folders, setFolders] = useState<FolderDef[]>(() => [
    ...SAMPLE_FOLDERS,
    ...loadJSON<FolderDef[]>(K.customFolders, []).filter(
      (cf) => !SAMPLE_FOLDERS.find((f) => f.key === cf.key),
    ),
  ]);

  const [browsePath, setBrowsePath] = useState<string | null>(null);

  const [allFiles, setAllFiles] = useState<FileEntry[]>(() => buildSampleFiles());
  const [isScanning, setIsScanning] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');
  const [filterByDate, setFilterByDate] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [periodFilter, setPeriodFilterState] = useState<PeriodFilter>(() =>
    loadJSON<PeriodFilter>(K.periodFilter, '14d'),
  );
  const [recursive, setRecursiveState] = useState<boolean>(() =>
    loadJSON<boolean>(K.recursive, false),
  );

  const [sortKey, setSortKey] = useState<SortKey>(() =>
    loadJSON<SortKey>(K.sortKey, 'modified'),
  );
  const [sortDir, setSortDir] = useState<SortDir>(() =>
    loadJSON<SortDir>(K.sortDir, 'desc'),
  );

  const [selectedPath, setSelected] = useState<string | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const selectionAnchorRef = useRef<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);

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

  const setViewMode = (v: ViewMode) => {
    setViewModeState(v);
    saveJSON(K.viewMode, v);
  };

  const setPeriodFilter = (p: PeriodFilter) => {
    setPeriodFilterState(p);
    saveJSON(K.periodFilter, p);
  };

  const excludeRef = useRef(excludeKeywords);
  const foldersRef = useRef(folders);
  const recursiveRef = useRef(recursive);
  const activeFolderRef = useRef(activeFolder);
  const expandedRef = useRef<Set<string>>(new Set());
  useEffect(() => { excludeRef.current = excludeKeywords; }, [excludeKeywords]);
  useEffect(() => { foldersRef.current = folders; }, [folders]);
  useEffect(() => { recursiveRef.current = recursive; }, [recursive]);
  useEffect(() => { activeFolderRef.current = activeFolder; }, [activeFolder]);

  const folderKeyForPath = (p: string): FolderKey => {
    const sep = p.includes('\\') ? '\\' : '/';
    const match = foldersRef.current
      .filter((f) => p === f.path || p.startsWith(f.path + sep))
      .sort((a, b) => b.path.length - a.path.length)[0];
    return match?.key ?? activeFolderRef.current;
  };

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
        if (!rec && expandedRef.current.size > 0) {
          const subList = [...expandedRef.current].map((p) => ({
            key: folderKeyForPath(p),
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
        const key = folderKeyForPath(path);
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
  const starMany = useCallback((paths: string[], on: boolean) => {
    setStarred((prev) => {
      const next = new Set(prev);
      for (const p of paths) {
        if (on) next.add(p);
        else next.delete(p);
      }
      saveJSON(K.starred, [...next]);
      return next;
    });
  }, []);
  const toggleStar = (path: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      saveJSON(K.starred, [...next]);
      return next;
    });
  };

  const selectOne = useCallback((path: string | null) => {
    setSelected(path);
    setSelectedPaths(path ? new Set([path]) : new Set());
    selectionAnchorRef.current = path;
  }, []);

  const toggleInSelection = useCallback((path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
    setSelected(path);
    selectionAnchorRef.current = path;
  }, []);

  const selectRange = useCallback((path: string, ordered: string[]) => {
    const anchor = selectionAnchorRef.current ?? path;
    const a = ordered.indexOf(anchor);
    const b = ordered.indexOf(path);
    if (a === -1 || b === -1) {
      setSelectedPaths(new Set([path]));
      setSelected(path);
      return;
    }
    const [lo, hi] = a <= b ? [a, b] : [b, a];
    setSelectedPaths(new Set(ordered.slice(lo, hi + 1)));
    setSelected(path);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPaths(new Set());
    setSelected(null);
    selectionAnchorRef.current = null;
  }, []);

  const requestDelete = useCallback((paths: string[]) => {
    if (paths.length > 0) setPendingDelete(paths);
  }, []);
  const cancelDelete = useCallback(() => setPendingDelete(null), []);

  const confirmDelete = useCallback(async () => {
    const paths = pendingDelete;
    setPendingDelete(null);
    if (!paths || paths.length === 0) return;
    const api = getAPI();
    let removed = paths;
    if (api?.trashItem) {
      const results = await Promise.all(
        paths.map((p) => api.trashItem(p).then((ok) => (ok ? p : null))),
      );
      removed = results.filter((p): p is string => p !== null);
    }
    if (removed.length === 0) return;
    const removedSet = new Set(removed);
    setAllFiles((prev) => prev.filter((f) => !removedSet.has(f.path)));
    setStarred((prev) => {
      if (![...removedSet].some((p) => prev.has(p))) return prev;
      const next = new Set(prev);
      removedSet.forEach((p) => next.delete(p));
      saveJSON(K.starred, [...next]);
      return next;
    });
    setSelected((cur) => (cur && removedSet.has(cur) ? null : cur));
    setSelectedPaths((prev) => {
      if (![...removedSet].some((p) => prev.has(p))) return prev;
      const next = new Set(prev);
      removedSet.forEach((p) => next.delete(p));
      return next;
    });
  }, [pendingDelete]);

  const renameFile = useCallback(async (path: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === path.split(/[\\/]/).pop()) return;
    const api = getAPI();
    const sep = path.includes('\\') ? '\\' : '/';
    const nextPath = api
      ? await api.renameItem(path, trimmed)
      : path.slice(0, path.lastIndexOf(sep) + 1) + trimmed;
    if (!nextPath) return;
    const ext = trimmed.includes('.') ? trimmed.slice(trimmed.lastIndexOf('.') + 1).toLowerCase() : '';
    setAllFiles((prev) =>
      prev.map((f) =>
        f.path === path ? { ...f, path: nextPath, name: trimmed, ext: f.isDir ? '' : ext } : f,
      ),
    );
    setSelected((cur) => (cur === path ? nextPath : cur));
  }, []);

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

      const watchPaths = foldersRef.current.map((f) => f.path);
      api.startWatch(watchPaths, recursiveRef.current);
    });

    const unsub = api.onFilesChanged(doScan);
    return unsub;
  }, [doScan]);

  useEffect(() => {
    const api = getAPI();
    if (!api) return;
    api.startWatch(folders.map((f) => f.path), recursive);
  }, [folders, recursive]);

  const folderFiles = useMemo(() => {
    const kwSet = new Set(excludeKeywords.map((k) => k.toLowerCase()));
    const notExcluded = (f: FileEntry) =>
      !f.path
        .toLowerCase()
        .split(/[\\/]/)
        .some((seg) => kwSet.has(seg));

    if (browsePath) {
      const sep = browsePath.includes('\\') ? '\\' : '/';
      const prefix = browsePath + sep;
      return allFiles.filter((f) => {
        if (!f.path.startsWith(prefix)) return false;
        if (!notExcluded(f)) return false;
        if (recursive) return !f.isDir;
        const relative = f.path.slice(prefix.length);
        return !relative.includes('\\') && !relative.includes('/');
      });
    }

    if (recursive) {
      return allFiles.filter((f) => f.folder === activeFolder && !f.isDir && notExcluded(f));
    }
    return allFiles.filter((f) => {
      if (f.folder !== activeFolder || !notExcluded(f)) return false;
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
    const periodStart = periodFilterStart(periodFilter);
    const sizeMin =
      sizeFilter === 'gt1mb' ? 1_048_576
        : sizeFilter === 'gt10mb' ? 10_485_760
          : sizeFilter === 'gt100mb' ? 104_857_600
            : 0;
    const out = searchMatched.filter((f) => {
      if (!(f.isDir || matchesType(f.ext, typeFilter))) return false;
      if (filterByDate && toDateKey(f.modifiedAt) !== filterByDate) return false;
      if (!f.isDir) {
        if (f.modifiedAt < periodStart) return false;
        if (rangeStart && f.modifiedAt < rangeStart) return false;
        if (sizeMin && f.sizeBytes < sizeMin) return false;
      }
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    out.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      const cmp =
        sortKey === 'name'
          ? a.name.localeCompare(b.name, 'ja')
          : sortKey === 'size'
            ? a.sizeBytes - b.sizeBytes
            : a.modifiedAt - b.modifiedAt;
      return cmp * dir;
    });
    return out;
  }, [searchMatched, typeFilter, sortKey, sortDir, filterByDate, dateRange, sizeFilter, periodFilter]);

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
    viewMode,
    setViewMode,
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
    periodFilter,
    setPeriodFilter,
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
    selectedPaths,
    selectOne,
    toggleInSelection,
    selectRange,
    clearSelection,
    starred,
    isStarred,
    toggleStar,
    starMany,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
    renameFile,
    editingPath,
    setEditingPath,
    excludeKeywords,
    addExclude,
    removeExclude,
    isScanning,
    rescan,
    countByType,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
