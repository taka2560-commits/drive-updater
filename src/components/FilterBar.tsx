import { type RefObject } from 'react';
import { Search, RefreshCw, List, LayoutGrid } from 'lucide-react';
import { Button } from './ui';
import { ActivityStrip } from './ActivityStrip';
import { useStore } from '../storeContext';
import { TYPE_CHIPS } from '../lib/fileType';
import type { FileEntry, DateRange, SizeFilter } from '../types';

export function FilterBar({
  files,
  searchRef,
}: {
  files: FileEntry[];
  searchRef: RefObject<HTMLInputElement | null>;
}) {
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    countByType,
    rescan,
    isScanning,
    recursive,
    setRecursive,
    viewMode,
    setViewMode,
    dateRange,
    setDateRange,
    sizeFilter,
    setSizeFilter,
  } = useStore();

  return (
    <div
      style={{
        padding: '14px 18px 10px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flexShrink: 0,
      }}
    >
      {/* Row 1: search + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-muted)',
            }}
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ファイル名で検索... (/)"
            aria-label="ファイル名で検索"
            style={{
              width: '100%',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              padding: '6px 10px 6px 30px',
              outline: 'none',
            }}
          />
        </div>

        <Button variant="secondary" size="md" Icon={RefreshCw} onClick={rescan} disabled={isScanning}>
          {isScanning ? 'スキャン中...' : '再スキャン'}
        </Button>

        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            style={{ accentColor: 'var(--color-accent)' }}
          />
          サブフォルダも
        </label>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            background: 'var(--color-bg)',
            borderRadius: 6,
            padding: 2,
            border: '1px solid var(--color-border)',
          }}
        >
          <ViewToggle active={viewMode === 'list'} Icon={List} label="リスト" onClick={() => setViewMode('list')} />
          <ViewToggle active={viewMode === 'grid'} Icon={LayoutGrid} label="グリッド" onClick={() => setViewMode('grid')} />
        </div>
      </div>

      {/* Row 2: type chips */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--color-muted)', marginRight: 2 }}>種類:</span>
        {TYPE_CHIPS.map((chip) => {
          const count = countByType[chip.key];
          const selected = typeFilter === chip.key;
          const disabled = count === 0 && chip.key !== 'all';
          return (
            <button
              key={chip.key}
              onClick={() => setTypeFilter(chip.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 10px',
                borderRadius: 9999,
                border: selected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: selected ? 'rgba(var(--accent-rgb), 0.12)' : 'transparent',
                color: selected ? 'var(--color-accent)' : 'var(--color-muted)',
                fontSize: 11,
                fontWeight: selected ? 500 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {chip.Icon && <chip.Icon size={11} />}
              {chip.label} · {count}
            </button>
          );
        })}
      </div>

      {/* Row 3: quick filters (period + size) */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-muted)', marginRight: 2 }}>期間:</span>
          {DATE_RANGES.map((r) => (
            <QuickChip
              key={r.key}
              label={r.label}
              selected={dateRange === r.key}
              onClick={() => setDateRange(r.key)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-muted)', marginRight: 2 }}>サイズ:</span>
          {SIZE_FILTERS.map((s) => (
            <QuickChip
              key={s.key}
              label={s.label}
              selected={sizeFilter === s.key}
              onClick={() => setSizeFilter(s.key)}
            />
          ))}
        </div>
      </div>

      {/* Row 4: activity strip */}
      <ActivityStrip files={files} />
    </div>
  );
}

const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'today', label: '今日' },
  { key: 'week', label: '今週' },
  { key: 'month', label: '今月' },
];

const SIZE_FILTERS: { key: SizeFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'gt1mb', label: '1MB+' },
  { key: 'gt10mb', label: '10MB+' },
  { key: 'gt100mb', label: '100MB+' },
];

function QuickChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px 10px',
        borderRadius: 9999,
        border: selected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
        background: selected ? 'rgba(var(--accent-rgb), 0.12)' : 'transparent',
        color: selected ? 'var(--color-accent)' : 'var(--color-muted)',
        fontSize: 11,
        fontWeight: selected ? 500 : 400,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  );
}

function ViewToggle({
  active,
  Icon,
  label,
  onClick,
}: {
  active: boolean;
  Icon: typeof List;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        border: 'none',
        background: active ? 'var(--color-surface)' : 'transparent',
        color: active ? 'var(--color-text)' : 'var(--color-muted)',
        fontSize: 11,
        borderRadius: 4,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Icon size={11} />
      {label}
    </button>
  );
}
