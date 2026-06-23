import type { FileEntry, FolderDef, FolderKey } from '../types';

// Standard + custom folders shown in the sidebar.
export const FOLDERS: FolderDef[] = [
  { key: 'desktop', label: 'デスクトップ', path: 'C:\\Users\\taka\\Desktop', icon: 'desktop', isStandard: true },
  { key: 'documents', label: 'ドキュメント', path: 'C:\\Users\\taka\\Documents', icon: 'documents', isStandard: true },
  { key: 'downloads', label: 'ダウンロード', path: 'C:\\Users\\taka\\Downloads', icon: 'downloads', isStandard: true },
  { key: 'custom:projects', label: 'Projects/2026', path: 'C:\\Users\\taka\\Projects\\2026', icon: 'folder', isStandard: false },
  { key: 'custom:wip', label: '作業中', path: 'D:\\WIP', icon: 'folder', isStandard: false },
];

const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

interface Seed {
  name: string;
  folder: FolderKey;
  sizeBytes: number;
  modAgo: number; // ms ago
  starred?: boolean;
}

// Seed files — clickable dummy data (chat decision: 静的ビジュアル/ダミーデータ).
// Timestamps are relative to load time so relative labels stay realistic.
const SEEDS: Seed[] = [
  // Desktop
  { name: 'プロジェクト計画書_v3.docx', folder: 'desktop', sizeBytes: 128 * 1024, modAgo: 14 * MIN, starred: true },
  { name: 'スクリーンショット_2026-06-21_143052.png', folder: 'desktop', sizeBytes: 1.2 * 1024 * 1024, modAgo: 2 * HOUR },
  { name: 'プレゼン資料_クライアント向け.pptx', folder: 'desktop', sizeBytes: 4.8 * 1024 * 1024, modAgo: 1 * DAY + 3 * HOUR, starred: true },
  { name: 'メモ.txt', folder: 'desktop', sizeBytes: 2 * 1024, modAgo: 3 * HOUR },
  { name: 'IMG_0234.jpg', folder: 'desktop', sizeBytes: 3.1 * 1024 * 1024, modAgo: 3 * DAY },
  { name: '設計図_v2.dwg', folder: 'desktop', sizeBytes: 2.4 * 1024 * 1024, modAgo: 2 * DAY },
  { name: '請求書_2026-06.pdf', folder: 'desktop', sizeBytes: 220 * 1024, modAgo: 5 * HOUR },
  { name: 'バナー案_最終.png', folder: 'desktop', sizeBytes: 880 * 1024, modAgo: 6 * DAY },
  { name: '予算表.xlsx', folder: 'desktop', sizeBytes: 96 * 1024, modAgo: 4 * DAY },
  { name: 'todo.md', folder: 'desktop', sizeBytes: 1.5 * 1024, modAgo: 40 * MIN },
  { name: 'archive_old.zip', folder: 'desktop', sizeBytes: 12 * 1024 * 1024, modAgo: 9 * DAY },
  { name: 'logo.svg', folder: 'desktop', sizeBytes: 18 * 1024, modAgo: 7 * DAY },

  // Documents
  { name: '月次報告_2026年6月.xlsx', folder: 'documents', sizeBytes: 256 * 1024, modAgo: 1 * HOUR, starred: true },
  { name: '提案書_2026Q2.pdf', folder: 'documents', sizeBytes: 1.8 * 1024 * 1024, modAgo: 4 * DAY, starred: true },
  { name: '議事録_開発チーム_0620.md', folder: 'documents', sizeBytes: 8 * 1024, modAgo: 1 * DAY + 5 * HOUR },
  { name: '経費精算_5月.xlsx', folder: 'documents', sizeBytes: 64 * 1024, modAgo: 8 * DAY },

  // Downloads
  { name: '契約書_最終版.pdf', folder: 'downloads', sizeBytes: 892 * 1024, modAgo: 2 * DAY, starred: true },
  { name: 'setup_installer.exe', folder: 'downloads', sizeBytes: 64 * 1024 * 1024, modAgo: 5 * DAY },
  { name: 'sample-dataset.csv', folder: 'downloads', sizeBytes: 340 * 1024, modAgo: 11 * DAY },

  // Custom folders
  { name: 'README.md', folder: 'custom:projects', sizeBytes: 4 * 1024, modAgo: 1 * DAY },
  { name: 'roadmap.xlsx', folder: 'custom:projects', sizeBytes: 72 * 1024, modAgo: 6 * HOUR },
  { name: 'draft_v1.docx', folder: 'custom:wip', sizeBytes: 40 * 1024, modAgo: 2 * HOUR },
];

function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

/** Build the full sample file set (timestamps relative to `now`). */
export function buildSampleFiles(now = Date.now()): FileEntry[] {
  return SEEDS.map((s) => {
    const folder = FOLDERS.find((f) => f.key === s.folder)!;
    const modifiedAt = now - s.modAgo;
    return {
      name: s.name,
      ext: extOf(s.name),
      folder: s.folder,
      path: `${folder.path}\\${s.name}`,
      sizeBytes: Math.round(s.sizeBytes),
      modifiedAt,
      accessedAt: modifiedAt + 2 * MIN,
      createdAt: modifiedAt - 3 * DAY,
      isDir: false,
    };
  });
}

/** Paths that start starred (persisted thereafter via localStorage). */
export const DEFAULT_STARRED: string[] = SEEDS.filter((s) => s.starred).map((s) => {
  const folder = FOLDERS.find((f) => f.key === s.folder)!;
  return `${folder.path}\\${s.name}`;
});

export const EXCLUDE_KEYWORDS = ['node_modules', '.git', '.DS_Store', 'dist'];
