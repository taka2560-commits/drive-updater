import * as React from "react";

export interface StatusBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}

export function StatusBar(props: StatusBarProps): JSX.Element;
