import React, { useState, useMemo } from 'react';
import { Star, ExternalLink, FolderOpen, Copy } from 'lucide-react';
import type { FileData } from './types';
import { TYPE_CONFIG } from './types';
import { groupByTime } from '../lib/grouping';

interface FileGroupListProps {
  files: FileData[];
  starredPaths: string[];
  toggleStar: (path: string, e?: React.MouseEvent) => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
}

export function FileGroupList({ files, starredPaths, toggleStar, copyToClipboard, copied }: FileGroupListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groups = useMemo(() => groupByTime(files), [files]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (files.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>ファイルが見つかりません。</div>;
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 40px', backgroundColor: 'var(--color-bg)' }}>
      {groups.map(group => (
        <div key={group.key} style={{ marginBottom: '32px' }}>
          
          {/* グループヘッダ */}
          <div style={{ display: 'flex', alignItems: 'center', height: '36px', marginBottom: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-text)', marginRight: '8px' }}>{group.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{group.subLabel}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', margin: '0 16px' }} />
            <span style={{ fontSize: '11px', color: group.key === 'today' ? 'var(--color-accent)' : 'var(--color-muted)' }}>
              {group.files.length}件 · {formatBytes(group.totalBytes)}
            </span>
          </div>

          {/* ファイルカード群 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {group.files.map(file => {
              const isExpanded = expandedId === file.id;
              const IconComp = TYPE_CONFIG[file.type]?.icon || TYPE_CONFIG.other.icon;
              const isStarred = starredPaths.includes(file.path);

              return (
                <div key={file.id} style={{
                  backgroundColor: 'var(--color-surface)',
                  border: `1px solid ${isExpanded ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}>
                  {/* カードヘッダ (常に表示) */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : file.id)}
                    style={{
                      height: '64px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer'
                    }}
                  >
                    <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={18} style={{ color: TYPE_CONFIG[file.type]?.color || 'var(--color-muted)' }} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>
                        {TYPE_CONFIG[file.type]?.label || TYPE_CONFIG.other.label} · {formatBytes(file.size)}
                      </div>
                    </div>

                    <Star 
                      size={18} 
                      style={{ flexShrink: 0, cursor: 'pointer', color: isStarred ? 'var(--color-accent)' : 'var(--color-muted)', fill: isStarred ? 'var(--color-accent)' : 'none', marginRight: '8px' }} 
                      onClick={(e) => toggleStar(file.path, e)}
                    />

                    <div style={{ fontSize: '11px', color: 'var(--color-muted)', width: '60px', textAlign: 'right' }}>
                      {/* 簡易的な時間表示 */}
                      {formatDate(file.updated)}
                    </div>
                    
                    <div style={{ color: 'var(--color-muted)', paddingLeft: '8px' }}>
                      {isExpanded ? '⌃' : '⌄'}
                    </div>
                  </div>

                  {/* カードボディ (展開時のみ) */}
                  {isExpanded && (
                    <div style={{
                      borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
                      display: 'grid', gridTemplateColumns: '220px 1fr', gap: '18px', padding: '16px 18px'
                    }}>
                      {/* 左: タイムライン */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '12px' }}>タイムライン</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '1px solid var(--color-border)', marginLeft: '6px', paddingLeft: '12px' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-15px', top: '3px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                            <div style={{ fontSize: '10px', color: 'var(--color-text)' }}>● 最終更新 {formatDate(file.updated)}</div>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-15px', top: '3px', width: '7px', height: '7px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }} />
                            <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>○ アクセス {formatDate(file.accessed)}</div>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-15px', top: '3px', width: '7px', height: '7px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }} />
                            <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>○ 作成 {formatDate(file.created)}</div>
                          </div>
                        </div>
                      </div>

                      {/* 右: パス & アクション */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '8px' }}>パス</div>
                        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px', fontSize: '11px', color: 'var(--color-muted)', wordBreak: 'break-all', marginBottom: '16px' }}>
                          {file.path}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => (window as any).electronAPI?.openFile(file.path)} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <ExternalLink size={14} /> 開く
                          </button>
                          <button onClick={() => (window as any).electronAPI?.openFolder(file.path)} style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <FolderOpen size={14} /> 保存場所
                          </button>
                          <button onClick={() => copyToClipboard(file.path)} style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Copy size={14} /> {copied ? 'コピー済' : 'パスをコピー'}
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
