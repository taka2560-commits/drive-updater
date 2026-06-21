import type { FileData } from '../components/types';

export interface HeatCell {
  date: string;       // YYYY-MM-DD
  weekday: number;    // 0=Sun ... 6=Sat
  count: number;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  isFuture: boolean;
  isToday: boolean;
}

const DAYS = 63; // 9 weeks * 7 days

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function levelOf(count: number, max: number): 0|1|2|3|4|5 {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.2) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.65) return 3;
  if (ratio < 0.9) return 4;
  return 5;
}

export function buildHeatmap(files: FileData[]): HeatCell[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayMs = today.getTime();

  // 開始日 = 今日から DAYS-1 日前
  const startMs = todayMs - (DAYS - 1) * 86_400_000;

  const counts = new Map<string, number>();
  for (const f of files) {
    const d = new Date(f.updated.getTime());
    const key = ymd(d);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let max = 1;
  for (const val of counts.values()) {
    if (val > max) max = val;
  }

  const cells: HeatCell[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(startMs + i * 86_400_000);
    const key = ymd(d);
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

export function buildSummary(files: FileData[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayMs = today.getTime();
  
  const dow = now.getDay();
  const daysFromMonday = (dow + 6) % 7;
  const startOfThisWeek = todayMs - daysFromMonday * 86_400_000;
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  let totalSize = 0;

  const countsByDate = new Map<string, number>();

  for (const f of files) {
    const t = f.updated.getTime();
    totalSize += f.size;
    if (t >= todayMs) todayCount++;
    if (t >= startOfThisWeek) weekCount++;
    if (t >= startOfThisMonth) monthCount++;

    const key = ymd(new Date(t));
    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
  }

  let maxDay = '';
  let maxCount = 0;
  for (const [date, count] of countsByDate.entries()) {
    if (count > maxCount) {
      maxCount = count;
      maxDay = date;
    }
  }

  return {
    todayCount,
    weekCount,
    monthCount,
    totalSize,
    maxDay,
    maxCount
  };
}
