import { FolderOpen, SearchX, Star } from 'lucide-react';
import { Button } from './ui';

interface EmptyStateProps {
  variant: 'folder' | 'search' | 'starred';
  query?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

/** Centered empty-state messaging (spec §5.1). */
export function EmptyState({ variant, query, onPrimary, onSecondary }: EmptyStateProps) {
  const config = {
    folder: {
      Icon: FolderOpen,
      title: 'このフォルダにはファイルがまだありません',
      sub: undefined as string | undefined,
      primary: '再スキャン',
      secondary: undefined as string | undefined,
    },
    search: {
      Icon: SearchX,
      title: `"${query ?? ''}" に一致するファイルが見つかりません`,
      sub: undefined,
      primary: '検索をクリア',
      secondary: 'すべて表示',
    },
    starred: {
      Icon: Star,
      title: 'スター付きファイルはまだありません',
      sub: 'ファイル名横の ☆ をクリックして追加できます',
      primary: undefined,
      secondary: undefined,
    },
  }[variant];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: 40,
        textAlign: 'center',
        background: 'var(--color-bg)',
      }}
    >
      <config.Icon size={44} color="var(--color-disabled)" />
      <div style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500, maxWidth: 320, lineHeight: 1.6 }}>
        {config.title}
      </div>
      {config.sub && (
        <div style={{ fontSize: 12, color: 'var(--color-muted)', maxWidth: 320, lineHeight: 1.6 }}>
          {config.sub}
        </div>
      )}
      {(config.primary || config.secondary) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {config.primary && (
            <Button variant="primary" size="md" onClick={onPrimary}>
              {config.primary}
            </Button>
          )}
          {config.secondary && (
            <Button variant="secondary" size="md" onClick={onSecondary}>
              {config.secondary}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
