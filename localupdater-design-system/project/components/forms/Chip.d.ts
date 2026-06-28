import * as React from "react";
import type { IconName } from "../Icon";

export interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  leftIcon?: IconName;
  /** Numeric badge to the right (e.g. count of files in that filter). */
  count?: number;
  size?: "sm" | "md";
  variant?: "default";
  removable?: boolean;
  onRemove?: () => void;
  style?: React.CSSProperties;
}

export function Chip(props: ChipProps): JSX.Element;
