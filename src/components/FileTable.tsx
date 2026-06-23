import { useState, type CSSProperties } from 'react';
import { Star, ChevronsUpDown, ChevronUp, ChevronDown, Folder, ChevronRight } from 'lucide-react';
import { useStore } from '../storeContext';
import { fileMeta } from '../lib/fileType';
import { formatBytes, formatRelativeTime, isRecent } from '../lib/format';
import type { FileEntry, SortKey } from '../types';

const TH: CSSProperties = {
  padding: '10px 8px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-head-text)',
  letterSpacing: '0.04em',
  userSelect: 'none',
  cursor: 'pointer',
};

export function FileTable() {
  const {
    filteredFiles,
    selectedPath,
    setSelected,
    isStarred,
    toggleStar,
    sortKey,
    sortDir,
    toggleSort,
    isScanning,
    folders,
    browseInto,
  } = useStore();

  if (isScanning && filteredFiles.length === 0) {
    return <Skeleton />;
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--color-bg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface-2)', zIndex: 5 }}>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ ...TH, padding: '10px 8px 10px 16px', width: 32, cursor: 'default' }} />
            <SortHeader label="ファイル名" col="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
            <th style={{ ...TH, width: 110, cursor: 'default' }}>フォルダ</th>
            <SortHeader label="サイズ" col="size" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" width={80} />
            <SortHeader label="更新" col="modified" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width={130} padRight />
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((f) =>
            f.isDir ? (
              <FolderRow
                key={f.path}
                file={f}
                selected={selectedPath === f.path}
                onSelect={() => setSelected(f.path)}
                onOpen={() => browseInto(f.path)}
                folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
              />
            ) : (
              <Row
                key={f.path}
                file={f}
                selected={selectedPath === f.path}
                starred={isStarred(f.path)}
                onSelect={() => setSelected(f.path)}
                onToggleStar={() => toggleStar(f.path)}
                folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
              />
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortHeader({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  align = 'left',
  width,
  padRight = false,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
  align?: 'left' | 'right';
  width?: number;
  padRight?: boolean;
}) {
  const activeSort = sortKey === col;
  const Indicator = !activeSort ? ChevronsUpDown : sortDir === 'asc' ? ChevronUp : ChevronDown;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        ...TH,
        width,
        textAlign: align,
        padding: padRight ? '10px 16px 10px 8px' : '10px 8px',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        <Indicator size={11} color={activeSort ? 'var(--color-accent)' : 'var(--color-disabled)'} />
      </span>
    </th>
  );
}

// フォルダ行（ダブルクリックまたは矢印アイコンでドリルダウン）
function FolderRow({
  file,
  selected,
  onSelect,
  onOpen,
  folderLabel,
}: {
  file: FileEntry;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  folderLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const rowBg = selected
    ? 'rgba(var(--accent-rgb), 0.08)'
    : hovered
      ? 'var(--color-surface-2)'
      : 'transparent';

  return (
    <tr
      role="row"
      aria-selected={selected}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(127,127,127,0.18)',
        background: rowBg,
        cursor: 'pointer',
        height: 36,
      }}
    >
      {/* Star column (empty for folders) */}
      <td style={{ padding: '8px 8px 8px 16px', textAlign: 'center' }} />
      {/* Name column */}
      <td style={{ padding: '8px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Folder size={15} color="var(--color-head-text)" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              color: 'var(--color-head-text)',
              fontWeight: selected ? 700 : 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 380,
            }}
          >
            {file.name}
          </span>
          {hovered && (
            <ChevronRight size={12} color="var(--color-disabled)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          )}
        </div>
      </td>
      {/* Folder label */}
      <td style={{ padding: '8px 8px', fontSize: 11, color: 'var(--color-muted)' }}>{folderLabel}</td>
      {/* Size: — for folders */}
      <td style={{ padding: '8px 8px', fontSize: 11, color: 'var(--color-disabled)', textAlign: 'right' }}>—</td>
      {/* Modified date */}
      <td style={{ padding: '8px 16px 8px 8px', fontSize: 11, color: 'var(--color-muted)' }}>
        {formatRelativeTime(file.modifiedAt)}
      </td>
    </tr>
  );
}

function Row({
  file,
  selected,
  starred,
  onSelect,
  onToggleStar,
  folderLabel,
}: {
  file: FileEntry;
  selected: boolean;
  starred: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
  folderLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const meta = fileMeta(file.ext);
  const recent = isRecent(file.modifiedAt);

  const rowBg = selected
    ? 'rgba(var(--accent-rgb), 0.10)'
    : hovered
      ? 'var(--color-surface-2)'
      : 'transparent';

  return (
    <tr
      role="row"
      aria-selected={selected}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(127,127,127,0.18)',
        background: rowBg,
        cursor: 'pointer',
        height: 36,
      }}
    >
      <td style={{ padding: '8px 8px 8px 16px', textAlign: 'center' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          aria-label={starred ? 'スターを外す' : 'スターを付ける'}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
        >
          <Star
            size={13}
            color={starred ? 'var(--color-accent)' : 'var(--color-disabled)'}
            fill={starred ? 'var(--color-accent)' : 'none'}
          />
        </button>
      </td>
      <td style={{ padding: '8px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <meta.Icon size={15} color={meta.color} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              color: 'var(--color-text)',
              fontWeight: selected ? 700 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 380,
            }}
          >
            {file.name}
          </span>
        </div>
      </td>
      <td style={{ padding: '8px 8px', fontSize: 11, color: 'var(--color-muted)' }}>{folderLabel}</td>
      <td
        style={{
          padding: '8px 8px',
          fontSize: 11,
          color: 'var(--color-muted)',
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {formatBytes(file.sizeBytes)}
      </td>
      <td
        style={{
          padding: '8px 16px 8px 8px',
          fontSize: 11,
          color: recent ? 'var(--color-accent)' : 'var(--color-muted)',
        }}
      >
        {formatRelativeTime(file.modifiedAt)}
      </td>
    </tr>
  );
}

function Skeleton() {
  return (
    <div style={{ flex: 1, overflow: 'hidden', background: 'var(--color-bg)', padding: '8px 16px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="blink"
          style={{
            height: 20,
            margin: '8px 0',
            borderRadius: 4,
            background: 'var(--color-surface-2)',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
