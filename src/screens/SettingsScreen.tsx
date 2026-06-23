import { useState } from 'react';
import { Settings, Palette, Filter, FolderPlus, Info, Check, Folder, Plus, X, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Window } from '../components/Window';
import { Button } from '../components/ui';
import { useStore } from '../storeContext';
import { THEMES, THEME_LABELS, THEME_SUBTITLES, type ThemeName } from '../theme/tokens';
import type { SettingsTab } from '../types';

const TABS: { key: SettingsTab; label: string; Icon: LucideIcon }[] = [
  { key: 'appearance', label: '外観', Icon: Palette },
  { key: 'exclude', label: 'スキャン除外', Icon: Filter },
  { key: 'folders', label: '追加フォルダ', Icon: FolderPlus },
  { key: 'about', label: 'アプリ情報', Icon: Info },
];

export function SettingsScreen() {
  const { settingsTab, setSettingsTab, setScreen } = useStore();

  return (
    <Window
      title={
        <>
          <Settings size={11} />
          LocalUpdater — 設定
        </>
      }
    >
      {/* Settings nav column */}
      <div
        style={{
          width: 192,
          flexShrink: 0,
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          onClick={() => setScreen('main')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setScreen('main')}
          style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-head-text)' }}>LocalUpdater</div>
          <div style={{ fontSize: 10, color: 'var(--color-disabled)', marginTop: 2 }}>← ファイル一覧へ戻る</div>
        </div>
        <div style={{ padding: '14px 0' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--color-disabled)',
              letterSpacing: '0.08em',
              padding: '0 18px 6px',
              textTransform: 'uppercase',
            }}
          >
            設定項目
          </div>
          {TABS.map((t) => {
            const active = settingsTab === t.key;
            return (
              <div
                key={t.key}
                onClick={() => setSettingsTab(t.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSettingsTab(t.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 18px',
                  height: 36,
                  fontSize: 13,
                  cursor: 'pointer',
                  color: active ? 'var(--color-text)' : 'var(--color-muted)',
                  background: active ? 'var(--color-bg)' : 'transparent',
                  borderLeft: active ? '3px solid var(--color-accent)' : '3px solid transparent',
                  boxSizing: 'border-box',
                }}
              >
                <t.Icon size={15} color={active ? 'var(--color-accent)' : 'currentColor'} />
                {t.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 36px' }}>
        {settingsTab === 'appearance' && <AppearanceTab />}
        {settingsTab === 'exclude' && <ExcludeTab />}
        {settingsTab === 'folders' && <FoldersTab />}
        {settingsTab === 'about' && <AboutTab />}
      </div>
    </Window>
  );
}

// ---- Appearance -------------------------------------------------------------
function AppearanceTab() {
  const { theme, setTheme } = useStore();
  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>設定</h1>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '0 0 28px' }}>
        アプリケーションの動作と外観を調整します。
      </p>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-head-text)', margin: '0 0 4px' }}>
          テーマ <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>— 3モードから選択</span>
        </h2>
        <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: '0 0 12px' }}>
          クリックで即座にアプリ全体の配色が切り替わります。
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['earth', 'night', 'light'] as ThemeName[]).map((t) => (
            <ThemeCard key={t} name={t} selected={theme === t} onSelect={() => setTheme(t)} />
          ))}
        </div>
      </div>
    </>
  );
}

function ThemeCard({ name, selected, onSelect }: { name: ThemeName; selected: boolean; onSelect: () => void }) {
  const tk = THEMES[name];
  const swatches = [tk.primary, tk.secondary, tk.accent, tk.bg];
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      style={{
        flex: 1,
        background: 'var(--color-surface)',
        border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
        borderRadius: 8,
        padding: 14,
        cursor: 'pointer',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={10} color="var(--color-bg)" />
        </div>
      )}
      {name === 'light' && !selected && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#F5563D',
            color: '#fff',
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 9999,
            letterSpacing: '0.04em',
          }}
        >
          NEW
        </div>
      )}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {swatches.map((c, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: c,
              border: i === 3 ? '1px solid var(--color-border)' : 'none',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: selected ? 'var(--color-text)' : 'var(--color-muted)' }}>
        {THEME_LABELS[name]}
      </div>
      <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 2 }}>{THEME_SUBTITLES[name]}</div>
    </div>
  );
}

// ---- Exclude ----------------------------------------------------------------
function ExcludeTab() {
  const { excludeKeywords, addExclude, removeExclude } = useStore();
  const [draft, setDraft] = useState('');
  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>スキャン除外</h1>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '0 0 24px' }}>
        ファイル名またはパスにこれらを含むファイルは一覧から除外します。
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: 10,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          maxWidth: 560,
        }}
      >
        {excludeKeywords.map((kw) => (
          <span
            key={kw}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 8px 3px 10px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 9999,
              fontSize: 11,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {kw}
            <button
              onClick={() => removeExclude(kw)}
              aria-label={`${kw} を削除`}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', color: 'var(--color-muted)' }}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addExclude(draft);
              setDraft('');
            }
          }}
          placeholder="+ 追加..."
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            fontSize: 11,
            padding: '3px 8px',
            outline: 'none',
            fontFamily: 'var(--font-mono)',
            minWidth: 90,
            flex: 1,
          }}
        />
      </div>
    </>
  );
}

// ---- Folders ----------------------------------------------------------------
function FoldersTab() {
  const { folders, addCustomFolder, removeCustomFolder } = useStore();
  const custom = folders.filter((f) => !f.isStandard);

  const handleAdd = async () => {
    const api = (window as unknown as { localUpdater?: { selectFolder: () => Promise<{ name: string; path: string } | null> } }).localUpdater;
    if (api?.selectFolder) {
      const result = await api.selectFolder();
      if (result) addCustomFolder(result.name, result.path);
    }
  };

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>追加フォルダ</h1>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '0 0 24px' }}>
        サイドバーに表示するカスタムフォルダ。
      </p>
      {custom.length > 0 && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden', maxWidth: 560, marginBottom: 10 }}>
          {custom.map((f, i) => (
            <div
              key={f.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 14px',
                borderBottom: i === custom.length - 1 ? 'none' : '1px solid var(--color-border)',
                gap: 12,
              }}
            >
              <Folder size={15} color="var(--color-head-text)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>{f.path}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeCustomFolder(f.key)}>削除</Button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <Button variant="primary" size="md" Icon={Plus} onClick={handleAdd}>フォルダを追加</Button>
      </div>
    </>
  );
}

// ---- About ------------------------------------------------------------------
function AboutTab() {
  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>アプリ情報</h1>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '0 0 24px' }}>
        LocalUpdater について。
      </p>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 20, maxWidth: 480, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderPlus size={20} color="var(--color-bg)" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>LocalUpdater</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>バージョン 1.0.0</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
          ローカルの特定フォルダをスキャンして「最近更新されたファイル」を一覧表示する
          デスクトップアプリ。Electron + React 19 で動作します。
        </p>
        <Button variant="secondary" size="md" Icon={ExternalLink}>GitHub で見る</Button>
      </div>
    </>
  );
}
