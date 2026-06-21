import React from 'react';
import { Star, ExternalLink, FolderOpen, Copy, Clock, File as FileIcon } from 'lucide-react';
import type { FileData } from './types';
import { TYPE_CONFIG } from './types';
import type { LayoutMode } from '../hooks/useLayout';

interface DetailPaneProps {
  layout: LayoutMode;
  selectedFile: FileData | null;
  previewImage: string | null;
  starredPaths: string[];
  toggleStar: (path: string, e?: React.MouseEvent) => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
  onClose?: () => void;
}

export function DetailPane({
  layout, selectedFile, previewImage, starredPaths, toggleStar, copyToClipboard, copied, onClose
}: DetailPaneProps) {
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedFile) {
    if (layout === 'C') return null;
    return (
      <div style={{ width: layout === 'A' ? '380px' : '100%', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0, borderLeft: layout === 'A' ? '1px solid var(--color-border)' : 'none', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', padding: '24px', textAlign: 'center' }}>
        <FileIcon size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <p style={{ fontSize: '14px' }}>リストからファイルを選択すると、詳細が表示されます。</p>
      </div>
    );
  }

  const isStarred = starredPaths.includes(selectedFile.path);

  const innerContent = (
    <div style={{ padding: '20px', display: layout === 'B' ? 'flex' : 'block', gap: layout === 'B' ? '24px' : '0' }}>
      
      {/* プレビューと基本情報 (B案では左側) */}
      <div style={{ flex: layout === 'B' ? '0 0 240px' : 'auto' }}>
        {previewImage ? (
          <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--color-surface)', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        ) : (
          <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
            {React.createElement(TYPE_CONFIG[selectedFile.type]?.icon || TYPE_CONFIG.other.icon, { size: 48 })}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text)', lineHeight: 1.2, wordBreak: 'break-all', margin: 0 }}>{selectedFile.name}</h2>
            <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', margin: 0 }}>{formatBytes(selectedFile.size)}</p>
          </div>
          <Star 
            size={20} 
            style={{ flexShrink: 0, cursor: 'pointer', color: isStarred ? 'var(--color-accent)' : 'var(--color-muted)', fill: isStarred ? 'var(--color-accent)' : 'none' }} 
            onClick={() => toggleStar(selectedFile.path)}
          />
        </div>
      </div>

      {/* アクションとメタデータ (B案では右側) */}
      <div style={{ flex: layout === 'B' ? '1' : 'auto', display: layout === 'B' ? 'flex' : 'block', gap: layout === 'B' ? '24px' : '0' }}>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: layout === 'B' ? 'row' : 'column', gap: '8px', marginBottom: '24px' }}>
            <button 
              onClick={() => (window as any).electronAPI?.openFile(selectedFile.path)} 
              style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ExternalLink size={16} /> ファイルを開く
            </button>
            <button 
              onClick={() => (window as any).electronAPI?.openFolder(selectedFile.path)} 
              style={{ flex: 1, backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <FolderOpen size={16} /> 保存場所を開く
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-muted)', marginBottom: '8px' }}>ローカルファイルパス</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '8px' }}>
              <code style={{ fontSize: '10px', color: 'var(--color-muted)', wordBreak: 'break-all' }}>{selectedFile.path}</code>
              <button 
                onClick={() => copyToClipboard(selectedFile.path)}
                style={{
                  width: '100%', padding: '6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: copied ? 'var(--color-secondary)' : 'var(--color-bg)', color: copied ? '#fff' : 'var(--color-text)', transition: 'all 0.2s'
                }}
              >
                {copied ? "✓ コピー済" : <><Copy size={14}/> パスをコピー</>}
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14}/> ファイル履歴
          </div>
          <div style={{ paddingLeft: '8px', borderLeft: '2px solid var(--color-border)', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-13px', top: '4px', width: '12px', height: '12px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></div>
              <div style={{ paddingLeft: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)' }}>最終更新日時</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>{formatDate(selectedFile.updated)}</div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-13px', top: '4px', width: '12px', height: '12px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></div>
              <div style={{ paddingLeft: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)' }}>最終アクセス日時</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>{formatDate(selectedFile.accessed)}</div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-13px', top: '4px', width: '12px', height: '12px', backgroundColor: 'var(--color-border)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></div>
              <div style={{ paddingLeft: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)' }}>作成日時</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>{formatDate(selectedFile.created)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (layout === 'B') {
    return (
      <div style={{ width: '100%', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        {innerContent}
      </div>
    );
  }

  if (layout === 'C') {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
        <div style={{ width: '480px', maxHeight: '90vh', backgroundColor: 'var(--color-bg)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
          </div>
          {innerContent}
        </div>
      </div>
    );
  }

  // Layout A (default)
  return (
    <div style={{ width: '380px', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0, borderLeft: '1px solid var(--color-border)', overflowY: 'auto' }}>
      {innerContent}
    </div>
  );
}
