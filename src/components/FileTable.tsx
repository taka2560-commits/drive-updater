import React, { useState, useRef } from 'react';
import { Star } from 'lucide-react';
import type { FileData } from './types';
import { TYPE_CONFIG } from './types';

import type { LayoutMode } from '../hooks/useLayout';

interface FileTableProps {
  layout: LayoutMode;
  appMode: "files" | "settings" | "starred";
  displayData: FileData[];
  viewMode: "list" | "grid";
  sortCol: keyof FileData;
  sortAsc: boolean;
  handleSort: (col: keyof FileData) => void;
  selectedFile: FileData | null;
  setSelectedFile: (file: FileData) => void;
  handleContextMenu: (e: React.MouseEvent, file: FileData) => void;
  starredPaths: string[];
  toggleStar: (path: string, e?: React.MouseEvent) => void;
  renderDetailPane?: () => React.ReactNode;
}

export function FileTable({
  layout, appMode, displayData, viewMode, sortCol, sortAsc, handleSort, selectedFile, setSelectedFile, handleContextMenu, starredPaths, toggleStar, renderDetailPane
}: FileTableProps) {
  
  const [colWidths, setColWidths] = useState({ name: 300, type: 100, size: 100, updated: 150 });
  const draggingCol = useRef<string | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent, col: string) => {
    e.stopPropagation();
    e.preventDefault();
    draggingCol.current = col;
    startX.current = e.clientX;
    startWidth.current = colWidths[col as keyof typeof colWidths];
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingCol.current) return;
      const deltaX = e.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + deltaX);
      setColWidths(prev => ({ ...prev, [draggingCol.current!]: newWidth }));
    };
    
    const handleMouseUp = () => {
      draggingCol.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Optional: save to localStorage
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const ResizeHandle = ({ col }: { col: string }) => (
    <div 
      onMouseDown={(e) => handleMouseDown(e, col)}
      style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize',
        backgroundColor: 'transparent', zIndex: 20
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    />
  );
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return { text: `${Math.max(1, diffMins)}分前`, recent: true };
    } else if (diffHours < 24) {
      return { text: `${diffHours}時間前`, recent: true };
    } else if (diffDays === 1) {
      return { text: `昨日`, recent: false };
    } else if (diffDays > 1 && diffDays < 7) {
      return { text: `${diffDays}日前`, recent: false };
    } else if (diffDays >= 7 && diffDays < 14) {
      return { text: `今週`, recent: false };
    } else {
      return { text: date.toLocaleString('ja-JP', { month: 'numeric', day: 'numeric' }), recent: false };
    }
  };

  if (appMode === "starred" && displayData.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', padding: '48px', textAlign: 'center' }}>
        <Star size={48} style={{ marginBottom: '16px', color: 'var(--color-border)' }} />
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '8px' }}>スター付きのファイルはありません</p>
        <p>よく使うファイルをリストから見つけ、★マークをクリックして追加してください。</p>
      </div>
    );
  }

  if (viewMode === "list") {
    
    // For Layout B, group by date
    let groupedData: { groupName: string; files: FileData[] }[] = [];
    if (layout === 'B') {
      const now = new Date();
      const groups: Record<string, FileData[]> = {
        "今日": [],
        "今週": [],
        "今月": [],
        "それ以前": []
      };
      displayData.forEach(f => {
        const diffDays = Math.floor((now.getTime() - f.updated.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) groups["今日"].push(f);
        else if (diffDays < 7) groups["今週"].push(f);
        else if (diffDays < 30) groups["今月"].push(f);
        else groups["それ以前"].push(f);
      });
      groupedData = [
        { groupName: "今日", files: groups["今日"] },
        { groupName: "今週", files: groups["今週"] },
        { groupName: "今月", files: groups["今月"] },
        { groupName: "それ以前", files: groups["それ以前"] }
      ].filter(g => g.files.length > 0);
    }

    const renderRow = (file: FileData) => {
      const IconComp = TYPE_CONFIG[file.type]?.icon || TYPE_CONFIG.other.icon;
      const isStarred = starredPaths.includes(file.path);
      const isSelected = selectedFile?.id === file.id;
      return (
        <React.Fragment key={file.id}>
          <tr 
            onClick={() => setSelectedFile(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            onDoubleClick={() => (window as any).electronAPI?.openFile(file.path)}
            style={{
              borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
              backgroundColor: isSelected ? 'var(--color-secondary)' : 'transparent',
              color: isSelected ? '#fff' : 'var(--color-text)',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-surface)' }}
            onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <td style={{ padding: '12px', textAlign: 'center' }}>
              <Star 
                size={16} 
                style={{ cursor: 'pointer', color: isStarred ? 'var(--color-accent)' : 'var(--color-muted)', fill: isStarred ? 'var(--color-accent)' : 'none' }} 
                onClick={(e) => toggleStar(file.path, e)}
              />
            </td>
            <td style={{ padding: '12px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconComp size={16} style={{ color: isSelected ? '#fff' : TYPE_CONFIG[file.type]?.color || 'var(--color-muted)', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
              </div>
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{ 
                padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-surface)',
                color: isSelected ? '#fff' : TYPE_CONFIG[file.type]?.color || 'var(--color-muted)',
                border: isSelected ? 'none' : `1px solid var(--color-border)`
              }}>
                {TYPE_CONFIG[file.type]?.label || TYPE_CONFIG.other.label}
              </span>
            </td>
            <td style={{ padding: '12px', fontSize: '12px', color: isSelected ? '#fff' : 'var(--color-muted)' }}>{formatBytes(file.size)}</td>
            <td style={{ padding: '12px', fontSize: '12px', color: isSelected ? '#fff' : (formatRelativeTime(file.updated).recent ? 'var(--color-accent)' : 'var(--color-muted)'), fontWeight: formatRelativeTime(file.updated).recent ? 'bold' : 'normal' }}>
              {formatRelativeTime(file.updated).text}
            </td>
          </tr>
          {layout === 'B' && isSelected && renderDetailPane && (
            <tr>
              <td colSpan={5} style={{ padding: 0 }}>
                {renderDetailPane()}
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    };

    return (
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead style={{ backgroundColor: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid var(--color-border)' }}>
          <tr>
            <th style={{ padding: '12px', width: '40px' }}></th>
            <th style={{ width: colWidths.name, padding: '12px', fontWeight: 'bold', color: 'var(--color-text)', position: 'relative' }}>
              <div onClick={() => handleSort("name")} style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>ファイル名 {sortCol === "name" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
              </div>
              <ResizeHandle col="name" />
            </th>
            <th style={{ width: colWidths.type, padding: '12px', fontWeight: 'bold', color: 'var(--color-text)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>種類</span>
              </div>
              <ResizeHandle col="type" />
            </th>
            <th style={{ width: colWidths.size, padding: '12px', fontWeight: 'bold', color: 'var(--color-text)', position: 'relative' }}>
              <div onClick={() => handleSort("size")} style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>サイズ {sortCol === "size" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
              </div>
              <ResizeHandle col="size" />
            </th>
            <th style={{ width: colWidths.updated, padding: '12px', fontWeight: 'bold', color: 'var(--color-text)', position: 'relative' }}>
              <div onClick={() => handleSort("updated")} style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>最終更新日時 {sortCol === "updated" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
              </div>
              <ResizeHandle col="updated" />
            </th>
          </tr>
        </thead>
        <tbody>
          {layout === 'B' ? (
            groupedData.length > 0 ? groupedData.map(group => (
              <React.Fragment key={group.groupName}>
                <tr>
                  <td colSpan={5} style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-muted)' }}>
                    {group.groupName}
                  </td>
                </tr>
                {group.files.map(renderRow)}
              </React.Fragment>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>条件に一致するファイルがありません</td>
              </tr>
            )
          ) : (
            displayData.map(renderRow)
          )}
          {layout !== 'B' && displayData.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>条件に一致するファイルがありません</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  return (
    <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {displayData.map(file => {
        const IconComp = TYPE_CONFIG[file.type]?.icon || TYPE_CONFIG.other.icon;
        const isStarred = starredPaths.includes(file.path);
        const isSelected = selectedFile?.id === file.id;
        return (
          <div
            key={file.id}
            onClick={() => setSelectedFile(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            onDoubleClick={() => (window as any).electronAPI?.openFile(file.path)}
            style={{
              border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative',
              backgroundColor: isSelected ? 'var(--color-secondary)' : 'var(--color-surface)',
              color: isSelected ? '#fff' : 'var(--color-text)',
              boxShadow: isSelected ? '0 0 0 1px var(--color-primary)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Star 
              size={16} 
              style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer', color: isStarred ? 'var(--color-accent)' : 'var(--color-muted)', fill: isStarred ? 'var(--color-accent)' : 'none' }} 
              onClick={(e) => toggleStar(file.path, e)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-bg)',
                color: isSelected ? '#fff' : TYPE_CONFIG[file.type]?.color || 'var(--color-text)',
                border: isSelected ? 'none' : `1px solid var(--color-border)`
              }}>
                <IconComp size={12} /> {TYPE_CONFIG[file.type]?.label || TYPE_CONFIG.other.label}
              </span>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} title={file.name}>
              {file.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'}` }}>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>{formatBytes(file.size)}</span>
              <span style={{ fontSize: '10px', opacity: 0.6 }}>{formatDate(file.updated).split(' ')[0]}</span>
            </div>
          </div>
        )
      })}
      {displayData.length === 0 && (
        <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>条件に一致するファイルがありません</div>
      )}
    </div>
  );
}
