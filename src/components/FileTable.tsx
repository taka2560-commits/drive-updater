import { useEffect, useMemo, useState } from 'react';
import {
  Star,
  Folder,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  Copy,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useStore } from '../storeContext';
import { FileTypeBadge } from './FileTypeBadge';
import { groupByTime } from '../lib/grouping';
import { formatRelativeTime, isRecent } from '../lib/format';
import type { FileEntry } from '../types';

function api() {
  return (window as unknown as { localUpdater?: Window['localUpdater'] }).localUpdater;
}

interface MenuState {
  x: number;
  y: number;
  file: FileEntry;
}

function formatSizeNum(bytes: number): string {
  if (bytes < 1024) return `${bytes}`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return v >= 100 || Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
}

function formatSizeUnit(bytes: number): string {
  if (bytes < 1024) return 'B';
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return units[i];
}

export function FileTable() {
  const {
    filteredFiles,
    selectedPath,
    selectedPaths,
    selectOne,
    toggleInSelection,
    selectRange,
    isStarred,
    toggleStar,
    isScanning,
    folders,
    browseInto,
    editingPath,
    setEditingPath,
    renameFile,
    requestDelete,
  } = useStore();

  const [menu, setMenu] = useState<MenuState | null>(null);

  const dirs = useMemo(() => filteredFiles.filter((f) => f.isDir), [filteredFiles]);
  const files = useMemo(() => filteredFiles.filter((f) => !f.isDir), [filteredFiles]);
  const groups = useMemo(() => groupByTime(files), [files]);

  const onRowClick = (e: React.MouseEvent, file: FileEntry) => {
    if (e.metaKey || e.ctrlKey) toggleInSelection(file.path);
    else if (e.shiftKey) selectRange(file.path, filteredFiles.map((f) => f.path));
    else selectOne(file.path);
  };

  const openMenu = (e: React.MouseEvent, file: FileEntry) => {
    e.preventDefault();
    if (!selectedPaths.has(file.path)) selectOne(file.path);
    setMenu({ x: e.clientX, y: e.clientY, file });
  };

  if (isScanning && filteredFiles.length === 0) {
    return <Skeleton />;
  }

  const contextMenuEl = menu && (
    <ContextMenu
      state={menu}
      starred={isStarred(menu.file.path)}
      onClose={() => setMenu(null)}
      onOpenFolder={() => browseInto(menu.file.path)}
      onToggleStar={() => toggleStar(menu.file.path)}
      onRename={() => setEditingPath(menu.file.path)}
      onDelete={() => requestDelete([menu.file.path])}
    />
  );

  const editProps = (file: FileEntry) => ({
    editing: editingPath === file.path,
    onRenameCommit: (name: string) => {
      renameFile(file.path, name);
      setEditingPath(null);
    },
    onRenameCancel: () => setEditingPath(null),
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
      {/* Folder section */}
      {dirs.length > 0 && (
        <section style={{ marginTop: 4 }}>
          <BucketHeader label="フォルダ" count={dirs.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {dirs.map((f) => (
              <FolderRow
                key={f.path}
                file={f}
                selected={selectedPaths.has(f.path) || selectedPath === f.path}
                onSelect={(e) => onRowClick(e, f)}
                onOpen={() => browseInto(f.path)}
                onContextMenu={(e) => openMenu(e, f)}
                {...editProps(f)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Time-bucketed file sections */}
      {groups.map((g) => (
        <section key={g.key} style={{ marginTop: 12 }}>
          <BucketHeader label={g.label} count={g.files.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {g.files.map((f) => (
              <FileRow
                key={f.path}
                file={f}
                selected={selectedPaths.has(f.path) || selectedPath === f.path}
                starred={isStarred(f.path)}
                onSelect={(e) => onRowClick(e, f)}
                onToggleStar={() => toggleStar(f.path)}
                onContextMenu={(e) => openMenu(e, f)}
                folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
                {...editProps(f)}
              />
            ))}
          </div>
        </section>
      ))}

      {contextMenuEl}
    </div>
  );
}

function BucketHeader({ label, count }: { label: string; count: number }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '8px 12px',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-app)',
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-muted)',
        }}
      >
        {count} 件
      </span>
    </header>
  );
}

function FileRow({
  file,
  selected,
  starred,
  onSelect,
  onToggleStar,
  onContextMenu,
  folderLabel,
  editing,
  onRenameCommit,
  onRenameCancel,
}: {
  file: FileEntry;
  selected: boolean;
  starred: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onToggleStar: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  folderLabel: string;
  editing: boolean;
  onRenameCommit: (name: string) => void;
  onRenameCancel: () => void;
}) {
  const [hover, setHover] = useState(false);
  const recent = isRecent(file.modifiedAt);

  return (
    <div
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto',
        alignItems: 'center',
        gap: 12,
        height: 36,
        padding: '0 12px',
        borderRadius: 'var(--radius-sm)',
        background: selected ? 'var(--accent-soft)' : hover ? 'var(--surface-hover)' : 'transparent',
        cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
    >
      <FileTypeBadge ext={file.ext} size={22} showLabel={false} />
      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {editing ? (
          <RenameInput initial={file.name} isDir={false} onCommit={onRenameCommit} onCancel={onRenameCancel} />
        ) : (
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </span>
        )}
        {recent && !editing && (
          <span
            style={{
              fontSize: 9,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--accent-soft)',
              padding: '1px 5px',
              borderRadius: 3,
              letterSpacing: '0.08em',
              lineHeight: 1.4,
              flexShrink: 0,
            }}
          >
            NEW
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 160,
        }}
        title={folderLabel}
      >
        {folderLabel}
      </span>
      <span
        style={{
          textAlign: 'right',
          minWidth: 76,
          display: 'inline-flex',
          alignItems: 'baseline',
          justifyContent: 'flex-end',
          gap: 3,
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
          {formatSizeNum(file.sizeBytes)}
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          {formatSizeUnit(file.sizeBytes)}
        </span>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80, justifyContent: 'flex-end' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
          aria-label={starred ? 'スターを外す' : 'スターを付ける'}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            display: 'inline-flex', opacity: starred || hover ? 1 : 0,
            transition: 'opacity var(--dur-fast) var(--ease-out)',
          }}
        >
          <Star
            size={13}
            color={starred ? 'var(--accent)' : 'var(--text-muted)'}
            fill={starred ? 'var(--accent)' : 'none'}
          />
        </button>
        <span style={{ fontSize: 11, color: recent ? 'var(--accent)' : 'var(--text-muted)', minWidth: 52, textAlign: 'right' }}>
          {formatRelativeTime(file.modifiedAt)}
        </span>
      </div>
    </div>
  );
}

function FolderRow({
  file,
  selected,
  onSelect,
  onOpen,
  onContextMenu,
  editing,
  onRenameCommit,
  onRenameCancel,
}: {
  file: FileEntry;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  editing: boolean;
  onRenameCommit: (name: string) => void;
  onRenameCancel: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onSelect}
      onDoubleClick={editing ? undefined : onOpen}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 12,
        height: 36,
        padding: '0 12px',
        borderRadius: 'var(--radius-sm)',
        background: selected ? 'var(--accent-soft)' : hover ? 'var(--surface-hover)' : 'transparent',
        cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
    >
      <Folder size={18} color="var(--text-brand)" style={{ flexShrink: 0 }} />
      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {editing ? (
          <RenameInput initial={file.name} isDir onCommit={onRenameCommit} onCancel={onRenameCancel} />
        ) : (
          <span
            style={{
              fontSize: 13,
              fontWeight: selected ? 700 : 500,
              color: 'var(--text-brand)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </span>
        )}
        {hover && !editing && (
          <ChevronRight size={12} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
        )}
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        {formatRelativeTime(file.modifiedAt)}
      </span>
    </div>
  );
}

function RenameInput({
  initial,
  isDir,
  onCommit,
  onCancel,
}: {
  initial: string;
  isDir: boolean;
  onCommit: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onFocus={(e) => {
        const dot = isDir ? -1 : initial.lastIndexOf('.');
        e.currentTarget.setSelectionRange(0, dot > 0 ? dot : initial.length);
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') onCommit(value);
        else if (e.key === 'Escape') onCancel();
      }}
      onBlur={() => onCommit(value)}
      style={{
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        fontFamily: 'var(--font-sans)',
        padding: '2px 6px',
        border: '1px solid var(--accent)',
        borderRadius: 4,
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        outline: 'none',
      }}
    />
  );
}

function ContextMenu({
  state,
  starred,
  onClose,
  onOpenFolder,
  onToggleStar,
  onRename,
  onDelete,
}: {
  state: MenuState;
  starred: boolean;
  onClose: () => void;
  onOpenFolder: () => void;
  onToggleStar: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const { x, y, file } = state;

  useEffect(() => {
    const onDown = () => onClose();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 100,
        padding: 4,
        minWidth: 190,
      }}
    >
      <div
        style={{
          padding: '7px 12px 8px',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)',
          marginBottom: 4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {file.name}
      </div>

      {file.isDir ? (
        <MenuItem Icon={Folder} label="フォルダを開く" onClick={() => { onOpenFolder(); onClose(); }} />
      ) : (
        <MenuItem Icon={ExternalLink} label="開く" onClick={() => { api()?.openPath(file.path); onClose(); }} />
      )}
      <MenuItem Icon={FolderOpen} label="保存場所を開く" onClick={() => { api()?.showInFolder(file.path); onClose(); }} />
      {!file.isDir && (
        <MenuItem Icon={Star} label={starred ? 'スターを外す' : 'スターをつける'} onClick={() => { onToggleStar(); onClose(); }} />
      )}
      <MenuItem Icon={Copy} label="パスをコピー" onClick={() => { navigator.clipboard?.writeText(file.path).catch(() => {}); onClose(); }} />
      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
      <MenuItem Icon={Pencil} label="名前を変更" onClick={() => { onRename(); onClose(); }} />
      <MenuItem Icon={Trash2} label="ゴミ箱に移動" danger onClick={() => { onDelete(); onClose(); }} />
    </div>
  );
}

function MenuItem({
  Icon,
  label,
  onClick,
  danger = false,
}: {
  Icon: typeof Copy;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const color = danger ? 'var(--danger)' : 'var(--text-primary)';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '7px 12px',
        fontSize: 12,
        border: 'none',
        background: hovered ? 'var(--surface-hover)' : 'transparent',
        color,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Icon size={14} style={{ flexShrink: 0, color: danger ? 'var(--danger)' : 'var(--text-muted)' }} />
      {label}
    </button>
  );
}

function Skeleton() {
  return (
    <div style={{ flex: 1, overflow: 'hidden', padding: '8px 16px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="blink"
          style={{
            height: 20,
            margin: '8px 0',
            borderRadius: 4,
            background: 'var(--surface-elevated)',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
