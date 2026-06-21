
import { Search, RefreshCw } from 'lucide-react';
import { TYPE_CONFIG } from './types';
import type { LayoutMode } from '../hooks/useLayout';

interface FilterBarProps {
  layout: LayoutMode;
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
}

export function FilterBar({
  layout, searchQuery, setSearchQuery, appMode, fetchFiles, viewMode, setViewMode, activeFilters, toggleFilter, recursive, setRecursive, activityData = []
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
                padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                color: 'var(--color-text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
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
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(TYPE_CONFIG).map(([type, config]) => {
            const IconComponent = config.icon;
            const isActive = activeFilters.includes(type);
            return (
              <button 
                key={type} onClick={() => toggleFilter(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                  borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                  border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: isActive ? 'var(--color-secondary)' : 'var(--color-surface)',
                  color: isActive ? '#fff' : 'var(--color-text)',
                  transition: 'all 0.2s'
                }}
              >
                <IconComponent size={14} /> {config.label}
              </button>
            )
          })}
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
           <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 'bold' }}>
             {layout === 'A' ? '14日間のアクティビティ帯' : '14日間のアクティビティヒートマップ'}
           </div>
           
           {layout === 'A' ? (
             <div style={{ display: 'flex', gap: '2px', height: '16px', alignItems: 'flex-end' }}>
               {activityData.length > 0 ? activityData.map((count, i) => (
                  <div key={i} title={`${count} items`} style={{ 
                    flex: 1, 
                    backgroundColor: count > 0 ? 'var(--color-primary)' : 'var(--color-border)',
                    height: `${Math.max(20, Math.min(100, count * 10))}%`,
                    borderRadius: '2px 2px 0 0',
                    opacity: count > 0 ? 0.8 : 0.3
                  }} />
               )) : Array.from({length: 14}).map((_, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: 'var(--color-border)', height: '20%', borderRadius: '2px 2px 0 0', opacity: 0.3 }} />
               ))}
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
