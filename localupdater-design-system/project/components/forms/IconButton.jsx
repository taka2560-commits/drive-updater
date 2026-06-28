import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Square icon-only button. Used in toolbars, list rows, titlebars.
 */
export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  active = false,
  disabled = false,
  title,
  ariaLabel,
  onClick,
  style = {},
  ...rest
}) {
  const sizes = { sm: 22, md: 28, lg: 34 };
  const iconSizes = { sm: 14, md: 16, lg: 18 };
  const dim = sizes[size] || sizes.md;
  const iSize = iconSizes[size] || iconSizes.md;

  const variants = {
    ghost: {
      base: "transparent",
      hover: "var(--surface-hover)",
      color: active ? "var(--accent)" : "var(--text-secondary)",
      activeBg: active ? "var(--accent-soft)" : "var(--surface-hover)",
      border: "transparent",
    },
    filled: {
      base: "var(--surface)",
      hover: "var(--surface-hover)",
      color: "var(--text-primary)",
      activeBg: "var(--accent-soft)",
      border: "var(--border)",
    },
  };
  const v = variants[variant] || variants.ghost;
  const [hover, setHover] = React.useState(false);
  const bg = disabled ? v.base : active ? v.activeBg : hover ? v.hover : v.base;

  return (
    <button
      type="button"
      aria-label={ariaLabel || title}
      title={title}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{
        width: dim,
        height: dim,
        borderRadius: "var(--radius-md)",
        background: bg,
        border: `1px solid ${v.border}`,
        color: v.color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={iSize} />
    </button>
  );
}
