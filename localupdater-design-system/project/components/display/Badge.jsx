import React from "react";

/**
 * Inline status pill. tone = neutral / accent / success / warning / danger / info.
 */
export function Badge({
  children,
  tone = "neutral",
  size = "md",
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: { bg: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", border: "var(--border)" },
    accent:  { bg: "var(--accent-soft)",      color: "var(--text-accent)",   border: "var(--accent)"  },
    brand:   { bg: "rgba(123,169,206,0.14)", color: "var(--text-brand)",     border: "rgba(123,169,206,0.45)" },
    success: { bg: "rgba(111,182,140,0.16)", color: "var(--success)",        border: "rgba(111,182,140,0.45)" },
    warning: { bg: "rgba(232,180,90,0.16)",  color: "var(--warning)",        border: "rgba(232,180,90,0.45)" },
    danger:  { bg: "rgba(216,112,96,0.16)",  color: "var(--danger)",         border: "rgba(216,112,96,0.45)" },
    info:    { bg: "rgba(123,169,206,0.16)", color: "var(--info)",           border: "rgba(123,169,206,0.45)" },
  };
  const t = tones[tone] || tones.neutral;
  const sizes = { sm: { h: 18, font: 10, padX: 6 }, md: { h: 20, font: 11, padX: 8 } };
  const s = sizes[size] || sizes.md;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: s.h,
        padding: `0 ${s.padX}px`,
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-sans)",
        fontSize: s.font,
        fontWeight: 500,
        letterSpacing: "0.04em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot ? (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
      ) : null}
      {children}
    </span>
  );
}
