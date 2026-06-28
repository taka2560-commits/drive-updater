import { useMemo } from 'react';
import { Folder } from 'lucide-react';
import { useStore } from '../storeContext';
import { formatBytes } from '../lib/format';

export function StatusBar() {
  const { filteredFiles, folders } = useStore();

  const fileCount = filteredFiles.filter((f) => !f.isDir).length;
  const totalBytes = useMemo(
    () => filteredFiles.filter((f) => !f.isDir).reduce((acc, f) => acc + f.sizeBytes, 0),
    [filteredFiles],
  );
  const folderCount = folders.length;
  const scanTime = useMemo(
    () => new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--statusbar-height)',
        padding: '0 12px',
        background: 'var(--bg-statusbar)',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 11,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
        fontFamily: 'var(--font-sans)',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <Folder size={11} />
        <span>監視中: {folderCount} フォルダ</span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {fileCount} 件 · {formatBytes(totalBytes)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span>最終スキャン: {scanTime}</span>
      </div>
    </div>
  );
}
