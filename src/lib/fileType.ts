import {
  FileText,
  FileSpreadsheet,
  MonitorPlay,
  Image as ImageIcon,
  File as FileIcon,
  Ruler,
  type LucideIcon,
} from 'lucide-react';
import type { FileTypeFilter } from '../types';

export interface FileTypeMeta {
  Icon: LucideIcon;
  color: string; // CSS color (var() or literal)
  label: string; // human label, e.g. 'Word文書'
}

// Map an extension to icon / color / human label.
const EXT_META: Record<string, FileTypeMeta> = {
  doc: { Icon: FileText, color: 'var(--text-brand)', label: 'Word文書' },
  docx: { Icon: FileText, color: 'var(--text-brand)', label: 'Word文書' },
  rtf: { Icon: FileText, color: 'var(--text-brand)', label: 'リッチテキスト' },
  txt: { Icon: FileText, color: 'var(--text-brand)', label: 'テキスト' },
  md: { Icon: FileText, color: 'var(--text-brand)', label: 'Markdown' },

  xls: { Icon: FileSpreadsheet, color: 'var(--text-brand)', label: 'Excel' },
  xlsx: { Icon: FileSpreadsheet, color: 'var(--text-brand)', label: 'Excel' },
  csv: { Icon: FileSpreadsheet, color: 'var(--text-brand)', label: 'CSV' },

  ppt: { Icon: MonitorPlay, color: 'var(--accent)', label: 'PowerPoint' },
  pptx: { Icon: MonitorPlay, color: 'var(--accent)', label: 'PowerPoint' },
  key: { Icon: MonitorPlay, color: 'var(--accent)', label: 'Keynote' },

  pdf: { Icon: FileText, color: '#F5A0A0', label: 'PDF' },

  png: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'PNG画像' },
  jpg: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'JPEG画像' },
  jpeg: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'JPEG画像' },
  gif: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'GIF画像' },
  webp: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'WebP画像' },
  svg: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'SVG画像' },
  bmp: { Icon: ImageIcon, color: 'var(--text-brand)', label: 'BMP画像' },

  dwg: { Icon: Ruler, color: '#5DB8D4', label: 'AutoCAD図面' },
  dxf: { Icon: Ruler, color: '#5DB8D4', label: 'CAD交換形式' },
};

const FALLBACK: FileTypeMeta = {
  Icon: FileIcon,
  color: 'var(--text-secondary)',
  label: 'ファイル',
};

export function fileMeta(ext: string): FileTypeMeta {
  return EXT_META[ext.toLowerCase()] ?? FALLBACK;
}

const FILTER_EXTS: Record<Exclude<FileTypeFilter, 'all' | 'other'>, string[]> = {
  docs: ['doc', 'docx', 'txt', 'md', 'rtf'],
  sheets: ['xls', 'xlsx', 'csv'],
  pdf: ['pdf'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'],
  slides: ['ppt', 'pptx', 'key'],
  cad: ['dwg', 'dxf'],
};

const ALL_KNOWN = new Set(Object.values(FILTER_EXTS).flat());

// Extensions whose contents are worth previewing as plain text.
const TEXT_PREVIEW_EXTS = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'log', 'json', 'xml', 'yml', 'yaml',
  'js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'html', 'htm', 'py', 'rb', 'go',
  'rs', 'java', 'c', 'h', 'cpp', 'sh', 'bat', 'ini', 'toml', 'env', 'sql',
]);

export function isTextPreviewable(ext: string): boolean {
  return TEXT_PREVIEW_EXTS.has(ext.toLowerCase());
}

export function matchesType(ext: string, filter: FileTypeFilter): boolean {
  const e = ext.toLowerCase();
  if (filter === 'all') return true;
  if (filter === 'other') return !ALL_KNOWN.has(e);
  return FILTER_EXTS[filter].includes(e);
}

export interface TypeChipDef {
  key: FileTypeFilter;
  label: string;
  Icon?: LucideIcon;
}

export const TYPE_CHIPS: TypeChipDef[] = [
  { key: 'all', label: 'すべて' },
  { key: 'docs', label: 'Docs', Icon: FileText },
  { key: 'sheets', label: 'Sheets', Icon: FileSpreadsheet },
  { key: 'pdf', label: 'PDF', Icon: FileText },
  { key: 'image', label: 'Image', Icon: ImageIcon },
  { key: 'slides', label: 'Slides', Icon: MonitorPlay },
  { key: 'cad', label: 'CAD', Icon: Ruler },
  { key: 'other', label: 'Other' },
];
