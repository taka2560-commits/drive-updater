/* @ds-bundle: {"format":3,"namespace":"LocalUpdaterDesignSystem_672f59","components":[{"name":"Icon","sourcePath":"components/Icon.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"EmptyState","sourcePath":"components/display/EmptyState.jsx"},{"name":"FileRow","sourcePath":"components/display/FileRow.jsx"},{"name":"FileTypeBadge","sourcePath":"components/display/FileTypeBadge.jsx"},{"name":"FILE_KINDS","sourcePath":"components/display/FileTypeBadge.jsx"},{"name":"FILE_EXT_MAP","sourcePath":"components/display/FileTypeBadge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SidebarItem","sourcePath":"components/navigation/SidebarItem.jsx"},{"name":"StatusBar","sourcePath":"components/navigation/StatusBar.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"Toolbar","sourcePath":"components/navigation/Toolbar.jsx"},{"name":"WindowFrame","sourcePath":"components/navigation/WindowFrame.jsx"},{"name":"BreadcrumbBar","sourcePath":"ui_kits/localupdater/BreadcrumbBar.jsx"},{"name":"CalendarView","sourcePath":"ui_kits/localupdater/CalendarView.jsx"},{"name":"ListView","sourcePath":"ui_kits/localupdater/ListView.jsx"},{"name":"LocalUpdaterApp","sourcePath":"ui_kits/localupdater/LocalUpdaterApp.jsx"},{"name":"Sidebar","sourcePath":"ui_kits/localupdater/Sidebar.jsx"},{"name":"TimelineView","sourcePath":"ui_kits/localupdater/TimelineView.jsx"},{"name":"NOW","sourcePath":"ui_kits/localupdater/data.js"},{"name":"FOLDERS","sourcePath":"ui_kits/localupdater/data.js"},{"name":"FILES","sourcePath":"ui_kits/localupdater/data.js"},{"name":"FILE_TYPE_TABS","sourcePath":"ui_kits/localupdater/data.js"}],"sourceHashes":{"components/Icon.jsx":"6c7b28717fe0","components/display/Badge.jsx":"404034437104","components/display/Card.jsx":"94c83e72517a","components/display/EmptyState.jsx":"92357aa854ca","components/display/FileRow.jsx":"a025fb43b55b","components/display/FileTypeBadge.jsx":"2167bcab7ff1","components/forms/Button.jsx":"8b4a0328a037","components/forms/Chip.jsx":"a75c152d4d66","components/forms/IconButton.jsx":"2a5af11e39ab","components/forms/Input.jsx":"6cfe4c78e2af","components/navigation/SidebarItem.jsx":"6be44f57bc66","components/navigation/StatusBar.jsx":"cb86187e3b2d","components/navigation/TabBar.jsx":"a779b1614f98","components/navigation/Toolbar.jsx":"61c04892db56","components/navigation/WindowFrame.jsx":"e8e0563a11a4","ui_kits/localupdater/BreadcrumbBar.jsx":"028ec12f9c60","ui_kits/localupdater/CalendarView.jsx":"65507ecf05cf","ui_kits/localupdater/ListView.jsx":"2f67266bc527","ui_kits/localupdater/LocalUpdaterApp.jsx":"534ac0e99cde","ui_kits/localupdater/Sidebar.jsx":"21cd1724def4","ui_kits/localupdater/TimelineView.jsx":"359584359fc8","ui_kits/localupdater/data.js":"34ff90fd8285"},"inlinedExternals":[],"unexposedExports":[{"name":"activityByDay","sourcePath":"ui_kits/localupdater/data.js"},{"name":"bucketByTime","sourcePath":"ui_kits/localupdater/data.js"},{"name":"countFor","sourcePath":"ui_kits/localupdater/data.js"},{"name":"formatSize","sourcePath":"components/display/FileRow.jsx"},{"name":"getBreadcrumb","sourcePath":"ui_kits/localupdater/data.js"},{"name":"getDescendantIds","sourcePath":"ui_kits/localupdater/data.js"},{"name":"getFolder","sourcePath":"ui_kits/localupdater/data.js"},{"name":"iconNames","sourcePath":"components/Icon.jsx"},{"name":"relTime","sourcePath":"components/display/FileRow.jsx"}]} */

(() => {

const __ds_ns = (window.LocalUpdaterDesignSystem_672f59 = window.LocalUpdaterDesignSystem_672f59 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Inline SVG icon component — a curated subset of Lucide-style stroke icons
 * sized for desktop UI (default 16). Add new paths to ICONS below.
 *
 * Stroke 1.75, round caps. Currentcolor — control with CSS color.
 */

const ICONS = {
  // navigation / files
  folder: "M3 7a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.4.6l1.4 1.4H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
  "folder-open": "M3 7a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.4.6l1.4 1.4H19a2 2 0 0 1 2 2v1H3V7zM3 10h18l-2.2 7.3a2 2 0 0 1-1.9 1.4H5.1a2 2 0 0 1-1.9-1.4L3 10z",
  folders: "M3 9a2 2 0 0 1 2-2h3l1.5 1.5H17a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M7 7V5a2 2 0 0 1 2-2h3l1.5 1.5H19a2 2 0 0 1 2 2v6",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5",
  download: "M12 3v12 M7 11l5 5 5-5 M5 21h14",
  desktop: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zM8 21h8 M12 17v4",
  // UI
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.3-4.3",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  grid: "M3 5a2 2 0 0 1 2-2h4v6H3V5zM15 3h4a2 2 0 0 1 2 2v4h-6V3zM3 11h6v6H3v-6zM15 11h6v4a2 2 0 0 1-2 2h-4v-6z",
  calendar: "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 9h18 M8 2v4 M16 2v4",
  timeline: "M4 7h16 M4 12h10 M4 17h13 M6 7v.01 M6 12v.01 M6 17v.01",
  star: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9L12 3z",
  settings: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z M19.4 14a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8h.01 M11 12h1v5h1",
  filter: "M3 5h18l-7 9v6l-4-2v-4L3 5z",
  close: "M6 6l12 12 M18 6L6 18",
  plus: "M12 5v14 M5 12h14",
  check: "M5 12l5 5 9-11",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  chevronUp: "M6 15l6-6 6 6",
  sort: "M7 4v16 M3 16l4 4 4-4 M17 20V4 M21 8l-4-4-4 4",
  trash: "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14",
  more: "M5 12h.01 M12 12h.01 M19 12h.01",
  cad: "M3 5h18v14H3z M3 9h18 M9 9v10 M15 9v10",
  image: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-7 7",
  slides: "M3 5h18v11H3z M8 21h8 M12 16v5",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM9 13h6 M9 17h4 M9 9h2",
  sheet: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 9h18 M3 15h18 M9 3v18 M15 3v18",
  pdf: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z M9 18v-4h1.5a1.5 1.5 0 0 1 0 3H9 M14 14h2.5 M14 14v4 M14 16h2",
  other: "M12 12.01 M12 6.01 M12 18.01",
  cursor: "M5 3l14 7-6 2-2 6-6-15z"
};
function Icon({
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
  const paths = d.split(" M").map((p, i) => i === 0 ? p : "M" + p);
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      flexShrink: 0,
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    },
    "aria-hidden": title ? undefined : true,
    role: title ? "img" : undefined
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, paths.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p
  })));
}
const iconNames = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon, iconNames });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Inline status pill. tone = neutral / accent / success / warning / danger / info.
 */
function Badge({
  children,
  tone = "neutral",
  size = "md",
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "rgba(255,255,255,0.06)",
      color: "var(--text-secondary)",
      border: "var(--border)"
    },
    accent: {
      bg: "var(--accent-soft)",
      color: "var(--text-accent)",
      border: "var(--accent)"
    },
    brand: {
      bg: "rgba(123,169,206,0.14)",
      color: "var(--text-brand)",
      border: "rgba(123,169,206,0.45)"
    },
    success: {
      bg: "rgba(111,182,140,0.16)",
      color: "var(--success)",
      border: "rgba(111,182,140,0.45)"
    },
    warning: {
      bg: "rgba(232,180,90,0.16)",
      color: "var(--warning)",
      border: "rgba(232,180,90,0.45)"
    },
    danger: {
      bg: "rgba(216,112,96,0.16)",
      color: "var(--danger)",
      border: "rgba(216,112,96,0.45)"
    },
    info: {
      bg: "rgba(123,169,206,0.16)",
      color: "var(--info)",
      border: "rgba(123,169,206,0.45)"
    }
  };
  const t = tones[tone] || tones.neutral;
  const sizes = {
    sm: {
      h: 18,
      font: 10,
      padX: 6
    },
    md: {
      h: 20,
      font: 11,
      padX: 8
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: s.h,
      padding: `0 ${s.padX}px`,
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.border}`,
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: s.font,
      fontWeight: 500,
      letterSpacing: "0.04em",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "currentColor"
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Generic surface card — light border, soft radius. Used for grouping
 * dense UI sections (settings panels, info modules, detail panes).
 */
function Card({
  children,
  padding = 16,
  elevation = "flat",
  selected = false,
  interactive = false,
  onClick,
  style = {},
  ...rest
}) {
  const shadow = {
    flat: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)"
  }[elevation] ?? "none";
  const [hover, setHover] = React.useState(false);
  const bg = hover && interactive ? "var(--surface-elevated)" : "var(--surface)";
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: bg,
      border: `1px solid ${selected ? "var(--accent)" : "var(--border-subtle)"}`,
      boxShadow: selected ? "var(--glow-accent)" : shadow,
      borderRadius: "var(--radius-lg)",
      padding,
      cursor: interactive ? "pointer" : "default",
      transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/EmptyState.jsx
try { (() => {
/**
 * Centered empty / loading / error state.
 */
function EmptyState({
  icon = "folder-open",
  title,
  description,
  action,
  size = "md",
  style = {}
}) {
  const sizes = {
    sm: {
      icon: 36,
      gap: 8
    },
    md: {
      icon: 56,
      gap: 12
    },
    lg: {
      icon: 72,
      gap: 16
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      padding: "48px 32px",
      textAlign: "center",
      color: "var(--text-secondary)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: s.icon + 24,
      height: s.icon + 24,
      borderRadius: "50%",
      background: "var(--surface)",
      border: "1px solid var(--border-subtle)",
      display: "grid",
      placeItems: "center",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon * 0.55
  })), title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)",
      letterSpacing: "0.01em"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      maxWidth: 320,
      lineHeight: "var(--leading-normal)"
    }
  }, description) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, action) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/display/FileTypeBadge.jsx
try { (() => {
/**
 * Square color-coded badge for a file extension. Used as the leading
 * thumbnail in list rows and grid tiles.
 *
 * Built-in mappings: cad / image / slides / doc / sheet / pdf / other.
 * Pass `kind` to pick one, or override `color` + `icon` explicitly.
 */
const KINDS = {
  cad: {
    color: "#7BA9CE",
    icon: "cad",
    label: "CAD"
  },
  image: {
    color: "#6FB68C",
    icon: "image",
    label: "IMG"
  },
  slides: {
    color: "#E8A05A",
    icon: "slides",
    label: "PPT"
  },
  doc: {
    color: "#92BAD9",
    icon: "doc",
    label: "DOC"
  },
  sheet: {
    color: "#6FB68C",
    icon: "sheet",
    label: "XLS"
  },
  pdf: {
    color: "#D87060",
    icon: "pdf",
    label: "PDF"
  },
  other: {
    color: "#9AA4B0",
    icon: "file",
    label: "—"
  }
};
const EXT_MAP = {
  dwg: "cad",
  dxf: "cad",
  step: "cad",
  stp: "cad",
  iges: "cad",
  igs: "cad",
  sldprt: "cad",
  sldasm: "cad",
  catpart: "cad",
  x_t: "cad",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  bmp: "image",
  tif: "image",
  tiff: "image",
  webp: "image",
  svg: "image",
  heic: "image",
  ppt: "slides",
  pptx: "slides",
  key: "slides",
  doc: "doc",
  docx: "doc",
  txt: "doc",
  md: "doc",
  rtf: "doc",
  xls: "sheet",
  xlsx: "sheet",
  csv: "sheet",
  numbers: "sheet",
  pdf: "pdf"
};
function FileTypeBadge({
  kind,
  ext,
  size = 32,
  showLabel = true,
  color,
  icon,
  style = {}
}) {
  const resolvedKind = kind || (ext ? EXT_MAP[String(ext).toLowerCase()] : null) || "other";
  const k = KINDS[resolvedKind] || KINDS.other;
  const finalColor = color || k.color;
  const finalIcon = icon || k.icon;
  const label = ext ? String(ext).toUpperCase().slice(0, 4) : k.label;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-md)",
      background: `${finalColor}22`,
      border: `1px solid ${finalColor}55`,
      color: finalColor,
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: finalIcon,
    size: Math.round(size * 0.45)
  }), showLabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: Math.max(8, Math.round(size * 0.22)),
      fontWeight: 600,
      letterSpacing: "0.04em",
      lineHeight: 1
    }
  }, label) : null);
}
Object.assign(__ds_scope, { FileTypeBadge, FILE_KINDS: KINDS, FILE_EXT_MAP: EXT_MAP });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/FileTypeBadge.jsx", error: String((e && e.message) || e) }); }

// components/display/FileRow.jsx
try { (() => {
/**
 * Single file row for the List view. Renders icon + name + path + size + time.
 * Designed for dense desktop list mode (32px tall).
 */
function relTime(ts) {
  if (!ts) return "";
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "たった今";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 時間前`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} 日前`;
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function formatSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}
function FileRow({
  name,
  path,
  ext,
  size,
  modified,
  isNew = false,
  selected = false,
  onClick,
  trailing,
  density = "comfortable",
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const guessedExt = ext ?? (name?.includes(".") ? name.split(".").pop() : null);
  const h = density === "compact" ? 30 : 36;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto auto auto",
      alignItems: "center",
      gap: 12,
      height: h,
      padding: "0 12px",
      borderRadius: "var(--radius-sm)",
      background: selected ? "var(--accent-soft)" : hover ? "var(--surface-hover)" : "transparent",
      color: selected ? "var(--text-primary)" : "var(--text-primary)",
      cursor: "pointer",
      transition: "background var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FileTypeBadge, {
    ext: guessedExt,
    size: 22,
    showLabel: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-primary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name), isNew ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
      color: "var(--accent)",
      background: "var(--accent-soft)",
      padding: "1px 5px",
      borderRadius: 3,
      letterSpacing: "0.08em",
      lineHeight: 1.4,
      flexShrink: 0
    }
  }, "NEW") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      letterSpacing: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: 220
    },
    title: path
  }, path), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right",
      minWidth: 76,
      display: "inline-flex",
      alignItems: "baseline",
      justifyContent: "flex-end",
      gap: 3,
      fontFamily: "var(--font-mono)",
      fontVariantNumeric: "tabular-nums"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, formatSize(size).replace(/\s?[A-Z]+$/, "")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      color: "var(--text-muted)",
      letterSpacing: "0.04em"
    }
  }, (formatSize(size).match(/[A-Z]+$/) || [""])[0])), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      textAlign: "right",
      minWidth: 60
    }
  }, typeof modified === "number" ? relTime(modified) : modified), trailing);
}
Object.assign(__ds_scope, { FileRow, formatSize, relTime });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/FileRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Primary button. Three visual variants (primary / secondary / ghost),
 * three sizes (sm / md / lg). Icons via leftIcon / rightIcon.
 */
function Button({
  children,
  variant = "secondary",
  size = "md",
  leftIcon,
  rightIcon,
  iconSize,
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
  style = {},
  onClick,
  ...rest
}) {
  const sizes = {
    sm: {
      h: 24,
      px: 8,
      font: 12,
      gap: 5,
      icon: 14,
      radius: "var(--radius-sm)"
    },
    md: {
      h: 30,
      px: 12,
      font: 13,
      gap: 6,
      icon: 16,
      radius: "var(--radius-md)"
    },
    lg: {
      h: 36,
      px: 16,
      font: 14,
      gap: 8,
      icon: 18,
      radius: "var(--radius-md)"
    }
  };
  const s = sizes[size] || sizes.md;
  const iSize = iconSize ?? s.icon;
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--text-on-accent)",
      borderColor: "transparent",
      hoverBg: "var(--accent-hover)",
      activeBg: "var(--accent)",
      fontWeight: 600
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text-primary)",
      borderColor: "var(--border)",
      hoverBg: "var(--surface-hover)",
      activeBg: "var(--surface-hover)",
      fontWeight: 500
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
      borderColor: "transparent",
      hoverBg: "var(--surface-hover)",
      activeBg: "var(--surface-hover)",
      fontWeight: 500
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      borderColor: "var(--border)",
      hoverBg: "rgba(216, 112, 96, 0.10)",
      activeBg: "rgba(216, 112, 96, 0.16)",
      fontWeight: 500
    }
  };
  const v = variants[variant] || variants.secondary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const bg = disabled ? v.background : active ? v.activeBg : hover ? v.hoverBg : v.background;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: disabled || loading ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    disabled: disabled,
    style: {
      height: s.h,
      padding: `0 ${s.px}px`,
      fontSize: s.font,
      fontFamily: "var(--font-sans)",
      fontWeight: v.fontWeight,
      lineHeight: 1,
      letterSpacing: "0.01em",
      color: v.color,
      background: bg,
      border: `1px solid ${v.borderColor}`,
      borderRadius: s.radius,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      width: fullWidth ? "100%" : undefined,
      transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out)",
      transform: active && !disabled ? "translateY(0.5px)" : "none",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: iSize,
      height: iSize,
      borderRadius: "50%",
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      animation: "lu-spin 0.8s linear infinite"
    }
  }) : leftIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leftIcon,
    size: iSize
  }) : null, children, !loading && rightIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: rightIcon,
    size: iSize
  }) : null, /*#__PURE__*/React.createElement("style", null, `@keyframes lu-spin { to { transform: rotate(360deg); } }`));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Filter / quick-select chip. Toggleable. Optional count.
 * Used heavily in LocalUpdater for file-type, time-range, and tag filters.
 */
function Chip({
  children,
  selected = false,
  onClick,
  leftIcon,
  count,
  size = "md",
  variant = "default",
  removable = false,
  onRemove,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      h: 22,
      font: 11,
      padX: 8,
      gap: 4,
      icon: 12
    },
    md: {
      h: 26,
      font: 12,
      padX: 10,
      gap: 6,
      icon: 14
    }
  };
  const s = sizes[size] || sizes.md;
  const [hover, setHover] = React.useState(false);
  const bg = selected ? "var(--accent-soft-2)" : hover ? "var(--surface-hover)" : "var(--surface)";
  const border = selected ? "var(--accent)" : "var(--border)";
  const color = selected ? "var(--text-accent)" : "var(--text-secondary)";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      height: s.h,
      padding: `0 ${s.padX}px`,
      background: bg,
      border: `1px solid ${border}`,
      color,
      borderRadius: "var(--radius-pill)",
      display: "inline-flex",
      alignItems: "center",
      gap: s.gap,
      fontSize: s.font,
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      letterSpacing: "0.01em",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), leftIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leftIcon,
    size: s.icon
  }) : null, /*#__PURE__*/React.createElement("span", null, children), count !== undefined ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: s.font - 1,
      color: selected ? "var(--text-accent)" : "var(--text-muted)",
      opacity: 0.85
    }
  }, count) : null, removable ? /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove?.();
    },
    style: {
      display: "inline-flex",
      marginLeft: 2,
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 10
  })) : null);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Square icon-only button. Used in toolbars, list rows, titlebars.
 */
function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  active = false,
  disabled = false,
  title,
  ariaLabel,
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 22,
    md: 28,
    lg: 34
  };
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };
  const dim = sizes[size] || sizes.md;
  const iSize = iconSizes[size] || iconSizes.md;
  const variants = {
    ghost: {
      base: "transparent",
      hover: "var(--surface-hover)",
      color: active ? "var(--accent)" : "var(--text-secondary)",
      activeBg: active ? "var(--accent-soft)" : "var(--surface-hover)",
      border: "transparent"
    },
    filled: {
      base: "var(--surface)",
      hover: "var(--surface-hover)",
      color: "var(--text-primary)",
      activeBg: "var(--accent-soft)",
      border: "var(--border)"
    }
  };
  const v = variants[variant] || variants.ghost;
  const [hover, setHover] = React.useState(false);
  const bg = disabled ? v.base : active ? v.activeBg : hover ? v.hover : v.base;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel || title,
    title: title,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    disabled: disabled,
    style: {
      width: dim,
      height: dim,
      borderRadius: "var(--radius-md)",
      background: bg,
      border: `1px solid ${v.border}`,
      color: v.color,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iSize
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Search / text input. Optional leading icon, clearable.
 */
function Input({
  value,
  defaultValue,
  onChange,
  placeholder = "",
  leftIcon,
  clearable = false,
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "text",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      h: 26,
      font: 12,
      padX: 8,
      icon: 14
    },
    md: {
      h: 30,
      font: 13,
      padX: 10,
      icon: 16
    },
    lg: {
      h: 36,
      font: 14,
      padX: 12,
      icon: 18
    }
  };
  const s = sizes[size] || sizes.md;
  const [focus, setFocus] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const handleChange = e => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e);
  };
  const handleClear = () => {
    if (!isControlled) setInternal("");
    onChange?.({
      target: {
        value: ""
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: s.h,
      padding: `0 ${s.padX}px`,
      background: "var(--surface)",
      border: `1px solid ${focus ? "var(--border-accent)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "0 0 0 3px var(--accent-soft)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
      width: fullWidth ? "100%" : undefined,
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, leftIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leftIcon,
    size: s.icon,
    style: {
      color: "var(--text-muted)"
    }
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: current,
    onChange: handleChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: placeholder,
    disabled: disabled,
    style: {
      flex: 1,
      minWidth: 0,
      height: "100%",
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      fontSize: s.font,
      letterSpacing: "0.01em"
    }
  }, rest)), clearable && current ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleClear,
    "aria-label": "\u30AF\u30EA\u30A2",
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: "none",
      padding: 0,
      background: "var(--border)",
      color: "var(--text-primary)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 10
  })) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Folder / category row in the left sidebar. Shows an icon, label, optional
 * count, and "selected" state (amber left accent + tint).
 *
 * Pass `expandable` to render an expand/collapse chevron before the icon
 * (used for folder rows with children). The chevron has its own click
 * handler that doesn't trigger row selection.
 */
function SidebarItem({
  icon,
  label,
  count,
  selected = false,
  depth = 0,
  onClick,
  trailing,
  expandable = false,
  expanded = false,
  onToggle,
  /** Reserve chevron space even when not expandable (for alignment with siblings that are). */
  reserveCaret = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const showCaretSlot = expandable || reserveCaret;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      width: "100%",
      height: 28,
      padding: `0 8px 0 ${4 + depth * 14}px`,
      borderRadius: "var(--radius-md)",
      background: selected ? "var(--accent-soft)" : hover ? "var(--surface-hover)" : "transparent",
      border: "none",
      position: "relative",
      color: selected ? "var(--text-accent)" : "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: selected ? 600 : 500,
      letterSpacing: "0.01em",
      textAlign: "left",
      cursor: "pointer",
      transition: "background var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), selected ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: 0,
      top: 4,
      bottom: 4,
      width: 2,
      borderRadius: 2,
      background: "var(--accent)"
    }
  }) : null, showCaretSlot ? expandable ? /*#__PURE__*/React.createElement("span", {
    role: "button",
    tabIndex: -1,
    "aria-label": expanded ? "閉じる" : "開く",
    onClick: e => {
      e.stopPropagation();
      onToggle?.();
    },
    style: {
      width: 16,
      height: 16,
      borderRadius: 3,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      transition: "transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
      transform: expanded ? "rotate(90deg)" : "none",
      flexShrink: 0
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--border-subtle)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronRight",
    size: 11,
    strokeWidth: 2.25
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      flexShrink: 0
    },
    "aria-hidden": true
  }) : null, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: selected ? "var(--accent)" : "var(--text-muted)",
      display: "inline-flex"
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, label), count !== undefined ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: selected ? "var(--text-accent)" : "var(--text-muted)",
      opacity: 0.85
    }
  }, count) : null, trailing);
}
Object.assign(__ds_scope, { SidebarItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StatusBar.jsx
try { (() => {
/**
 * Persistent footer status bar — counts, scan time, theme indicator.
 * Three slot regions (left / center / right).
 */
function StatusBar({
  left,
  center,
  right,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      height: "var(--statusbar-height)",
      padding: "0 12px",
      background: "var(--bg-statusbar)",
      borderTop: "1px solid var(--border-subtle)",
      fontSize: 11,
      color: "var(--text-muted)",
      letterSpacing: "0.04em",
      fontFamily: "var(--font-sans)",
      gap: 12,
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0
    }
  }, left), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      gap: 12
    }
  }, center), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0
    }
  }, right));
}
Object.assign(__ds_scope, { StatusBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StatusBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/**
 * Horizontal segmented tab bar. Active tab gets an amber underline.
 * Used for view-mode (List / Timeline / Calendar) and section tabs.
 */
function TabBar({
  tabs,
  value,
  onChange,
  size = "md",
  variant = "underline",
  style = {}
}) {
  const sizes = {
    sm: {
      h: 28,
      font: 12,
      padX: 10,
      gap: 4
    },
    md: {
      h: 36,
      font: 13,
      padX: 14,
      gap: 6
    }
  };
  const s = sizes[size] || sizes.md;
  if (variant === "segmented") {
    return /*#__PURE__*/React.createElement("div", {
      role: "tablist",
      style: {
        display: "inline-flex",
        padding: 2,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        gap: 2,
        ...style
      }
    }, tabs.map(t => {
      const active = t.value === value;
      return /*#__PURE__*/React.createElement("button", {
        key: t.value,
        role: "tab",
        "aria-selected": active,
        onClick: () => onChange?.(t.value),
        style: {
          height: s.h - 4,
          padding: `0 ${s.padX}px`,
          border: "none",
          borderRadius: "var(--radius-sm)",
          background: active ? "var(--accent)" : "transparent",
          color: active ? "var(--text-on-accent)" : "var(--text-secondary)",
          fontFamily: "var(--font-sans)",
          fontSize: s.font,
          fontWeight: active ? 600 : 500,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: s.gap,
          transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
        }
      }, t.icon, t.label);
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: 4,
      borderBottom: "1px solid var(--border)",
      ...style
    }
  }, tabs.map(t => {
    const active = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange?.(t.value),
      style: {
        height: s.h,
        padding: `0 ${s.padX}px`,
        background: "transparent",
        border: "none",
        borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        fontFamily: "var(--font-sans)",
        fontSize: s.font,
        fontWeight: active ? 600 : 500,
        letterSpacing: "0.01em",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        marginBottom: -1,
        transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
      }
    }, t.icon, t.label, t.count !== undefined ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: s.font - 2,
        color: "var(--text-muted)",
        marginLeft: 2
      }
    }, t.count) : null);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Toolbar.jsx
try { (() => {
/**
 * Horizontal toolbar with three slot regions (left / center / right).
 * Designed for the main app header above content.
 */
function Toolbar({
  left,
  center,
  right,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      height: "var(--header-height)",
      padding: "0 var(--gutter-window)",
      background: "var(--bg-app)",
      borderBottom: "1px solid var(--border-subtle)",
      gap: 12,
      flexShrink: 0,
      ...style
    }
  }, children ?? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexShrink: 0
    }
  }, left), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      minWidth: 0
    }
  }, center), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexShrink: 0
    }
  }, right)));
}
Object.assign(__ds_scope, { Toolbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Toolbar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/WindowFrame.jsx
try { (() => {
/**
 * macOS-style window chrome: titlebar with traffic-light dots + title.
 * Body slot is the content. Pure visual — no actual close/min behavior.
 */
function WindowFrame({
  title,
  subtitle,
  children,
  toolbar,
  statusBar,
  width = "100%",
  height = "100%",
  rounded = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      background: "var(--bg-app)",
      color: "var(--text-primary)",
      borderRadius: rounded ? "var(--radius-xl)" : 0,
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
      border: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--titlebar-height)",
      background: "var(--bg-titlebar)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 6,
      flexShrink: 0,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "#FF5F57"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "#FEBC2E"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "#28C840"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      pointerEvents: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--text-primary)",
      letterSpacing: "0.01em"
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, "\u2014 ", subtitle) : null)), toolbar, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      overflow: "hidden"
    }
  }, children), statusBar);
}
Object.assign(__ds_scope, { WindowFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/WindowFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/ListView.jsx
try { (() => {
const BUCKET_LABELS = {
  today: "今日",
  yesterday: "昨日",
  thisWeek: "今週",
  lastWeek: "先週",
  older: "それ以前"
};

/**
 * List view — grouped by time bucket. Mirrors uploaded screen A.
 */
function ListView({
  buckets,
  selectedId,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 16px 24px",
      overflow: "auto"
    }
  }, Object.entries(buckets).map(([key, files]) => files.length === 0 ? null : /*#__PURE__*/React.createElement("section", {
    key: key,
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      padding: "8px 12px",
      position: "sticky",
      top: 0,
      background: "var(--bg-app)",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "var(--text-secondary)",
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }
  }, BUCKET_LABELS[key]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--text-muted)"
    }
  }, files.length, " \u4EF6")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, files.map(f => /*#__PURE__*/React.createElement(__ds_scope.FileRow, {
    key: f.name + f.modified,
    name: f.name,
    ext: f.ext,
    path: f.path,
    size: f.size,
    modified: f.modified,
    isNew: f.isNew,
    selected: selectedId === f.name,
    onClick: () => onSelect?.(f.name)
  }))))));
}
Object.assign(__ds_scope, { ListView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/ListView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/Sidebar.jsx
try { (() => {
/**
 * Left sidebar — watched folders, theme switcher footer.
 */
function Sidebar({
  folders,
  current,
  onSelect,
  theme,
  onThemeChange
}) {
  // --- Folder tree expand/collapse state ----------------------------------
  const childrenOf = React.useMemo(() => {
    const m = new Map();
    for (const f of folders) {
      if (!f.parent) continue;
      if (!m.has(f.parent)) m.set(f.parent, []);
      m.get(f.parent).push(f.id);
    }
    return m;
  }, [folders]);
  const folderById = React.useMemo(() => Object.fromEntries(folders.map(f => [f.id, f])), [folders]);
  const hasChildren = id => childrenOf.has(id);
  const anyExpandable = folders.some(f => hasChildren(f.id));
  const [expanded, setExpanded] = React.useState(() => {
    const set = new Set();
    // Auto-expand ancestor chain of the selected folder
    let c = folderById[current];
    while (c && c.parent) {
      set.add(c.parent);
      c = folderById[c.parent];
    }
    // Expand "Dropbox" by default so the tree shows useful structure
    if (folders.some(f => f.id === "dropbox")) set.add("dropbox");
    return set;
  });
  React.useEffect(() => {
    // Re-open the ancestor chain when selection changes via breadcrumb etc.
    let c = folderById[current];
    if (!c) return;
    setExpanded(prev => {
      const next = new Set(prev);
      let changed = false;
      while (c && c.parent) {
        if (!next.has(c.parent)) {
          next.add(c.parent);
          changed = true;
        }
        c = folderById[c.parent];
      }
      return changed ? next : prev;
    });
  }, [current, folderById]);
  const toggle = id => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const isVisible = f => {
    let p = f.parent;
    while (p) {
      if (!expanded.has(p)) return false;
      p = folderById[p]?.parent;
    }
    return true;
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 220,
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 14px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 5,
      background: "var(--accent)",
      display: "grid",
      placeItems: "center",
      color: "var(--text-on-accent)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "refresh",
    size: 11,
    strokeWidth: 2.25
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-primary)",
      letterSpacing: "0.01em"
    }
  }, "LocalUpdater"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--text-muted)",
      letterSpacing: "0.04em"
    }
  }, "\u6700\u8FD1\u66F4\u65B0\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 8px",
      flex: 1,
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 8px 6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--text-muted)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontWeight: 600
    }
  }, "\u76E3\u8996\u4E2D\u30D5\u30A9\u30EB\u30C0"), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "plus",
    size: "sm",
    title: "\u30D5\u30A9\u30EB\u30C0\u3092\u8FFD\u52A0"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, folders.filter(isVisible).map(f => /*#__PURE__*/React.createElement(__ds_scope.SidebarItem, {
    key: f.id,
    icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: f.icon,
      size: 14
    }),
    label: f.label,
    count: f.count,
    depth: f.depth ?? 0,
    selected: current === f.id,
    onClick: () => onSelect?.(f.id),
    expandable: hasChildren(f.id),
    expanded: expanded.has(f.id),
    onToggle: () => toggle(f.id),
    reserveCaret: anyExpandable && !hasChildren(f.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: "4px 8px 6px",
      fontSize: 10,
      color: "var(--text-muted)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontWeight: 600
    }
  }, "\u8868\u793A\u671F\u9593"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, [{
    id: "1d",
    label: "24 時間"
  }, {
    id: "7d",
    label: "1 週間"
  }, {
    id: "14d",
    label: "2 週間",
    selected: true
  }, {
    id: "30d",
    label: "1 か月"
  }].map(p => /*#__PURE__*/React.createElement(__ds_scope.SidebarItem, {
    key: p.id,
    icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "calendar",
      size: 14
    }),
    label: p.label,
    selected: p.selected
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderTop: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--text-muted)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginRight: 4
    }
  }, "\u30C6\u30FC\u30DE"), [{
    id: "earth",
    color: "#E8A05A",
    label: "Earth"
  }, {
    id: "night",
    color: "#5286FF",
    label: "Night"
  }, {
    id: "light",
    color: "#FF7A69",
    label: "Light"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => onThemeChange?.(t.id),
    title: t.label,
    "aria-label": t.label,
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: t.color,
      border: theme === t.id ? "2px solid var(--text-primary)" : "2px solid transparent",
      outline: theme === t.id ? "1px solid var(--accent)" : "none",
      outlineOffset: 1,
      cursor: "pointer",
      padding: 0
    }
  }))));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/TimelineView.jsx
try { (() => {
const DAY_LABELS = {
  today: "今日",
  yesterday: "昨日",
  thisWeek: "今週",
  lastWeek: "先週",
  older: "それ以前"
};

/**
 * Timeline view — vertical lane with file pips clustered by day,
 * matches uploaded screen B.
 */
function TimelineView({
  buckets
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 32px 32px",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingLeft: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: 10,
      top: 8,
      bottom: 8,
      width: 2,
      background: "linear-gradient(to bottom, var(--border-subtle), var(--border) 40%, var(--border-subtle))",
      borderRadius: 1
    }
  }), Object.entries(buckets).map(([key, files]) => files.length === 0 ? null : /*#__PURE__*/React.createElement("section", {
    key: key,
    style: {
      marginBottom: 24,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginLeft: -32,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: key === "today" ? "var(--accent)" : "var(--surface-elevated)",
      border: key === "today" ? "none" : "1px solid var(--border)",
      color: key === "today" ? "var(--text-on-accent)" : "var(--text-secondary)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      flexShrink: 0,
      boxShadow: key === "today" ? "0 0 0 4px var(--accent-soft)" : "none"
    }
  }, files.length), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 12,
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-primary)",
      letterSpacing: "0.01em"
    }
  }, DAY_LABELS[key]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)"
    }
  }, key === "today" ? new Date().toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short"
  }) : `${files.length} 件 / ${__ds_scope.formatSize(files.reduce((s, f) => s + f.size, 0))}`))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      paddingLeft: 4
    }
  }, files.map(f => /*#__PURE__*/React.createElement("article", {
    key: f.name + f.modified,
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "center",
      gap: 12,
      padding: "8px 12px",
      background: "var(--surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FileTypeBadge, {
    ext: f.ext,
    size: 28,
    showLabel: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-primary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, f.name, f.isNew ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontSize: 9,
      fontFamily: "var(--font-mono)",
      color: "var(--accent)",
      background: "var(--accent-soft)",
      padding: "1px 5px",
      borderRadius: 3,
      letterSpacing: "0.08em",
      verticalAlign: 1
    }
  }, "NEW") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      marginTop: 2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, f.path)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, new Date(f.modified).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      marginTop: 1
    }
  }, __ds_scope.formatSize(f.size))))))))));
}
Object.assign(__ds_scope, { TimelineView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/TimelineView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/data.js
try { (() => {
/**
 * Shared sample data + helpers for the LocalUpdater UI kit screens.
 * Times are computed once at module load so dates feel "live" but stable
 * across the screens in a single page-load.
 */

const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const NOW = now;

/**
 * Folder tree — nested via `parent`. `depth` is the visual indent in the
 * sidebar. Counts are computed at runtime by `countFor()` so they stay
 * accurate when files are added or filters change.
 */
const FOLDERS = [{
  id: "all",
  label: "すべて",
  icon: "star",
  depth: 0
}, {
  id: "desktop",
  label: "デスクトップ",
  icon: "desktop",
  depth: 0
}, {
  id: "assets",
  label: "素材",
  icon: "folder",
  depth: 1,
  parent: "desktop"
}, {
  id: "dropbox",
  label: "Dropbox",
  icon: "folder",
  depth: 0
}, {
  id: "drawings",
  label: "図面",
  icon: "folder",
  depth: 1,
  parent: "dropbox"
}, {
  id: "fy2026",
  label: "2026年度",
  icon: "folder",
  depth: 2,
  parent: "drawings"
}, {
  id: "parts",
  label: "部品",
  icon: "folder",
  depth: 2,
  parent: "drawings"
}, {
  id: "review",
  label: "レビュー",
  icon: "folder",
  depth: 1,
  parent: "dropbox"
}, {
  id: "downloads",
  label: "ダウンロード",
  icon: "download",
  depth: 0
}];
const FILES = [
// Today
{
  name: "hub_assembly_v4.dwg",
  ext: "dwg",
  size: 2_457_600,
  modified: now - 18 * MIN,
  path: "Dropbox / 図面 / 2026年度",
  isNew: true,
  folder: "fy2026"
}, {
  name: "bracket-rev-3.step",
  ext: "step",
  size: 1_120_000,
  modified: now - 42 * MIN,
  path: "Dropbox / 図面 / 部品",
  isNew: true,
  folder: "parts"
}, {
  name: "client-review_2026-06-25.pdf",
  ext: "pdf",
  size: 4_200_000,
  modified: now - 2 * HOUR,
  path: "Dropbox / レビュー",
  folder: "review"
}, {
  name: "概算見積り_v2.xlsx",
  ext: "xlsx",
  size: 86_400,
  modified: now - 3 * HOUR,
  path: "デスクトップ",
  folder: "desktop"
}, {
  name: "進捗説明.pptx",
  ext: "pptx",
  size: 12_400_000,
  modified: now - 4 * HOUR,
  path: "デスクトップ",
  folder: "desktop"
},
// Yesterday
{
  name: "frame_section.dxf",
  ext: "dxf",
  size: 620_000,
  modified: now - 1 * DAY - 2 * HOUR,
  path: "Dropbox / 図面 / 2026年度",
  folder: "fy2026"
}, {
  name: "site_photo_03.jpg",
  ext: "jpg",
  size: 3_800_000,
  modified: now - 1 * DAY - 5 * HOUR,
  path: "ダウンロード",
  folder: "downloads"
}, {
  name: "打合せメモ.md",
  ext: "md",
  size: 4_200,
  modified: now - 1 * DAY - 6 * HOUR,
  path: "デスクトップ",
  folder: "desktop"
}, {
  name: "specs_outline.docx",
  ext: "docx",
  size: 42_000,
  modified: now - 1 * DAY - 9 * HOUR,
  path: "Dropbox",
  folder: "dropbox"
},
// 2 days
{
  name: "render_top.png",
  ext: "png",
  size: 8_400_000,
  modified: now - 2 * DAY - 1 * HOUR,
  path: "デスクトップ / 素材",
  folder: "assets"
}, {
  name: "render_side.png",
  ext: "png",
  size: 7_900_000,
  modified: now - 2 * DAY - 1 * HOUR,
  path: "デスクトップ / 素材",
  folder: "assets"
}, {
  name: "BOM_revC.xlsx",
  ext: "xlsx",
  size: 220_000,
  modified: now - 2 * DAY - 4 * HOUR,
  path: "Dropbox / 図面 / 部品",
  folder: "parts"
},
// 3-7 days
{
  name: "shaft_revB.dwg",
  ext: "dwg",
  size: 1_900_000,
  modified: now - 3 * DAY,
  path: "Dropbox / 図面 / 部品",
  folder: "parts"
}, {
  name: "client_brief.pdf",
  ext: "pdf",
  size: 1_200_000,
  modified: now - 4 * DAY,
  path: "Dropbox / レビュー",
  folder: "review"
}, {
  name: "logo_marks.svg",
  ext: "svg",
  size: 18_000,
  modified: now - 5 * DAY,
  path: "デスクトップ / 素材",
  folder: "assets"
}, {
  name: "site_photo_01.jpg",
  ext: "jpg",
  size: 3_200_000,
  modified: now - 6 * DAY,
  path: "ダウンロード",
  folder: "downloads"
},
// 7-14 days
{
  name: "machine-housing_v2.SLDPRT",
  ext: "sldprt",
  size: 920_000,
  modified: now - 8 * DAY,
  path: "Dropbox / 図面 / 2026年度",
  folder: "fy2026"
}, {
  name: "manufacturing_v1.pdf",
  ext: "pdf",
  size: 5_400_000,
  modified: now - 9 * DAY,
  path: "Dropbox / レビュー",
  folder: "review"
}, {
  name: "宛先リスト.csv",
  ext: "csv",
  size: 8_400,
  modified: now - 11 * DAY,
  path: "デスクトップ",
  folder: "desktop"
}, {
  name: "old_revision.dwg",
  ext: "dwg",
  size: 2_100_000,
  modified: now - 13 * DAY,
  path: "Dropbox / 図面",
  folder: "drawings"
}];

// ---------------------------------------------------------------------------
// Folder-tree helpers
// ---------------------------------------------------------------------------

const FOLDER_BY_ID = Object.fromEntries(FOLDERS.map(f => [f.id, f]));

/** Look up a folder by id. */
function getFolder(id) {
  return FOLDER_BY_ID[id];
}

/**
 * Return all descendant folder ids (including the folder itself).
 * Used for filtering: "show files in this folder or any nested one".
 */
function getDescendantIds(id) {
  if (id === "all") return null; // null = "no filter"
  const out = [id];
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    for (const f of FOLDERS) {
      if (f.parent === cur) {
        out.push(f.id);
        stack.push(f.id);
      }
    }
  }
  return out;
}

/**
 * Ancestor chain from root to `id`, inclusive. The first item is a
 * synthetic "home" root so the breadcrumb always starts there.
 * Returns `null` for the "all" view (no breadcrumb shown).
 */
function getBreadcrumb(id) {
  if (!id || id === "all") return null;
  const chain = [];
  let cur = FOLDER_BY_ID[id];
  while (cur) {
    chain.unshift(cur);
    cur = cur.parent ? FOLDER_BY_ID[cur.parent] : null;
  }
  return chain;
}

/** Count files in a folder + its descendants. */
function countFor(id) {
  if (id === "all") return FILES.length;
  const ids = new Set(getDescendantIds(id) || []);
  return FILES.filter(f => ids.has(f.folder)).length;
}
const FILE_TYPE_TABS = [{
  value: "all",
  label: "すべて",
  count: FILES.length
}, {
  value: "cad",
  label: "CAD",
  count: FILES.filter(f => ["dwg", "dxf", "step", "sldprt", "stp"].includes(f.ext)).length
}, {
  value: "img",
  label: "画像",
  count: FILES.filter(f => ["png", "jpg", "jpeg", "gif", "svg"].includes(f.ext)).length
}, {
  value: "doc",
  label: "ドキュメント",
  count: FILES.filter(f => ["docx", "md", "txt", "pptx", "xlsx", "csv"].includes(f.ext)).length
}, {
  value: "pdf",
  label: "PDF",
  count: FILES.filter(f => f.ext === "pdf").length
}];

/** Bucket files into a Today / Yesterday / This week / Last week structure. */
function bucketByTime(files) {
  const startOfDay = (offsetDays = 0) => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime() - offsetDays * DAY;
  };
  const today = startOfDay(0);
  const yesterday = startOfDay(1);
  const week = startOfDay(7);
  const buckets = {
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
    older: []
  };
  for (const f of files) {
    if (f.modified >= today) buckets.today.push(f);else if (f.modified >= yesterday) buckets.yesterday.push(f);else if (f.modified >= week) buckets.thisWeek.push(f);else if (f.modified >= week - 7 * DAY) buckets.lastWeek.push(f);else buckets.older.push(f);
  }
  return buckets;
}

/** Group by YYYY-MM-DD for the calendar heatmap. */
function activityByDay(files, days = 28) {
  const map = new Map();
  for (const f of files) {
    const d = new Date(f.modified);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * DAY);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    out.push({
      date: d,
      key,
      count: map.get(key) || 0
    });
  }
  return out;
}
Object.assign(__ds_scope, { NOW, FOLDERS, FILES, getFolder, getDescendantIds, getBreadcrumb, countFor, FILE_TYPE_TABS, bucketByTime, activityByDay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/data.js", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/BreadcrumbBar.jsx
try { (() => {
/**
 * Breadcrumb path for the current folder. Always starts with a home
 * (すべて) segment. Each segment is clickable and jumps directly to
 * that level — including non-adjacent ones, so you can pop several
 * levels in one click.
 *
 * Renders nothing when the current folder is "all" (no breadcrumb needed).
 */
function BreadcrumbBar({
  currentId,
  onSelect,
  style = {}
}) {
  const chain = __ds_scope.getBreadcrumb(currentId);
  if (!chain) return null;
  const segments = [{
    id: "all",
    label: "すべて",
    icon: "star",
    isHome: true
  }, ...chain.map(f => ({
    id: f.id,
    label: f.label,
    icon: f.icon
  }))];
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "\u30D5\u30A9\u30EB\u30C0\u968E\u5C64",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: "8px 24px",
      background: "var(--bg-app)",
      borderBottom: "1px solid var(--border-subtle)",
      fontSize: 12,
      flexWrap: "wrap",
      ...style
    }
  }, segments.map((seg, i) => {
    const last = i === segments.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: seg.id
    }, /*#__PURE__*/React.createElement(Segment, {
      icon: seg.icon,
      label: seg.label,
      isLast: last,
      isHome: seg.isHome,
      onClick: last ? undefined : () => onSelect?.(seg.id)
    }), !last ? /*#__PURE__*/React.createElement("span", {
      "aria-hidden": true,
      style: {
        color: "var(--text-faint)",
        margin: "0 2px",
        display: "inline-flex",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevronRight",
      size: 12
    })) : null);
  }));
}
function Segment({
  icon,
  label,
  isLast,
  isHome,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    disabled: !clickable,
    "aria-current": isLast ? "page" : undefined,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 24,
      padding: "0 8px",
      border: "none",
      borderRadius: "var(--radius-sm)",
      background: clickable && hover ? "var(--surface-hover)" : "transparent",
      color: isLast ? "var(--text-primary)" : "var(--text-secondary)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: isLast ? 600 : 500,
      letterSpacing: "0.01em",
      cursor: clickable ? "pointer" : "default",
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: isLast ? "var(--accent)" : clickable && hover ? "var(--text-primary)" : "var(--text-muted)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: isHome ? "star" : icon,
    size: 13
  })), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { BreadcrumbBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/BreadcrumbBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/CalendarView.jsx
try { (() => {
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** Map count → heat level (0–4). */
function heat(count) {
  if (!count) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

/**
 * Calendar view — month grid with heatmap cells + a side panel listing
 * files for the focused day. Mirrors uploaded screen C.
 */
function CalendarView({
  files
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a count map: "Y-M-D" → number of files on that day
  const counts = new Map();
  for (const f of files) {
    const d = new Date(f.modified);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({
    blank: true
  });
  for (let d = 1; d <= daysInMonth; d++) {
    const c = counts.get(d) || 0;
    cells.push({
      day: d,
      count: c,
      level: heat(c),
      isToday: d === today.getDate()
    });
  }
  const [focusDay, setFocusDay] = React.useState(today.getDate());
  const focusFiles = files.filter(f => new Date(f.modified).getDate() === focusDay && new Date(f.modified).getMonth() === month).sort((a, b) => b.modified - a.modified);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 24,
      padding: "16px 24px 24px",
      overflow: "hidden",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: "-0.01em"
    }
  }, year, " \u5E74 ", month + 1, " \u6708"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--text-muted)"
    }
  }, "\u6D3B\u52D5\u91CF\u3092\u8272\u306E\u6FC3\u3055\u3067\u8868\u793A"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--text-muted)"
    }
  }, "\u5C11"), [0, 1, 2, 3, 4].map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: `var(--heat-${l})`,
      border: l === 0 ? "1px solid var(--border-subtle)" : "none"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--text-muted)"
    }
  }, "\u591A"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 6,
      marginBottom: 6
    }
  }, WEEKDAYS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      fontSize: 10.5,
      fontWeight: 600,
      textAlign: "center",
      color: i === 0 ? "var(--danger)" : i === 6 ? "var(--brand)" : "var(--text-muted)",
      letterSpacing: "0.04em"
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridAutoRows: "1fr",
      gap: 6,
      flex: 1,
      minHeight: 0
    }
  }, cells.map((c, i) => {
    if (c.blank) return /*#__PURE__*/React.createElement("div", {
      key: `b${i}`
    });
    const focused = focusDay === c.day;
    return /*#__PURE__*/React.createElement("button", {
      key: c.day,
      onClick: () => setFocusDay(c.day),
      style: {
        position: "relative",
        background: `var(--heat-${c.level})`,
        border: focused ? "1.5px solid var(--accent)" : c.isToday ? "1.5px solid var(--text-secondary)" : "1px solid var(--border-subtle)",
        borderRadius: 6,
        padding: "6px 8px",
        color: c.level >= 3 ? "var(--text-on-accent)" : "var(--text-primary)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        fontFamily: "var(--font-sans)",
        minHeight: 56,
        transition: "border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: c.isToday ? 700 : 500,
        fontVariantNumeric: "tabular-nums",
        opacity: c.level === 0 ? 0.7 : 1
      }
    }, c.day), c.count > 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 600,
        opacity: 0.95
      }
    }, c.count, " \u4EF6") : null);
  }))), /*#__PURE__*/React.createElement("aside", {
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "16px 16px 12px",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 4
    }
  }, month + 1, " \u6708 ", focusDay, " \u65E5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      marginBottom: 6
    }
  }, focusFiles.length, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 400,
      marginLeft: 4,
      color: "var(--text-muted)"
    }
  }, "\u4EF6\u306E\u66F4\u65B0")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-secondary)",
      marginBottom: 14
    }
  }, "\u5408\u8A08 ", __ds_scope.formatSize(focusFiles.reduce((s, f) => s + f.size, 0))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, focusFiles.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      padding: "8px 0"
    }
  }, "\u3053\u306E\u65E5\u306E\u66F4\u65B0\u306F\u3042\u308A\u307E\u305B\u3093\u3002") : focusFiles.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.name,
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 10,
      alignItems: "center",
      padding: "6px 0",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FileTypeBadge, {
    ext: f.ext,
    size: 24,
    showLabel: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-primary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)"
    }
  }, new Date(f.modified).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)"
    }
  }, __ds_scope.formatSize(f.size)))))));
}
Object.assign(__ds_scope, { CalendarView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/CalendarView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/localupdater/LocalUpdaterApp.jsx
try { (() => {
const VIEW_LABEL = {
  list: "リスト表示",
  timeline: "タイムライン表示",
  calendar: "カレンダー表示"
};

/**
 * Full LocalUpdater app surface — title bar, sidebar, toolbar with view-mode
 * picker, filter chips, content area, status bar. Theme switchable via
 * the swatches in the sidebar footer.
 */
function LocalUpdaterApp({
  defaultView = "list",
  defaultTheme = "earth"
} = {}) {
  const [view, setView] = React.useState(defaultView);
  const [theme, setTheme] = React.useState(defaultTheme);
  const [folder, setFolder] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(__ds_scope.FILES[0]?.name);

  // Filter pipeline — folder filter includes the folder + all descendants
  let working = __ds_scope.FILES;
  if (folder !== "all") {
    const allowed = new Set(__ds_scope.getDescendantIds(folder) || []);
    working = working.filter(f => allowed.has(f.folder));
  }
  if (type !== "all") {
    const m = {
      cad: ["dwg", "dxf", "step", "stp", "sldprt"],
      img: ["png", "jpg", "jpeg", "gif", "svg"],
      doc: ["docx", "md", "txt", "pptx", "xlsx", "csv"],
      pdf: ["pdf"]
    }[type] || [];
    working = working.filter(f => m.includes(f.ext));
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    working = working.filter(f => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q));
  }
  const buckets = __ds_scope.bucketByTime(working);
  const totalSize = working.reduce((s, f) => s + f.size, 0);
  return /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    style: {
      height: "100%",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.WindowFrame, {
    title: "LocalUpdater",
    subtitle: `${working.length} 件 · ${__ds_scope.formatSize(totalSize)}`,
    toolbar: /*#__PURE__*/React.createElement(__ds_scope.Toolbar, {
      left: /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "baseline",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("h1", {
        style: {
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.01em"
        }
      }, "\u6700\u8FD1\u66F4\u65B0\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB")),
      center: /*#__PURE__*/React.createElement(__ds_scope.TabBar, {
        variant: "segmented",
        value: view,
        onChange: setView,
        tabs: [{
          value: "list",
          label: "リスト",
          icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
            name: "list",
            size: 14
          })
        }, {
          value: "timeline",
          label: "タイムライン",
          icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
            name: "timeline",
            size: 14
          })
        }, {
          value: "calendar",
          label: "カレンダー",
          icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
            name: "calendar",
            size: 14
          })
        }]
      }),
      right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Input, {
        leftIcon: "search",
        placeholder: "\u30D5\u30A1\u30A4\u30EB\u540D\u3067\u691C\u7D22\u2026",
        value: query,
        onChange: e => setQuery(e.target.value),
        clearable: true,
        style: {
          width: 200
        }
      }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
        icon: "refresh",
        title: "\u518D\u30B9\u30AD\u30E3\u30F3"
      }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
        icon: "settings",
        title: "\u8A2D\u5B9A"
      }))
    }),
    statusBar: /*#__PURE__*/React.createElement(__ds_scope.StatusBar, {
      left: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: "folders",
        size: 11
      }), " \u76E3\u8996\u4E2D: 3 \u30D5\u30A9\u30EB\u30C0"),
      center: `${working.length} 件 · ${__ds_scope.formatSize(totalSize)}`,
      right: /*#__PURE__*/React.createElement(React.Fragment, null, "\u6700\u7D42\u30B9\u30AD\u30E3\u30F3: ", new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit"
      }))
    }),
    rounded: false,
    style: {
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Sidebar, {
    folders: __ds_scope.FOLDERS.map(f => ({
      ...f,
      count: __ds_scope.countFor(f.id)
    })),
    current: folder,
    onSelect: setFolder,
    theme: theme,
    onThemeChange: setTheme
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-app)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 24px",
      borderBottom: "1px solid var(--border-subtle)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--text-muted)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontWeight: 600,
      marginRight: 4
    }
  }, "\u7A2E\u5225"), __ds_scope.FILE_TYPE_TABS.map(t => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: t.value,
    selected: type === t.value,
    onClick: () => setType(t.value),
    leftIcon: t.value === "cad" ? "cad" : t.value === "img" ? "image" : t.value === "doc" ? "doc" : t.value === "pdf" ? "pdf" : "folder",
    count: t.count
  }, t.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "ghost",
    leftIcon: "filter"
  }, "\u30D5\u30A3\u30EB\u30BF"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "ghost",
    rightIcon: "chevronDown"
  }, "\u66F4\u65B0\u65E5 \u2193")), /*#__PURE__*/React.createElement(__ds_scope.BreadcrumbBar, {
    currentId: folder,
    onSelect: setFolder
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      position: "relative",
      overflow: "hidden"
    }
  }, view === "list" && /*#__PURE__*/React.createElement(__ds_scope.ListView, {
    buckets: buckets,
    selectedId: selected,
    onSelect: setSelected
  }), view === "timeline" && /*#__PURE__*/React.createElement(__ds_scope.TimelineView, {
    buckets: buckets
  }), view === "calendar" && /*#__PURE__*/React.createElement(__ds_scope.CalendarView, {
    files: working
  })))));
}
Object.assign(__ds_scope, { LocalUpdaterApp });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/localupdater/LocalUpdaterApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.FileRow = __ds_scope.FileRow;

__ds_ns.FileTypeBadge = __ds_scope.FileTypeBadge;

__ds_ns.FILE_KINDS = __ds_scope.FILE_KINDS;

__ds_ns.FILE_EXT_MAP = __ds_scope.FILE_EXT_MAP;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SidebarItem = __ds_scope.SidebarItem;

__ds_ns.StatusBar = __ds_scope.StatusBar;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.Toolbar = __ds_scope.Toolbar;

__ds_ns.WindowFrame = __ds_scope.WindowFrame;

__ds_ns.BreadcrumbBar = __ds_scope.BreadcrumbBar;

__ds_ns.CalendarView = __ds_scope.CalendarView;

__ds_ns.ListView = __ds_scope.ListView;

__ds_ns.LocalUpdaterApp = __ds_scope.LocalUpdaterApp;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.TimelineView = __ds_scope.TimelineView;

__ds_ns.NOW = __ds_scope.NOW;

__ds_ns.FOLDERS = __ds_scope.FOLDERS;

__ds_ns.FILES = __ds_scope.FILES;

__ds_ns.FILE_TYPE_TABS = __ds_scope.FILE_TYPE_TABS;

})();
