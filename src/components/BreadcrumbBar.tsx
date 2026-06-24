import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../storeContext';

/**
 * Shows the current folder path as clickable breadcrumb segments whenever
 * the user has drilled into a sub-folder (browsePath !== null).
 *
 * Example: デスクトップ > 作業中フォルダ > サブフォルダ
 */
export function BreadcrumbBar() {
  const { browsePath, activeFolder, folders, setActiveFolder, browseInto } = useStore();

  if (!browsePath) return null;

  const folder = folders.find((f) => f.key === activeFolder);
  const rootPath = folder?.path ?? '';
  const sep = browsePath.includes('\\') ? '\\' : '/';

  // Build segments relative to the root folder.
  const relative = browsePath.startsWith(rootPath + sep)
    ? browsePath.slice(rootPath.length + sep.length)
    : browsePath;
  const segments = relative.split(sep).filter(Boolean);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 18px',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      {/* Root: active folder label */}
      <button
        onClick={() => setActiveFolder(activeFolder)}
        title={rootPath}
        style={crumbBtn}
      >
        <Home size={11} style={{ flexShrink: 0 }} />
        {folder?.label ?? activeFolder}
      </button>

      {/* Each sub-folder segment */}
      {segments.map((seg, i) => {
        const segPath = rootPath + sep + segments.slice(0, i + 1).join(sep);
        const isLast = i === segments.length - 1;
        return (
          <span key={segPath} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ChevronRight size={11} color="var(--color-disabled)" />
            {isLast ? (
              <span style={crumbCurrent}>{seg}</span>
            ) : (
              <button
                onClick={() => browseInto(segPath)}
                title={segPath}
                style={crumbBtn}
              >
                {seg}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}

const crumbBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: 'none',
  border: 'none',
  padding: '2px 4px',
  borderRadius: 4,
  fontSize: 12,
  color: 'var(--color-accent)',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
};

const crumbCurrent: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--color-text)',
  fontWeight: 600,
  padding: '2px 4px',
};
