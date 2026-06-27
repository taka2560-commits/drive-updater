import React from "react";

/**
 * Horizontal segmented tab bar. Active tab gets an amber underline.
 * Used for view-mode (List / Timeline / Calendar) and section tabs.
 */
export function TabBar({
  tabs,
  value,
  onChange,
  size = "md",
  variant = "underline",
  style = {},
}) {
  const sizes = {
    sm: { h: 28, font: 12, padX: 10, gap: 4 },
    md: { h: 36, font: 13, padX: 14, gap: 6 },
  };
  const s = sizes[size] || sizes.md;

  if (variant === "segmented") {
    return (
      <div
        role="tablist"
        style={{
          display: "inline-flex",
          padding: 2,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          gap: 2,
          ...style,
        }}
      >
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange?.(t.value)}
              style={{
                height: s.h - 4,
                padding: `0 ${s.padX}px`,
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "var(--text-on-accent)" : "var(--text-secondary)",
                fontFamily: "var(--font-sans)",
                fontSize: s.font,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: s.gap,
                transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid var(--border)",
        ...style,
      }}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.value)}
            style={{
              height: s.h,
              padding: `0 ${s.padX}px`,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              fontSize: s.font,
              fontWeight: active ? 600 : 500,
              letterSpacing: "0.01em",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: s.gap,
              marginBottom: -1,
              transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
            }}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: s.font - 2, color: "var(--text-muted)", marginLeft: 2 }}>
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
