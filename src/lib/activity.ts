import type { FileEntry } from '../types';

export interface DayBucket {
  date: string; // YYYY-MM-DD
  count: number;
}

const DAY_MS = 86_400_000;

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Build the last `days` activity buckets from file modified timestamps. */
export function buildActivity(
  files: FileEntry[],
  days = 14,
  now = Date.now(),
): DayBucket[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    buckets.set(dayKey(now - i * DAY_MS), 0);
  }
  for (const f of files) {
    const key = dayKey(f.modifiedAt);
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + 1);
  }
  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}

/** Bar fill color by activity level relative to the busiest day. */
export function activityColor(count: number, max: number): string {
  if (count === 0) return 'var(--color-border)';
  const ratio = max === 0 ? 0 : count / max;
  if (ratio >= 0.75) return 'var(--color-accent)';
  if (ratio >= 0.4) return 'rgba(var(--accent-rgb), 0.55)';
  return 'rgba(var(--accent-rgb), 0.30)';
}

/** Bar pixel height (3–22px), normalized to the busiest day. */
export function activityHeight(count: number, max: number): number {
  if (count === 0) return 3;
  const ratio = max === 0 ? 0 : count / max;
  return Math.max(3, Math.round(ratio * 22));
}
