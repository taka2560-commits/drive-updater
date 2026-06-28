import { useEffect, useState } from 'react';
import { Star, X, ExternalLink, FolderOpen, Copy, History, MousePointerClick, Trash2 } from 'lucide-react';
import { Button } from './ui';
import { useStore } from '../storeContext';
import { fileMeta, matchesType, isTextPreviewable } from '../lib/fileType';
import { formatBytes, formatDateTime, formatRelativeTime } from '../lib/format';
import type { FileEntry } from '../types';

export function DetailPane() {
  const { selectedFile, setSelected, isStarred, toggleStar } = useStore();

  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            flex: 1,
          }}
        >
          詳細
        </span>
        {selectedFile && (
          <button
            onClick={() => toggleStar(selectedFile.path)}
            aria-label="スター切替"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', padding: 0 }}
          >
            <Star
              size={14}
              color={isStarred(selectedFile.path) ? 'var(--accent)' : 'var(--text-muted)'}
              fill={isStarred(selectedFile.path) ? 'var(--accent)' : 'none'}
            />
          </button>
        )}
        <button
          onClick={() => setSelected(null)}
          aria-label="詳細を閉じる"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', padding: 0 }}
        >
          <X size={14} color="var(--text-muted)" />
        </button>
      </div>

      {selectedFile ? <Detail file={selectedFile} /> : <EmptyDetail />}
    </div>
  );
}

function EmptyDetail() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
        color: 'var(--text-secondary)',
      }}
    >
      <MousePointerClick size={36} color="var(--text-muted)" />
      <div style={{ fontSize: 12, lineHeight: 1.6 }}>
        ファイルを選択すると
        <br />
        詳細を表示します
      </div>
    </div>
  );
}

function Detail({ file }: { file: FileEntry }) {
  const { requestDelete } = useStore();
  const meta = fileMeta(file.ext);
  const isImage = matchesType(file.ext, 'image');
  const isText = !file.isDir && isTextPreviewable(file.ext);

  const [preview, setPreview] = useState<{ path: string; data: string } | null>(null);
  const [dimensions, setDimensions] = useState<{ path: string; value: string } | null>(null);
  const [text, setText] = useState<{ path: string; data: string } | null>(null);
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

  useEffect(() => {
    if (!isText) return;
    const api = window.localUpdater;
    if (!api?.readText) return;
    let cancelled = false;
    api.readText(file.path).then((data) => {
      if (!cancelled && data != null) setText({ path: file.path, data });
    });
    return () => {
      cancelled = true;
    };
  }, [file.path, isText]);

  const previewSrc = preview && preview.path === file.path ? preview.data : null;
  const dimsLabel = dimensions && dimensions.path === file.path ? dimensions.value : null;
  const textSrc = text && text.path === file.path ? text.data : null;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
      {/* Preview */}
      <div
        style={{
          width: '100%',
          height: 200,
          background: 'var(--bg-sidebar)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={file.name}
            onLoad={(e) => {
              const img = e.currentTarget;
              setDimensions({ path: file.path, value: `${img.naturalWidth} × ${img.naturalHeight}` });
            }}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : textSrc != null ? (
          <pre
            style={{
              margin: 0,
              width: '100%',
              height: '100%',
              overflow: 'auto',
              padding: 10,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              textAlign: 'left',
            }}
          >
            {textSrc}
          </pre>
        ) : (
          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <meta.Icon size={40} color={isImage ? 'var(--text-brand)' : meta.color} />
            <div style={{ fontSize: 11 }}>{meta.label}</div>
          </div>
        )}
        {dimsLabel && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 3,
            }}
          >
            {dimsLabel}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 3,
            textTransform: 'uppercase',
          }}
        >
          {file.ext}
        </div>
      </div>

      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 4px',
          lineHeight: 1.4,
          wordBreak: 'break-all',
        }}
      >
        {file.name}
      </h2>
      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
        <span>{formatBytes(file.sizeBytes)}</span>
        <span>·</span>
        <span>{meta.label}</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        <Button
          variant="primary" size="lg"
          Icon={file.isDir ? FolderOpen : ExternalLink}
          style={{ width: '100%' }}
          onClick={() => {
            const api = (window as unknown as { localUpdater?: { openPath: (p: string) => void } }).localUpdater;
            api?.openPath(file.path);
          }}
        >
          {file.isDir ? 'フォルダを開く' : 'ファイルを開く'}
        </Button>
        {!file.isDir && (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button
              variant="secondary" size="md" Icon={FolderOpen} style={{ flex: 1 }}
              onClick={() => {
                const api = (window as unknown as { localUpdater?: { showInFolder: (p: string) => void } }).localUpdater;
                api?.showInFolder(file.path);
              }}
            >
              保存場所
            </Button>
            <Button
              variant="secondary" size="md" Icon={Copy} style={{ flex: 1 }}
              onClick={() => navigator.clipboard?.writeText(file.path).catch(() => {})}
            >
              パス
            </Button>
          </div>
        )}
        <Button
          variant="ghost" size="md" Icon={Trash2} style={{ width: '100%', color: 'var(--danger)' }}
          onClick={() => requestDelete([file.path])}
        >
          ゴミ箱に移動
        </Button>
      </div>

      {/* Path */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel>ローカルパス</SectionLabel>
        <div
          style={{
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-secondary)',
            wordBreak: 'break-all',
            lineHeight: 1.5,
          }}
        >
          {file.path}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <SectionLabel>
          <History size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />
          履歴
        </SectionLabel>
        <div style={{ position: 'relative', paddingLeft: 20, marginTop: 6 }}>
          <div
            style={{
              position: 'absolute',
              left: 5,
              top: 6,
              bottom: 6,
              width: 1,
              background: 'var(--border)',
            }}
          />
          <TimelineNode color="var(--accent)" title="最終更新" abs={formatDateTime(file.modifiedAt)} rel={formatRelativeTime(file.modifiedAt)} />
          <TimelineNode color="var(--text-brand)" title="最終アクセス" abs={formatDateTime(file.accessedAt)} />
          <TimelineNode color="var(--text-secondary)" title="作成" abs={formatDateTime(file.createdAt)} last />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {children}
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
          border: '2px solid var(--surface)',
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{abs}</div>
      {rel && <div style={{ fontSize: 10, color: 'var(--accent)', marginTop: 1 }}>{rel}</div>}
    </div>
  );
}
