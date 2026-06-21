import React from 'react';
import { ExternalLink, FolderOpen, Star, Copy, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FileData } from './types';
import { TYPE_CONFIG } from './types';

interface DetailModalProps {
  selectedFile: FileData;
  previewImage: string | null;
  starredPaths: string[];
  toggleStar: (path: string, e?: React.MouseEvent) => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
  onClose: () => void;
  allFiles: FileData[];
  onNavigate: (newFile: FileData) => void;
}

export function DetailModal({
  selectedFile, previewImage, starredPaths, toggleStar, copyToClipboard, copied, onClose, allFiles, onNavigate
}: DetailModalProps) {
  const isStarred = starredPaths.includes(selectedFile.path);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const IconComp = TYPE_CONFIG[selectedFile.type]?.icon || TYPE_CONFIG.other.icon;

  // Navigation logic
  const currentIndex = allFiles.findIndex(f => f.id === selectedFile.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allFiles.length - 1 && currentIndex !== -1;

  const handlePrev = () => { if (hasPrev) onNavigate(allFiles[currentIndex - 1]); };
  const handleNext = () => { if (hasNext) onNavigate(allFiles[currentIndex + 1]); };

  return (
    <div 
      style={{
        position: 'fixed', inset: '32px 0 0 0', zIndex: 100,
        backgroundColor: 'rgba(34,38,41,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '760px', minHeight: '400px', maxHeight: 'min(640px, 80vh)',
          backgroundColor: 'var(--color-bg)',
          borderRadius: '12px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <IconComp size={24} style={{ color: TYPE_CONFIG[selectedFile.type]?.color || 'var(--color-muted)', marginRight: '16px' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedFile.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
              {TYPE_CONFIG[selectedFile.type]?.label || TYPE_CONFIG.other.label} · {formatBytes(selectedFile.size)} · デスクトップ
            </div>
          </div>
          <Star 
            size={20} 
            style={{ cursor: 'pointer', color: isStarred ? 'var(--color-accent)' : 'var(--color-muted)', fill: isStarred ? 'var(--color-accent)' : 'none', margin: '0 16px' }} 
            onClick={(e) => toggleStar(selectedFile.path, e)}
          />
          <X size={20} style={{ cursor: 'pointer', color: 'var(--color-muted)' }} onClick={onClose} />
        </div>

        {/* Body (2 columns) */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Preview */}
          <div style={{ width: '320px', borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-log-bg)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewImage ? (
              <img src={previewImage} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
                <IconComp size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <div style={{ fontSize: '12px' }}>プレビューなし</div>
              </div>
            )}
          </div>

          {/* Right Info */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '16px' }}>ファイル情報</div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', fontSize: '12px', color: 'var(--color-text)', marginBottom: '32px' }}>
              <div style={{ color: 'var(--color-muted)' }}>最終更新</div>
              <div>{formatDate(selectedFile.updated)}</div>
              <div style={{ color: 'var(--color-muted)' }}>アクセス</div>
              <div>{formatDate(selectedFile.accessed)}</div>
              <div style={{ color: 'var(--color-muted)' }}>作成</div>
              <div>{formatDate(selectedFile.created)}</div>
              <div style={{ color: 'var(--color-muted)' }}>サイズ</div>
              <div>{formatBytes(selectedFile.size)}</div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '12px' }}>パス</div>
            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px', fontSize: '11px', color: 'var(--color-muted)', wordBreak: 'break-all', marginBottom: '24px' }}>
              {selectedFile.path}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => (window as any).electronAPI?.openFile(selectedFile.path)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ExternalLink size={16} /> 開く
              </button>
              <button onClick={() => (window as any).electronAPI?.openFolder(selectedFile.path)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FolderOpen size={16} /> 保存場所
              </button>
              <button onClick={() => copyToClipboard(selectedFile.path)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Copy size={16} /> {copied ? 'コピー済' : 'パスコピー'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              disabled={!hasPrev} onClick={handlePrev}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: hasPrev ? 'var(--color-text)' : 'var(--color-disabled)', cursor: hasPrev ? 'pointer' : 'default', fontSize: '12px' }}
            >
              <ChevronLeft size={16} /> 前のファイル
            </button>
            <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
              {currentIndex + 1} / {allFiles.length}
            </span>
            <button 
              disabled={!hasNext} onClick={handleNext}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: hasNext ? 'var(--color-text)' : 'var(--color-disabled)', cursor: hasNext ? 'pointer' : 'default', fontSize: '12px' }}
            >
              次のファイル <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
            ESC で閉じる
          </div>
        </div>
      </div>
    </div>
  );
}
