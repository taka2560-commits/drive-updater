import * as React from "react";

export type IconName =
  | "folder" | "folder-open" | "folders" | "file" | "download" | "desktop"
  | "search" | "refresh" | "list" | "grid" | "calendar" | "timeline"
  | "star" | "settings" | "info" | "filter" | "close" | "plus" | "check"
  | "chevronDown" | "chevronRight" | "chevronUp" | "sort" | "trash" | "more"
  | "cad" | "image" | "slides" | "doc" | "sheet" | "pdf" | "other" | "cursor";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon glyph name. See `iconNames` for the full list. */
  name: IconName;
  /** Square size in px. Default 16. */
  size?: number;
  /** Stroke width. Default 1.75. */
  strokeWidth?: number;
  /** Accessible title — sets role="img" when present. */
  title?: string;
}

/**
 * Stroke icon, sized for desktop UI. 16px default. Color via currentColor.
 *
 * @example
 *   <Icon name="folder" size={18} />
 *   <Icon name="search" style={{ color: 'var(--text-muted)' }} />
 */
export function Icon(props: IconProps): JSX.Element;

export const iconNames: IconName[];
