
import { FolderOpen, Settings, Star, ChevronLeft, ChevronRight, Monitor, FileText, Download, Plus } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  appMode: "files" | "settings" | "starred";
  setAppMode: (m: "files" | "settings" | "starred") => void;
  currentDir: string;
  setCurrentDir: (dir: string) => void;
  defaultPaths: { desktop: string; documents: string; downloads: string } | null;
  customDirs: { name: string; path: string }[];
  handleAddFolder: () => void;
  filesCount: number;
  starredCount: number;
}

export function Sidebar({
  collapsed, setCollapsed, appMode, setAppMode, currentDir, setCurrentDir, defaultPaths, customDirs, handleAddFolder, filesCount, starredCount
}: SidebarProps) {
  
  const navItemStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isActive ? 'var(--color-surface-2)' : 'transparent',
    borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent',
    color: isActive ? 'var(--color-text)' : 'var(--color-muted)',
    transition: 'background 0.2s',
  });

  return (
    <div style={{
      width: collapsed ? '64px' : '192px',
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      transition: 'width 0.3s',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{
        padding: '24px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--color-head-text)', lineHeight: 1.2 }}>LocalUpdater</span>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>最近更新されたファイル</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ color: 'var(--color-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {!collapsed && <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-muted)', padding: '8px 8px 4px' }}>標準フォルダ</div>}
          
          <div 
            onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.desktop); }}
            style={navItemStyle(appMode === "files" && currentDir === defaultPaths?.desktop)}
            onMouseOver={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.desktop) e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
            onMouseOut={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.desktop) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
              <Monitor size={18} />
              {!collapsed && <span style={{ fontSize: '13px', fontWeight: 'bold' }}>デスクトップ</span>}
            </div>
            {!collapsed && <span style={{ fontSize: '11px', color: (appMode === "files" && currentDir === defaultPaths?.desktop) ? 'var(--color-accent)' : 'var(--color-muted)', fontWeight: 'bold' }}>
              {currentDir === defaultPaths?.desktop ? filesCount : 12}
            </span>}
          </div>

          <div 
            onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.documents); }}
            style={navItemStyle(appMode === "files" && currentDir === defaultPaths?.documents)}
            onMouseOver={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.documents) e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
            onMouseOut={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.documents) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
              <FileText size={18} />
              {!collapsed && <span style={{ fontSize: '13px', fontWeight: 'bold' }}>ドキュメント</span>}
            </div>
            {!collapsed && <span style={{ fontSize: '11px', color: (appMode === "files" && currentDir === defaultPaths?.documents) ? 'var(--color-accent)' : 'var(--color-muted)', fontWeight: 'bold' }}>
              {currentDir === defaultPaths?.documents ? filesCount : 38}
            </span>}
          </div>

          <div 
            onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.downloads); }}
            style={navItemStyle(appMode === "files" && currentDir === defaultPaths?.downloads)}
            onMouseOver={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.downloads) e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
            onMouseOut={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.downloads) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
              <Download size={18} />
              {!collapsed && <span style={{ fontSize: '13px', fontWeight: 'bold' }}>ダウンロード</span>}
            </div>
            {!collapsed && <span style={{ fontSize: '11px', color: (appMode === "files" && currentDir === defaultPaths?.downloads) ? 'var(--color-accent)' : 'var(--color-muted)', fontWeight: 'bold' }}>
              {currentDir === defaultPaths?.downloads ? filesCount : 24}
            </span>}
          </div>

          {!collapsed && <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-muted)', padding: '16px 8px 4px' }}>追加フォルダ</div>}
          {customDirs.map((dir, i) => (
            <div 
              key={i} 
              onClick={() => { setAppMode("files"); setCurrentDir(dir.path); }}
              style={navItemStyle(appMode === "files" && currentDir === dir.path)}
              onMouseOver={(e) => { if (appMode !== "files" || currentDir !== dir.path) e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
              onMouseOut={(e) => { if (appMode !== "files" || currentDir !== dir.path) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <FolderOpen size={18} />
              {!collapsed && <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dir.name}</span>}
            </div>
          ))}

          <div 
            onClick={handleAddFolder}
            style={{ ...navItemStyle(false), color: 'var(--color-muted)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus size={18} />
            {!collapsed && <span style={{ fontSize: '13px' }}>フォルダを追加...</span>}
          </div>

          {!collapsed && <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-muted)', padding: '16px 8px 4px' }}>その他</div>}
          <div 
            onClick={() => setAppMode("starred")}
            style={navItemStyle(appMode === "starred")}
            onMouseOver={(e) => { if (appMode !== "starred") e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
            onMouseOut={(e) => { if (appMode !== "starred") e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
              <Star size={18} fill={appMode === "starred" ? "currentColor" : "none"} />
              {!collapsed && <span style={{ fontSize: '13px', fontWeight: 'bold' }}>スター付き</span>}
            </div>
            {!collapsed && <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>
              {starredCount}
            </span>}
          </div>
        </div>
      </div>

      <div style={{ padding: '8px', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
        <div 
          onClick={() => setAppMode("settings")}
          style={{...navItemStyle(appMode === "settings"), borderLeft: 'none', paddingLeft: '16px'}}
          onMouseOver={(e) => { if (appMode !== "settings") e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
          onMouseOut={(e) => { if (appMode !== "settings") e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Settings size={18} />
          {!collapsed && <span style={{ fontSize: '13px', fontWeight: 'bold' }}>設定</span>}
        </div>
      </div>
    </div>
  );
}
