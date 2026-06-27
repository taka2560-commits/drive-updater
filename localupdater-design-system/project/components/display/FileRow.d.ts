import * as React from "react";

export interface FileRowProps {
  name: string;
  path?: string;
  /** Extension without the dot (e.g. "dwg"). Auto-detected from `name` if omitted. */
  ext?: string;
  /** Bytes. */
  size?: number;
  /** Either a unix-ms timestamp (rendered as relative time) or a pre-formatted string. */
  modified?: number | string;
  /** Show a NEW badge next to the name. */
  isNew?: boolean;
  selected?: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
  /** `comfortable` = 36px, `compact` = 30px. */
  density?: "comfortable" | "compact";
  style?: React.CSSProperties;
}

export function FileRow(props: FileRowProps): JSX.Element;

export function formatSize(bytes?: number | null): string;
export function relTime(ts: number): string;
