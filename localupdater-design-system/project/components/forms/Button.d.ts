import * as React from "react";
import type { IconName } from "../Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: React.ReactNode;
  /** Visual style. Default "secondary". */
  variant?: ButtonVariant;
  /** Height + padding scale. Default "md". */
  size?: ButtonSize;
  /** Leading glyph from the Icon set. */
  leftIcon?: IconName;
  /** Trailing glyph (e.g. chevron). */
  rightIcon?: IconName;
  /** Override the icon size; defaults to a value matched to button size. */
  iconSize?: number;
  /** Stretch to fill its container. */
  fullWidth?: boolean;
  /** Show a spinner in place of the leading icon. */
  loading?: boolean;
}

/**
 * @startingPoint section="Forms" subtitle="主要なボタン — 4 バリアント・3 サイズ" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
