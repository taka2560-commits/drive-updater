import React from "react";
import { Icon } from "../../components/Icon.jsx";
import { IconButton } from "../../components/forms/IconButton.jsx";
import { Button } from "../../components/forms/Button.jsx";
import { SidebarItem } from "../../components/navigation/SidebarItem.jsx";

/**
 * Left sidebar — watched folders, theme switcher footer.
 */
export function Sidebar({ folders, current, onSelect, theme, onThemeChange }) {
  // --- Folder tree expand/collapse state ----------------------------------
  const childrenOf = React.useMemo(() => {
    const m = new Map();
    for (const f of folders) {
      if (!f.parent) continue;
      if (!m.has(f.parent)) m.set(f.parent, []);
      m.get(f.parent).push(f.id);
    }
    return m;
  }, [folders]);
  const folderById = React.useMemo(
    () => Object.fromEntries(folders.map((f) => [f.id, f])),
    [folders]
  );
  const hasChildren = (id) => childrenOf.has(id);
  const anyExpandable = folders.some((f) => hasChildren(f.id));

  const [expanded, setExpanded] = React.useState(() => {
    const set = new Set();
    // Auto-expand ancestor chain of the selected folder
    let c = folderById[current];
    while (c && c.parent) {
      set.add(c.parent);
      c = folderById[c.parent];
    }
    // Expand "Dropbox" by default so the tree shows useful structure
    if (folders.some((f) => f.id === "dropbox")) set.add("dropbox");
    return set;
  });

  React.useEffect(() => {
    // Re-open the ancestor chain when selection changes via breadcrumb etc.
    let c = folderById[current];
    if (!c) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      let changed = false;
      while (c && c.parent) {
        if (!next.has(c.parent)) { next.add(c.parent); changed = true; }
        c = folderById[c.parent];
      }
      return changed ? next : prev;
    });
  }, [current, folderById]);

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isVisible = (f) => {
    let p = f.parent;
    while (p) {
      if (!expanded.has(p)) return false;
      p = folderById[p]?.parent;
    }
    return true;
  };

  return (
    <aside
      style={{
        width: 220,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Brand strip */}
      <div
        style={{
          padding: "16px 14px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: "var(--accent)",
            display: "grid",
            placeItems: "center",
            color: "var(--text-on-accent)",
          }}
        >
          <Icon name="refresh" size={11} strokeWidth={2.25} />
        </span>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            LocalUpdater
          </span>
          <span style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            最近更新されたファイル
          </span>
        </div>
      </div>

      {/* Folders */}
      <div style={{ padding: "12px 8px", flex: 1, overflow: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px 6px",
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            監視中フォルダ
          </span>
          <IconButton icon="plus" size="sm" title="フォルダを追加" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {folders.filter(isVisible).map((f) => (
            <SidebarItem
              key={f.id}
              icon={<Icon name={f.icon} size={14} />}
              label={f.label}
              count={f.count}
              depth={f.depth ?? 0}
              selected={current === f.id}
              onClick={() => onSelect?.(f.id)}
              expandable={hasChildren(f.id)}
              expanded={expanded.has(f.id)}
              onToggle={() => toggle(f.id)}
              reserveCaret={anyExpandable && !hasChildren(f.id)}
            />
          ))}
        </div>

        {/* Filter section */}
        <div
          style={{
            marginTop: 18,
            padding: "4px 8px 6px",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          表示期間
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            { id: "1d",  label: "24 時間" },
            { id: "7d",  label: "1 週間"  },
            { id: "14d", label: "2 週間", selected: true },
            { id: "30d", label: "1 か月"  },
          ].map((p) => (
            <SidebarItem
              key={p.id}
              icon={<Icon name="calendar" size={14} />}
              label={p.label}
              selected={p.selected}
            />
          ))}
        </div>
      </div>

      {/* Theme footer */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>
          テーマ
        </span>
        {[
          { id: "earth", color: "#E8A05A", label: "Earth" },
          { id: "night", color: "#5286FF", label: "Night" },
          { id: "light", color: "#FF7A69", label: "Light" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange?.(t.id)}
            title={t.label}
            aria-label={t.label}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: t.color,
              border: theme === t.id ? "2px solid var(--text-primary)" : "2px solid transparent",
              outline: theme === t.id ? "1px solid var(--accent)" : "none",
              outlineOffset: 1,
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </aside>
  );
}
