import { useMemo } from 'react';
import { buildActivity, activityColor, activityHeight } from '../lib/activity';
import { formatActivityLabel } from '../lib/format';
import type { FileEntry } from '../types';

/** Last-14-days activity strip (file-update counts per day). */
export function ActivityStrip({ files }: { files: FileEntry[] }) {
  const { buckets, max, total } = useMemo(() => {
    const b = buildActivity(files, 14);
    const m = b.reduce((acc, d) => Math.max(acc, d.count), 0);
    const t = b.reduce((acc, d) => acc + d.count, 0);
    return { buckets: b, max: m, total: t };
  }, [files]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          fontSize: 10,
          color: 'var(--color-disabled)',
          width: 96,
          flexShrink: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 700,
        }}
      >
        過去14日
      </span>
      <div style={{ flex: 1, display: 'flex', gap: 3, alignItems: 'flex-end', height: 22 }}>
        {buckets.map((d) => (
          <div
            key={d.date}
            title={formatActivityLabel(d.date, d.count)}
            style={{
              flex: 1,
              background: activityColor(d.count, max),
              height: activityHeight(d.count, max),
              borderRadius: 2,
              minHeight: 3,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 10, color: 'var(--color-muted)', width: 64, textAlign: 'right', flexShrink: 0 }}>
        合計 {total}件
      </span>
    </div>
  );
}
