import { useEffect, useState } from 'react';
import {
  Star,
  Folder,
  ExternalLink,
  FolderOpen,
  Copy,
  Pencil,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import type { FileEntry } from '../types';

function api() {
  return (window as unknown as { localUpdater?: Window['localUpdater'] }).localUpdater;
}

export interface MenuState {
  x: number;
  y: number;
  file: FileEntry;
}

export function ContextMenu({
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
  Icon: LucideIcon;
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
