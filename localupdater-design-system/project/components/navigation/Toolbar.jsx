import React from "react";

/**
 * Horizontal toolbar with three slot regions (left / center / right).
 * Designed for the main app header above content.
 */
export function Toolbar({ left, center, right, children, style = {} }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "var(--header-height)",
        padding: "0 var(--gutter-window)",
        background: "var(--bg-app)",
        borderBottom: "1px solid var(--border-subtle)",
        gap: 12,
        flexShrink: 0,
        ...style,
      }}
    >
      {children ?? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {left}
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
            {center}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {right}
          </div>
        </>
      )}
    </div>
  );
}
