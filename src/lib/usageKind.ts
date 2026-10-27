import { kindOf } from './fileType';

// Categories for the disk-usage screen: the list's file kinds, plus the kinds
// that usually take the most space (video, audio, archives, programs).
export type UsageKind =
  | 'docs' | 'sheets' | 'pdf' | 'image' | 'slides' | 'cad'
  | 'video' | 'audio' | 'archive' | 'app' | 'other';

const EXTRA: Record<'video' | 'audio' | 'archive' | 'app', string[]> = {
  video: ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'm4v', 'webm', 'mpg', 'mpeg', 'mts', 'm2ts', 'flv', '3gp'],
  audio: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'wma', 'ogg', 'opus', 'aiff'],
  archive: ['zip', 'rar', '7z', 'lzh', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'iso', 'cab', 'img', 'vhd', 'vhdx'],
  app: ['exe', 'msi', 'dll', 'sys', 'bat', 'cmd', 'ps1', 'jar', 'dmg', 'pkg', 'appx', 'msix', 'apk'],
};

const EXTRA_BY_EXT = new Map<string, UsageKind>();
for (const [kind, exts] of Object.entries(EXTRA)) for (const e of exts) EXTRA_BY_EXT.set(e, kind as UsageKind);

export function usageKindOf(ext: string): UsageKind {
  const e = ext.toLowerCase();
  return EXTRA_BY_EXT.get(e) ?? kindOf(e);
}

export const USAGE_KINDS: Record<UsageKind, { label: string; color: string }> = {
  docs: { label: '文書', color: '#7BA9CE' },
  sheets: { label: '表計算', color: '#4FB286' },
  pdf: { label: 'PDF', color: '#F08A8A' },
  image: { label: '画像', color: '#B48EDB' },
  slides: { label: 'プレゼン', color: '#E8A05A' },
  cad: { label: 'CAD', color: '#5DB8D4' },
  video: { label: '動画', color: '#E070A8' },
  audio: { label: '音声', color: '#D9C25B' },
  archive: { label: '圧縮・イメージ', color: '#9C8F7A' },
  app: { label: 'プログラム', color: '#7C86D9' },
  other: { label: 'その他', color: '#8A95A2' },
};

/** Sum per-extension totals into categories, biggest first. */
export function groupByKind(exts: [string, number, number][]) {
  const map = new Map<UsageKind, { count: number; bytes: number }>();
  for (const [ext, count, bytes] of exts) {
    const k = usageKindOf(ext);
    const cur = map.get(k) ?? { count: 0, bytes: 0 };
    cur.count += count;
    cur.bytes += bytes;
    map.set(k, cur);
  }
  return [...map.entries()]
    .map(([kind, v]) => ({ kind, ...v, ...USAGE_KINDS[kind] }))
    .sort((a, b) => b.bytes - a.bytes);
}
