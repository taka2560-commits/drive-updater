import * as React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabBarProps {
  tabs: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  /** `underline` (default) for primary section tabs, `segmented` for view-mode pickers. */
  variant?: "underline" | "segmented";
  style?: React.CSSProperties;
}

export function TabBar(props: TabBarProps): JSX.Element;
