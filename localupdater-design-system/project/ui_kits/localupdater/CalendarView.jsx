import React from "react";
import { activityByDay } from "./data.js";
import { FileTypeBadge } from "../../components/display/FileTypeBadge.jsx";
import { formatSize } from "../../components/display/FileRow.jsx";

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
export function CalendarView({ files }) {
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
  for (let i = 0; i < startWeekday; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const c = counts.get(d) || 0;
    cells.push({ day: d, count: c, level: heat(c), isToday: d === today.getDate() });
  }

  const [focusDay, setFocusDay] = React.useState(today.getDate());
  const focusFiles = files
    .filter((f) => new Date(f.modified).getDate() === focusDay && new Date(f.modified).getMonth() === month)
    .sort((a, b) => b.modified - a.modified);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, padding: "16px 24px 24px", overflow: "hidden", height: "100%" }}>
      {/* Calendar */}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {year} 年 {month + 1} 月
          </h2>
          <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
            活動量を色の濃さで表示
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>少</span>
            {[0,1,2,3,4].map((l) => (
              <span key={l} style={{
                width: 12, height: 12, borderRadius: 3,
                background: `var(--heat-${l})`,
                border: l === 0 ? "1px solid var(--border-subtle)" : "none",
              }} />
            ))}
            <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>多</span>
          </div>
        </div>

        {/* Weekday header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                textAlign: "center",
                color: i === 0 ? "var(--danger)" : i === 6 ? "var(--brand)" : "var(--text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 6, flex: 1, minHeight: 0 }}>
          {cells.map((c, i) => {
            if (c.blank) return <div key={`b${i}`} />;
            const focused = focusDay === c.day;
            return (
              <button
                key={c.day}
                onClick={() => setFocusDay(c.day)}
                style={{
                  position: "relative",
                  background: `var(--heat-${c.level})`,
                  border: focused
                    ? "1.5px solid var(--accent)"
                    : c.isToday
                    ? "1.5px solid var(--text-secondary)"
                    : "1px solid var(--border-subtle)",
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
                  transition: "border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: c.isToday ? 700 : 500,
                  fontVariantNumeric: "tabular-nums",
                  opacity: c.level === 0 ? 0.7 : 1,
                }}>
                  {c.day}
                </span>
                {c.count > 0 ? (
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    opacity: 0.95,
                  }}>
                    {c.count} 件
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      <aside
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 16px 12px",
          overflow: "auto",
        }}
      >
        <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
          {month + 1} 月 {focusDay} 日
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>
          {focusFiles.length}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: "var(--text-muted)" }}>件の更新</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 14 }}>
          合計 {formatSize(focusFiles.reduce((s,f)=>s+f.size, 0))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {focusFiles.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "8px 0" }}>
              この日の更新はありません。
            </div>
          ) : focusFiles.map((f) => (
            <div
              key={f.name}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 10,
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <FileTypeBadge ext={f.ext} size={24} showLabel={false} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 12.5,
                  color: "var(--text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {new Date(f.modified).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <span style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {formatSize(f.size)}
              </span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
