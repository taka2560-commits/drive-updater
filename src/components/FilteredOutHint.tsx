import { useStore } from '../storeContext';

/**
 * Shown under the folder rows when the current filters hide every *file*
 * (folders are always listed, so the full-page empty state never appears).
 */
export function FilteredOutHint() {
  const { resetFilters } = useStore();
  return (
    <div
      role="status"
      style={{
        margin: '16px 12px 0',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 12,
        color: 'var(--text-secondary)',
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <span style={{ flex: 1 }}>期間・種別・サイズの絞り込みで、ファイルがすべて除外されています。</span>
      <button
        onClick={resetFilters}
        style={{
          padding: '4px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--accent)',
          background: 'var(--accent-soft)',
          color: 'var(--text-accent)',
          fontSize: 12,
          fontFamily: 'var(--font-sans)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        すべて表示
      </button>
    </div>
  );
}
