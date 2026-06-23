import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { applyTheme, loadSavedTheme, type ThemeName } from './theme/tokens';
import { matchesType } from './lib/fileType';
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
} as const;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(loadSavedTheme);
  const [screen, setScreen] = useState<Screen>('main');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('appearance');
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

  const setActiveFolder = (k: FolderKey) => {
    setActiveFolderState(k);
    setBrowsePath(null);
    setSelected(null);
    setSearchQuery('');
    setTypeFilter('all');
  };

  const browseInto = useCallback((path: string) => {
    setBrowsePath(path);
    setSelected(null);
    setSearchQuery('');
    setTypeFilter('all');
  }, []);

  const browseUp = useCallback(() => {
    setBrowsePath(null);
    setSelected(null);
  }, []);

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

  // Refs to keep latest values in rescan closure (synced in effects, not during render)
  const excludeRef = useRef(excludeKeywords);
  const foldersRef = useRef(folders);
  useEffect(() => { excludeRef.current = excludeKeywords; }, [excludeKeywords]);
  useEffect(() => { foldersRef.current = folders; }, [folders]);

  const rescan = useCallback(() => {
    setIsScanning(true);
    const api = getAPI();
    if (api) {
      const folderList = foldersRef.current.map((f) => ({ key: f.key, path: f.path }));
      api
        .scanFolders(folderList, false, excludeRef.current)
        .then((files) => {
          setAllFiles(files);
          setIsScanning(false);
        })
        .catch(() => {
          setAllFiles(buildSampleFiles());
          setIsScanning(false);
        });
    } else {
      window.setTimeout(() => {
        setAllFiles(buildSampleFiles());
        setIsScanning(false);
      }, 650);
    }
  }, []);

  // On mount: fetch real OS paths and do initial scan
  useEffect(() => {
    const api = getAPI();
    if (!api) return;

    api.getDefaultPaths().then(({ desktop, documents, downloads }) => {
      setFolders((prev) =>
        prev.map((f) => {
          if (f.key === 'desktop') return { ...f, path: desktop };
          if (f.key === 'documents') return { ...f, path: documents };
          if (f.key === 'downloads') return { ...f, path: downloads };
          return f;
        }),
      );
      setIsScanning(true);
      const folderList = [
        { key: 'desktop', path: desktop },
        { key: 'documents', path: documents },
        { key: 'downloads', path: downloads },
        ...loadJSON<FolderDef[]>(K.customFolders, []).map((f) => ({
          key: f.key,
          path: f.path,
        })),
      ];
      api
        .scanFolders(folderList, false, loadJSON<string[]>(K.exclude, EXCLUDE_KEYWORDS))
        .then((files) => {
          setAllFiles(files);
          setIsScanning(false);
        })
        .catch(() => {
          setAllFiles(buildSampleFiles());
          setIsScanning(false);
        });
    });

    const unsub = api.onFilesChanged(rescan);
    return unsub;
  }, [rescan]);

  // Derived: entries at current browsePath or active folder root
  const folderFiles = useMemo(() => {
    const kw = excludeKeywords;
    if (browsePath) {
      // Direct children of browsePath only
      return allFiles.filter((f) => {
        const sep = browsePath.includes('\\') ? '\\' : '/';
        if (!f.path.startsWith(browsePath + sep)) return false;
        const relative = f.path.slice(browsePath.length + sep.length);
        const isDirectChild =
          !relative.includes('\\') && !relative.includes('/');
        return (
          isDirectChild && !kw.some((k) => f.path.toLowerCase().includes(k.toLowerCase()))
        );
      });
    }
    return allFiles.filter(
      (f) =>
        f.folder === activeFolder &&
        !kw.some((k) => f.path.toLowerCase().includes(k.toLowerCase())),
    );
  }, [allFiles, activeFolder, browsePath, excludeKeywords]);

  // Count by type (dirs excluded from counts)
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
      other: 0,
    } as Record<FileTypeFilter, number>;
    for (const f of searchMatched) {
      if (f.isDir) continue;
      (['docs', 'sheets', 'pdf', 'image', 'slides', 'other'] as const).forEach((t) => {
        if (matchesType(f.ext, t)) counts[t]++;
      });
    }
    return counts;
  }, [searchMatched]);

  const filteredFiles = useMemo(() => {
    // Dirs always pass type filter; files go through matchesType
    const out = searchMatched.filter((f) => f.isDir || matchesType(f.ext, typeFilter));
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
  }, [searchMatched, typeFilter, sortKey, sortDir]);

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
