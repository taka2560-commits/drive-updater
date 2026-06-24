import { Star, Folder } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import { useStore } from '../storeContext';
import { fileMeta } from '../lib/fileType';
import { formatBytes, formatRelativeTime, isRecent } from '../lib/format';
import type { FileEntry, SortKey } from '../types';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'modified', label: '更新日' },
  { key: 'name', label: '名前' },
  { key: 'size', label: 'サイズ' },
];

/** C-layout: card-style rows; clicking a file opens the modal. */
export function FileListC() {
  const {
    filteredFiles,
    folders,
    selectedPath,
    selectedPaths,
    setSelected,
    selectOne,
    toggleInSelection,
    selectRange,
    isStarred,
    toggleStar,
    browseInto,
    sortKey,
    sortDir,
    toggleSort,
  } = useStore();

  // ⌘/Shift click → multi-select (no modal); plain click → open modal / drill-in.
  const onRowClick = (e: React.MouseEvent, f: FileEntry) => {
    if (e.metaKey || e.ctrlKey) {
      toggleInSelection(f.path);
    } else if (e.shiftKey) {
      selectRange(f.path, filteredFiles.map((x) => x.path));
    } else if (f.isDir) {
      browseInto(f.path);
    } else {
      selectOne(f.path);
      setSelected(f.path); // open detail modal
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-bg)', overflow: 'hidden' }}>
      {/* Sort toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px 10px' }}>
        <span style={{ fontSize: 11, color: 'var(--color-muted)', marginRight: 2 }}>並び順:</span>
        {SORTS.map((s) => {
          const active = sortKey === s.key;
          return (
            <button
              key={s.key}
              onClick={() => toggleSort(s.key)}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: active ? 'var(--color-surface)' : 'transparent',
                color: active ? 'var(--color-text)' : 'var(--color-muted)',
                fontWeight: active ? 700 : 400,
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {s.label}
              {active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
            </button>
          );
        })}
      </div>

      <Virtuoso
        style={{ flex: 1 }}
        data={filteredFiles}
        computeItemKey={(_, f) => f.path}
        itemContent={(_, f) => (
          <div style={{ padding: '0 24px 6px' }}>
            <RowC
              file={f}
              folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
              selected={selectedPaths.has(f.path) || selectedPath === f.path}
              starred={!f.isDir && isStarred(f.path)}
              onClick={(e) => onRowClick(e, f)}
              onToggleStar={() => toggleStar(f.path)}
            />
          </div>
        )}
      />
    </div>
  );
}

function RowC({
  file,
  folderLabel,
  selected,
  starred,
  onClick,
  onToggleStar,
}: {
  file: FileEntry;
  folderLabel: string;
  selected: boolean;
  starred: boolean;
  onClick: (e: React.MouseEvent) => void;
  onToggleStar: () => void;
}) {
  const meta = fileMeta(file.ext);
  const recent = isRecent(file.modifiedAt);

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 44,
        padding: '0 14px',
        background: 'var(--color-surface)',
        border: selected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
        borderRadius: 8,
        cursor: 'pointer',
      }}
    >
      {file.isDir ? (
        <Folder size={18} color="var(--color-head-text)" style={{ flexShrink: 0 }} />
      ) : (
        <meta.Icon size={18} color={meta.color} style={{ flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: file.isDir ? 'var(--color-head-text)' : 'var(--color-text)',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-muted)' }}>
          {file.isDir ? 'フォルダ' : `${formatBytes(file.sizeBytes)} · ${meta.label}`} · {folderLabel}
        </div>
      </div>
      {!file.isDir && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          aria-label={starred ? 'スターを外す' : 'スターを付ける'}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
        >
          <Star size={14} color={starred ? 'var(--color-accent)' : 'var(--color-disabled)'} fill={starred ? 'var(--color-accent)' : 'none'} />
        </button>
      )}
      <span style={{ fontSize: 11, color: recent ? 'var(--color-accent)' : 'var(--color-muted)', width: 64, textAlign: 'right' }}>
        {formatRelativeTime(file.modifiedAt)}
      </span>
    </div>
  );
}
