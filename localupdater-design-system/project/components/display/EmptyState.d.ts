import * as React from "react";
import type { IconName } from "../Icon";

export interface EmptyStateProps {
  icon?: IconName;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export function EmptyState(props: EmptyStateProps): JSX.Element;
