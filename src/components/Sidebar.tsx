
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
}

export function Sidebar({
  collapsed, setCollapsed, appMode, setAppMode, currentDir, setCurrentDir, defaultPaths, customDirs, handleAddFolder
}: SidebarProps) {
  
  const navItemStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    color: isActive ? '#fff' : 'var(--color-text)',
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
        padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {!collapsed && <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
          <FolderOpen size={18} /> LocalUpdater
        </span>}
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
            <Monitor size={18} />
            {!collapsed && <span style={{ fontSize: '13px' }}>デスクトップ</span>}
          </div>

          <div 
            onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.documents); }}
            style={navItemStyle(appMode === "files" && currentDir === defaultPaths?.documents)}
            onMouseOver={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.documents) e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
            onMouseOut={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.documents) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <FileText size={18} />
            {!collapsed && <span style={{ fontSize: '13px' }}>ドキュメント</span>}
          </div>

          <div 
            onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.downloads); }}
            style={navItemStyle(appMode === "files" && currentDir === defaultPaths?.downloads)}
            onMouseOver={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.downloads) e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
            onMouseOut={(e) => { if (appMode !== "files" || currentDir !== defaultPaths?.downloads) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <Download size={18} />
            {!collapsed && <span style={{ fontSize: '13px' }}>ダウンロード</span>}
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
            <Star size={18} fill={appMode === "starred" ? "currentColor" : "none"} />
            {!collapsed && <span style={{ fontSize: '13px' }}>スター付き</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: '8px', borderTop: '1px solid var(--color-border)' }}>
        <div 
          onClick={() => setAppMode("settings")}
          style={navItemStyle(appMode === "settings")}
          onMouseOver={(e) => { if (appMode !== "settings") e.currentTarget.style.backgroundColor = 'var(--color-border)' }}
          onMouseOut={(e) => { if (appMode !== "settings") e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Settings size={18} />
          {!collapsed && <span style={{ fontSize: '13px' }}>設定</span>}
        </div>
      </div>
    </div>
  );
}
