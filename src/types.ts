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
  | 'other';

export type SortKey = 'modified' | 'name' | 'size';
export type SortDir = 'asc' | 'desc';
export type ViewMode = 'list' | 'grid';

export type Screen = 'main' | 'starred' | 'settings';
export type SettingsTab = 'appearance' | 'exclude' | 'folders' | 'about';
