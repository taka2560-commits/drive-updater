import { FolderTree } from 'lucide-react';
import { useStore } from '../storeContext';
import { TYPE_CHIPS } from '../lib/fileType';
import type { SortKey } from '../types';

const SORT_LABELS: Record<SortKey, string> = {
  modified: '更新日',
  name: '名前',
  size: 'サイズ',
};

export function FilterBar() {
  const {
    typeFilter,
    setTypeFilter,
    countByType,
    sortKey,
    sortDir,
    toggleSort,
    recursive,
    setRecursive,
  } = useStore();

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

      {/* Right-aligned controls; they wrap together when the window is narrow */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      {/* Include sub-folders: turns the list into a cross-folder "recently updated" view */}
      <button
        onClick={() => setRecursive(!recursive)}
        aria-pressed={recursive}
        title="サブフォルダ内のファイルもまとめて表示します（深い階層の変更は、ウィンドウを開き直したときや定期的に反映されます）"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          borderRadius: 'var(--radius-md)',
          border: recursive ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: recursive ? 'var(--accent-soft)' : 'transparent',
          color: recursive ? 'var(--text-accent)' : 'var(--text-secondary)',
          fontSize: 12,
          fontFamily: 'var(--font-sans)',
          cursor: 'pointer',
        }}
      >
        <FolderTree size={12} />
        サブフォルダを含める
      </button>

      {/* Sort control: pick a key; picking the active key flips the direction */}
      <div
        role="group"
        aria-label="並び替え"
        style={{
          display: 'inline-flex',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => {
          const active = sortKey === k;
          return (
            <button
              key={k}
              onClick={() => toggleSort(k)}
              aria-pressed={active}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderLeft: k === 'modified' ? 'none' : '1px solid var(--border)',
                background: active ? 'var(--surface-hover)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: 12,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}
            >
              {SORT_LABELS[k]}
              {active && (sortDir === 'desc' ? ' ↓' : ' ↑')}
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
