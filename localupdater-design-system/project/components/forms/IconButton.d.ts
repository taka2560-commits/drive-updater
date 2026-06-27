import * as React from "react";
import type { IconName } from "../Icon";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  icon: IconName;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "filled";
  /** Sticky pressed state (toggles, view-mode picker). */
  active?: boolean;
  /** Tooltip + aria-label fallback. */
  title?: string;
  ariaLabel?: string;
}

export function IconButton(props: IconButtonProps): JSX.Element;
