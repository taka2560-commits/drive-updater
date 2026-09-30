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
import { dateRangeStart, groupByTime, periodFilterStart } from './lib/grouping';
import { validateFileName } from './lib/fileName';
import { baseName, dirName, isDirectChild, relativeTo, sepOf, trimTrailingSep } from './lib/paths';
import {
  buildSampleFiles,
  DEFAULT_STARRED,
  EXCLUDE_KEYWORDS,
  FOLDERS as SAMPLE_FOLDERS,
} from './data/sampleData';
import { StoreContext, type Store } from './storeContext';

function getAPI(): LocalUpdaterAPI | null {
  return window.localUpdater ?? null;
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
  // A value saved by the current version always wins.
  const saved = loadJSON<string>(K.viewMode, '');
  if (saved === 'list' || saved === 'timeline' || saved === 'calendar') return saved;
  // Otherwise fall back to the pre-2.0 layout setting (A/B/C).
  const oldLayout = loadJSON<string>('localUpdater.layout', '');
  if (oldLayout === 'B') return 'timeline';
  if (oldLayout === 'C') return 'calendar';
  return 'list';
}

/** Folders added by v1.x lived under `customDirs`; carry them over once. */
function loadCustomFolders(): FolderDef[] {
  const current = loadJSON<FolderDef[]>(K.customFolders, []);
  const legacy = loadJSON<{ name: string; path: string }[]>('customDirs', []);
  if (legacy.length === 0) return current;
  const merged = [...current];
  for (const d of legacy) {
    if (!d?.path || merged.some((f) => f.path === d.path)) continue;
    merged.push({
      key: uniqueFolderKey(d.name, d.path, merged),
      label: d.name || baseName(d.path),
      path: d.path,
      icon: 'folder',
      isStandard: false,
    });
  }
  saveJSON(K.customFolders, merged);
  try {
    localStorage.removeItem('customDirs');
  } catch {
    /* ignore */
  }
  return merged;
}

function shortHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** `custom:<slug>`; falls back to a path hash for non-ASCII names or collisions. */
function uniqueFolderKey(name: string, path: string, existing: FolderDef[]): FolderKey {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  let key: FolderKey = `custom:${slug || shortHash(path)}`;
  if (existing.some((f) => f.key === key)) key = `custom:${slug ? slug + '-' : ''}${shortHash(path)}`;
  return key;
}

function mergeByPath(base: FileEntry[], extra: FileEntry[]): FileEntry[] {
  const map = new Map<string, FileEntry>();
  for (const f of base) map.set(f.path, f);
  for (const f of extra) map.set(f.path, f);
  return [...map.values()];
}

/** Predicate: true when any path segment below the folder root is an excluded name. */
function makeExcludeTest(folders: FolderDef[], keywords: string[]) {
  const kwSet = new Set(keywords.map((k) => k.toLowerCase()));
  const roots = new Map(folders.map((f) => [f.key, f.path]));
  return (f: FileEntry): boolean => {
    const root = roots.get(f.folder);
    // Only look below the watched folder, so a keyword such as "desktop" can't
    // hide everything just because the root itself lives in ...\Desktop.
    const rel = (root && relativeTo(root, f.path)) ?? f.path;
    return rel
      .toLowerCase()
      .split(/[\\/]/)
      .some((seg) => kwSet.has(seg));
  };
}

const IS_MAC = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(loadSavedTheme);
  const [screen, setScreen] = useState<Screen>('main');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('appearance');
  const [viewMode, setViewModeState] = useState<ViewMode>(migrateViewMode);
  const [activeFolder, setActiveFolderState] = useState<FolderKey>('desktop');

  const [folders, setFolders] = useState<FolderDef[]>(() => [
    ...SAMPLE_FOLDERS,
    ...loadCustomFolders().filter((cf) => !SAMPLE_FOLDERS.find((f) => f.key === cf.key)),
  ]);

  const [browsePath, setBrowsePath] = useState<string | null>(null);

  // Demo data is only for the browser preview; the desktop app starts empty and scanning.
  const [allFiles, setAllFiles] = useState<FileEntry[]>(() => (getAPI() ? [] : buildSampleFiles()));
  const [isScanning, setIsScanning] = useState(() => getAPI() !== null);
  const [lastScanAt, setLastScanAt] = useState<number>(() => Date.now());

  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setNotice(msg);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 5000);
  }, []);

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

  // Selection is stored raw and exposed through `selectedPath`/`selectedPaths`
  // below, which only ever contain files that are currently visible — so a
  // filter/search/period change can never leave an invisible file selected.
  const [rawSelectedPath, setRawSelectedPath] = useState<string | null>(null);
  const [rawSelectedPaths, setRawSelectedPaths] = useState<Set<string>>(new Set());
  const selectionAnchorRef = useRef<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);

  const [starred, setStarred] = useState<Set<string>>(
    () => new Set(loadJSON<string[]>(K.starred, getAPI() ? [] : DEFAULT_STARRED)),
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
  const scanSeq = useRef(0);
  useEffect(() => { excludeRef.current = excludeKeywords; }, [excludeKeywords]);
  useEffect(() => { foldersRef.current = folders; }, [folders]);
  useEffect(() => { recursiveRef.current = recursive; }, [recursive]);
  useEffect(() => { activeFolderRef.current = activeFolder; }, [activeFolder]);

  const clearSelection = useCallback(() => {
    setRawSelectedPath(null);
    setRawSelectedPaths(new Set());
    selectionAnchorRef.current = null;
  }, []);

  const folderKeyForPath = (p: string): FolderKey => {
    const match = foldersRef.current
      .filter((f) => relativeTo(f.path, p) !== null || p === f.path)
      .sort((a, b) => b.path.length - a.path.length)[0];
    return match?.key ?? activeFolderRef.current;
  };

  const doScan = useCallback(() => {
    const api = getAPI();
    if (!api) {
      setIsScanning(true);
      window.setTimeout(() => {
        setAllFiles(buildSampleFiles());
        setLastScanAt(Date.now());
        setIsScanning(false);
      }, 400);
      return;
    }
    // Only the newest scan may publish its result (watcher bursts overlap scans).
    const seq = ++scanSeq.current;
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
        if (seq !== scanSeq.current) return;
        setAllFiles(result);
        setLastScanAt(Date.now());
        setIsScanning(false);
      })
      .catch(() => {
        if (seq !== scanSeq.current) return;
        setIsScanning(false);
        notify('スキャンに失敗しました。再スキャンしてください');
      });
  }, [notify]);

  const rescan = useCallback(() => doScan(), [doScan]);

  const setActiveFolder = (k: FolderKey) => {
    setActiveFolderState(k);
    setBrowsePath(null);
    clearSelection();
    setSearchQuery('');
    setTypeFilter('all');
    setFilterByDate(null);
    setDateRange('all');
    setSizeFilter('all');
  };

  const browseInto = useCallback(
    (path: string) => {
      setBrowsePath(path);
      clearSelection();
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
    [clearSelection],
  );

  const browseUp = useCallback(() => {
    setBrowsePath((prev) => {
      if (!prev) return null;
      const root = foldersRef.current.find((f) => f.key === activeFolderRef.current)?.path ?? '';
      const parent = dirName(prev);
      return parent && trimTrailingSep(parent) !== trimTrailingSep(root) ? parent : null;
    });
    clearSelection();
  }, [clearSelection]);

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
      // Names read naturally A→Z; dates and sizes start with the biggest/newest.
      const dir = k === 'name' ? 'asc' : 'desc';
      setSortKey(k);
      setSortDir(dir);
      saveJSON(K.sortKey, k);
      saveJSON(K.sortDir, dir);
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

  // "Show everything": also lifts the period limit, which is often the actual cause.
  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setSizeFilter('all');
    setDateRange('all');
    setFilterByDate(null);
    setPeriodFilter('all');
  };

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
    if (removed.length < paths.length) {
      notify(
        removed.length === 0
          ? 'ゴミ箱に移動できませんでした（使用中の可能性があります）'
          : `${paths.length - removed.length} 件をゴミ箱に移動できませんでした`,
      );
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
    setRawSelectedPath((cur) => (cur && removedSet.has(cur) ? null : cur));
    setRawSelectedPaths((prev) => {
      if (![...removedSet].some((p) => prev.has(p))) return prev;
      const next = new Set(prev);
      removedSet.forEach((p) => next.delete(p));
      return next;
    });
  }, [pendingDelete, notify]);

  const renameFile = useCallback(async (path: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === baseName(path)) return;
    const problem = validateFileName(trimmed);
    if (problem) {
      notify(`名前を変更できません: ${problem}`);
      return;
    }
    const api = getAPI();
    const nextPath = api
      ? await api.renameItem(path, trimmed)
      : path.slice(0, path.lastIndexOf(sepOf(path)) + 1) + trimmed;
    if (!nextPath) {
      notify('名前を変更できませんでした（同じ名前があるか、使用中の可能性があります）');
      return;
    }
    const ext = trimmed.includes('.') ? trimmed.slice(trimmed.lastIndexOf('.') + 1).toLowerCase() : '';
    // A renamed folder moves everything below it; keep stars/selection attached.
    const remap = (p: string): string => {
      if (p === path) return nextPath;
      const rel = relativeTo(path, p);
      return rel === null ? p : nextPath + sepOf(nextPath) + rel;
    };
    setAllFiles((prev) =>
      prev.map((f) =>
        f.path === path
          ? { ...f, path: nextPath, name: trimmed, ext: f.isDir ? '' : ext }
          : { ...f, path: remap(f.path) },
      ),
    );
    setStarred((prev) => {
      if (![...prev].some((p) => remap(p) !== p)) return prev;
      const next = new Set([...prev].map(remap));
      saveJSON(K.starred, [...next]);
      return next;
    });
    if (expandedRef.current.has(path)) {
      expandedRef.current.delete(path);
      expandedRef.current.add(nextPath);
    }
    setRawSelectedPath((cur) => (cur ? remap(cur) : cur));
    setRawSelectedPaths((prev) => new Set([...prev].map(remap)));
    selectionAnchorRef.current = nextPath;
  }, [notify]);

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

  const addCustomFolder = useCallback(
    (name: string, path: string) => {
      const current = foldersRef.current;
      if (current.some((f) => f.path === path)) return;
      const newFolder: FolderDef = {
        key: uniqueFolderKey(name, path, current),
        label: name || baseName(path),
        path,
        icon: 'folder',
        isStandard: false,
      };
      const next = [...current, newFolder];
      // Update the ref right away so the scan below already includes the new folder.
      foldersRef.current = next;
      setFolders(next);
      saveJSON(K.customFolders, next.filter((f) => !f.isStandard));
      doScan();
    },
    [doScan],
  );

  const removeCustomFolder = useCallback((key: FolderKey) => {
    setFolders((prev) => {
      const next = prev.filter((f) => f.key !== key);
      saveJSON(K.customFolders, next.filter((f) => !f.isStandard));
      return next;
    });
    setAllFiles((prev) => prev.filter((f) => f.folder !== key));
    setActiveFolderState((cur) => (cur === key ? 'desktop' : cur));
    setBrowsePath(null);
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
    });

    const unsub = api.onFilesChanged(doScan);
    return unsub;
  }, [doScan]);

  // Watch every root plus the sub-folder being browsed, one level deep each.
  useEffect(() => {
    const api = getAPI();
    if (!api) return;
    const paths = folders.map((f) => f.path);
    if (browsePath && !recursive) paths.push(browsePath);
    api.startWatch(paths, recursive);
  }, [folders, recursive, browsePath]);

  // Deep changes aren't watched (recursive watchers stall the app on big trees), so
  // with "include sub-folders" on, refresh when the window is used again and periodically.
  useEffect(() => {
    if (!recursive || !getAPI()) return;
    let last = Date.now();
    const refresh = () => {
      if (document.visibilityState !== 'visible' || Date.now() - last < 15_000) return;
      last = Date.now();
      doScan();
    };
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 30_000);
    return () => {
      window.removeEventListener('focus', refresh);
      window.clearInterval(timer);
    };
  }, [recursive, doScan]);

  const folderFiles = useMemo(() => {
    const isExcluded = makeExcludeTest(folders, excludeKeywords);

    if (browsePath) {
      return allFiles.filter((f) => {
        const rel = relativeTo(browsePath, f.path);
        if (rel === null || isExcluded(f)) return false;
        if (recursive) return !f.isDir;
        return !/[\\/]/.test(rel);
      });
    }

    const root = folders.find((fd) => fd.key === activeFolder)?.path;
    if (recursive) {
      return allFiles.filter((f) => f.folder === activeFolder && !f.isDir && !isExcluded(f));
    }
    return allFiles.filter((f) => {
      if (f.folder !== activeFolder || isExcluded(f)) return false;
      return !root || isDirectChild(root, f.path) || relativeTo(root, f.path) === null;
    });
  }, [allFiles, activeFolder, browsePath, excludeKeywords, recursive, folders]);

  const searchMatched = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q ? folderFiles.filter((f) => f.name.toLowerCase().includes(q)) : folderFiles;
  }, [folderFiles, searchQuery]);

  // Everything except the type chip: the chips' counts describe what each chip
  // would show *given the other active filters*.
  const baseFiltered = useMemo(() => {
    const rangeStart = dateRangeStart(dateRange);
    const periodStart = periodFilterStart(periodFilter);
    const sizeMin =
      sizeFilter === 'gt1mb' ? 1_048_576
        : sizeFilter === 'gt10mb' ? 10_485_760
          : sizeFilter === 'gt100mb' ? 104_857_600
            : 0;
    return searchMatched.filter((f) => {
      if (filterByDate && toDateKey(f.modifiedAt) !== filterByDate) return false;
      if (!f.isDir) {
        // Inside a sub-folder the user is deliberately browsing: show every period.
        if (!browsePath && f.modifiedAt < periodStart) return false;
        if (rangeStart && f.modifiedAt < rangeStart) return false;
        if (sizeMin && f.sizeBytes < sizeMin) return false;
      }
      return true;
    });
  }, [searchMatched, filterByDate, dateRange, sizeFilter, periodFilter, browsePath]);

  const countByType = useMemo(() => {
    const counts = {
      all: baseFiltered.filter((f) => !f.isDir).length,
      docs: 0,
      sheets: 0,
      pdf: 0,
      image: 0,
      slides: 0,
      cad: 0,
      other: 0,
    } as Record<FileTypeFilter, number>;
    for (const f of baseFiltered) {
      if (f.isDir) continue;
      (['docs', 'sheets', 'pdf', 'image', 'slides', 'cad', 'other'] as const).forEach((t) => {
        if (matchesType(f.ext, t)) counts[t]++;
      });
    }
    return counts;
  }, [baseFiltered]);

  // Final list in *display order* (folders, then time buckets), so keyboard
  // navigation and range selection follow exactly what is on screen.
  const filteredFiles = useMemo(() => {
    const out = baseFiltered.filter((f) => f.isDir || matchesType(f.ext, typeFilter));
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
    const dirs = out.filter((f) => f.isDir);
    const files = out.filter((f) => !f.isDir);
    const ordered = groupByTime(files, new Date(), sortKey === 'modified' && sortDir === 'asc');
    return [...dirs, ...ordered.flatMap((g) => g.files)];
  }, [baseFiltered, typeFilter, sortKey, sortDir]);

  const visiblePaths = useMemo(() => new Set(filteredFiles.map((f) => f.path)), [filteredFiles]);
  const selectedPaths = useMemo(() => {
    const s = new Set<string>();
    for (const p of rawSelectedPaths) if (visiblePaths.has(p)) s.add(p);
    return s;
  }, [rawSelectedPaths, visiblePaths]);
  const selectedPath = rawSelectedPath && visiblePaths.has(rawSelectedPath) ? rawSelectedPath : null;

  const selectOne = useCallback((path: string | null) => {
    setRawSelectedPath(path);
    setRawSelectedPaths(path ? new Set([path]) : new Set());
    selectionAnchorRef.current = path;
  }, []);

  const toggleInSelection = useCallback(
    (path: string) => {
      const next = new Set(selectedPaths);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      setRawSelectedPaths(next);
      setRawSelectedPath(next.has(path) ? path : ([...next].pop() ?? null));
      selectionAnchorRef.current = path;
    },
    [selectedPaths],
  );

  const selectRange = useCallback((path: string, ordered: string[]) => {
    const anchor = selectionAnchorRef.current ?? path;
    const a = ordered.indexOf(anchor);
    const b = ordered.indexOf(path);
    if (a === -1 || b === -1) {
      setRawSelectedPaths(new Set([path]));
      setRawSelectedPath(path);
      return;
    }
    const [lo, hi] = a <= b ? [a, b] : [b, a];
    setRawSelectedPaths(new Set(ordered.slice(lo, hi + 1)));
    setRawSelectedPath(path);
  }, []);

  /** Jump to a file from anywhere (e.g. the starred list): folder, sub-folder, filters, selection. */
  const revealFile = (path: string) => {
    const key = folderKeyForPath(path);
    const root = foldersRef.current.find((f) => f.key === key)?.path ?? '';
    setScreen('main');
    setActiveFolderState(key);
    setSearchQuery('');
    setTypeFilter('all');
    setFilterByDate(null);
    setDateRange('all');
    setSizeFilter('all');
    const parent = dirName(path);
    const inRoot = trimTrailingSep(parent) === trimTrailingSep(root);
    if (inRoot) {
      setBrowsePath(null);
      const file = allFiles.find((f) => f.path === path);
      if (file && file.modifiedAt < periodFilterStart(periodFilter)) setPeriodFilter('all');
    } else {
      browseInto(parent);
    }
    selectOne(path);
  };

  const selectedFile = useMemo(
    () => allFiles.find((f) => f.path === selectedPath) ?? null,
    [allFiles, selectedPath],
  );

  // Sidebar badges follow the same rules as the list (period + depth), so the
  // number next to a folder matches what opening it shows.
  const folderCounts = useMemo(() => {
    const periodStart = periodFilterStart(periodFilter);
    const isExcluded = makeExcludeTest(folders, excludeKeywords);
    const roots = new Map(folders.map((f) => [f.key, f.path]));
    const counts: Record<string, number> = {};
    for (const fd of folders) counts[fd.key] = 0;
    for (const f of allFiles) {
      if (f.isDir || f.modifiedAt < periodStart) continue;
      const root = roots.get(f.folder);
      if (!root || (!recursive && !isDirectChild(root, f.path)) || isExcluded(f)) continue;
      counts[f.folder] = (counts[f.folder] ?? 0) + 1;
    }
    return counts;
  }, [allFiles, folders, periodFilter, recursive, excludeKeywords]);

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
    revealFile,
    allFiles,
    folderFiles,
    filteredFiles,
    folderCounts,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    recursive,
    setRecursive,
    periodFilter,
    setPeriodFilter,
    resetFilters,
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
    setSelected: selectOne,
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
    lastScanAt,
    rescan,
    notice,
    notify,
    countByType,
    isMac: IS_MAC,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
