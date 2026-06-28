import { useState, type CSSProperties, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

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
  accent: { background: 'var(--accent)', color: 'var(--bg-app)' },
  primary: { background: 'var(--brand)', color: 'var(--text-primary)' },
  muted: { background: 'var(--border)', color: 'var(--text-secondary)' },
  success: { background: 'var(--success-bg)', color: 'var(--success-text)' },
  danger: { background: 'var(--danger-bg)', color: 'var(--danger-text)' },
  warn: { background: 'var(--warn-bg)', color: 'var(--warn-text)' },
  outline: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
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
          background: hov ? 'var(--accent-hover)' : 'var(--brand)',
          border: 'none',
          color: 'var(--text-primary)',
          fontWeight: 'var(--font-weight-bold)',
        }
      : variant === 'secondary'
        ? {
            background: hov ? 'var(--brand)' : 'transparent',
            border: '1px solid var(--brand)',
            color: hov ? 'var(--text-primary)' : 'var(--text-brand)',
          }
        : {
            background: hov ? 'var(--surface-hover)' : 'transparent',
            border: '1px solid var(--border)',
            color: hov ? 'var(--text-primary)' : 'var(--text-secondary)',
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
        transition: 'background var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast)',
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
          ? 'var(--text-primary)'
          : hovered
            ? 'var(--text-brand)'
            : 'var(--text-secondary)',
        background: active
          ? 'var(--bg-app)'
          : hovered
            ? 'var(--surface-hover)'
            : 'transparent',
        borderLeft: active
          ? '3px solid var(--accent)'
          : '3px solid transparent',
        transition: 'background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)',
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
            color: active ? 'var(--accent)' : 'inherit',
          }}
        />
      )}
      <span style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        {children}
      </span>
    </div>
  );
}
