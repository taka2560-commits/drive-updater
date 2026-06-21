import { Monitor, FileText, Download, Plus, Star, Settings } from 'lucide-react';

interface TopNavProps {
  appMode: "files" | "settings" | "starred";
  setAppMode: (mode: "files" | "settings" | "starred") => void;
  currentDir: string;
  setCurrentDir: (dir: string) => void;
  defaultPaths: {desktop:string, documents:string, downloads:string} | null;
  customDirs: {name:string, path:string}[];
  handleAddFolder: () => void;
}

export function TopNav({ appMode, setAppMode, currentDir, setCurrentDir, defaultPaths, customDirs, handleAddFolder }: TopNavProps) {
  
  const tabStyle = (active: boolean) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '0 16px', height: '100%', cursor: 'pointer',
    color: active ? 'var(--color-text)' : 'var(--color-muted)',
    borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{ height: '56px', width: '100%', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '28px', marginRight: '24px', borderRight: '1px solid var(--color-border)', height: '32px' }}>
        <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--color-accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>L</div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-text)', lineHeight: 1 }}>LocalUpdater</div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '2px' }}>最近更新されたファイル</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', height: '100%', flex: 1, overflowX: 'auto', overflowY: 'hidden', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <div style={tabStyle(appMode === "files" && currentDir === defaultPaths?.desktop)} onClick={() => { setCurrentDir(defaultPaths?.desktop || ""); setAppMode("files"); }}>
          <Monitor size={14} /> デスクトップ
        </div>
        <div style={tabStyle(appMode === "files" && currentDir === defaultPaths?.documents)} onClick={() => { setCurrentDir(defaultPaths?.documents || ""); setAppMode("files"); }}>
          <FileText size={14} /> ドキュメント
        </div>
        <div style={tabStyle(appMode === "files" && currentDir === defaultPaths?.downloads)} onClick={() => { setCurrentDir(defaultPaths?.downloads || ""); setAppMode("files"); }}>
          <Download size={14} /> ダウンロード
        </div>
        
        {customDirs.map(d => (
          <div key={d.path} style={tabStyle(appMode === "files" && currentDir === d.path)} onClick={() => { setCurrentDir(d.path); setAppMode("files"); }}>
            <span style={{ fontSize: '12px' }}>📁</span> {d.name}
          </div>
        ))}

        <div style={{ ...tabStyle(false), color: 'var(--color-muted)' }} onClick={handleAddFolder}>
          <Plus size={14} /> 追加
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px' }}>
        <div style={{ ...tabStyle(appMode === "starred"), padding: '0 4px' }} onClick={() => setAppMode("starred")}>
          <Star size={18} fill={appMode === "starred" ? 'var(--color-accent)' : 'none'} color={appMode === "starred" ? 'var(--color-accent)' : 'var(--color-muted)'} />
        </div>
        <div style={{ ...tabStyle(appMode === "settings"), padding: '0 4px' }} onClick={() => setAppMode("settings")}>
          <Settings size={18} color={appMode === "settings" ? 'var(--color-text)' : 'var(--color-muted)'} />
        </div>
      </div>
    </div>
  );
}
