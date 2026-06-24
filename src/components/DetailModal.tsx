import { useEffect, useMemo, useState } from 'react';
import { Star, X, ExternalLink, FolderOpen, Copy, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useStore } from '../storeContext';
import { fileMeta, matchesType } from '../lib/fileType';
import { formatBytes, formatDateTime, formatRelativeTime } from '../lib/format';
import { Button } from './ui';
import type { FileEntry } from '../types';

/** C-layout: full-width modal detail with prev/next navigation. */
export function DetailModal({ file }: { file: FileEntry }) {
  const { filteredFiles, setSelected, isStarred, toggleStar, requestDelete } = useStore();

  const index = useMemo(() => filteredFiles.findIndex((f) => f.path === file.path), [filteredFiles, file.path]);
  const hasPrev = index > 0;
  const hasNext = index >= 0 && index < filteredFiles.length - 1;
  const goPrev = () => hasPrev && setSelected(filteredFiles[index - 1].path);
  const goNext = () => hasNext && setSelected(filteredFiles[index + 1].path);
  const close = () => setSelected(null);

  const meta = fileMeta(file.ext);
  const isImage = matchesType(file.ext, 'image');

  // Image thumbnail (Electron only), tagged by path to avoid stale results.
  const [preview, setPreview] = useState<{ path: string; data: string } | null>(null);
  useEffect(() => {
    if (!isImage || file.isDir) return;
    const api = window.localUpdater;
    if (!api?.readImage) return;
    let cancelled = false;
    api.readImage(file.path).then((data) => {
      if (!cancelled && data) setPreview({ path: file.path, data });
    });
    return () => {
      cancelled = true;
    };
  }, [file.path, isImage, file.isDir]);
  const previewSrc = preview && preview.path === file.path ? preview.data : null;

  // Keyboard (SPEC_C §6.5).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          goNext();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          window.localUpdater?.openPath(file.path);
          break;
        case 's':
        case 'S':
          if (!file.isDir) toggleStar(file.path);
          break;
        case 'o':
        case 'O':
          window.localUpdater?.showInFolder(file.path);
          break;
        case 'c':
        case 'C':
          navigator.clipboard?.writeText(file.path).catch(() => {});
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, file.path, filteredFiles.length]);

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: '32px 0 0 0',
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        animation: 'lu-expand 150ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 760,
          maxWidth: '92vw',
          height: 'min(640px, 80vh)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
          <meta.Icon size={20} color={meta.color} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {file.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>
              {file.isDir ? 'フォルダ' : `${meta.label} · ${formatBytes(file.sizeBytes)}`}
            </div>
          </div>
          {!file.isDir && (
            <button onClick={() => toggleStar(file.path)} aria-label="スター切替" style={iconBtn}>
              <Star size={15} color={isStarred(file.path) ? 'var(--color-accent)' : 'var(--color-muted)'} fill={isStarred(file.path) ? 'var(--color-accent)' : 'none'} />
            </button>
          )}
          <button onClick={close} aria-label="閉じる" style={iconBtn}>
            <X size={15} color="var(--color-muted)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Preview */}
          <div style={{ width: 320, flexShrink: 0, background: 'var(--color-log-bg)', borderRight: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            {previewSrc ? (
              <img src={previewSrc} alt={file.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--color-muted)' }}>
                <meta.Icon size={56} color={meta.color} />
                <span style={{ fontSize: 11 }}>{meta.label}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            <SectionLabel>ファイル情報</SectionLabel>
            <InfoRow label="最終更新" value={`${formatDateTime(file.modifiedAt)}（${formatRelativeTime(file.modifiedAt)}）`} />
            <InfoRow label="アクセス" value={formatDateTime(file.accessedAt)} />
            <InfoRow label="作成" value={formatDateTime(file.createdAt)} />
            {!file.isDir && <InfoRow label="サイズ" value={`${file.sizeBytes.toLocaleString()} bytes`} />}

            <div style={{ height: 16 }} />
            <SectionLabel>パス</SectionLabel>
            <div style={{ background: 'var(--color-log-bg)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-muted)', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {file.path}
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" Icon={file.isDir ? FolderOpen : ExternalLink} onClick={() => window.localUpdater?.openPath(file.path)}>
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
              <Button variant="ghost" size="md" Icon={Trash2} style={{ color: '#D46A6A' }} onClick={() => requestDelete([file.path])}>
                ゴミ箱
              </Button>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
          <Button variant="ghost" size="sm" Icon={ChevronLeft} disabled={!hasPrev} onClick={goPrev}>
            前のファイル
          </Button>
          <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
            {index >= 0 ? `${index + 1} / ${filteredFiles.length}` : ''}
          </span>
          <Button variant="ghost" size="sm" disabled={!hasNext} onClick={goNext}>
            次のファイル
            <ChevronRight size={13} />
          </Button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--color-disabled)' }}>ESC で閉じる</span>
        </div>
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  padding: 4,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-disabled)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 12, padding: '4px 0' }}>
      <span style={{ width: 72, flexShrink: 0, color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ color: 'var(--color-text)' }}>{value}</span>
    </div>
  );
}
