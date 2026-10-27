// Data model — see handoff/IMPLEMENTATION_SPEC.md §1

export type FolderKey =
  | 'desktop'
  | 'documents'
  | 'downloads'
  | `custom:${string}`;

export interface FolderDef {
  key: FolderKey;
  label: string;
  path: string;
  icon: string;
  isStandard: boolean;
}

export interface FileEntry {
  path: string;
  name: string;
  ext: string; // lowercase, no dot
  folder: FolderKey;
  sizeBytes: number;
  modifiedAt: number; // unix ms
  accessedAt: number; // unix ms
  createdAt: number; // unix ms
  isDir: boolean;
}

export type FileTypeFilter =
  | 'all'
  | 'docs'
  | 'sheets'
  | 'pdf'
  | 'image'
  | 'slides'
  | 'cad'
  | 'other';

export type SortKey = 'modified' | 'name' | 'size';
export type SortDir = 'asc' | 'desc';
export type ViewMode = 'list' | 'timeline' | 'calendar';

export type PeriodFilter = 'all' | '1d' | '7d' | '14d' | '30d';

// Quick filters. 'all' = no constraint.
export type DateRange = 'all' | 'today' | 'week' | 'month';
export type SizeFilter = 'all' | 'gt1mb' | 'gt10mb' | 'gt100mb';

export type Screen = 'main' | 'starred' | 'settings' | 'usage';

// --- 容量分析 (electron/usage.ts と一致させる) ---
export interface UsageChild {
  name: string;
  path: string;
  bytes: number;
  files: number;
  dirs: number;
}

export interface UsageNode {
  root: string;
  scannedAt: number;
  inaccessible: number; // 読めなかったフォルダの数
  path: string;
  name: string;
  bytes: number;
  files: number;
  dirs: number;
  children: UsageChild[]; // サイズ降順
  exts: [ext: string, count: number, bytes: number][]; // 配下の拡張子別、サイズ降順
  largest: { path: string; name: string; bytes: number; modifiedAt: number }[];
}

export interface UsageSummary {
  root: string;
  scannedAt: number;
  bytes: number;
  files: number;
}

export interface UsageProgress {
  root: string;
  files: number;
  bytes: number;
  dirs: number;
  current: string;
  done?: boolean; // sent once when the analysis ends (finished or canceled)
}

export type UsageAnalyzeResult =
  | { ok: true; root: string; scannedAt: number }
  | { canceled: true }
  | { error: string };
export type SettingsTab = 'appearance' | 'exclude' | 'folders' | 'about';
