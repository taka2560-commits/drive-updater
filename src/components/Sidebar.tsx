import { useState } from 'react';
import { Monitor, FileText, Download, Folder, Plus, RefreshCw, Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStore } from '../storeContext';
import type { FolderKey, PeriodFilter } from '../types';
import type { ThemeName } from '../theme/tokens';

const FOLDER_ICONS: Record<string, LucideIcon> = {
  desktop: Monitor,
  documents: FileText,
  downloads: Download,
  folder: Folder,
};

const PERIODS: { id: PeriodFilter; label: string }[] = [
  { id: '1d', label: '24 時間' },
  { id: '7d', label: '1 週間' },
  { id: '14d', label: '2 週間' },
  { id: '30d', label: '1 か月' },
];

const THEME_SWATCHES: { id: ThemeName; color: string; label: string }[] = [
  { id: 'earth', color: '#E8A05A', label: 'Earth' },
  { id: 'night', color: '#5286FF', label: 'Night' },
  { id: 'light', color: '#FF7A69', label: 'Light' },
];

export function Sidebar() {
  const {
    activeFolder,
    setActiveFolder,
    allFiles,
    screen,
    setScreen,
    folders,
    addCustomFolder,
    periodFilter,
    setPeriodFilter,
    theme,
    setTheme,
  } = useStore();

  const standard = folders.filter((f) => f.isStandard);
  const custom = folders.filter((f) => !f.isStandard);
  const countFor = (key: FolderKey) => allFiles.filter((f) => f.folder === key && !f.isDir).length;

  const goFolder = (key: FolderKey) => {
    setActiveFolder(key);
    setScreen('main');
  };

  const isFolderActive = (key: FolderKey) => screen === 'main' && activeFolder === key;

  const handleAdd = async () => {
    const api = (window as unknown as { localUpdater?: { selectFolder: () => Promise<{ name: string; path: string } | null> } }).localUpdater;
    if (api?.selectFolder) {
      const result = await api.selectFolder();
      if (result) addCustomFolder(result.name, result.path);
    }
  };

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand strip */}
      <div
        style={{
          padding: '16px 14px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: 'var(--accent)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--text-on-accent)',
          }}
        >
          <RefreshCw size={11} strokeWidth={2.25} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
            LocalUpdater
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            最近更新されたファイル
          </span>
        </div>
      </div>

      {/* Folders + Period */}
      <div style={{ padding: '12px 8px', flex: 1, overflow: 'auto' }}>
        {/* Section: 監視中フォルダ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px 6px',
          }}
        >
          <SectionLabel>監視中フォルダ</SectionLabel>
          <button
            onClick={handleAdd}
            title="フォルダを追加"
            style={{
              width: 20,
              height: 20,
              borderRadius: 3,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <Plus size={13} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {standard.map((f) => (
            <SidebarItem
              key={f.key}
              Icon={FOLDER_ICONS[f.icon] ?? Folder}
              label={f.label}
              count={countFor(f.key)}
              selected={isFolderActive(f.key)}
              onClick={() => goFolder(f.key)}
            />
          ))}
          {custom.map((f) => (
            <SidebarItem
              key={f.key}
              Icon={Folder}
              label={f.label}
              count={countFor(f.key)}
              selected={isFolderActive(f.key)}
              onClick={() => goFolder(f.key)}
            />
          ))}
        </div>

        {/* Section: 表示期間 */}
        <div style={{ marginTop: 18, padding: '4px 8px 6px' }}>
          <SectionLabel>表示期間</SectionLabel>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {PERIODS.map((p) => (
            <SidebarItem
              key={p.id}
              Icon={Calendar}
              label={p.label}
              selected={periodFilter === p.id}
              onClick={() => setPeriodFilter(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Theme footer */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginRight: 4,
          }}
        >
          テーマ
        </span>
        {THEME_SWATCHES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            aria-label={t.label}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: t.color,
              border: theme === t.id ? '2px solid var(--text-primary)' : '2px solid transparent',
              outline: theme === t.id ? '1px solid var(--accent)' : 'none',
              outlineOffset: 1,
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

function SidebarItem({
  Icon,
  label,
  count,
  selected = false,
  onClick,
}: {
  Icon: LucideIcon;
  label: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: '100%',
        height: 28,
        padding: '0 8px',
        borderRadius: 'var(--radius-md)',
        background: selected ? 'var(--accent-soft)' : hover ? 'var(--surface-hover)' : 'transparent',
        border: 'none',
        position: 'relative',
        color: selected ? 'var(--text-accent)' : 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: selected ? 600 : 500,
        letterSpacing: '0.01em',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
    >
      {selected && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            bottom: 4,
            width: 2,
            borderRadius: 2,
            background: 'var(--accent)',
          }}
        />
      )}
      <span style={{ color: selected ? 'var(--accent)' : 'var(--text-muted)', display: 'inline-flex' }}>
        <Icon size={14} />
      </span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: selected ? 'var(--text-accent)' : 'var(--text-muted)',
            opacity: 0.85,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
