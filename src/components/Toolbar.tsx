import { type RefObject, useState } from 'react';
import { List, Clock, CalendarRange, Search, RefreshCw, Settings, X } from 'lucide-react';
import { useStore } from '../storeContext';
import type { ViewMode } from '../types';

const VIEWS: { value: ViewMode; label: string; Icon: typeof List }[] = [
  { value: 'list', label: 'リスト', Icon: List },
  { value: 'timeline', label: 'タイムライン', Icon: Clock },
  { value: 'calendar', label: 'カレンダー', Icon: CalendarRange },
];

export function Toolbar({ searchRef }: { searchRef: RefObject<HTMLInputElement | null> }) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, rescan, isScanning, setScreen, screen } = useStore();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--header-height)',
        padding: '0 var(--gutter-window)',
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 12,
        flexShrink: 0,
      }}
    >
      {/* Left: title */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          最近更新されたファイル
        </h1>
      </div>

      {/* Center: segmented view control */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <div
          role="tablist"
          style={{
            display: 'inline-flex',
            padding: 2,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            gap: 2,
          }}
        >
          {VIEWS.map((v) => {
            const active = viewMode === v.value;
            return (
              <button
                key={v.value}
                role="tab"
                aria-selected={active}
                onClick={() => setViewMode(v.value)}
                style={{
                  height: 32,
                  padding: '0 14px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
                }}
              >
                <v.Icon size={14} />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: search + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 200 }}>
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ファイル名で検索…"
            aria-label="ファイル名で検索"
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              padding: '6px 30px 6px 30px',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'inline-flex',
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <ToolbarButton
          Icon={RefreshCw}
          title="再スキャン"
          onClick={rescan}
          disabled={isScanning}
          spinning={isScanning}
        />
        <ToolbarButton
          Icon={Settings}
          title="設定"
          onClick={() => setScreen(screen === 'settings' ? 'main' : 'settings')}
          active={screen === 'settings'}
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  Icon,
  title,
  onClick,
  disabled,
  active,
  spinning,
}: {
  Icon: typeof Settings;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  spinning?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: active ? 'var(--surface)' : hovered ? 'var(--surface-hover)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
    >
      <Icon
        size={15}
        style={spinning ? { animation: 'lu-spin 0.8s linear infinite' } : undefined}
      />
    </button>
  );
}
