import React from "react";
import { Icon } from "../Icon.jsx";

/**
 * Square color-coded badge for a file extension. Used as the leading
 * thumbnail in list rows and grid tiles.
 *
 * Built-in mappings: cad / image / slides / doc / sheet / pdf / other.
 * Pass `kind` to pick one, or override `color` + `icon` explicitly.
 */
const KINDS = {
  cad:    { color: "#7BA9CE", icon: "cad",    label: "CAD" },
  image:  { color: "#6FB68C", icon: "image",  label: "IMG" },
  slides: { color: "#E8A05A", icon: "slides", label: "PPT" },
  doc:    { color: "#92BAD9", icon: "doc",    label: "DOC" },
  sheet:  { color: "#6FB68C", icon: "sheet",  label: "XLS" },
  pdf:    { color: "#D87060", icon: "pdf",    label: "PDF" },
  other:  { color: "#9AA4B0", icon: "file",   label: "—"   },
};

const EXT_MAP = {
  dwg: "cad", dxf: "cad", step: "cad", stp: "cad", iges: "cad", igs: "cad", sldprt: "cad", sldasm: "cad", catpart: "cad", x_t: "cad",
  png: "image", jpg: "image", jpeg: "image", gif: "image", bmp: "image", tif: "image", tiff: "image", webp: "image", svg: "image", heic: "image",
  ppt: "slides", pptx: "slides", key: "slides",
  doc: "doc", docx: "doc", txt: "doc", md: "doc", rtf: "doc",
  xls: "sheet", xlsx: "sheet", csv: "sheet", numbers: "sheet",
  pdf: "pdf",
};

export function FileTypeBadge({
  kind,
  ext,
  size = 32,
  showLabel = true,
  color,
  icon,
  style = {},
}) {
  const resolvedKind = kind || (ext ? EXT_MAP[String(ext).toLowerCase()] : null) || "other";
  const k = KINDS[resolvedKind] || KINDS.other;
  const finalColor = color || k.color;
  const finalIcon = icon || k.icon;
  const label = ext ? String(ext).toUpperCase().slice(0, 4) : k.label;

  return (
    <div
      style={{
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
        ...style,
      }}
    >
      <Icon name={finalIcon} size={Math.round(size * 0.45)} />
      {showLabel ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: Math.max(8, Math.round(size * 0.22)),
            fontWeight: 600,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { KINDS as FILE_KINDS, EXT_MAP as FILE_EXT_MAP };
