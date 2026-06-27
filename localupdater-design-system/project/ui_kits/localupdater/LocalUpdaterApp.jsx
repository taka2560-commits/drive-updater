import React from "react";

import { WindowFrame } from "../../components/navigation/WindowFrame.jsx";
import { Toolbar }    from "../../components/navigation/Toolbar.jsx";
import { TabBar }     from "../../components/navigation/TabBar.jsx";
import { StatusBar }  from "../../components/navigation/StatusBar.jsx";
import { Icon }       from "../../components/Icon.jsx";
import { IconButton } from "../../components/forms/IconButton.jsx";
import { Input }      from "../../components/forms/Input.jsx";
import { Chip }       from "../../components/forms/Chip.jsx";
import { Button }     from "../../components/forms/Button.jsx";
import { formatSize } from "../../components/display/FileRow.jsx";

import { Sidebar }       from "./Sidebar.jsx";
import { ListView }      from "./ListView.jsx";
import { TimelineView }  from "./TimelineView.jsx";
import { CalendarView }  from "./CalendarView.jsx";
import { BreadcrumbBar } from "./BreadcrumbBar.jsx";
import { FOLDERS, FILES, FILE_TYPE_TABS, bucketByTime, getDescendantIds, countFor } from "./data.js";

const VIEW_LABEL = { list: "リスト表示", timeline: "タイムライン表示", calendar: "カレンダー表示" };

/**
 * Full LocalUpdater app surface — title bar, sidebar, toolbar with view-mode
 * picker, filter chips, content area, status bar. Theme switchable via
 * the swatches in the sidebar footer.
 */
export function LocalUpdaterApp({ defaultView = "list", defaultTheme = "earth" } = {}) {
  const [view, setView]       = React.useState(defaultView);
  const [theme, setTheme]     = React.useState(defaultTheme);
  const [folder, setFolder]   = React.useState("all");
  const [type, setType]       = React.useState("all");
  const [query, setQuery]     = React.useState("");
  const [selected, setSelected] = React.useState(FILES[0]?.name);

  // Filter pipeline — folder filter includes the folder + all descendants
  let working = FILES;
  if (folder !== "all") {
    const allowed = new Set(getDescendantIds(folder) || []);
    working = working.filter((f) => allowed.has(f.folder));
  }
  if (type !== "all") {
    const m = {
      cad:  ["dwg","dxf","step","stp","sldprt"],
      img:  ["png","jpg","jpeg","gif","svg"],
      doc:  ["docx","md","txt","pptx","xlsx","csv"],
      pdf:  ["pdf"],
    }[type] || [];
    working = working.filter((f) => m.includes(f.ext));
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    working = working.filter((f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q));
  }
  const buckets = bucketByTime(working);
  const totalSize = working.reduce((s, f) => s + f.size, 0);

  return (
    <div data-theme={theme} style={{ height: "100%", width: "100%" }}>
      <WindowFrame
        title="LocalUpdater"
        subtitle={`${working.length} 件 · ${formatSize(totalSize)}`}
        toolbar={
          <Toolbar
            left={
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  最近更新されたファイル
                </h1>
              </div>
            }
            center={
              <TabBar
                variant="segmented"
                value={view}
                onChange={setView}
                tabs={[
                  { value: "list",     label: "リスト",       icon: <Icon name="list"     size={14} /> },
                  { value: "timeline", label: "タイムライン", icon: <Icon name="timeline" size={14} /> },
                  { value: "calendar", label: "カレンダー",   icon: <Icon name="calendar" size={14} /> },
                ]}
              />
            }
            right={
              <>
                <Input
                  leftIcon="search"
                  placeholder="ファイル名で検索…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  clearable
                  style={{ width: 200 }}
                />
                <IconButton icon="refresh"  title="再スキャン" />
                <IconButton icon="settings" title="設定" />
              </>
            }
          />
        }
        statusBar={
          <StatusBar
            left={<><Icon name="folders" size={11} /> 監視中: 3 フォルダ</>}
            center={`${working.length} 件 · ${formatSize(totalSize)}`}
            right={<>最終スキャン: {new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</>}
          />
        }
        rounded={false}
        style={{ borderRadius: 12 }}
      >
        <Sidebar
          folders={FOLDERS.map((f) => ({ ...f, count: countFor(f.id) }))}
          current={folder}
          onSelect={setFolder}
          theme={theme}
          onThemeChange={setTheme}
        />
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
          {/* Filter strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 24px",
              borderBottom: "1px solid var(--border-subtle)",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginRight: 4 }}>
              種別
            </span>
            {FILE_TYPE_TABS.map((t) => (
              <Chip
                key={t.value}
                selected={type === t.value}
                onClick={() => setType(t.value)}
                leftIcon={
                  t.value === "cad" ? "cad" :
                  t.value === "img" ? "image" :
                  t.value === "doc" ? "doc" :
                  t.value === "pdf" ? "pdf" :
                  "folder"
                }
                count={t.count}
              >
                {t.label}
              </Chip>
            ))}
            <span style={{ flex: 1 }} />
            <Button size="sm" variant="ghost" leftIcon="filter">フィルタ</Button>
            <Button size="sm" variant="ghost" rightIcon="chevronDown">更新日 ↓</Button>
          </div>

          <BreadcrumbBar currentId={folder} onSelect={setFolder} />

          <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden" }}>
            {view === "list" && (
              <ListView buckets={buckets} selectedId={selected} onSelect={setSelected} />
            )}
            {view === "timeline" && (
              <TimelineView buckets={buckets} />
            )}
            {view === "calendar" && (
              <CalendarView files={working} />
            )}
          </div>
        </main>
      </WindowFrame>
    </div>
  );
}
