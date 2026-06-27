import * as React from "react";
import type { IconName } from "../Icon";

export type FileKind = "cad" | "image" | "slides" | "doc" | "sheet" | "pdf" | "other";

export interface FileTypeBadgeProps {
  /** Pre-classified kind (cad / image / …). Wins over `ext`. */
  kind?: FileKind;
  /** Raw extension (no dot). Resolves to a kind via FILE_EXT_MAP. */
  ext?: string;
  /** Side length in px. Default 32. */
  size?: number;
  /** Print the extension label under the glyph. */
  showLabel?: boolean;
  /** Override the resolved color (any CSS color string). */
  color?: string;
  /** Override the resolved icon. */
  icon?: IconName;
  style?: React.CSSProperties;
}

export function FileTypeBadge(props: FileTypeBadgeProps): JSX.Element;

export const FILE_KINDS: Record<FileKind, { color: string; icon: IconName; label: string }>;
export const FILE_EXT_MAP: Record<string, FileKind>;
