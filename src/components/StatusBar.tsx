import { useMemo } from 'react';
import { FolderOpen } from 'lucide-react';
import { useStore } from '../storeContext';
import { formatBytes } from '../lib/format';

/** Footer status bar: watching indicator + counts + current path. */
export function StatusBar() {
  const { filteredFiles, folderFiles, activeFolder, folders, browsePath } = useStore();

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

      <div style={{ flex: 1 }} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <FolderOpen size={11} />
        {currentPath}
      </span>
    </div>
  );
}
