import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLayout } from '../hooks/useLayout';

interface SettingsProps {
  excludeTerms: string;
  setExcludeTerms: (val: string) => void;
  customDirs: { name: string; path: string }[];
  setCustomDirs: (dirs: { name: string; path: string }[]) => void;
}

export function Settings({ excludeTerms, setExcludeTerms, customDirs, setCustomDirs }: SettingsProps) {
  const [theme, setTheme] = useTheme();
  const [layout, setLayout] = useLayout();

  const sectionStyle = {
    padding: '24px',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    backgroundColor: 'var(--color-surface)',
    marginBottom: '24px',
    boxShadow: theme === 'light' ? '0 1px 2px rgba(42,63,57,0.10)' : 'none',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    outline: 'none',
    fontSize: '14px',
  };

  const themeCardStyle = (isActive: boolean) => ({
    flex: 1,
    padding: '16px',
    border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: '8px',
    backgroundColor: 'var(--color-bg)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SettingsIcon size={28} /> 設定
      </h1>
      
      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>テーマ設定</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '16px' }}>
          アプリケーションの外観を選択します。
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={themeCardStyle(theme === 'earth')} onClick={() => setTheme('earth')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #31658F 0%, #246169 100%)' }} />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Earth (標準)</span>
          </div>
          <div style={themeCardStyle(theme === 'night')} onClick={() => setTheme('night')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1F74C1 0%, #183095 100%)' }} />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Night</span>
          </div>
          <div style={themeCardStyle(theme === 'light')} onClick={() => setTheme('light')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #5DCFAF 0%, #39BAC1 100%)', border: '1px solid #DCE3E0' }} />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Light</span>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>レイアウト設定</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '16px' }}>
          メイン画面の構造を選択します。
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={themeCardStyle(layout === 'A')} onClick={() => setLayout('A')}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>A案: 右ペイン</span>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>詳細を常に右側に表示</span>
          </div>
          <div style={themeCardStyle(layout === 'B')} onClick={() => setLayout('B')}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>B案: インライン</span>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>日付グループ＆行下に展開</span>
          </div>
          <div style={themeCardStyle(layout === 'C')} onClick={() => setLayout('C')}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>C案: モーダル</span>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>詳細をポップアップ表示</span>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>スキャン除外キーワード</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '16px' }}>
          ファイル名またはパスに以下のキーワードが含まれる場合、スキャン対象から除外します。複数ある場合はカンマ（,）で区切ってください。
        </p>
        <input 
          type="text" 
          style={inputStyle}
          value={excludeTerms}
          onChange={(e) => setExcludeTerms(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '16px' }}>追加フォルダの管理</h2>
        {customDirs.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--color-muted)' }}>追加されたフォルダはありません。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {customDirs.map((dir, idx) => (
              <div key={idx} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                backgroundColor: 'var(--color-bg)', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '6px'
              }}>
                <div style={{ overflow: 'hidden', marginRight: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{dir.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{dir.path}</div>
                </div>
                <button 
                  onClick={() => setCustomDirs(customDirs.filter((_, i) => i !== idx))}
                  style={{ 
                    color: 'var(--color-accent)', background: 'transparent', border: 'none', 
                    fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 8px' 
                  }}
                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
