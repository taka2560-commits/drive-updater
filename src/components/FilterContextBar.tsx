import { Calendar, X } from 'lucide-react';
import { useStore } from '../storeContext';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** C-layout: shown only while a heatmap date is selected. */
export function FilterContextBar() {
  const { filterByDate, setFilterByDate, filteredFiles } = useStore();
  if (!filterByDate) return null;

  const [y, m, d] = filterByDate.split('-').map(Number);
  const wd = WEEKDAYS[new Date(filterByDate).getDay()];
  const count = filteredFiles.filter((f) => !f.isDir).length;

  return (
    <div
      style={{
        height: 40,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 24px',
        background: 'rgba(var(--accent-rgb), 0.08)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Calendar size={13} color="var(--color-accent)" />
      <span style={{ fontSize: 12, color: 'var(--color-text)' }}>
        {y}年{m}月{d}日 ({wd}) のファイル
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          padding: '1px 8px',
          borderRadius: 9999,
          background: 'var(--color-accent)',
          color: 'var(--color-bg)',
        }}
      >
        {count}件
      </span>
      <div style={{ flex: 1 }} />
      <button
        onClick={() => setFilterByDate(null)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          padding: '4px 10px',
          fontSize: 11,
          color: 'var(--color-muted)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <X size={12} />
        絞り込みを解除
      </button>
    </div>
  );
}
