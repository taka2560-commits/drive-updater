import { useMemo, useState } from 'react';
import { Star, Folder } from 'lucide-react';
import { useStore } from '../storeContext';
import { FileTypeBadge } from './FileTypeBadge';
import { ContextMenu, type MenuState } from './ContextMenu';
import { groupByTime } from '../lib/grouping';
import { formatBytes, formatRelativeTime, isRecent } from '../lib/format';
import type { FileEntry } from '../types';

export function FileGroupList() {
  const {
    filteredFiles,
    folders,
    isStarred,
    toggleStar,
    browseInto,
    selectOne,
    selectedPaths,
    setEditingPath,
    requestDelete,
  } = useStore();

  const [menu, setMenu] = useState<MenuState | null>(null);

  const openMenu = (e: React.MouseEvent, file: FileEntry) => {
    e.preventDefault();
    if (!selectedPaths.has(file.path)) selectOne(file.path);
    setMenu({ x: e.clientX, y: e.clientY, file });
  };

  const dirs = useMemo(() => filteredFiles.filter((f) => f.isDir), [filteredFiles]);
  const files = useMemo(() => filteredFiles.filter((f) => !f.isDir), [filteredFiles]);
  const groups = useMemo(() => groupByTime(files), [files]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 32px 32px' }}>
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* Vertical rail */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 10,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'linear-gradient(to bottom, var(--border-subtle), var(--border) 40%, var(--border-subtle))',
            borderRadius: 1,
          }}
        />

        {/* Folder section */}
        {dirs.length > 0 && (
          <TimelineSection
            label="フォルダ"
            subLabel={`${dirs.length} 件`}
            count={dirs.length}
            isToday={false}
          >
            {dirs.map((f) => (
              <FolderCard
                key={f.path}
                file={f}
                folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
                onOpen={() => browseInto(f.path)}
                onContextMenu={(e) => openMenu(e, f)}
              />
            ))}
          </TimelineSection>
        )}

        {/* Time-bucketed file sections */}
        {groups.map((g) => (
          <TimelineSection
            key={g.key}
            label={g.label}
            subLabel={
              g.key === 'today'
                ? new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
                : `${g.files.length} 件 / ${formatBytes(g.totalBytes)}`
            }
            count={g.files.length}
            isToday={g.key === 'today'}
          >
            {g.files.map((f) => (
              <TimelineFileCard
                key={f.path}
                file={f}
                folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
                starred={isStarred(f.path)}
                onSelect={() => selectOne(f.path)}
                onToggleStar={() => toggleStar(f.path)}
                onContextMenu={(e) => openMenu(e, f)}
              />
            ))}
          </TimelineSection>
        ))}
      </div>

      {menu && (
        <ContextMenu
          state={menu}
          starred={isStarred(menu.file.path)}
          onClose={() => setMenu(null)}
          onOpenFolder={() => browseInto(menu.file.path)}
          onToggleStar={() => toggleStar(menu.file.path)}
          onRename={() => setEditingPath(menu.file.path)}
          onDelete={() => requestDelete([menu.file.path])}
        />
      )}
    </div>
  );
}

function TimelineSection({
  label,
  subLabel,
  count,
  isToday,
  children,
}: {
  label: string;
  subLabel: string;
  count: number;
  isToday: boolean;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 24, position: 'relative' }}>
      {/* Day node */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: -32,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: isToday ? 'var(--accent)' : 'var(--surface-elevated)',
            border: isToday ? 'none' : '1px solid var(--border)',
            color: isToday ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 600,
            flexShrink: 0,
            boxShadow: isToday ? '0 0 0 4px var(--accent-soft)' : 'none',
          }}
        >
          {count}
        </span>
        <div style={{ marginLeft: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '0.01em',
            }}
          >
            {label}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {subLabel}
          </span>
        </div>
      </div>

      {/* File cluster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 4 }}>
        {children}
      </div>
    </section>
  );
}

function TimelineFileCard({
  file,
  folderLabel,
  starred,
  onSelect,
  onToggleStar,
  onContextMenu,
}: {
  file: FileEntry;
  folderLabel: string;
  starred: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  const recent = isRecent(file.modifiedAt);

  return (
    <article
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        borderColor: hover ? 'var(--border)' : undefined,
      }}
    >
      <FileTypeBadge ext={file.ext} size={28} showLabel={false} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </span>
          {recent && (
            <span
              style={{
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                background: 'var(--accent-soft)',
                padding: '1px 5px',
                borderRadius: 3,
                letterSpacing: '0.08em',
                flexShrink: 0,
              }}
            >
              NEW
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {folderLabel}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: recent ? 'var(--accent)' : 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
            {formatRelativeTime(file.modifiedAt)}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
            {formatBytes(file.sizeBytes)}
          </div>
        </div>
      </div>
    </article>
  );
}

function FolderCard({
  file,
  folderLabel,
  onOpen,
  onContextMenu,
}: {
  file: FileEntry;
  folderLabel: string;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onOpen}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        borderColor: hover ? 'var(--border)' : undefined,
      }}
    >
      <Folder size={22} color="var(--text-brand)" />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-brand)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          フォルダ · {folderLabel}
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        {formatRelativeTime(file.modifiedAt)}
      </span>
    </article>
  );
}
