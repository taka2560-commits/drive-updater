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

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 60) return { text: `${Math.max(1, diffMins)}分前`, recent: true };
    if (diffHours < 24) return { text: `${diffHours}時間前`, recent: true };
    if (diffDays === 1) return { text: `昨日`, recent: false };
    if (diffDays > 1 && diffDays < 7) return { text: `${diffDays}日前`, recent: false };
    if (diffDays >= 7 && diffDays < 14) return { text: `今週`, recent: false };
    return { text: '', recent: false };
  };

  const relUpdate = formatRelativeTime(selectedFile.updated);

  const innerContent = (
    <div style={{ padding: '24px', display: layout === 'B' ? 'flex' : 'block', gap: layout === 'B' ? '24px' : '0' }}>
      
      {/* プレビューと基本情報 (B案では左側) */}
      <div style={{ flex: layout === 'B' ? '0 0 240px' : 'auto' }}>
        
        {layout === 'A' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-muted)' }}>詳細</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Star 
                size={18} 
                style={{ cursor: 'pointer', color: isStarred ? 'var(--color-accent)' : 'var(--color-muted)', fill: isStarred ? 'var(--color-accent)' : 'none' }} 
                onClick={() => toggleStar(selectedFile.path)}
              />
              {onClose && <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}><span style={{ fontSize: '18px', lineHeight: 1 }}>&times;</span></button>}
            </div>
          </div>
        )}

        {previewImage ? (
          <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#1a1c1e', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>PNG</div>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>1920 x 1080</div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', flexDirection: 'column', gap: '12px' }}>
            {React.createElement(TYPE_CONFIG[selectedFile.type]?.icon || TYPE_CONFIG.other.icon, { size: 48 })}
            <span style={{ fontSize: '12px' }}>プレビューなし</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text)', lineHeight: 1.4, wordBreak: 'break-all', margin: 0 }}>{selectedFile.name}</h2>
            <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', margin: 0 }}>
              {formatBytes(selectedFile.size)} &nbsp;·&nbsp; {TYPE_CONFIG[selectedFile.type]?.label || TYPE_CONFIG.other.label}
            </p>
          </div>
        </div>
      </div>

      {/* アクションとメタデータ (B案では右側) */}
      <div style={{ flex: layout === 'B' ? '1' : 'auto', display: layout === 'B' ? 'flex' : 'block', gap: layout === 'B' ? '24px' : '0' }}>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <button 
              onClick={() => (window as any).electronAPI?.openFile(selectedFile.path)} 
              style={{ width: '100%', backgroundColor: 'var(--color-primary-hi)', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
            >
              <ExternalLink size={16} /> ファイルを開く
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => (window as any).electronAPI?.openFolder(selectedFile.path)} 
                style={{ flex: 1, backgroundColor: 'var(--color-surface)', color: 'var(--color-sec-text)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FolderOpen size={16} /> 保存場所
              </button>
              <button 
                onClick={() => copyToClipboard(selectedFile.path)}
                style={{ flex: 1, backgroundColor: copied ? 'var(--color-secondary)' : 'var(--color-surface)', color: copied ? '#fff' : 'var(--color-sec-text)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
              >
                {copied ? "✓ コピー済" : <><Copy size={16}/> パス</>}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-muted)', marginBottom: '8px' }}>ローカルパス</div>
            <div style={{ backgroundColor: 'var(--color-log-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', fontSize: '11px', color: 'var(--color-muted)', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
              {selectedFile.path}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12}/> 履歴
          </div>
          <div style={{ paddingLeft: '8px', borderLeft: '1px solid var(--color-border)', marginLeft: '6px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-12px', top: '4px', width: '10px', height: '10px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></div>
              <div style={{ paddingLeft: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)' }}>最終更新</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>{formatDate(selectedFile.updated)}</div>
                {relUpdate.recent && <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold', marginTop: '2px' }}>{relUpdate.text}</div>}
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-12px', top: '4px', width: '10px', height: '10px', backgroundColor: 'var(--color-sec-text)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></div>
              <div style={{ paddingLeft: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)' }}>最終アクセス</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>{formatDate(selectedFile.accessed)}</div>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-12px', top: '4px', width: '10px', height: '10px', backgroundColor: 'var(--color-muted)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></div>
              <div style={{ paddingLeft: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)' }}>作成</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>{formatDate(selectedFile.created)}</div>
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
