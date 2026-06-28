import { ChevronDown } from 'lucide-react';
import { useStore } from '../storeContext';
import { TYPE_CHIPS } from '../lib/fileType';
import type { SortKey } from '../types';

const SORT_LABELS: Record<SortKey, string> = {
  modified: '更新日',
  name: '名前',
  size: 'サイズ',
};

export function FilterBar() {
  const { typeFilter, setTypeFilter, countByType, sortKey, sortDir, toggleSort } = useStore();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px var(--gutter-window)',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginRight: 4,
        }}
      >
        種別
      </span>
      {TYPE_CHIPS.map((chip) => {
        const count = countByType[chip.key];
        const selected = typeFilter === chip.key;
        const disabled = count === 0 && chip.key !== 'all';
        return (
          <button
            key={chip.key}
            onClick={() => setTypeFilter(chip.key)}
            disabled={disabled}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: selected ? 'var(--accent-soft)' : 'transparent',
              color: selected ? 'var(--text-accent)' : 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: selected ? 500 : 400,
              cursor: disabled ? 'default' : 'pointer',
              fontFamily: 'var(--font-sans)',
              opacity: disabled ? 0.4 : 1,
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}
          >
            {chip.Icon && <chip.Icon size={11} />}
            {chip.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.7 }}>
              {count}
            </span>
          </button>
        );
      })}

      <span style={{ flex: 1 }} />

      {/* Sort control */}
      <button
        onClick={() => toggleSort(sortKey)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: 12,
          fontFamily: 'var(--font-sans)',
          cursor: 'pointer',
        }}
      >
        {SORT_LABELS[sortKey]} {sortDir === 'desc' ? '↓' : '↑'}
        <ChevronDown size={11} />
      </button>
    </div>
  );
}
