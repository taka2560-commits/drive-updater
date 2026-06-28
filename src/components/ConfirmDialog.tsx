import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../storeContext';

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
        background: 'var(--surface-overlay)',
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
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
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
            <AlertTriangle size={20} color="var(--danger)" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            ゴミ箱に移動しますか？
          </div>
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          {name ? (
            <>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-all' }}>{name}</span>
              {' をゴミ箱に移動します。'}
            </>
          ) : (
            <>
              選択中の <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{count}件</span>{' '}
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
  borderRadius: 'var(--radius-md)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  border: '1px solid var(--border)',
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: 'var(--surface-elevated)',
  color: 'var(--text-primary)',
};

const btnDanger: React.CSSProperties = {
  ...btnBase,
  background: 'var(--danger)',
  borderColor: 'var(--danger)',
  color: '#fff',
};
