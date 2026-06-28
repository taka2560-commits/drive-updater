import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Primary button. Three visual variants (primary / secondary / ghost),
 * three sizes (sm / md / lg). Icons via leftIcon / rightIcon.
 */
export function Button({
  children,
  variant = "secondary",
  size = "md",
  leftIcon,
  rightIcon,
  iconSize,
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
  style = {},
  onClick,
  ...rest
}) {
  const sizes = {
    sm: { h: 24, px: 8,  font: 12, gap: 5, icon: 14, radius: "var(--radius-sm)" },
    md: { h: 30, px: 12, font: 13, gap: 6, icon: 16, radius: "var(--radius-md)" },
    lg: { h: 36, px: 16, font: 14, gap: 8, icon: 18, radius: "var(--radius-md)" },
  };
  const s = sizes[size] || sizes.md;
  const iSize = iconSize ?? s.icon;

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--text-on-accent)",
      borderColor: "transparent",
      hoverBg: "var(--accent-hover)",
      activeBg: "var(--accent)",
      fontWeight: 600,
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text-primary)",
      borderColor: "var(--border)",
      hoverBg: "var(--surface-hover)",
      activeBg: "var(--surface-hover)",
      fontWeight: 500,
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
      borderColor: "transparent",
      hoverBg: "var(--surface-hover)",
      activeBg: "var(--surface-hover)",
      fontWeight: 500,
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      borderColor: "var(--border)",
      hoverBg: "rgba(216, 112, 96, 0.10)",
      activeBg: "rgba(216, 112, 96, 0.16)",
      fontWeight: 500,
    },
  };
  const v = variants[variant] || variants.secondary;

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const bg = disabled
    ? v.background
    : active
    ? v.activeBg
    : hover
    ? v.hoverBg
    : v.background;

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      disabled={disabled}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.font,
        fontFamily: "var(--font-sans)",
        fontWeight: v.fontWeight,
        lineHeight: 1,
        letterSpacing: "0.01em",
        color: v.color,
        background: bg,
        border: `1px solid ${v.borderColor}`,
        borderRadius: s.radius,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? "100%" : undefined,
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out)",
        transform: active && !disabled ? "translateY(0.5px)" : "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: iSize,
            height: iSize,
            borderRadius: "50%",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            animation: "lu-spin 0.8s linear infinite",
          }}
        />
      ) : leftIcon ? (
        <Icon name={leftIcon} size={iSize} />
      ) : null}
      {children}
      {!loading && rightIcon ? <Icon name={rightIcon} size={iSize} /> : null}
      <style>{`@keyframes lu-spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
