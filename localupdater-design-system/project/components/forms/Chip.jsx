import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Filter / quick-select chip. Toggleable. Optional count.
 * Used heavily in LocalUpdater for file-type, time-range, and tag filters.
 */
export function Chip({
  children,
  selected = false,
  onClick,
  leftIcon,
  count,
  size = "md",
  variant = "default",
  removable = false,
  onRemove,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { h: 22, font: 11, padX: 8,  gap: 4, icon: 12 },
    md: { h: 26, font: 12, padX: 10, gap: 6, icon: 14 },
  };
  const s = sizes[size] || sizes.md;
  const [hover, setHover] = React.useState(false);

  const bg = selected
    ? "var(--accent-soft-2)"
    : hover
    ? "var(--surface-hover)"
    : "var(--surface)";
  const border = selected ? "var(--accent)" : "var(--border)";
  const color = selected ? "var(--text-accent)" : "var(--text-secondary)";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: s.h,
        padding: `0 ${s.padX}px`,
        background: bg,
        border: `1px solid ${border}`,
        color,
        borderRadius: "var(--radius-pill)",
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        fontSize: s.font,
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        letterSpacing: "0.01em",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      {leftIcon ? <Icon name={leftIcon} size={s.icon} /> : null}
      <span>{children}</span>
      {count !== undefined ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: s.font - 1,
            color: selected ? "var(--text-accent)" : "var(--text-muted)",
            opacity: 0.85,
          }}
        >
          {count}
        </span>
      ) : null}
      {removable ? (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          style={{ display: "inline-flex", marginLeft: 2, opacity: 0.7 }}
        >
          <Icon name="close" size={10} />
        </span>
      ) : null}
    </button>
  );
}
