import { useState, type CSSProperties, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/* =============================================================================
   SiteSorter design-system primitives, reproduced in the app's stack.
   Faithful to _ds_bundle.js (Button / Badge / NavItem), with lucide icons.
   ============================================================================= */

// ---- Badge ------------------------------------------------------------------
type BadgeVariant =
  | 'accent'
  | 'primary'
  | 'muted'
  | 'success'
  | 'danger'
  | 'warn'
  | 'outline';

const BADGE_VARIANTS: Record<BadgeVariant, CSSProperties> = {
  accent: { background: 'var(--color-accent)', color: 'var(--color-bg)' },
  primary: { background: 'var(--color-primary)', color: 'var(--color-text)' },
  muted: { background: 'var(--color-border)', color: 'var(--color-muted)' },
  success: { background: 'var(--color-success)', color: 'var(--color-success-text)' },
  danger: { background: 'var(--color-danger)', color: 'var(--color-danger-text)' },
  warn: { background: 'var(--color-warn)', color: 'var(--color-warn-text)' },
  outline: {
    background: 'transparent',
    border: '1px solid var(--color-border)',
    color: 'var(--color-muted)',
  },
};

export function Badge({
  children,
  variant = 'accent',
  size = 'md',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '1px 6px' : '2px 9px',
        borderRadius: 'var(--radius-full)',
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 1.6,
        whiteSpace: 'nowrap',
        ...BADGE_VARIANTS[variant],
      }}
    >
      {children}
    </span>
  );
}

// ---- Button -----------------------------------------------------------------
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const BTN_SIZES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '4px 10px', fontSize: 'var(--text-sm)', gap: '5px' },
  md: { padding: '7px 14px', fontSize: 'var(--text-base)', gap: '6px' },
  lg: { padding: '10px 20px', fontSize: 'var(--text-md)', gap: '7px', minHeight: 36 },
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  onClick,
  Icon,
  type = 'button',
  style,
  title,
  ariaLabel,
}: {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  Icon?: LucideIcon;
  type?: 'button' | 'submit';
  style?: CSSProperties;
  title?: string;
  ariaLabel?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const hov = hovered && !disabled;

  const variantStyle: CSSProperties =
    variant === 'primary'
      ? {
          background: hov ? 'var(--color-primary-hi)' : 'var(--color-primary)',
          border: 'none',
          color: 'var(--color-text)',
          fontWeight: 'var(--font-weight-bold)',
        }
      : variant === 'secondary'
        ? {
            background: hov ? 'var(--color-secondary)' : 'transparent',
            border: '1px solid var(--color-secondary)',
            color: hov ? 'var(--color-text)' : 'var(--color-sec-text)',
          }
        : {
            background: hov ? 'rgba(127,127,127,0.10)' : 'transparent',
            border: '1px solid var(--color-border)',
            color: hov ? 'var(--color-text)' : 'var(--color-muted)',
          };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        opacity: disabled ? 0.45 : 1,
        outline: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...BTN_SIZES[size],
        ...variantStyle,
        ...style,
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 13 : 15} style={{ flexShrink: 0 }} />}
      {children}
    </button>
  );
}

// ---- NavItem ----------------------------------------------------------------
export function NavItem({
  children,
  Icon,
  active = false,
  onClick,
}: {
  children: ReactNode;
  Icon?: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 18px',
        height: 'var(--nav-item-height)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-md)',
        color: active
          ? 'var(--color-text)'
          : hovered
            ? 'var(--color-head-text)'
            : 'var(--color-muted)',
        background: active
          ? 'var(--color-bg)'
          : hovered
            ? 'rgba(127,127,127,0.06)'
            : 'transparent',
        borderLeft: active
          ? '3px solid var(--color-accent)'
          : '3px solid transparent',
        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
        userSelect: 'none',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    >
      {Icon && (
        <Icon
          size={15}
          style={{
            flexShrink: 0,
            color: active ? 'var(--color-accent)' : 'inherit',
          }}
        />
      )}
      <span style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        {children}
      </span>
    </div>
  );
}
