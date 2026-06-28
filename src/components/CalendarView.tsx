import { useState, useMemo } from 'react';
import { useStore } from '../storeContext';
import { FileTypeBadge } from './FileTypeBadge';
import { formatBytes, formatActivityLabel } from '../lib/format';
import { buildSummary } from '../lib/heatmap';
import type { FileEntry } from '../types';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function heat(count: number): number {
  if (!count) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

export function CalendarView() {
  const { folderFiles, filteredFiles, selectOne } = useStore();

  const summary = useMemo(() => buildSummary(folderFiles), [folderFiles]);

  const { year, month, todayDate, startWeekday, daysInMonth, allFiles, counts } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const firstDay = new Date(y, m, 1);
    const nonDirs = filteredFiles.filter((f) => !f.isDir);
    const cmap = new Map<number, number>();
    for (const f of nonDirs) {
      const d = new Date(f.modifiedAt);
      if (d.getFullYear() === y && d.getMonth() === m) {
        const key = d.getDate();
        cmap.set(key, (cmap.get(key) || 0) + 1);
      }
    }
    return {
      year: y,
      month: m,
      todayDate: now.getDate(),
      startWeekday: firstDay.getDay(),
      daysInMonth: new Date(y, m + 1, 0).getDate(),
      allFiles: nonDirs,
      counts: cmap,
    };
  }, [filteredFiles]);

  const cells: { blank?: boolean; day?: number; count: number; level: number; isToday: boolean }[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ blank: true, count: 0, level: 0, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const c = counts.get(d) || 0;
    cells.push({ day: d, count: c, level: heat(c), isToday: d === todayDate });
  }

  const [focusDay, setFocusDay] = useState(todayDate);

  const focusFiles = useMemo(
    () =>
      allFiles
        .filter((f) => {
          const d = new Date(f.modifiedAt);
          return d.getDate() === focusDay && d.getMonth() === month && d.getFullYear() === year;
        })
        .sort((a, b) => b.modifiedAt - a.modifiedAt),
    [allFiles, focusDay, month, year],
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 24,
        padding: '16px 24px 24px',
        overflow: 'hidden',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Calendar grid */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Title + legend */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', margin: 0, color: 'var(--text-primary)' }}>
            {year} 年 {month + 1} 月
          </h2>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            活動量を色の濃さで表示
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>少</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: `var(--heat-${l})`,
                  border: l === 0 ? '1px solid var(--border-subtle)' : 'none',
                }}
              />
            ))}
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>多</span>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <SummaryChip label="今日" value={`${summary.todayCount} 件`} accent />
          <SummaryChip label="今週" value={`${summary.weekCount} 件`} />
          <SummaryChip label="今月" value={`${summary.monthCount} 件`} />
          <SummaryChip label="合計サイズ" value={formatBytes(summary.totalBytes)} />
          <SummaryChip
            label="最も忙しい日"
            value={summary.maxDay ? formatActivityLabel(summary.maxDay, summary.maxCount).replace(/ — /, ' ') : '—'}
          />
        </div>

        {/* Weekday header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                textAlign: 'center',
                color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--brand)' : 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', gap: 6, flex: 1, minHeight: 0 }}>
          {cells.map((c, i) => {
            if (c.blank) return <div key={`b${i}`} />;
            const focused = focusDay === c.day;
            return (
              <button
                key={c.day}
                onClick={() => setFocusDay(c.day!)}
                style={{
                  position: 'relative',
                  background: `var(--heat-${c.level})`,
                  border: focused
                    ? '1.5px solid var(--accent)'
                    : c.isToday
                      ? '1.5px solid var(--text-secondary)'
                      : '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '6px 8px',
                  color: c.level >= 3 ? 'var(--text-on-accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-sans)',
                  minHeight: 56,
                  transition: 'border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: c.isToday ? 700 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: c.level === 0 ? 0.7 : 1,
                  }}
                >
                  {c.day}
                </span>
                {c.count > 0 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      fontWeight: 600,
                      opacity: 0.95,
                    }}
                  >
                    {c.count} 件
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      <aside
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 16px 12px',
          overflow: 'auto',
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {month + 1} 月 {focusDay} 日
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6, color: 'var(--text-primary)' }}>
          {focusFiles.length}
          <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: 'var(--text-muted)' }}>件の更新</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14 }}>
          合計 {formatBytes(focusFiles.reduce((s, f) => s + f.sizeBytes, 0))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {focusFiles.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>
              この日の更新はありません。
            </div>
          ) : (
            focusFiles.map((f) => (
              <SidePanelRow key={f.path} file={f} onSelect={() => selectOne(f.path)} />
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

function SidePanelRow({ file, onSelect }: { file: FileEntry; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 10,
        alignItems: 'center',
        padding: '6px 0',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        background: hover ? 'var(--surface-hover)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
    >
      <FileTypeBadge ext={file.ext} size={24} showLabel={false} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 12.5,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.name}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {new Date(file.modifiedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {formatBytes(file.sizeBytes)}
      </span>
    </div>
  );
}

function SummaryChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        padding: '8px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: accent ? 'var(--accent)' : 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  );
}
