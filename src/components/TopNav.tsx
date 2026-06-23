import { Monitor, FileText, Download, Folder, Plus, Star, Settings, RefreshCw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStore } from '../storeContext';
import type { FolderKey } from '../types';

const FOLDER_ICONS: Record<string, LucideIcon> = {
  desktop: Monitor,
  documents: FileText,
  downloads: Download,
  folder: Folder,
};

/** B-layout top navigation: brand + folder tabs + actions (replaces sidebar). */
export function TopNav() {
  const {
    folders,
    activeFolder,
    setActiveFolder,
    allFiles,
    screen,
    setScreen,
    starred,
    addCustomFolder,
  } = useStore();

  const countFor = (key: FolderKey) => allFiles.filter((f) => f.folder === key && !f.isDir).length;

  const handleAdd = async () => {
    const api = window.localUpdater;
    if (api?.selectFolder) {
      const result = await api.selectFolder();
      if (result) addCustomFolder(result.name, result.path);
    }
  };

  return (
    <div
      style={{
        height: 56,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '0 18px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 28, marginRight: 24, borderRight: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCw size={15} color="var(--color-bg)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-head-text)', lineHeight: 1.1 }}>
            LocalUpdater
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-disabled)' }}>最近更新</div>
        </div>
      </div>

      {/* Folder tabs */}
      <div
        className="lu-hide-scrollbar"
        style={{ display: 'flex', alignItems: 'stretch', gap: 4, flex: 1, minWidth: 0, overflowX: 'auto', height: '100%' }}
      >
        {folders.map((f) => {
          const Icon = FOLDER_ICONS[f.icon] ?? Folder;
          const active = screen === 'main' && activeFolder === f.key;
          return (
            <button
              key={f.key}
              onClick={() => {
                setActiveFolder(f.key);
                setScreen('main');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 12px',
                height: '100%',
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                color: active ? 'var(--color-text)' : 'var(--color-muted)',
                fontWeight: active ? 700 : 400,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Icon size={12} />
              {f.label}
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: active ? 'var(--color-accent)' : 'transparent',
                  color: active ? 'var(--color-bg)' : 'var(--color-disabled)',
                  fontWeight: active ? 700 : 400,
                }}
              >
                {countFor(f.key)}
              </span>
            </button>
          );
        })}
        <button
          onClick={handleAdd}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '0 10px',
            height: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--color-muted)',
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <Plus size={13} />
          追加
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 12, flexShrink: 0 }}>
        <IconButton active={screen === 'starred'} onClick={() => setScreen('starred')} title="スター付き">
          <Star size={16} color={screen === 'starred' ? 'var(--color-accent)' : 'var(--color-muted)'} fill={screen === 'starred' ? 'var(--color-accent)' : 'none'} />
          {starred.size > 0 && (
            <span style={{ fontSize: 10, color: 'var(--color-muted)', marginLeft: 2 }}>{starred.size}</span>
          )}
        </IconButton>
        <IconButton active={screen === 'settings'} onClick={() => setScreen('settings')} title="設定">
          <Settings size={16} color={screen === 'settings' ? 'var(--color-accent)' : 'var(--color-muted)'} />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 32,
        padding: '0 8px',
        borderRadius: 6,
        border: '1px solid transparent',
        background: active ? 'var(--color-bg)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
