import React from "react";

/**
 * Persistent footer status bar — counts, scan time, theme indicator.
 * Three slot regions (left / center / right).
 */
export function StatusBar({ left, center, right, style = {} }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "var(--statusbar-height)",
        padding: "0 12px",
        background: "var(--bg-statusbar)",
        borderTop: "1px solid var(--border-subtle)",
        fontSize: 11,
        color: "var(--text-muted)",
        letterSpacing: "0.04em",
        fontFamily: "var(--font-sans)",
        gap: 12,
        flexShrink: 0,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>{left}</div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 12 }}>{center}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>{right}</div>
    </div>
  );
}
