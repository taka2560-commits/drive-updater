import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Search / text input. Optional leading icon, clearable.
 */
export function Input({
  value,
  defaultValue,
  onChange,
  placeholder = "",
  leftIcon,
  clearable = false,
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "text",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { h: 26, font: 12, padX: 8, icon: 14 },
    md: { h: 30, font: 13, padX: 10, icon: 16 },
    lg: { h: 36, font: 14, padX: 12, icon: 18 },
  };
  const s = sizes[size] || sizes.md;
  const [focus, setFocus] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e);
  };
  const handleClear = () => {
    if (!isControlled) setInternal("");
    onChange?.({ target: { value: "" } });
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: s.h,
        padding: `0 ${s.padX}px`,
        background: "var(--surface)",
        border: `1px solid ${focus ? "var(--border-accent)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "0 0 0 3px var(--accent-soft)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        width: fullWidth ? "100%" : undefined,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {leftIcon ? (
        <Icon name={leftIcon} size={s.icon} style={{ color: "var(--text-muted)" }} />
      ) : null}
      <input
        type={type}
        value={current}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
          fontSize: s.font,
          letterSpacing: "0.01em",
        }}
        {...rest}
      />
      {clearable && current ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="クリア"
          style={{
            width: 18, height: 18, borderRadius: "50%",
            border: "none", padding: 0,
            background: "var(--border)", color: "var(--text-primary)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Icon name="close" size={10} />
        </button>
      ) : null}
    </div>
  );
}
