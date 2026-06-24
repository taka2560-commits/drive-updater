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
  doc: { Icon: FileText, color: 'var(--color-head-text)', label: 'Word文書' },
  docx: { Icon: FileText, color: 'var(--color-head-text)', label: 'Word文書' },
  rtf: { Icon: FileText, color: 'var(--color-head-text)', label: 'リッチテキスト' },
  txt: { Icon: FileText, color: 'var(--color-head-text)', label: 'テキスト' },
  md: { Icon: FileText, color: 'var(--color-head-text)', label: 'Markdown' },

  xls: { Icon: FileSpreadsheet, color: 'var(--color-sec-text)', label: 'Excel' },
  xlsx: { Icon: FileSpreadsheet, color: 'var(--color-sec-text)', label: 'Excel' },
  csv: { Icon: FileSpreadsheet, color: 'var(--color-sec-text)', label: 'CSV' },

  ppt: { Icon: MonitorPlay, color: 'var(--color-accent)', label: 'PowerPoint' },
  pptx: { Icon: MonitorPlay, color: 'var(--color-accent)', label: 'PowerPoint' },
  key: { Icon: MonitorPlay, color: 'var(--color-accent)', label: 'Keynote' },

  pdf: { Icon: FileText, color: '#F5A0A0', label: 'PDF' },

  png: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'PNG画像' },
  jpg: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'JPEG画像' },
  jpeg: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'JPEG画像' },
  gif: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'GIF画像' },
  webp: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'WebP画像' },
  svg: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'SVG画像' },
  bmp: { Icon: ImageIcon, color: 'var(--color-head-text)', label: 'BMP画像' },

  dwg: { Icon: Ruler, color: '#5DB8D4', label: 'AutoCAD図面' },
  dxf: { Icon: Ruler, color: '#5DB8D4', label: 'CAD交換形式' },
};

const FALLBACK: FileTypeMeta = {
  Icon: FileIcon,
  color: 'var(--color-muted)',
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
