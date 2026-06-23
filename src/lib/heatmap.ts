import type { FileEntry } from '../types';
import { toDateKey } from './format';

// Calendar heatmap for the C layout (SPEC_C §3).
export interface HeatCell {
  date: string; // YYYY-MM-DD
  weekday: number; // 0=Sun ... 6=Sat
  count: number;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  isFuture: boolean;
  isToday: boolean;
}

export interface HeatSummary {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalBytes: number;
  maxDay: string | null; // YYYY-MM-DD
  maxCount: number;
}

const DAY = 86_400_000;
export const HEATMAP_DAYS = 63; // 9 週分

function levelOf(count: number, max: number): HeatCell['level'] {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.2) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.65) return 3;
  if (ratio < 0.9) return 4;
  return 5;
}

/** Build a 63-day (9×7) heatmap ending on today, counting file updates per day. */
export function buildHeatmap(files: FileEntry[], now = new Date()): HeatCell[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayMs = today.getTime();
  const startMs = todayMs - (HEATMAP_DAYS - 1) * DAY;

  const counts = new Map<string, number>();
  for (const f of files) {
    if (f.isDir) continue;
    const key = toDateKey(f.modifiedAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const max = Math.max(...counts.values(), 1);
  const cells: HeatCell[] = [];
  for (let i = 0; i < HEATMAP_DAYS; i++) {
    const d = new Date(startMs + i * DAY);
    const key = toDateKey(d.getTime());
    const count = counts.get(key) ?? 0;
    cells.push({
      date: key,
      weekday: d.getDay(),
      count,
      level: levelOf(count, max),
      isFuture: d.getTime() > todayMs,
      isToday: d.getTime() === todayMs,
    });
  }
  return cells;
}

/** Summary chips: today / this week / this month counts, total size, busiest day. */
export function buildSummary(files: FileEntry[], now = new Date()): HeatSummary {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const daysFromMonday = (now.getDay() + 6) % 7;
  const startOfThisWeek = startOfToday - daysFromMonday * DAY;
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  let totalBytes = 0;
  const perDay = new Map<string, number>();

  for (const f of files) {
    if (f.isDir) continue;
    totalBytes += f.sizeBytes;
    const t = f.modifiedAt;
    if (t >= startOfToday) todayCount++;
    if (t >= startOfThisWeek) weekCount++;
    if (t >= startOfThisMonth) monthCount++;
    const key = toDateKey(t);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  let maxDay: string | null = null;
  let maxCount = 0;
  for (const [day, c] of perDay) {
    if (c > maxCount) {
      maxCount = c;
      maxDay = day;
    }
  }

  return { todayCount, weekCount, monthCount, totalBytes, maxDay, maxCount };
}
