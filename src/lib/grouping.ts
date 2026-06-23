import type { FileEntry } from '../types';

// Time-axis grouping for the B layout (SPEC_B §3).
export type GroupKey = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'older';

export interface FileGroup {
  key: GroupKey;
  label: string; // 表示名
  subLabel: string; // 日付サブテキスト
  files: FileEntry[];
  totalBytes: number;
}

const DAY = 86_400_000;
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function buildSubLabel(key: GroupKey, now: Date): string {
  if (key === 'today' || key === 'yesterday') {
    const d = key === 'today' ? now : new Date(now.getTime() - DAY);
    const wd = WEEKDAYS[d.getDay()];
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} (${wd})`;
  }
  return '';
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Bucket files by recency (今日 / 昨日 / 今週 / 先週 / 今月 / それ以前). */
export function groupByTime(files: FileEntry[], now = new Date()): FileGroup[] {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - DAY;
  // 月曜始まりの今週開始
  const daysFromMonday = (now.getDay() + 6) % 7;
  const startOfThisWeek = startOfToday - daysFromMonday * DAY;
  const startOfLastWeek = startOfThisWeek - 7 * DAY;
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const buckets: Record<GroupKey, FileEntry[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    older: [],
  };

  for (const f of files) {
    const t = f.modifiedAt;
    if (t >= startOfToday) buckets.today.push(f);
    else if (t >= startOfYesterday) buckets.yesterday.push(f);
    else if (t >= startOfThisWeek) buckets.thisWeek.push(f);
    else if (t >= startOfLastWeek) buckets.lastWeek.push(f);
    else if (t >= startOfThisMonth) buckets.thisMonth.push(f);
    else buckets.older.push(f);
  }

  const labels: Record<GroupKey, string> = {
    today: '今日',
    yesterday: '昨日',
    thisWeek: '今週',
    lastWeek: '先週',
    thisMonth: '今月',
    older: 'それ以前',
  };

  return (Object.keys(buckets) as GroupKey[])
    .filter((k) => buckets[k].length > 0)
    .map((k) => ({
      key: k,
      label: labels[k],
      subLabel: buildSubLabel(k, now),
      files: buckets[k].sort((a, b) => b.modifiedAt - a.modifiedAt),
      totalBytes: buckets[k].reduce((s, f) => s + f.sizeBytes, 0),
    }));
}
