import type { FileData } from '../components/types';

export type GroupKey = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'older';

export interface FileGroup {
  key: GroupKey;
  label: string;
  subLabel: string;
  files: FileData[];
  totalBytes: number;
}

function buildSubLabel(key: GroupKey, now: Date): string {
  // 簡易的な日付範囲ラベル生成
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (key === 'today') return `${now.getFullYear()}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  return '';
}

export function groupByTime(files: FileData[]): FileGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  
  const dow = now.getDay();
  const daysFromMonday = (dow + 6) % 7;
  const startOfThisWeek = startOfToday - daysFromMonday * 86_400_000;
  const startOfLastWeek = startOfThisWeek - 7 * 86_400_000;
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const buckets: Record<GroupKey, FileData[]> = {
    today: [], yesterday: [], thisWeek: [], lastWeek: [], thisMonth: [], older: [],
  };

  for (const f of files) {
    const t = f.updated.getTime();
    if (t >= startOfToday) buckets.today.push(f);
    else if (t >= startOfYesterday) buckets.yesterday.push(f);
    else if (t >= startOfThisWeek) buckets.thisWeek.push(f);
    else if (t >= startOfLastWeek) buckets.lastWeek.push(f);
    else if (t >= startOfThisMonth) buckets.thisMonth.push(f);
    else buckets.older.push(f);
  }

  const labels: Record<GroupKey, string> = {
    today: '今日', yesterday: '昨日', thisWeek: '今週',
    lastWeek: '先週', thisMonth: '今月', older: 'それ以前',
  };

  return (Object.keys(buckets) as GroupKey[])
    .filter(k => buckets[k].length > 0)
    .map(k => ({
      key: k,
      label: labels[k],
      subLabel: buildSubLabel(k, now),
      files: buckets[k].sort((a, b) => b.updated.getTime() - a.updated.getTime()),
      totalBytes: buckets[k].reduce((s, f) => s + f.size, 0),
    }));
}
