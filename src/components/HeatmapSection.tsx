import { useMemo, useState } from 'react';
import { buildHeatmap, buildSummary } from '../lib/heatmap';
import type { FileData } from './types';

interface HeatmapSectionProps {
  files: FileData[];
  filterByDate: string | null;
  setFilterByDate: (date: string | null) => void;
}

export function HeatmapSection({ files, filterByDate, setFilterByDate }: HeatmapSectionProps) {
  const cells = useMemo(() => buildHeatmap(files), [files]);
  const summary = useMemo(() => buildSummary(files), [files]);
  const [hoveredCell, setHoveredCell] = useState<{date: string, count: number} | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getMonth() + 1}月${d.getDate()}日 (${days[d.getDay()]})`;
  };

  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-text)' }}>アクティビティ<span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--color-muted)', marginLeft: '8px' }}>過去9週間</span></div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>セルをクリックでその日に絞り込み</div>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--color-muted)' }}>
          <span>少</span>
          <div style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: 'var(--heat-0)' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: 'var(--heat-1)' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: 'var(--heat-2)' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: 'var(--heat-3)' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: 'var(--heat-4)' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: 'var(--heat-5)' }} />
          <span>多</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', position: 'relative' }}>
        {/* We skip row labels for simplicity, just render the grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(9, 14px)', 
          gridTemplateRows: 'repeat(7, 14px)', 
          gridAutoFlow: 'column', 
          gap: '3px' 
        }}>
          {cells.map((cell, i) => (
            <div
              key={i}
              onClick={() => {
                if (!cell.isFuture) {
                  setFilterByDate(filterByDate === cell.date ? null : cell.date);
                }
              }}
              onMouseEnter={() => setHoveredCell({date: cell.date, count: cell.count})}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                width: '14px', height: '14px', borderRadius: '2px',
                backgroundColor: cell.isFuture ? 'transparent' : `var(--heat-${cell.level})`,
                border: cell.isFuture ? '1px dashed var(--color-border)' : 
                        cell.date === filterByDate ? '1px solid var(--color-text)' :
                        cell.isToday ? '1px solid var(--color-text)' : 'none',
                cursor: cell.isFuture ? 'default' : 'pointer',
                opacity: (filterByDate && filterByDate !== cell.date) ? 0.4 : 1,
              }}
            />
          ))}
        </div>
        
        {/* Hover Tooltip - simple inline implementation */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '24px', color: 'var(--color-muted)', fontSize: '12px' }}>
          {hoveredCell ? (
            <span>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{formatDateLabel(hoveredCell.date)}</span>
              {' — '}
              {hoveredCell.count === 0 ? '更新なし' : `${hoveredCell.count}件`}
            </span>
          ) : filterByDate ? (
            <span>絞り込み中: <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{formatDateLabel(filterByDate)}</span></span>
          ) : (
            <span>マスにカーソルを合わせると詳細が表示されます</span>
          )}
        </div>
      </div>

      {/* Summary Strip */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>今日</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-accent)' }}>{summary.todayCount} 件</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>今週</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text)' }}>{summary.weekCount} 件</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>今月</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text)' }}>{summary.monthCount} 件</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>合計サイズ</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text)' }}>{formatBytes(summary.totalSize)}</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>最も忙しい日</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-head-text)' }}>
            {summary.maxDay ? `${new Date(summary.maxDay).getMonth() + 1}月${new Date(summary.maxDay).getDate()}日 ${summary.maxCount}件` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
