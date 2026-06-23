import { useMemo, useState } from 'react';
import { Star, ChevronDown, ChevronUp, ExternalLink, FolderOpen, Copy } from 'lucide-react';
import { useStore } from '../storeContext';
import { groupByTime, type FileGroup } from '../lib/grouping';
import { fileMeta } from '../lib/fileType';
import { formatBytes, formatRelativeTime, formatDateTime, isRecent } from '../lib/format';
import { Button } from './ui';
import type { FileEntry } from '../types';

/** B-layout: time-grouped, accordion-expandable file cards. */
export function FileGroupList() {
  const { filteredFiles, folders, isStarred, toggleStar, browseInto } = useStore();
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const groups = useMemo(() => groupByTime(filteredFiles), [filteredFiles]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)', padding: '8px 32px 24px' }}>
      {groups.map((g) => (
        <div key={g.key} style={{ marginTop: 16 }}>
          <GroupHeader group={g} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {g.files.map((f) => (
              <FileCard
                key={f.path}
                file={f}
                folderLabel={folders.find((fd) => fd.key === f.folder)?.label ?? ''}
                expanded={expandedPath === f.path}
                starred={!f.isDir && isStarred(f.path)}
                onToggle={() => setExpandedPath((prev) => (prev === f.path ? null : f.path))}
                onOpen={() => (f.isDir ? browseInto(f.path) : window.localUpdater?.openPath(f.path))}
                onToggleStar={() => toggleStar(f.path)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GroupHeader({ group }: { group: FileGroup }) {
  const accent = group.key === 'today';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 28 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>{group.label}</span>
      {group.subLabel && (
        <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{group.subLabel}</span>
      )}
      <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
      <span style={{ fontSize: 11, color: accent ? 'var(--color-accent)' : 'var(--color-muted)' }}>
        {group.files.length}件 · {formatBytes(group.totalBytes)}
      </span>
    </div>
  );
}

function FileCard({
  file,
  folderLabel,
  expanded,
  starred,
  onToggle,
  onOpen,
  onToggleStar,
}: {
  file: FileEntry;
  folderLabel: string;
  expanded: boolean;
  starred: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onToggleStar: () => void;
}) {
  const meta = fileMeta(file.ext);
  const recent = isRecent(file.modifiedAt);

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: expanded ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: expanded ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {/* Collapsed row */}
      <div
        onClick={onToggle}
        onDoubleClick={onOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          height: 64,
          padding: '12px 18px',
          cursor: 'pointer',
        }}
      >
        <meta.Icon size={22} color={meta.color} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              color: 'var(--color-text)',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
            {file.isDir ? 'フォルダ' : `${meta.label} · ${formatBytes(file.sizeBytes)}`} · {folderLabel}
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
            <Star
              size={15}
              color={starred ? 'var(--color-accent)' : 'var(--color-disabled)'}
              fill={starred ? 'var(--color-accent)' : 'none'}
            />
          </button>
        )}
        <span style={{ fontSize: 12, color: recent ? 'var(--color-accent)' : 'var(--color-muted)', width: 70, textAlign: 'right' }}>
          {formatRelativeTime(file.modifiedAt)}
        </span>
        {expanded ? (
          <ChevronUp size={16} color="var(--color-muted)" />
        ) : (
          <ChevronDown size={16} color="var(--color-muted)" />
        )}
      </div>

      {/* Expanded body (lazy mounted) */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface-2)',
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: 18,
            padding: '16px 18px',
            animation: 'lu-expand 180ms ease-out',
          }}
        >
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--color-border)' }} />
            <TimelineNode color="var(--color-accent)" title="最終更新" abs={formatDateTime(file.modifiedAt)} rel={formatRelativeTime(file.modifiedAt)} />
            <TimelineNode color="var(--color-sec-text)" title="最終アクセス" abs={formatDateTime(file.accessedAt)} />
            <TimelineNode color="var(--color-muted)" title="作成" abs={formatDateTime(file.createdAt)} last />
          </div>

          {/* Path + actions */}
          <div>
            <div
              style={{
                background: 'var(--color-log-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                padding: '8px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--color-muted)',
                wordBreak: 'break-all',
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            >
              {file.path}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" Icon={file.isDir ? FolderOpen : ExternalLink} onClick={onOpen}>
                {file.isDir ? 'フォルダを開く' : '開く'}
              </Button>
              {!file.isDir && (
                <>
                  <Button variant="secondary" size="md" Icon={FolderOpen} onClick={() => window.localUpdater?.showInFolder(file.path)}>
                    保存場所
                  </Button>
                  <Button variant="secondary" size="md" Icon={Copy} onClick={() => navigator.clipboard?.writeText(file.path).catch(() => {})}>
                    パスをコピー
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineNode({
  color,
  title,
  abs,
  rel,
  last = false,
}: {
  color: string;
  title: string;
  abs: string;
  rel?: string;
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : 14, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: -19,
          top: 3,
          width: 11,
          height: 11,
          background: color,
          borderRadius: '50%',
          border: '2px solid var(--color-surface-2)',
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text)' }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{abs}</div>
      {rel && <div style={{ fontSize: 10, color: 'var(--color-accent)', marginTop: 1 }}>{rel}</div>}
    </div>
  );
}
