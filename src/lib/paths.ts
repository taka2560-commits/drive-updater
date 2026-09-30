// Small path helpers that work on both Windows (\) and POSIX (/) style paths,
// since the renderer never imports node:path.

export function sepOf(p: string): string {
  return p.includes('\\') ? '\\' : '/';
}

export function trimTrailingSep(p: string): string {
  return p.replace(/[\\/]+$/, '');
}

/** Path of `p` relative to `root`, or null when `p` is not inside `root`. */
export function relativeTo(root: string, p: string): string | null {
  const r = trimTrailingSep(root);
  if (!p.startsWith(r)) return null;
  const c = p[r.length];
  if (c !== '\\' && c !== '/') return null;
  return p.slice(r.length + 1);
}

export function dirName(p: string): string {
  const i = Math.max(p.lastIndexOf('\\'), p.lastIndexOf('/'));
  return i > 0 ? p.slice(0, i) : p;
}

export function baseName(p: string): string {
  return p.split(/[\\/]/).pop() ?? p;
}

/** "デスクトップ › 図面 › 10_CAD": where a file lives, relative to its watched folder. */
export function locationLabel(rootLabel: string, rootPath: string, filePath: string): string {
  const dir = dirName(filePath);
  if (trimTrailingSep(dir) === trimTrailingSep(rootPath)) return rootLabel;
  const rel = relativeTo(rootPath, dir);
  return rel ? [rootLabel, ...rel.split(/[\\/]/)].join(' › ') : rootLabel;
}

/** True when `p` sits directly inside `root` (not in a nested folder). */
export function isDirectChild(root: string, p: string): boolean {
  const rel = relativeTo(root, p);
  return rel !== null && !/[\\/]/.test(rel);
}
