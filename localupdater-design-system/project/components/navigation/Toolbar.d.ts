import * as React from "react";

export interface ToolbarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  /** Overrides the 3-slot layout. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Toolbar(props: ToolbarProps): JSX.Element;
