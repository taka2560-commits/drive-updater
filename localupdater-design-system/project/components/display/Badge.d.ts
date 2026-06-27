import * as React from "react";

export type BadgeTone =
  | "neutral" | "accent" | "brand" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: BadgeTone;
  size?: "sm" | "md";
  /** Add a leading status dot. */
  dot?: boolean;
}

export function Badge(props: BadgeProps): JSX.Element;
