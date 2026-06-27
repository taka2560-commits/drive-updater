import * as React from "react";

export interface WindowFrameProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Toolbar element rendered below the titlebar. */
  toolbar?: React.ReactNode;
  /** Status bar pinned at the bottom. */
  statusBar?: React.ReactNode;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  style?: React.CSSProperties;
}

/**
 * @startingPoint section="App shell" subtitle="macOS 風のウィンドウフレーム" viewport="1080x680"
 */
export function WindowFrame(props: WindowFrameProps): JSX.Element;
