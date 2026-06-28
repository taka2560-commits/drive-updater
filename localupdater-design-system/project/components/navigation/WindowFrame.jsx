import React from "react";

/**
 * macOS-style window chrome: titlebar with traffic-light dots + title.
 * Body slot is the content. Pure visual — no actual close/min behavior.
 */
export function WindowFrame({
  title,
  subtitle,
  children,
  toolbar,
  statusBar,
  width = "100%",
  height = "100%",
  rounded = true,
  style = {},
}) {
  return (
    <div
      style={{
        width,
        height,
        background: "var(--bg-app)",
        color: "var(--text-primary)",
        borderRadius: rounded ? "var(--radius-xl)" : 0,
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: "var(--titlebar-height)",
          background: "var(--bg-titlebar)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 6,
          flexShrink: 0,
          position: "relative",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
        <div
          style={{
            position: "absolute",
            left: 0, right: 0,
            textAlign: "center",
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>— {subtitle}</span>
          ) : null}
        </div>
      </div>

      {toolbar}

      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        {children}
      </div>

      {statusBar}
    </div>
  );
}
