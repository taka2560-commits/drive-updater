import { useEffect, useMemo, useState } from 'react';
import { HardDrive, Folder, FolderOpen, RefreshCw, X, ChevronRight, ExternalLink, Plus } from 'lucide-react';
import { Button } from '../components/ui';
import { FileTypeBadge } from '../components/FileTypeBadge';
import { useStore } from '../storeContext';
import { formatBytes, formatDateTime } from '../lib/format';
import { baseName, dirName, relativeTo, trimTrailingSep } from '../lib/paths';
import { groupByKind } from '../lib/usageKind';
import { sampleUsageApi } from '../lib/usageSample';
import type { UsageNode, UsageProgress, UsageSummary } from '../types';

const ROOT_KEY = 'localUpdater.usageRoot';
const MAX_CHILDREN = 200;

function usageApi() {
  return window.localUpdater ?? sampleUsageApi;
}

function loadRoot(): string | null {
  try {
    return localStorage.getItem(ROOT_KEY);
  } catch {
    return null;
  }
}

const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);
const pctLabel = (part: number, whole: number) => {
  const v = pct(part, whole);
  return v > 0 && v < 0.1 ? '<0.1%' : `${v.toFixed(1)}%`;
};
const rootLabel = (p: string) => baseName(trimTrailingSep(p)) || p;

export function UsageContent() {
  const { folders } = useStore();
  const [root, setRoot] = useState<string | null>(loadRoot);
  const [path, setPath] = useState<string | null>(root);
  const [saved, setSaved] = useState<UsageSummary[]>([]);
  const [result, setResult] = useState<{ key: string; node: UsageNode | null } | null>(null);
  const [reload, setReload] = useState(0);
  const [running, setRunning] = useState<string | null>(null);
  const [progress, setProgress] = useState<UsageProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    usageApi().listUsage().then((list) => {
      if (!cancelled) setSaved(list);
    });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  useEffect(() => {
    const api = usageApi();
    // An analysis started before this screen was opened (e.g. a whole drive) may still be running.
    api.usageStatus().then((p) => {
      if (p) {
        setRunning(p.root);
        setProgress(p);
      }
    });
    return api.onUsageProgress((p) => {
      if (!p.done) {
        setProgress(p);
        return;
      }
      setRunning((cur) => (cur === p.root ? null : cur));
      setReload((n) => n + 1);
    });
  }, []);

  const key = root && path ? `${root}\n${path}\n${reload}` : null;
  useEffect(() => {
    if (!root || !path || !key) return;
    let cancelled = false;
    usageApi()
      .getUsageNode(root, path)
      .then((node) => {
        if (!cancelled) setResult({ key, node });
      });
    return () => {
      cancelled = true;
    };
  }, [root, path, key]);

  const loading = key !== null && result?.key !== key;
  const node = result?.key === key ? result.node : null;

  const analyze = async (target: string) => {
    setError(null);
    setProgress(null);
    setRunning(target);
    const res = await usageApi().analyzeUsage(target);
    // Starting another analysis cancels this one; don't clear that newer run's state.
    setRunning((cur) => (cur === target ? null : cur));
    if ('canceled' in res) return;
    if ('ok' in res) {
      // The main process normalises the path; follow it so later lookups match.
      setRoot(res.root);
      setPath((p) => (p && p !== target ? p : res.root));
      setReload((n) => n + 1);
    } else if ('error' in res) {
      setError('このフォルダは分析できませんでした（存在しないか、アクセスできません）');
    }
  };

  const selectRoot = (target: string, analyzeIfNew = true) => {
    setRoot(target);
    setPath(target);
    setError(null);
    try {
      localStorage.setItem(ROOT_KEY, target);
    } catch {
      /* ignore */
    }
    if (analyzeIfNew && !saved.some((s) => s.root === target)) void analyze(target);
  };

  const pickFolder = async () => {
    const picked = await window.localUpdater?.selectFolder();
    if (picked) selectRoot(picked.path);
  };

  // Watched folders first, then other saved analyses (e.g. whole drives).
  const targets = useMemo(() => {
    const list = folders.map((f) => ({ path: f.path, label: f.label }));
    for (const s of saved) if (!list.some((t) => t.path === s.root)) list.push({ path: s.root, label: rootLabel(s.root) });
    return list;
  }, [folders, saved]);

  const isRunningHere = running !== null && running === root;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
      {/* Header: title + target chooser */}
      <div style={{ padding: '18px var(--gutter-window) 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <HardDrive size={16} color="var(--accent)" />
          容量分析
        </h1>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 12px' }}>
          フォルダごとのサイズ・ファイルの種類・件数を集計します。前回の結果は保存され、すぐに表示されます。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {targets.map((t) => {
            const active = t.path === root;
            return (
              <button
                key={t.path}
                onClick={() => selectRoot(t.path)}
                title={t.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                }}
              >
                <Folder size={12} />
                {t.label}
              </button>
            );
          })}
          {window.localUpdater && (
            <Button variant="ghost" size="sm" Icon={Plus} onClick={pickFolder}>
              フォルダ / ドライブを選ぶ…
            </Button>
          )}
        </div>
      </div>

      {/* Status: when the result is from, or live progress */}
      {root && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px var(--gutter-window)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            minHeight: 44,
            flexShrink: 0,
          }}
        >
          {isRunningHere ? (
            <>
              <RefreshCw size={13} style={{ animation: 'lu-spin 0.8s linear infinite', flexShrink: 0 }} color="var(--accent)" />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>
                分析中… {(progress?.files ?? 0).toLocaleString('ja-JP')} 件 · {formatBytes(progress?.bytes ?? 0)}
              </span>
              <span
                title={progress?.current}
                style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}
              >
                {progress?.current}
              </span>
              <Button variant="secondary" size="sm" Icon={X} onClick={() => void usageApi().cancelUsage()}>
                中止
              </Button>
            </>
          ) : (
            <>
              <span style={{ flex: 1 }}>
                {node
                  ? `${formatDateTime(node.scannedAt)} 時点の結果`
                  : loading
                    ? '読み込み中…'
                    : 'このフォルダはまだ分析していません'}
                {node && node.inaccessible > 0 && (
                  <span style={{ marginLeft: 10, color: 'var(--text-muted)' }}>
                    （アクセスできないフォルダ {node.inaccessible.toLocaleString('ja-JP')} 件は除外）
                  </span>
                )}
              </span>
              <Button
                variant={node ? 'secondary' : 'primary'}
                size="sm"
                Icon={RefreshCw}
                disabled={running !== null}
                onClick={() => void analyze(root)}
              >
                {node ? '再分析' : '分析する'}
              </Button>
            </>
          )}
        </div>
      )}

      {error && (
        <div role="status" style={{ padding: '8px var(--gutter-window)', fontSize: 12, color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {!root ? (
        <CenterNote>上の一覧から分析するフォルダを選んでください。</CenterNote>
      ) : node ? (
        <NodeView node={node} onOpen={setPath} />
      ) : loading || isRunningHere ? null : (
        <CenterNote>「分析する」を押すと、このフォルダの中身を集計します。</CenterNote>
      )}
    </div>
  );
}

function CenterNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 13 }}>
      {children}
    </div>
  );
}

function NodeView({ node, onOpen }: { node: UsageNode; onOpen: (path: string) => void }) {
  const kinds = useMemo(() => groupByKind(node.exts), [node.exts]);
  const ownBytes = node.bytes - node.children.reduce((s, c) => s + c.bytes, 0);
  const ownFiles = node.files - node.children.reduce((s, c) => s + c.files, 0);

  // Breadcrumb from the analysed root down to the current folder.
  const rel = node.path === node.root ? null : relativeTo(node.root, node.path);
  const segments = rel ? rel.split(/[\\/]/).filter(Boolean) : [];
  const sep = node.root.includes('\\') ? '\\' : '/';
  const base = trimTrailingSep(node.root);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px var(--gutter-window) 28px' }}>
      <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, fontSize: 12, marginBottom: 14 }}>
        <Crumb label={rootLabel(node.root)} title={node.root} onClick={segments.length ? () => onOpen(node.root) : undefined} />
        {segments.map((seg, i) => {
          const p = base + sep + segments.slice(0, i + 1).join(sep);
          return (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ChevronRight size={11} color="var(--text-muted)" />
              <Crumb label={seg} title={p} onClick={i < segments.length - 1 ? () => onOpen(p) : undefined} />
            </span>
          );
        })}
        <button
          onClick={() => void window.localUpdater?.openPath(node.path)}
          title="エクスプローラーで開く"
          style={{ ...iconBtn, marginLeft: 6 }}
        >
          <FolderOpen size={13} />
        </button>
      </nav>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <Stat label="合計サイズ" value={formatBytes(node.bytes)} accent />
        <Stat label="ファイル" value={`${node.files.toLocaleString('ja-JP')} 件`} />
        <Stat label="フォルダ" value={`${node.dirs.toLocaleString('ja-JP')} 件`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18, alignItems: 'start' }}>
        {/* Sub-folders */}
        <Card title="サブフォルダ" note={`${node.children.length.toLocaleString('ja-JP')} 件 · サイズ順`}>
          {node.children.length === 0 && ownFiles === 0 ? (
            <Empty>中身がありません</Empty>
          ) : (
            <>
              {node.children.slice(0, MAX_CHILDREN).map((c) => (
                <BarRow
                  key={c.path}
                  icon={<Folder size={14} color="var(--text-brand)" />}
                  label={c.name}
                  title={c.path}
                  sub={`${c.files.toLocaleString('ja-JP')} ファイル`}
                  bytes={c.bytes}
                  total={node.bytes}
                  onClick={() => onOpen(c.path)}
                  chevron
                />
              ))}
              {node.children.length > MAX_CHILDREN && (
                <Empty>ほか {(node.children.length - MAX_CHILDREN).toLocaleString('ja-JP')} フォルダ</Empty>
              )}
              {ownFiles > 0 && (
                <BarRow
                  icon={<span style={{ width: 14 }} />}
                  label="（このフォルダ直下のファイル）"
                  sub={`${ownFiles.toLocaleString('ja-JP')} ファイル`}
                  bytes={ownBytes}
                  total={node.bytes}
                  muted
                />
              )}
            </>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Kinds */}
          <Card title="ファイルの種類">
            {kinds.length === 0 ? (
              <Empty>ファイルがありません</Empty>
            ) : (
              <>
                <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-hover)', margin: '4px 0 12px' }}>
                  {kinds.map((k) => (
                    <div key={k.kind} title={`${k.label} ${formatBytes(k.bytes)}`} style={{ width: `${pct(k.bytes, node.bytes)}%`, background: k.color }} />
                  ))}
                </div>
                {kinds.map((k) => (
                  <div key={k.kind} style={tableRow}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: k.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, color: 'var(--text-primary)' }}>{k.label}</span>
                    <span style={numCell}>{k.count.toLocaleString('ja-JP')} 件</span>
                    <span style={{ ...numCell, width: 72 }}>{formatBytes(k.bytes)}</span>
                    <span style={{ ...numCell, width: 48, color: 'var(--text-muted)' }}>{pctLabel(k.bytes, node.bytes)}</span>
                  </div>
                ))}
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', margin: '12px 0 6px', letterSpacing: '0.06em' }}>拡張子別（上位10）</div>
                {node.exts.slice(0, 10).map(([ext, count, bytes]) => (
                  <div key={ext || '(none)'} style={tableRow}>
                    <span style={{ flex: 1, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{ext ? `.${ext}` : '拡張子なし'}</span>
                    <span style={numCell}>{count.toLocaleString('ja-JP')} 件</span>
                    <span style={{ ...numCell, width: 72 }}>{formatBytes(bytes)}</span>
                    <span style={{ ...numCell, width: 48, color: 'var(--text-muted)' }}>{pctLabel(bytes, node.bytes)}</span>
                  </div>
                ))}
              </>
            )}
          </Card>

          {/* Largest files */}
          <Card title="大きいファイル" note="上位20 · ダブルクリックで開く">
            {node.largest.length === 0 ? (
              <Empty>ファイルがありません</Empty>
            ) : (
              node.largest.slice(0, 20).map((f) => {
                const where = relativeTo(node.path, dirName(f.path));
                return (
                  <div
                    key={f.path}
                    onDoubleClick={() => void window.localUpdater?.openPath(f.path)}
                    title={f.path}
                    style={{ ...tableRow, cursor: 'default' }}
                  >
                    <FileTypeBadge ext={f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.') + 1) : ''} size={20} showLabel={false} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      {where && (
                        <span style={{ display: 'block', fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {where}
                        </span>
                      )}
                    </span>
                    <span style={{ ...numCell, width: 72 }}>{formatBytes(f.bytes)}</span>
                    <button onClick={() => void window.localUpdater?.showInFolder(f.path)} title="保存場所を開く" style={iconBtn}>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Crumb({ label, title, onClick }: { label: string; title: string; onClick?: () => void }) {
  return onClick ? (
    <button onClick={onClick} title={title} style={{ background: 'none', border: 'none', padding: '2px 4px', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
      {label}
    </button>
  ) : (
    <span title={title} style={{ padding: '2px 4px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
      {label}
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ flex: 1, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
        {note && <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{note}</span>}
      </div>
      {children}
    </section>
  );
}

function BarRow({
  icon,
  label,
  title,
  sub,
  bytes,
  total,
  onClick,
  chevron,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  title?: string;
  sub: string;
  bytes: number;
  total: number;
  onClick?: () => void;
  chevron?: boolean;
  muted?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) 72px 48px auto',
        alignItems: 'center',
        gap: 10,
        padding: '6px 6px',
        borderRadius: 'var(--radius-sm)',
        cursor: onClick ? 'pointer' : 'default',
        background: hover && onClick ? 'var(--surface-hover)' : 'transparent',
      }}
    >
      {icon}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 12.5, color: muted ? 'var(--text-secondary)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', flexShrink: 0 }}>{sub}</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--surface-hover)', marginTop: 4, overflow: 'hidden' }}>
          <div style={{ width: `${pct(bytes, total)}%`, height: '100%', background: muted ? 'var(--text-muted)' : 'var(--accent)', borderRadius: 3 }} />
        </div>
      </div>
      <span style={{ ...numCell, width: 72 }}>{formatBytes(bytes)}</span>
      <span style={{ ...numCell, width: 48, color: 'var(--text-muted)' }}>{pctLabel(bytes, total)}</span>
      <span style={{ width: 12, display: 'inline-flex' }}>{chevron && hover && <ChevronRight size={12} color="var(--text-muted)" />}</span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 6px' }}>{children}</div>;
}

const tableRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '5px 4px',
  fontSize: 12,
  borderBottom: '1px solid var(--border-subtle)',
};

const numCell: React.CSSProperties = {
  textAlign: 'right',
  fontFamily: 'var(--font-mono)',
  fontSize: 11.5,
  color: 'var(--text-secondary)',
  fontVariantNumeric: 'tabular-nums',
  flexShrink: 0,
};

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 3,
  cursor: 'pointer',
  color: 'var(--text-muted)',
  display: 'inline-flex',
  borderRadius: 'var(--radius-sm)',
};
