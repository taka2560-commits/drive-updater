import React from "react";
import { FileTypeBadge } from "../../components/display/FileTypeBadge.jsx";
import { formatSize, relTime } from "../../components/display/FileRow.jsx";

const DAY_LABELS = {
  today:     "今日",
  yesterday: "昨日",
  thisWeek:  "今週",
  lastWeek:  "先週",
  older:     "それ以前",
};

/**
 * Timeline view — vertical lane with file pips clustered by day,
 * matches uploaded screen B.
 */
export function TimelineView({ buckets }) {
  return (
    <div style={{ padding: "16px 32px 32px", overflow: "auto" }}>
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {/* Vertical rail */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            bottom: 8,
            width: 2,
            background: "linear-gradient(to bottom, var(--border-subtle), var(--border) 40%, var(--border-subtle))",
            borderRadius: 1,
          }}
        />
        {Object.entries(buckets).map(([key, files]) =>
          files.length === 0 ? null : (
            <section key={key} style={{ marginBottom: 24, position: "relative" }}>
              {/* Day node */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: -32,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
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
                    boxShadow: key === "today" ? "0 0 0 4px var(--accent-soft)" : "none",
                  }}
                >
                  {files.length}
                </span>
                <div style={{ marginLeft: 12, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {DAY_LABELS[key]}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {key === "today" ? new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" }) : `${files.length} 件 / ${formatSize(files.reduce((s,f)=>s+f.size,0))}`}
                  </span>
                </div>
              </div>

              {/* File cluster */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
                {files.map((f) => (
                  <article
                    key={f.name + f.modified}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      background: "var(--surface)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <FileTypeBadge ext={f.ext} size={28} showLabel={false} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.name}
                        {f.isNew ? (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 9,
                              fontFamily: "var(--font-mono)",
                              color: "var(--accent)",
                              background: "var(--accent-soft)",
                              padding: "1px 5px",
                              borderRadius: 3,
                              letterSpacing: "0.08em",
                              verticalAlign: 1,
                            }}
                          >
                            NEW
                          </span>
                        ) : null}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.path}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                        {new Date(f.modified).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                        {formatSize(f.size)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}
