import React from "react";
import { Icon } from "../../components/Icon.jsx";
import { getBreadcrumb } from "./data.js";

/**
 * Breadcrumb path for the current folder. Always starts with a home
 * (すべて) segment. Each segment is clickable and jumps directly to
 * that level — including non-adjacent ones, so you can pop several
 * levels in one click.
 *
 * Renders nothing when the current folder is "all" (no breadcrumb needed).
 */
export function BreadcrumbBar({ currentId, onSelect, style = {} }) {
  const chain = getBreadcrumb(currentId);
  if (!chain) return null;

  const segments = [
    { id: "all", label: "すべて", icon: "star", isHome: true },
    ...chain.map((f) => ({ id: f.id, label: f.label, icon: f.icon })),
  ];

  return (
    <nav
      aria-label="フォルダ階層"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "8px 24px",
        background: "var(--bg-app)",
        borderBottom: "1px solid var(--border-subtle)",
        fontSize: 12,
        flexWrap: "wrap",
        ...style,
      }}
    >
      {segments.map((seg, i) => {
        const last = i === segments.length - 1;
        return (
          <React.Fragment key={seg.id}>
            <Segment
              icon={seg.icon}
              label={seg.label}
              isLast={last}
              isHome={seg.isHome}
              onClick={last ? undefined : () => onSelect?.(seg.id)}
            />
            {!last ? (
              <span
                aria-hidden
                style={{
                  color: "var(--text-faint)",
                  margin: "0 2px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Icon name="chevronRight" size={12} />
              </span>
            ) : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function Segment({ icon, label, isLast, isHome, onClick }) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onClick;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={!clickable}
      aria-current={isLast ? "page" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 24,
        padding: "0 8px",
        border: "none",
        borderRadius: "var(--radius-sm)",
        background: clickable && hover ? "var(--surface-hover)" : "transparent",
        color: isLast ? "var(--text-primary)" : "var(--text-secondary)",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: isLast ? 600 : 500,
        letterSpacing: "0.01em",
        cursor: clickable ? "pointer" : "default",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      }}
    >
      <span
        style={{
          color: isLast
            ? "var(--accent)"
            : clickable && hover
            ? "var(--text-primary)"
            : "var(--text-muted)",
          display: "inline-flex",
        }}
      >
        <Icon name={isHome ? "star" : icon} size={13} />
      </span>
      <span>{label}</span>
    </button>
  );
}
