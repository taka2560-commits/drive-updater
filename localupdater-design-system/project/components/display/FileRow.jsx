import React from "react";
import { FileTypeBadge } from "./FileTypeBadge.jsx";
import { Icon } from "../Icon.jsx";

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

export function FileRow({
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
  style = {},
}) {
  const [hover, setHover] = React.useState(false);
  const guessedExt = ext ?? (name?.includes(".") ? name.split(".").pop() : null);
  const h = density === "compact" ? 30 : 36;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto auto",
        alignItems: "center",
        gap: 12,
        height: h,
        padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        background: selected
          ? "var(--accent-soft)"
          : hover
          ? "var(--surface-hover)"
          : "transparent",
        color: selected ? "var(--text-primary)" : "var(--text-primary)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      <FileTypeBadge ext={guessedExt} size={22} showLabel={false} />
      <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>
        {isNew ? (
          <span
            style={{
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              color: "var(--accent)",
              background: "var(--accent-soft)",
              padding: "1px 5px",
              borderRadius: 3,
              letterSpacing: "0.08em",
              lineHeight: 1.4,
              flexShrink: 0,
            }}
          >
            NEW
          </span>
        ) : null}
      </div>
      <span
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          letterSpacing: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 220,
        }}
        title={path}
      >
        {path}
      </span>
      <span style={{ textAlign: "right", minWidth: 76, display: "inline-flex", alignItems: "baseline", justifyContent: "flex-end", gap: 3, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)" }}>
          {formatSize(size).replace(/\s?[A-Z]+$/, "")}
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
          {(formatSize(size).match(/[A-Z]+$/) || [""])[0]}
        </span>
      </span>
      <span style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", minWidth: 60 }}>
        {typeof modified === "number" ? relTime(modified) : modified}
      </span>
      {trailing}
    </div>
  );
}

export { formatSize, relTime };
