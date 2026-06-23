import { useMemo } from 'react';
import { ChevronUp, FolderOpen } from 'lucide-react';
import { useStore } from '../storeContext';
import { formatBytes } from '../lib/format';

/** Footer status bar: watching indicator + counts + active path + breadcrumb. */
export function StatusBar() {
  const { filteredFiles, folderFiles, activeFolder, folders, browsePath, browseUp } = useStore();

  const totalBytes = useMemo(
    () => filteredFiles.filter((f) => !f.isDir).reduce((acc, f) => acc + f.sizeBytes, 0),
    [filteredFiles],
  );

  const rootPath = folders.find((f) => f.key === activeFolder)?.path ?? '';
  const currentPath = browsePath ?? rootPath;
  const filtered = filteredFiles.filter((f) => !f.isDir).length !== folderFiles.filter((f) => !f.isDir).length;
  const fileCount = filteredFiles.filter((f) => !f.isDir).length;
  const folderCount = folderFiles.filter((f) => !f.isDir).length;

  return (
    <div
      style={{
        padding: '6px 16px',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        color: 'var(--color-muted)',
        flexShrink: 0,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span
          className="blink"
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6A3F', display: 'inline-block' }}
        />
        監視中
      </span>
      <span>
        {filtered ? `${fileCount}件 / ${folderCount}件中` : `${fileCount}件`}
        {' · '}
        {formatBytes(totalBytes)}
      </span>

      {/* Sub-folder breadcrumb */}
      {browsePath && (
        <button
          onClick={browseUp}
          title="上の階層へ戻る"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: '2px 7px',
            fontSize: 10,
            color: 'var(--color-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <ChevronUp size={11} />
          上の階層へ
        </button>
      )}

      <div style={{ flex: 1 }} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <FolderOpen size={11} />
        {currentPath}
      </span>
    </div>
  );
}
