import { useMemo } from 'react';
import { Star, Monitor, FileText, Download, Folder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Window } from '../components/Window';
import { Sidebar } from '../components/Sidebar';
import { EmptyState } from '../components/EmptyState';
import { useStore } from '../storeContext';
import { fileMeta } from '../lib/fileType';
import { formatBytes, formatRelativeTime, isRecent } from '../lib/format';
import type { FileEntry } from '../types';

const FOLDER_ICON: Record<string, LucideIcon> = {
  desktop: Monitor,
  documents: FileText,
  downloads: Download,
  folder: Folder,
};

export function StarredScreen() {
  const { allFiles, starred, setSelected, setScreen, toggleStar, folders } = useStore();

  const starredFiles = useMemo(
    () => allFiles.filter((f) => starred.has(f.path) && !f.isDir),
    [allFiles, starred],
  );

  // Group by folder, preserving sidebar folder order.
  const groups = useMemo(() => {
    return folders.map((folder) => ({
      folder,
      files: starredFiles
        .filter((f) => f.folder === folder.key)
        .sort((a, b) => b.modifiedAt - a.modifiedAt),
    })).filter((g) => g.files.length > 0);
  }, [starredFiles, folders]);

  const open = (path: string) => {
    setSelected(path);
    setScreen('main');
  };

  return (
    <Window
      title={
        <>
          <Star size={11} color="var(--color-accent)" fill="var(--color-accent)" />
          LocalUpdater — スター付き ({starred.size})
        </>
      }
    >
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '18px 24px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              スター付きファイル
            </h1>
            <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
              {starred.size}件 · 全フォルダ横断
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: '4px 0 0', lineHeight: 1.5 }}>
            頻繁にアクセスするファイル。プロジェクトをまたいで一覧表示します。
          </p>
        </div>

        {starredFiles.length === 0 ? (
          <EmptyState variant="starred" />
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
            {groups.map(({ folder, files }) => (
              <Group key={folder.key} icon={folder.icon} label={folder.label} count={files.length}>
                {files.map((f, i) => (
                  <StarredRow
                    key={f.path}
                    file={f}
                    last={i === files.length - 1}
                    onOpen={() => open(f.path)}
                    onUnstar={() => toggleStar(f.path)}
                  />
                ))}
              </Group>
            ))}
          </div>
        )}
      </div>
    </Window>
  );
}

function Group({
  icon,
  label,
  count,
  children,
}: {
  icon: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  const Icon = FOLDER_ICON[icon] ?? FOLDER_ICON['folder'];
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={12} color="var(--color-head-text)" />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-head-text)', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        <span style={{ fontSize: 10, color: 'var(--color-disabled)' }}>{count}件</span>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function StarredRow({
  file,
  last,
  onOpen,
  onUnstar,
}: {
  file: FileEntry;
  last: boolean;
  onOpen: () => void;
  onUnstar: () => void;
}) {
  const meta = fileMeta(file.ext);
  const recent = isRecent(file.modifiedAt);
  return (
    <div
      onClick={onOpen}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 14px',
        borderBottom: last ? 'none' : '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUnstar();
        }}
        aria-label="スターを外す"
        style={{ background: 'none', border: 'none', padding: 0, marginRight: 12, cursor: 'pointer', display: 'inline-flex' }}
      >
        <Star size={13} color="var(--color-accent)" fill="var(--color-accent)" />
      </button>
      <meta.Icon size={15} color={meta.color} style={{ marginRight: 10, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {file.name}
      </span>
      <span style={{ fontSize: 11, color: 'var(--color-muted)', marginRight: 14, fontFamily: 'var(--font-mono)' }}>
        {formatBytes(file.sizeBytes)}
      </span>
      <span style={{ fontSize: 11, color: recent ? 'var(--color-accent)' : 'var(--color-muted)', width: 80, textAlign: 'right' }}>
        {formatRelativeTime(file.modifiedAt)}
      </span>
    </div>
  );
}
