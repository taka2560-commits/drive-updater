import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../storeContext';

/**
 * Central confirmation dialog for destructive actions.
 * Currently driven by store.pendingDelete (file/folder trash).
 * Rendered once at the app root so every layout shares it.
 */
export function ConfirmDialog() {
  const { pendingDelete, cancelDelete, confirmDelete } = useStore();
  const open = pendingDelete !== null;
  const count = pendingDelete?.length ?? 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancelDelete();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        confirmDelete();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, cancelDelete, confirmDelete]);

  if (!open) return null;

  const name = count === 1 ? pendingDelete![0].split(/[\\/]/).pop() : null;

  return (
    <div
      onClick={cancelDelete}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        animation: 'lu-expand 120ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: '90vw',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(245,160,160,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} color="#F5A0A0" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>
            ゴミ箱に移動しますか？
          </div>
        </div>

        <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 20 }}>
          {name ? (
            <>
              <span style={{ color: 'var(--color-text)', fontWeight: 600, wordBreak: 'break-all' }}>{name}</span>
              {' をゴミ箱に移動します。'}
            </>
          ) : (
            <>
              選択中の <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{count}件</span>{' '}
              をゴミ箱に移動します。
            </>
          )}
          <br />
          OS のゴミ箱から復元できます。
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={cancelDelete} style={btnSecondary}>
            キャンセル
          </button>
          <button onClick={confirmDelete} style={btnDanger} autoFocus>
            ゴミ箱に移動
          </button>
        </div>
      </div>
    </div>
  );
}

const btnBase: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  border: '1px solid var(--color-border)',
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-surface-2)',
  color: 'var(--color-text)',
};

const btnDanger: React.CSSProperties = {
  ...btnBase,
  background: '#D46A6A',
  borderColor: '#D46A6A',
  color: '#fff',
};
