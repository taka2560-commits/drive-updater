
import { Search, RefreshCw } from 'lucide-react';
import { TYPE_CONFIG } from './types';
import type { LayoutMode } from '../hooks/useLayout';

interface FilterBarProps {
  layout: LayoutMode;
  setLayout: (mode: LayoutMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  appMode: "files" | "settings" | "starred";
  fetchFiles: () => void;
  viewMode: "list" | "grid";
  setViewMode: (m: "list" | "grid") => void;
  activeFilters: string[];
  toggleFilter: (type: string) => void;
  recursive: boolean;
  setRecursive: (v: boolean) => void;
  activityData?: number[]; // [1, 5, 0, 12, ...] length 14
  typeCounts: Record<string, number>;
  totalFiles: number;
}

export function FilterBar({
  layout, setLayout, searchQuery, setSearchQuery, appMode, fetchFiles, viewMode, setViewMode, activeFilters, toggleFilter, recursive, setRecursive, activityData = [], typeCounts, totalFiles
}: FilterBarProps) {
  
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ position: 'relative', maxWidth: '400px', width: '100%', color: 'var(--color-muted)' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" placeholder="ファイル名を検索..." 
              style={{
                width: '100%', padding: '8px 16px 8px 36px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text)',
                outline: 'none',
              }}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
          {appMode === "files" && (
            <button 
              onClick={fetchFiles} 
              style={{
                padding: '8px 12px', backgroundColor: 'transparent', border: '1px solid var(--color-sec-text)',
                color: 'var(--color-sec-text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <RefreshCw size={16} /> 再スキャン
            </button>
          )}
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '4px', border: '1px solid var(--color-border)' }}>
          <button 
            onClick={() => setViewMode("list")} 
            style={{
              padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none',
              backgroundColor: viewMode === 'list' ? 'var(--color-bg)' : 'transparent',
              color: viewMode === 'list' ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            ≡ リスト
          </button>
          <button 
            onClick={() => setViewMode("grid")} 
            style={{
              padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none',
              backgroundColor: viewMode === 'grid' ? 'var(--color-bg)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            ▦ グリッド
          </button>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '4px', border: '1px solid var(--color-border)', marginLeft: '8px' }}>
          <button 
            onClick={() => setLayout("A")} 
            style={{
              padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none',
              backgroundColor: layout === 'A' ? 'var(--color-bg)' : 'transparent',
              color: layout === 'A' ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: layout === 'A' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            A案: 右ペイン
          </button>
          <button 
            onClick={() => setLayout("B")} 
            style={{
              padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none',
              backgroundColor: layout === 'B' ? 'var(--color-bg)' : 'transparent',
              color: layout === 'B' ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: layout === 'B' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            B案: カード
          </button>
          <button 
            onClick={() => setLayout("C")} 
            style={{
              padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none',
              backgroundColor: layout === 'C' ? 'var(--color-bg)' : 'transparent',
              color: layout === 'C' ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: layout === 'C' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            C案: モーダル
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 'bold' }}>種類:</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* すべてボタン */}
            <button 
              onClick={() => toggleFilter('all')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px 12px',
                borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', minWidth: '70px',
                border: activeFilters.length === 0 ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                color: activeFilters.length === 0 ? 'var(--color-accent)' : 'var(--color-text)',
                transition: 'all 0.2s', lineHeight: 1.2
              }}
            >
              <span>すべて・</span>
              <span style={{ fontSize: '12px' }}>{totalFiles}</span>
            </button>

            {Object.entries(TYPE_CONFIG).map(([type, config]) => {
              const IconComponent = config.icon;
              const isActive = activeFilters.includes(type);
              const count = typeCounts[type] || 0;
              return (
                <button 
                  key={type} onClick={() => toggleFilter(type)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px 12px',
                    borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', minWidth: '70px',
                    border: `1px solid ${isActive ? 'var(--color-sec-text)' : 'var(--color-border)'}`,
                    backgroundColor: 'transparent',
                    color: isActive ? 'var(--color-sec-text)' : 'var(--color-muted)',
                    transition: 'all 0.2s', lineHeight: 1.2
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconComponent size={12} /> {config.label}・
                  </div>
                  <span style={{ fontSize: '12px', color: isActive ? 'var(--color-sec-text)' : 'var(--color-text)' }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
        {appMode === "files" && (
          <label style={{
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px',
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '6px 12px', borderRadius: '8px'
          }}>
            <input 
              type="checkbox" 
              checked={recursive} 
              onChange={(e) => setRecursive(e.target.checked)} 
              style={{ accentColor: 'var(--color-primary)' }}
            />
            サブフォルダもスキャン
          </label>
        )}
      </div>

      {appMode === "files" && layout !== 'B' && (
        <div style={{ padding: '8px 0', borderTop: '1px solid var(--color-border)' }}>
           {layout === 'A' ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                 過去14日
               </div>
               <div style={{ display: 'flex', gap: '4px', height: '24px', alignItems: 'flex-end', flex: 1, maxWidth: '300px' }}>
                 {activityData.length > 0 ? activityData.map((count, i) => (
                    <div key={i} title={`${count} items`} style={{ 
                      flex: 1, 
                      backgroundColor: count > 0 ? 'var(--color-accent)' : 'var(--color-border)',
                      height: `${Math.max(10, Math.min(100, count * 15))}%`,
                      borderRadius: '2px 2px 0 0',
                      opacity: count > 0 ? 0.9 : 0.3
                    }} />
                 )) : Array.from({length: 14}).map((_, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: 'var(--color-border)', height: '10%', borderRadius: '2px 2px 0 0', opacity: 0.3 }} />
                 ))}
               </div>
               <div style={{ fontSize: '11px', color: 'var(--color-text)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                 合計 {activityData.reduce((a,b)=>a+b, 0)}件
               </div>
             </div>
           ) : (
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', height: 'auto', width: '100%', maxWidth: '240px' }}>
               {/* Layout C: Heatmap (2 rows of 7) */}
               {activityData.length > 0 ? activityData.map((count, i) => (
                  <div key={i} title={`${count} items`} style={{ 
                    flex: '1 0 12%', aspectRatio: '1/1',
                    backgroundColor: count > 0 ? 'var(--color-primary)' : 'var(--color-surface)',
                    borderRadius: '2px',
                    border: '1px solid var(--color-border)',
                    opacity: count > 0 ? Math.min(1, 0.4 + count * 0.1) : 0.5
                  }} />
               )) : Array.from({length: 14}).map((_, i) => (
                  <div key={i} style={{ flex: '1 0 12%', aspectRatio: '1/1', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '2px', opacity: 0.5 }} />
               ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}
