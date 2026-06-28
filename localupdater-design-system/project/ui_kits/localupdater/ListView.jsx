import React from "react";
import { FileRow } from "../../components/display/FileRow.jsx";

const BUCKET_LABELS = {
  today:     "今日",
  yesterday: "昨日",
  thisWeek:  "今週",
  lastWeek:  "先週",
  older:     "それ以前",
};

/**
 * List view — grouped by time bucket. Mirrors uploaded screen A.
 */
export function ListView({ buckets, selectedId, onSelect }) {
  return (
    <div style={{ padding: "8px 16px 24px", overflow: "auto" }}>
      {Object.entries(buckets).map(([key, files]) =>
        files.length === 0 ? null : (
          <section key={key} style={{ marginTop: 12 }}>
            <header
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                padding: "8px 12px",
                position: "sticky",
                top: 0,
                background: "var(--bg-app)",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {BUCKET_LABELS[key]}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: "var(--text-muted)",
                }}
              >
                {files.length} 件
              </span>
            </header>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {files.map((f) => (
                <FileRow
                  key={f.name + f.modified}
                  name={f.name}
                  ext={f.ext}
                  path={f.path}
                  size={f.size}
                  modified={f.modified}
                  isNew={f.isNew}
                  selected={selectedId === f.name}
                  onClick={() => onSelect?.(f.name)}
                />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
