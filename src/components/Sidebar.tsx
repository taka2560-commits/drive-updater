import { Monitor, FileText, Download, Folder, Plus, Star, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge, NavItem } from './ui';
import { useStore } from '../storeContext';
import type { FolderKey } from '../types';

const FOLDER_ICONS: Record<string, LucideIcon> = {
  desktop: Monitor,
  documents: FileText,
  downloads: Download,
  folder: Folder,
};

function SectionLabel({ children, top = 0 }: { children: string; top?: number }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--color-disabled)',
        letterSpacing: '0.08em',
        padding: `${top}px 18px 6px`,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}

function CountRow({ label, count, variant }: { label: string; count: number; variant: 'muted' | 'outline' | 'accent' }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <Badge variant={variant} size="sm">
        {count}
      </Badge>
    </span>
  );
}

export function Sidebar() {
  const { activeFolder, setActiveFolder, allFiles, screen, setScreen, starred, folders } = useStore();

  const countFor = (key: FolderKey) => allFiles.filter((f) => f.folder === key && !f.isDir).length;
  const standard = folders.filter((f) => f.isStandard);
  const custom = folders.filter((f) => !f.isStandard);

  const goFolder = (key: FolderKey) => {
    setActiveFolder(key);
    setScreen('main');
  };

  const isFolderActive = (key: FolderKey) => screen === 'main' && activeFolder === key;

  return (
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
      <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-head-text)', letterSpacing: '0.01em' }}>
          LocalUpdater
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-disabled)', marginTop: 2 }}>
          最近更新されたファイル
        </div>
      </div>

      <div style={{ padding: '14px 0', flex: 1, overflowY: 'auto' }}>
        <SectionLabel>標準フォルダ</SectionLabel>
        {standard.map((f, i) => (
          <NavItem
            key={f.key}
            Icon={FOLDER_ICONS[f.icon]}
            active={isFolderActive(f.key)}
            onClick={() => goFolder(f.key)}
          >
            <CountRow label={f.label} count={countFor(f.key)} variant={i === 0 ? 'muted' : 'outline'} />
          </NavItem>
        ))}

        <SectionLabel top={18}>追加フォルダ</SectionLabel>
        {custom.map((f) => (
          <NavItem
            key={f.key}
            Icon={Folder}
            active={isFolderActive(f.key)}
            onClick={() => goFolder(f.key)}
          >
            {f.label}
          </NavItem>
        ))}
        <NavItem Icon={Plus} onClick={() => setScreen('settings')}>
          フォルダを追加...
        </NavItem>

        <SectionLabel top={18}>その他</SectionLabel>
        <NavItem Icon={Star} active={screen === 'starred'} onClick={() => setScreen('starred')}>
          <CountRow label="スター付き" count={starred.size} variant="accent" />
        </NavItem>
      </div>

      <div style={{ padding: '10px 0', borderTop: '1px solid var(--color-border)' }}>
        <NavItem Icon={Settings} active={screen === 'settings'} onClick={() => setScreen('settings')}>
          設定
        </NavItem>
      </div>
    </div>
  );
}
