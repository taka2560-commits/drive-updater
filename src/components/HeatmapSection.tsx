import { useMemo } from 'react';
import { useStore } from '../storeContext';
import { buildHeatmap, buildSummary, type HeatCell } from '../lib/heatmap';
import { formatActivityLabel, formatBytes } from '../lib/format';

/** C-layout: GitHub-style activity heatmap + summary chips. */
export function HeatmapSection() {
  const { folderFiles, filterByDate, setFilterByDate } = useStore();

  const cells = useMemo(() => buildHeatmap(folderFiles), [folderFiles]);
  const summary = useMemo(() => buildSummary(folderFiles), [folderFiles]);

  return (
    <div
      style={{
        flexShrink: 0,
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 14px)',
            gridTemplateRows: 'repeat(7, 14px)',
            gridAutoFlow: 'column',
            gap: 3,
          }}
        >
          {cells.map((c) => (
            <Cell key={c.date} cell={c} selected={filterByDate === c.date} onPick={setFilterByDate} />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--color-muted)' }}>少</span>
          {[0, 1, 2, 3, 5].map((lv) => (
            <div key={lv} style={{ width: 11, height: 11, borderRadius: 2, background: `var(--heat-${lv})` }} />
          ))}
          <span style={{ fontSize: 10, color: 'var(--color-muted)' }}>多</span>
        </div>

        <div style={{ flex: 1 }} />
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <Chip label="今日" value={`${summary.todayCount} 件`} accent />
        <Chip label="今週" value={`${summary.weekCount} 件`} />
        <Chip label="今月" value={`${summary.monthCount} 件`} />
        <Chip label="合計サイズ" value={formatBytes(summary.totalBytes)} />
        <Chip
          label="最も忙しい日"
          value={summary.maxDay ? formatActivityLabel(summary.maxDay, summary.maxCount).replace(/ — /, ' ') : '—'}
          head
        />
      </div>
    </div>
  );
}

function Cell({
  cell,
  selected,
  onPick,
}: {
  cell: HeatCell;
  selected: boolean;
  onPick: (d: string | null) => void;
}) {
  if (cell.isFuture) {
    return (
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 2,
          background: 'transparent',
          border: '1px dashed var(--color-border)',
          pointerEvents: 'none',
        }}
      />
    );
  }
  return (
    <div
      title={formatActivityLabel(cell.date, cell.count)}
      onClick={() => onPick(selected ? null : cell.date)}
      style={{
        width: 14,
        height: 14,
        borderRadius: 2,
        background: `var(--heat-${cell.level})`,
        border: selected
          ? '2px solid var(--color-accent)'
          : cell.isToday
            ? '1px solid var(--color-text)'
            : '1px solid transparent',
        cursor: 'pointer',
        boxSizing: 'border-box',
      }}
    />
  );
}

function Chip({
  label,
  value,
  accent,
  head,
}: {
  label: string;
  value: string;
  accent?: boolean;
  head?: boolean;
}) {
  const color = accent ? 'var(--color-accent)' : head ? 'var(--color-head-text)' : 'var(--color-text)';
  return (
    <div
      style={{
        flex: 1,
        padding: '8px 12px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 6,
      }}
    >
      <div style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  );
}
