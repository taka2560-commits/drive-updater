/**
 * Inline SVG icon component — a curated subset of Lucide-style stroke icons
 * sized for desktop UI (default 16). Add new paths to ICONS below.
 *
 * Stroke 1.75, round caps. Currentcolor — control with CSS color.
 */

import React from "react";

const ICONS = {
  // navigation / files
  folder:        "M3 7a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.4.6l1.4 1.4H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
  "folder-open": "M3 7a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.4.6l1.4 1.4H19a2 2 0 0 1 2 2v1H3V7zM3 10h18l-2.2 7.3a2 2 0 0 1-1.9 1.4H5.1a2 2 0 0 1-1.9-1.4L3 10z",
  folders:       "M3 9a2 2 0 0 1 2-2h3l1.5 1.5H17a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M7 7V5a2 2 0 0 1 2-2h3l1.5 1.5H19a2 2 0 0 1 2 2v6",
  file:          "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5",
  download:      "M12 3v12 M7 11l5 5 5-5 M5 21h14",
  desktop:       "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zM8 21h8 M12 17v4",
  // UI
  search:        "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.3-4.3",
  refresh:       "M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5",
  list:          "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  grid:          "M3 5a2 2 0 0 1 2-2h4v6H3V5zM15 3h4a2 2 0 0 1 2 2v4h-6V3zM3 11h6v6H3v-6zM15 11h6v4a2 2 0 0 1-2 2h-4v-6z",
  calendar:      "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 9h18 M8 2v4 M16 2v4",
  timeline:      "M4 7h16 M4 12h10 M4 17h13 M6 7v.01 M6 12v.01 M6 17v.01",
  star:          "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9L12 3z",
  settings:      "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z M19.4 14a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  info:          "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8h.01 M11 12h1v5h1",
  filter:        "M3 5h18l-7 9v6l-4-2v-4L3 5z",
  close:         "M6 6l12 12 M18 6L6 18",
  plus:          "M12 5v14 M5 12h14",
  check:         "M5 12l5 5 9-11",
  chevronDown:   "M6 9l6 6 6-6",
  chevronRight:  "M9 6l6 6-6 6",
  chevronUp:     "M6 15l6-6 6 6",
  sort:          "M7 4v16 M3 16l4 4 4-4 M17 20V4 M21 8l-4-4-4 4",
  trash:         "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14",
  more:          "M5 12h.01 M12 12h.01 M19 12h.01",
  cad:           "M3 5h18v14H3z M3 9h18 M9 9v10 M15 9v10",
  image:         "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-7 7",
  slides:        "M3 5h18v11H3z M8 21h8 M12 16v5",
  doc:           "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM9 13h6 M9 17h4 M9 9h2",
  sheet:         "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 9h18 M3 15h18 M9 3v18 M15 3v18",
  pdf:           "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z M9 18v-4h1.5a1.5 1.5 0 0 1 0 3H9 M14 14h2.5 M14 14v4 M14 16h2",
  other:         "M12 12.01 M12 6.01 M12 18.01",
  cursor:        "M5 3l14 7-6 2-2 6-6-15z",
};

export function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  className = "",
  style = {},
  title,
  ...rest
}) {
  const d = ICONS[name];
  if (!d) return null;
  const paths = d.split(" M").map((p, i) => (i === 0 ? p : "M" + p));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style }}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

export const iconNames = Object.keys(ICONS);
