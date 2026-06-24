import { useEffect, forwardRef, useState, type CSSProperties } from 'react';
import {
  Star,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Folder,
  ExternalLink,
  FolderOpen,
  Copy,
  Pencil,
  Trash2,
} from 'lucide-react';
import { TableVirtuoso } from 'react-virtuoso';
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

function api() {
  return (window as unknown as { localUpdater?: Window['localUpdater'] }).localUpdater;
}

interface MenuState {
  x: number;
  y: number;
  file: FileEntry;
}

// Context passed to the module-level TableRow component via react-virtuoso's context prop.
interface VTableCtx {
  selectedPath: string | null;
  selectedPaths: Set<string>;
  editingPath: string | null;
  onRowClick: (e: React.MouseEvent, f: FileEntry) => void;
  openMenu: (e: React.MouseEvent, f: FileEntry) => void;
  browseInto: (path: string) => void;
}

// Must be defined at module scope so react-virtuoso receives a stable reference.
// react-virtuoso injects `item` (the data element) plus `context` and the
// data-index / data-item-index / data-known-size attributes it uses to measure
// and track rows — those MUST be forwarded to the <tr>, or only one row renders.
const VTableRow = ({
  context,
  item,
  style,
  ...rest
}: {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  item?: FileEntry;
  context?: VTableCtx;
}) => {
  const [hovered, setHovered] = useState(false);

  if (!context || !item) return <tr style={style} {...rest} />;

  const f = item;
  const isSelected = context.selectedPaths.has(f.path) || context.selectedPath === f.path;

  return (
    <tr
      {...rest}
      style={{
        ...style,
        borderBottom: '1px solid rgba(127,127,127,0.18)',
        cursor: 'pointer',
        height: 36,
        background: isSelected
          ? 'rgba(var(--accent-rgb), 0.08)'
          : hovered
            ? 'var(--color-surface-2)'
            : 'transparent',
      }}
      aria-selected={isSelected}
      onClick={(e) => context.onRowClick(e, f)}
      onDoubleClick={
        context.editingPath === f.path || !f.isDir ? undefined : () => context.browseInto(f.path)
      }
      onContextMenu={(e) => context.openMenu(e, f)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
};

// Stable component overrides for TableVirtuoso — never recreated.
const TABLE_COMPONENTS = {
  Table: ({ style, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <table style={{ ...style, width: '100%', borderCollapse: 'collapse' }} {...props} />
  ),
  TableHead: forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'thead'>>(
    (props, ref) => (
      <thead
        ref={ref}
        style={{ position: 'sticky', top: 0, background: 'var(--color-surface-2)', zIndex: 5 }}
        {...props}
      />
    ),
  ),
  TableBody: forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tbody'>>(
    (props, ref) => <tbody {...props} ref={ref} />,
  ),
  // react-virtuoso injects item + context at runtime; cast bypasses the type mismatch.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TableRow: VTableRow as any,
};

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
    sortKey,
    sortDir,
    toggleSort,
    isScanning,
    folders,
    browseInto,
    viewMode,
    editingPath,
    setEditingPath,
    renameFile,
    requestDelete,
  } = useStore();

  const [menu, setMenu] = useState<MenuState | null>(null);

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

  if (viewMode === 'grid') {
    return (
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--color-bg)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 12,
            padding: 16,
          }}
        >
          {filteredFiles.map((f) => (
            <GridCard
              key={f.path}
              file={f}
              selected={selectedPaths.has(f.path) || selectedPath === f.path}
              starred={!f.isDir && isStarred(f.path)}
              onSelect={(e) => onRowClick(e, f)}
              onOpen={() => (f.isDir ? browseInto(f.path) : selectOne(f.path))}
              onToggleStar={() => toggleStar(f.path)}
              onContextMenu={(e) => openMenu(e, f)}
            />
          ))}
        </div>
        {contextMenuEl}
      </div>
    );
  }

  // List view — virtualized with TableVirtuoso.
  const vtableCtx: VTableCtx = {
    selectedPath,
    selectedPaths,
    editingPath,
    onRowClick,
    openMenu,
    browseInto,
  };

  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-bg)' }}
    >
      <TableVirtuoso<FileEntry, VTableCtx>
        style={{ flex: 1 }}
        data={filteredFiles}
        computeItemKey={(_, f) => f.path}
        context={vtableCtx}
        components={TABLE_COMPONENTS}
        fixedHeaderContent={() => (
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ ...TH, padding: '10px 8px 10px 16px', width: 32, cursor: 'default' }} />
            <SortHeader
              label="ファイル名"
              col="name"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            />
            <th style={{ ...TH, width: 110, cursor: 'default' }}>フォルダ</th>
            <SortHeader
              label="サイズ"
              col="size"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
              align="right"
              width={80}
            />
            <SortHeader
              label="更新"
              col="modified"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
              width={130}
              padRight
            />
          </tr>
        )}
        itemContent={(_, f) => {
          const isSelected = selectedPaths.has(f.path) || selectedPath === f.path;
          const { editing, onRenameCommit, onRenameCancel } = editProps(f);
          const folderLabel = folders.find((fd) => fd.key === f.folder)?.label ?? '';

          if (f.isDir) {
            return (
              <>
                <td style={{ padding: '8px 8px 8px 16px', textAlign: 'center' }} />
                <td style={{ padding: '8px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Folder size={15} color="var(--color-head-text)" style={{ flexShrink: 0 }} />
                    {editing ? (
                      <RenameInput
                        initial={f.name}
                        isDir
                        onCommit={onRenameCommit}
                        onCancel={onRenameCancel}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 13,
                          color: 'var(--color-head-text)',
                          fontWeight: isSelected ? 700 : 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 380,
                        }}
                      >
                        {f.name}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '8px 8px', fontSize: 11, color: 'var(--color-muted)' }}>
                  {folderLabel}
                </td>
                <td
                  style={{
                    padding: '8px 8px',
                    fontSize: 11,
                    color: 'var(--color-disabled)',
                    textAlign: 'right',
                  }}
                >
                  —
                </td>
                <td style={{ padding: '8px 16px 8px 8px', fontSize: 11, color: 'var(--color-muted)' }}>
                  {formatRelativeTime(f.modifiedAt)}
                </td>
              </>
            );
          }

          const meta = fileMeta(f.ext);
          const recent = isRecent(f.modifiedAt);
          return (
            <>
              <td style={{ padding: '8px 8px 8px 16px', textAlign: 'center' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(f.path);
                  }}
                  aria-label={isStarred(f.path) ? 'スターを外す' : 'スターを付ける'}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
                >
                  <Star
                    size={13}
                    color={isStarred(f.path) ? 'var(--color-accent)' : 'var(--color-disabled)'}
                    fill={isStarred(f.path) ? 'var(--color-accent)' : 'none'}
                  />
                </button>
              </td>
              <td style={{ padding: '8px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <meta.Icon size={15} color={meta.color} style={{ flexShrink: 0 }} />
                  {editing ? (
                    <RenameInput
                      initial={f.name}
                      isDir={false}
                      onCommit={onRenameCommit}
                      onCancel={onRenameCancel}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 13,
                        color: 'var(--color-text)',
                        fontWeight: isSelected ? 700 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 380,
                      }}
                    >
                      {f.name}
                    </span>
                  )}
                </div>
              </td>
              <td style={{ padding: '8px 8px', fontSize: 11, color: 'var(--color-muted)' }}>
                {folderLabel}
              </td>
              <td
                style={{
                  padding: '8px 8px',
                  fontSize: 11,
                  color: 'var(--color-muted)',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {formatBytes(f.sizeBytes)}
              </td>
              <td
                style={{
                  padding: '8px 16px 8px 8px',
                  fontSize: 11,
                  color: recent ? 'var(--color-accent)' : 'var(--color-muted)',
                }}
              >
                {formatRelativeTime(f.modifiedAt)}
              </td>
            </>
          );
        }}
      />
      {contextMenuEl}
    </div>
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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
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
          color: 'var(--color-muted)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {file.name}
      </div>

      {file.isDir ? (
        <MenuItem
          Icon={Folder}
          label="フォルダを開く"
          onClick={() => {
            onOpenFolder();
            onClose();
          }}
        />
      ) : (
        <MenuItem
          Icon={ExternalLink}
          label="開く"
          onClick={() => {
            api()?.openPath(file.path);
            onClose();
          }}
        />
      )}

      <MenuItem
        Icon={FolderOpen}
        label="保存場所を開く"
        onClick={() => {
          api()?.showInFolder(file.path);
          onClose();
        }}
      />

      {!file.isDir && (
        <MenuItem
          Icon={Star}
          label={starred ? 'スターを外す' : 'スターをつける'}
          onClick={() => {
            onToggleStar();
            onClose();
          }}
        />
      )}

      <MenuItem
        Icon={Copy}
        label="パスをコピー"
        onClick={() => {
          navigator.clipboard?.writeText(file.path).catch(() => {});
          onClose();
        }}
      />

      <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />

      <MenuItem
        Icon={Pencil}
        label="名前を変更"
        onClick={() => {
          onRename();
          onClose();
        }}
      />
      <MenuItem
        Icon={Trash2}
        label="ゴミ箱に移動"
        danger
        onClick={() => {
          onDelete();
          onClose();
        }}
      />
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
  const color = danger ? '#D46A6A' : 'var(--color-text)';
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
        background: hovered ? 'var(--color-bg)' : 'transparent',
        color,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        borderRadius: 4,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Icon size={14} style={{ flexShrink: 0, color: danger ? '#D46A6A' : 'var(--color-muted)' }} />
      {label}
    </button>
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
        border: '1px solid var(--color-accent)',
        borderRadius: 4,
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        outline: 'none',
      }}
    />
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

function GridCard({
  file,
  selected,
  starred,
  onSelect,
  onOpen,
  onToggleStar,
  onContextMenu,
}: {
  file: FileEntry;
  selected: boolean;
  starred: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
  onToggleStar: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meta = fileMeta(file.ext);
  const recent = isRecent(file.modifiedAt);

  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '16px 10px 12px',
        background: selected ? 'rgba(var(--accent-rgb), 0.10)' : 'var(--color-surface)',
        border: selected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
        borderRadius: 8,
        cursor: 'pointer',
        boxShadow: hovered ? 'var(--shadow-sm)' : 'none',
        transition: 'box-shadow 0.12s, border-color 0.12s',
      }}
    >
      {!file.isDir && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          aria-label={starred ? 'スターを外す' : 'スターを付ける'}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            opacity: starred || hovered ? 1 : 0,
            transition: 'opacity 0.12s',
          }}
        >
          <Star
            size={13}
            color={starred ? 'var(--color-accent)' : 'var(--color-disabled)'}
            fill={starred ? 'var(--color-accent)' : 'none'}
          />
        </button>
      )}

      {file.isDir ? (
        <Folder size={40} color="var(--color-head-text)" />
      ) : (
        <meta.Icon size={40} color={meta.color} />
      )}

      <span
        style={{
          fontSize: 12,
          color: file.isDir ? 'var(--color-head-text)' : 'var(--color-text)',
          fontWeight: file.isDir ? 500 : 400,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.3,
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {file.name}
      </span>

      <span style={{ fontSize: 10, color: recent ? 'var(--color-accent)' : 'var(--color-muted)' }}>
        {file.isDir ? 'フォルダ' : formatBytes(file.sizeBytes)}
      </span>
    </div>
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
