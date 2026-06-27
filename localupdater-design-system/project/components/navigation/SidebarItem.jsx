import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Folder / category row in the left sidebar. Shows an icon, label, optional
 * count, and "selected" state (amber left accent + tint).
 *
 * Pass `expandable` to render an expand/collapse chevron before the icon
 * (used for folder rows with children). The chevron has its own click
 * handler that doesn't trigger row selection.
 */
export function SidebarItem({
  icon,
  label,
  count,
  selected = false,
  depth = 0,
  onClick,
  trailing,
  expandable = false,
  expanded = false,
  onToggle,
  /** Reserve chevron space even when not expandable (for alignment with siblings that are). */
  reserveCaret = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const showCaretSlot = expandable || reserveCaret;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        width: "100%",
        height: 28,
        padding: `0 8px 0 ${4 + depth * 14}px`,
        borderRadius: "var(--radius-md)",
        background: selected ? "var(--accent-soft)" : hover ? "var(--surface-hover)" : "transparent",
        border: "none",
        position: "relative",
        color: selected ? "var(--text-accent)" : "var(--text-primary)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: selected ? 600 : 500,
        letterSpacing: "0.01em",
        textAlign: "left",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      {selected ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 4,
            bottom: 4,
            width: 2,
            borderRadius: 2,
            background: "var(--accent)",
          }}
        />
      ) : null}
      {showCaretSlot ? (
        expandable ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label={expanded ? "閉じる" : "開く"}
            onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
            style={{
              width: 16,
              height: 16,
              borderRadius: 3,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              transition: "transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
              transform: expanded ? "rotate(90deg)" : "none",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Icon name="chevronRight" size={11} strokeWidth={2.25} />
          </span>
        ) : (
          <span style={{ width: 16, flexShrink: 0 }} aria-hidden />
        )
      ) : null}
      {icon ? (
        <span style={{ color: selected ? "var(--accent)" : "var(--text-muted)", display: "inline-flex" }}>
          {icon}
        </span>
      ) : null}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {count !== undefined ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: selected ? "var(--text-accent)" : "var(--text-muted)",
            opacity: 0.85,
          }}
        >
          {count}
        </span>
      ) : null}
      {trailing}
    </button>
  );
}
