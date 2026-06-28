import React from "react";

/**
 * Generic surface card — light border, soft radius. Used for grouping
 * dense UI sections (settings panels, info modules, detail panes).
 */
export function Card({
  children,
  padding = 16,
  elevation = "flat",
  selected = false,
  interactive = false,
  onClick,
  style = {},
  ...rest
}) {
  const shadow = {
    flat: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
  }[elevation] ?? "none";

  const [hover, setHover] = React.useState(false);
  const bg = hover && interactive ? "var(--surface-elevated)" : "var(--surface)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: bg,
        border: `1px solid ${selected ? "var(--accent)" : "var(--border-subtle)"}`,
        boxShadow: selected ? "var(--glow-accent)" : shadow,
        borderRadius: "var(--radius-lg)",
        padding,
        cursor: interactive ? "pointer" : "default",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
