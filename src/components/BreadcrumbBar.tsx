import { ChevronRight, Star } from 'lucide-react';
import { useStore } from '../storeContext';

export function BreadcrumbBar() {
  const { browsePath, activeFolder, folders, setActiveFolder, browseInto } = useStore();

  if (!browsePath) return null;

  const folder = folders.find((f) => f.key === activeFolder);
  const rootPath = folder?.path ?? '';
  const sep = browsePath.includes('\\') ? '\\' : '/';

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
        padding: '8px var(--gutter-window)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        flexWrap: 'wrap',
        fontSize: 12,
      }}
    >
      {/* Root segment */}
      <button onClick={() => setActiveFolder(activeFolder)} title={rootPath} style={crumbBtn}>
        <Star size={11} color="var(--accent)" style={{ flexShrink: 0 }} />
        すべて
      </button>

      <ChevronRight size={11} color="var(--text-muted)" />

      <button onClick={() => setActiveFolder(activeFolder)} title={rootPath} style={crumbBtn}>
        {folder?.label ?? activeFolder}
      </button>

      {segments.map((seg, i) => {
        const segPath = rootPath + sep + segments.slice(0, i + 1).join(sep);
        const isLast = i === segments.length - 1;
        return (
          <span key={segPath} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ChevronRight size={11} color="var(--text-muted)" />
            {isLast ? (
              <span style={crumbCurrent}>
                {seg}
              </span>
            ) : (
              <button onClick={() => browseInto(segPath)} title={segPath} style={crumbBtn}>
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
  borderRadius: 'var(--radius-sm)',
  fontSize: 12,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
};

const crumbCurrent: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-primary)',
  fontWeight: 600,
  padding: '2px 4px',
};
