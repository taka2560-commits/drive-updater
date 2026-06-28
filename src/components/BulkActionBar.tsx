import { Star, Trash2, Copy, X } from 'lucide-react';
import { useStore } from '../storeContext';

export function BulkActionBar() {
  const { selectedPaths, filteredFiles, starred, starMany, requestDelete, clearSelection } = useStore();

  const count = selectedPaths.size;
  if (count < 2) return null;

  const paths = [...selectedPaths];
  const filePaths = filteredFiles.filter((f) => !f.isDir && selectedPaths.has(f.path)).map((f) => f.path);
  const allStarred = filePaths.length > 0 && filePaths.every((p) => starred.has(p));

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 16,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 10px 8px 14px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        boxShadow: 'var(--shadow-lg)',
        zIndex: 80,
        animation: 'lu-expand 140ms ease-out',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginRight: 4 }}>
        {count}件選択中
      </span>

      {filePaths.length > 0 && (
        <BarButton
          Icon={Star}
          label={allStarred ? 'スター解除' : 'スター'}
          onClick={() => starMany(filePaths, !allStarred)}
        />
      )}
      <BarButton
        Icon={Copy}
        label="パスをコピー"
        onClick={() => navigator.clipboard?.writeText(paths.join('\n')).catch(() => {})}
      />
      <BarButton Icon={Trash2} label="ゴミ箱" danger onClick={() => requestDelete(paths)} />

      <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />
      <BarButton Icon={X} label="解除" onClick={clearSelection} />
    </div>
  );
}

function BarButton({
  Icon,
  label,
  onClick,
  danger = false,
}: {
  Icon: typeof Star;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 10px',
        borderRadius: 7,
        border: '1px solid var(--border)',
        background: 'transparent',
        color: danger ? 'var(--danger)' : 'var(--text-primary)',
        fontSize: 12,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Icon size={14} color={danger ? 'var(--danger)' : 'var(--text-muted)'} />
      {label}
    </button>
  );
}
