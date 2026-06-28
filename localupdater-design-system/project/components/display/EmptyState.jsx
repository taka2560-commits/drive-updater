import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Centered empty / loading / error state.
 */
export function EmptyState({
  icon = "folder-open",
  title,
  description,
  action,
  size = "md",
  style = {},
}) {
  const sizes = { sm: { icon: 36, gap: 8 }, md: { icon: 56, gap: 12 }, lg: { icon: 72, gap: 16 } };
  const s = sizes[size] || sizes.md;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        padding: "48px 32px",
        textAlign: "center",
        color: "var(--text-secondary)",
        ...style,
      }}
    >
      <div
        style={{
          width: s.icon + 24,
          height: s.icon + 24,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1px solid var(--border-subtle)",
          display: "grid",
          placeItems: "center",
          color: "var(--text-muted)",
        }}
      >
        <Icon name={icon} size={s.icon * 0.55} />
      </div>
      {title ? (
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
          {title}
        </div>
      ) : null}
      {description ? (
        <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 320, lineHeight: "var(--leading-normal)" }}>
          {description}
        </div>
      ) : null}
      {action ? <div style={{ marginTop: 4 }}>{action}</div> : null}
    </div>
  );
}
