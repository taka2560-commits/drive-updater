import type { ReactNode } from 'react';

export function Window({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        height: '100%',
        background: 'var(--bg-app)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 'var(--titlebar-height)',
          background: 'var(--bg-titlebar)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 10,
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
          // @ts-expect-error -- Electron draggable region
          WebkitAppRegion: 'drag',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <Dot color="#E15453" />
          <Dot color="#E5A43A" />
          <Dot color="#4DBC4A" />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {title}
        </div>
        <div style={{ width: 48 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
  );
}
