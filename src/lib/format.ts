// Formatting helpers — sizes, dates, relative time.

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const fixed = v >= 100 || Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
  return `${fixed} ${units[i]}`;
}

const DAY = 86_400_000;

/** Short relative label: 今 / 5分前 / 1時間前 / 昨日 / 2日前 / 先週 / MM-DD */
export function formatRelativeTime(ts: number, now = Date.now()): string {
  const diff = now - ts;
  if (diff < 60_000) return '今';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分前`;
  if (diff < DAY) return `${Math.floor(diff / 3_600_000)}時間前`;

  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((startOfToday - new Date(ts).setHours(0, 0, 0, 0)) / DAY);
  if (dayDiff === 1) return '昨日';
  if (dayDiff < 7) return `${dayDiff}日前`;
  if (dayDiff < 14) return '先週';
  return formatMonthDay(ts);
}

export function formatMonthDay(ts: number): string {
  const d = new Date(ts);
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Local date key (YYYY-MM-DD) — shared by store/heatmap/grouping. */
export function toDateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Full timestamp: 2026-06-21 14:30 */
export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** True when the timestamp is within the last 24h (used for accent coloring). */
export function isRecent(ts: number, now = Date.now()): boolean {
  return now - ts < DAY;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** Activity tooltip label: 6月15日 (土) — 9件 */
export function formatActivityLabel(dateKey: string, count: number): string {
  const [, m, d] = dateKey.split('-').map(Number);
  const wd = WEEKDAYS[new Date(dateKey).getDay()];
  return `${m}月${d}日 (${wd}) — ${count}件`;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
