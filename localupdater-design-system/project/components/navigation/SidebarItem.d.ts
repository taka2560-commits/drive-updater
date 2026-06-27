import * as React from "react";

export interface SidebarItemProps {
  /** Already-built icon element (pass <Icon name="folder" />). */
  icon?: React.ReactNode;
  label: React.ReactNode;
  count?: number;
  selected?: boolean;
  /** Indent level for tree folders. */
  depth?: number;
  onClick?: () => void;
  /** Trailing element (e.g. an inline IconButton). */
  trailing?: React.ReactNode;
  /** Render an expand/collapse chevron before the icon. */
  expandable?: boolean;
  /** Whether the children are currently visible. */
  expanded?: boolean;
  /** Toggle handler — receives clicks on the chevron without triggering row select. */
  onToggle?: () => void;
  /** Reserve chevron space even when not expandable, so leaf siblings align with expandable ones. */
  reserveCaret?: boolean;
  style?: React.CSSProperties;
}

export function SidebarItem(props: SidebarItemProps): JSX.Element;
