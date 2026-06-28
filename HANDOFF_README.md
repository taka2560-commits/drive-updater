# Handoff: LocalUpdater UI

> A Japanese-first desktop utility for surfacing recently-updated files across watched folders, with three view modes (list / timeline / calendar) and three color themes.

## About the design files in this bundle

The files in this bundle are **design references created in HTML/JSX** — interactive prototypes showing the intended look, layout, and behavior. **They are not production code to ship as-is.**

Your task is to **recreate these designs in the target codebase's environment**, using its established patterns and libraries (React, Electron, Tauri, native, etc.). If no environment exists yet, pick the framework that best fits a desktop file-watching utility — for Japanese desktop PC tools the strongest options are **Electron + React + Vite** or **Tauri + React** (lighter, native binaries).

The CSS tokens (everything under `tokens/`) **can be copied directly** to any web-based codebase — they're plain CSS custom properties on `:root` and per-theme attribute selectors.

## Fidelity

**High-fidelity.** Pixel-perfect mockups with final colors, typography, spacing, hover/active/selected states, three full themes (earth / night / light), and three full content views. Recreate pixel-perfectly using the codebase's existing libraries.

## What's in the bundle

```
design_handoff_localupdater/
├─ README.md                       ← this file (start here)
├─ design-system-readme.md         ← full design-system overview
│
├─ styles.css                      ← root entry — @imports everything below
├─ tokens/                         ← CSS custom properties — copy as-is
│   ├─ fonts.css                   ← Google Fonts loader
│   ├─ colors.css                  ← Earth (default), Night, Light themes
│   ├─ typography.css              ← families + scale + leading/tracking
│   ├─ spacing.css                 ← 4px scale + layout aliases
│   ├─ radii.css                   ← corner radii
│   ├─ shadows.css                 ← elevation
│   ├─ motion.css                  ← durations + easings
│   └─ base.css                    ← body resets (palt, scrollbar, etc.)
│
├─ components/                     ← reusable primitives (reference React impls)
│   ├─ Icon.jsx + .d.ts            ← stroke icons (Lucide-style, ~30 glyphs)
│   ├─ forms/                      ← Button, IconButton, Input, Chip
│   ├─ display/                    ← Card, Badge, FileTypeBadge, FileRow, EmptyState
│   └─ navigation/                 ← Toolbar, TabBar, SidebarItem, StatusBar, WindowFrame
│
├─ ui_kits/localupdater/           ← full app composition
│   ├─ LocalUpdaterApp.jsx         ← top-level shell
│   ├─ Sidebar.jsx                 ← folder tree (expandable) + theme switcher
│   ├─ BreadcrumbBar.jsx           ← folder path with clickable segments
│   ├─ ListView.jsx                ← screen A — grouped time-bucketed list
│   ├─ TimelineView.jsx            ← screen B — vertical timeline
│   ├─ CalendarView.jsx            ← screen C — month heatmap + side panel
│   ├─ data.js                     ← sample folders + files + helpers
│   ├─ index.html                  ← live prototype (open in a browser)
│   └─ calendar.html               ← same app, defaults to calendar view
│
├─ guidelines/                     ← swatch / specimen reference cards
└─ _ds_bundle.js                   ← compiled bundle that powers index.html
```

## How to view the prototype

Open `ui_kits/localupdater/index.html` in any modern browser (no server needed). It loads the compiled component bundle + sample data and renders the full app. Try:

- The 3-segment view-mode control (リスト / タイムライン / カレンダー)
- The theme swatches in the lower-left sidebar (Earth / Night / Light)
- Expand/collapse the Dropbox folder tree via the chevron
- Drill into 図面 → 2026年度, then click a breadcrumb segment to jump back
- Toggle filter chips (CAD / 画像 / ドキュメント / PDF)
- Type into the search box

## Product overview

LocalUpdater watches the user's folders (Desktop, Dropbox, Downloads, etc.) and surfaces files modified recently. Single-window desktop utility for **one user** — dense, instrument-like, designed for quick scanning of "what did I touch lately?"

**Primary user actions** (in order of importance):
1. Glance at recently-updated files — list / timeline / calendar of the last few days
2. Drill into a specific folder or subfolder via sidebar tree or breadcrumb
3. Filter by file type (CAD / image / doc / PDF)
4. Search by filename
5. Trigger a re-scan
6. Switch view mode + theme

## Design tokens — summary

All values live in `tokens/`. Read those files for canonical numbers. High-level:

**Themes** — applied via `data-theme="earth|night|light"` on a parent element (default earth; no attribute needed).

| Token        | Earth (default) | Night            | Light             |
| ------------ | --------------- | ---------------- | ----------------- |
| `--bg-app`   | `#1B232C`       | `#0E1530`        | `#FAFBFC`         |
| `--surface`  | `#232D38`       | `#131C3D`        | `#FFFFFF`         |
| `--accent`   | `#E8A05A` amber | `#FFD23F` yellow | `#FF7A69` coral   |
| `--brand`    | `#7BA9CE` sky   | `#5286FF` blue   | `#2EAE92` mint    |

**Type** — Google Fonts: **Inter** + **Noto Sans JP** + **JetBrains Mono**.

| Token         | Value     | Used for                  |
| ------------- | --------- | ------------------------- |
| `--text-3xl`  | 32 / 600  | Page-level headings       |
| `--text-2xl`  | 24 / 600  | Section headings          |
| `--text-xl`   | 20 / 600  | Subsection headings       |
| `--text-lg`   | 16        | Larger UI labels          |
| `--text-md`   | 14        | Form input text           |
| `--text-base` | **13**    | **Body UI default**       |
| `--text-sm`   | 12        | Filter chips              |
| `--text-xs`   | 11        | Meta info, status bar     |

Body **line-height 1.65**, `letter-spacing: 0.01em`, `font-feature-settings: "palt"` for proper Japanese punctuation kerning. **Non-negotiable** for Japanese readability — do not strip them when porting.

**Spacing** — 4px scale (2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64). Default card padding 16, row gap 12.

**Radii** — `--radius-sm` 4 (chips, rows), `--radius-md` 6 (inputs, buttons), `--radius-lg` 8 (cards), `--radius-pill` (filter chips).

**Motion** — 140ms transitions with `ease-out`. No bounces. Hover = next surface step up. Press = +0.5px Y translate. Selection = amber tint or 2px amber left bar.

## Screens

### 1. App shell (always visible)

```
┌──────────────────────────────────────────────────────────┐  28px  title bar
├─────────┬────────────────────────────────────────────────┤
│         │              Main toolbar (56px)               │  ← title · view-mode · search/refresh/settings
│ Sidebar │  ────────────────────────────────────────────  │
│ (220px) │  Filter strip (~48px) — type chips + sort      │
│         │  ────────────────────────────────────────────  │
│         │  Breadcrumb (~40px) — only if folder ≠ "all"   │
│         │  ────────────────────────────────────────────  │
│         │                                                │
│         │              Content area (flex 1)             │
│         │                                                │
├─────────┴────────────────────────────────────────────────┤  28px  status bar
└──────────────────────────────────────────────────────────┘
```

**Sidebar** (220px):
- Brand strip (LocalUpdater wordmark + amber refresh dot)
- "監視中フォルダ" — collapsible tree. Caret-click toggles expand without changing selection; label-click selects that folder. Counts include descendants. Default expand: Dropbox + ancestors of current selection. Leaf rows reserve caret space so labels stay aligned.
- "表示期間": 24時間 / 1週間 / **2週間** (default) / 1か月
- Footer: three colored theme swatches

**Main toolbar**:
- Left: `最近更新されたファイル` (18 / 600)
- Center: segmented control with icons
- Right: search (200px, leftIcon search, clearable, placeholder `ファイル名で検索…`) · `[refresh]` icon button · `[settings]` icon button

**Filter strip**: `種別` label (10px uppercase muted) + 5 chips with counts (すべて / CAD / 画像 / ドキュメント / PDF). Selected chip = amber-soft bg + amber border. Right side: `[filter] フィルタ`, `[chevron] 更新日 ↓`.

**BreadcrumbBar** (when folder ≠ "all"): `⭐ すべて  ›  Dropbox  ›  図面  ›  2026年度`. Every segment is a button; click jumps directly to that level. Last segment is non-clickable, text-primary, amber icon.

**Status bar**: left `[folders] 監視中: 3 フォルダ` · center `35 件 · 109 MB` · right `最終スキャン: 12:34`. 11px, letter-spacing 0.04em, all text-muted.

### 2. ListView

Grouped by time bucket (今日 / 昨日 / 今週 / 先週 / それ以前). Each group has a sticky header (uppercase label + `N 件` count).

**File row** (36px tall):
- `[FileTypeBadge 22px]` — color-coded square (CAD blue, image green, PDF coral…)
- File name (13 / 500 / text-primary, ellipsis)
- Optional `NEW` badge (9px mono, amber on amber-soft)
- Path (11 / mono / muted, ellipsis, max 220px)
- **Size — emphasized**: number 12.5 / 600 / text-primary mono; unit 10 / 500 / muted; tabular-nums; right-aligned, min-width 76px
- Modified time (11 / muted, relative like "18 分前" within 7 days, else `M/D`)

Row hover → `--surface-hover`. Selected → `--accent-soft`. No row borders; `gap: 1px` between rows.

### 3. TimelineView

2px vertical rail (gradient subtle → default → subtle). Each bucket gets a circular 22px day node on the rail — count inside, "今日" node is amber with glow. File cards stack to the right of the node: `Surface + 1px border + 6px radius`, 8/12 padding, with `[FileTypeBadge 28px] · name + path · time (24h) + size`.

### 4. CalendarView

Month heatmap (left, flex 1) + day side panel (320px, right).

**Calendar**: header `2026 年 6 月` (20 / 600) + legend (少 → 多, 5 steps). 7-col weekday row (`日 月 火 水 木 金 土`; 日 = danger, 土 = brand, weekdays = muted). Day cells: date top-left (mono tabular), file count below (`N 件`, only if > 0). Cell bg from `--heat-0` to `--heat-4`. Today = text-secondary outline; focused day = accent outline.

```css
/* Heat scale — Earth theme */
--heat-0: rgba(255,255,255,0.04)   /* no activity */
--heat-1: rgba(232,160,90,0.18)    /* 1 file */
--heat-2: rgba(232,160,90,0.38)    /* 2 files */
--heat-3: rgba(232,160,90,0.62)    /* 3–4 files */
--heat-4: var(--accent)            /* 5+ files */
```

**Side panel**: surface card, 16 padding. Header `6 月 25 日` (uppercase 11 muted) → `5` (22 / 600) + `件の更新` suffix → `合計 23.1 MB` (small secondary). File list below: 24px badge · name + time · size, separated by hairline borders.

## Interactions & behavior

- **View / theme / folder / chip switches** — instant, no transition
- **Folder expand/collapse** — caret rotates 90° via `transition: transform 140ms ease-out`
- **Search** — debounced text filter on filename + path (case-insensitive), with clear button
- **Hover** — background steps up; transitions `var(--dur-fast) var(--ease-out)` (140ms)
- **Press** — buttons translate Y +0.5px (no scale)
- **Focus ring** — `var(--ring)` (2px steel-bg + 2px accent)

`EmptyState` is provided for "no results" / "no folders watched yet" cases.

## State to manage

```ts
{
  view:    'list' | 'timeline' | 'calendar'   // persist
  theme:   'earth' | 'night' | 'light'        // persist
  folder:  string                              // current folder id or "all"
  type:    'all' | 'cad' | 'img' | 'doc' | 'pdf'
  period:  '1d' | '7d' | '14d' | '30d'        // default '14d'
  query:   string                              // search input
  selectedFileId: string | null
  expandedFolders: Set<string>                 // sidebar tree state
}
```

From the OS / file system in the real implementation:
- Watched folder list (persistent, user-managed via Add/Remove flow)
- File scan results: `{name, path, ext, size, modifiedAt}[]`
- File-watcher events (added / modified / deleted) → incremental refresh
- Reveal-in-finder / open-with-default-app actions (file row right-click — not yet designed)

## Assets

- **Fonts** — Inter / Noto Sans JP / JetBrains Mono via Google Fonts. **For a packaged desktop app, bundle locally**: replace `@import url(...)` in `tokens/fonts.css` with `@font-face` rules pointing to local woff2 files.
- **Icons** — inline stroke SVGs (~30 glyphs) curated in `components/Icon.jsx`. Lucide-style, 1.75 stroke, round caps, `currentColor`. **No icon font, no PNG, no emoji.** Add glyphs by appending to the `ICONS` map.
- **Images** — none. File-type "thumbnails" are tinted colored squares with the family's stroke glyph.

## What to honor strictly

These are load-bearing — don't compromise when porting:

1. **Themes via `data-theme` attribute on a parent.** Components reference `var(--accent)` etc.; never hardcode hex inside component styles. Theme swap = single attribute change.
2. **Japanese-first typography** — line-height 1.65, palt on, +0.01em tracking. Body 13px. Looks "too dense" by Western web standards; correct for dense Japanese desktop UI.
3. **No gradients, no images, no patterns, no glassmorphism.** Solid backgrounds only.
4. **One amber accent per view** (selected state, freshest file, current mode). Resist adding additional accent colors.
5. **Stroke icon set only.** No emoji, no icon fonts, no Unicode symbols (except `↓ ↑` in sort labels).
6. **Density.** Title 28, toolbar 56, status 28, sidebar 220, list row 36, calendar cell min-height 56. Don't add web-style padding.
7. **Tabular numerals** on every count / size / time. `font-variant-numeric: tabular-nums` on numeric mono spans.

## What to adapt to the target codebase

- **Component library** — if the target uses MUI / Chakra / Mantine / Radix etc., use those primitives styled with these tokens. Don't ship the JSX in `components/` as-is unless React-from-scratch is the target.
- **Routing** — Tabs are local state in the prototype; hook into the codebase's router if it has one.
- **Persistence** — `view` and `theme` should persist (settings file / `localStorage` / Electron preferences).
- **Data layer** — replace `data.js` sample data with the real file-watcher integration.
- **Native window chrome** — `WindowFrame` recreates macOS chrome in CSS for the prototype. In a real Electron/Tauri app, **use the OS-provided window chrome** and drop `WindowFrame`. Render only the toolbar + content directly.

## File map — where to look for what

| Question | File |
|---|---|
| Full screen assembled | `ui_kits/localupdater/LocalUpdaterApp.jsx` |
| Exact colors / sizes / fonts | `tokens/*.css` |
| List row layout | `components/display/FileRow.jsx` |
| Calendar heatmap math | `ui_kits/localupdater/CalendarView.jsx` |
| Folder tree expand/collapse | `ui_kits/localupdater/Sidebar.jsx` + `components/navigation/SidebarItem.jsx` |
| Breadcrumb navigation | `ui_kits/localupdater/BreadcrumbBar.jsx` + `data.js` `getBreadcrumb` |
| Time bucketing & activity-by-day helpers | `ui_kits/localupdater/data.js` |
| Tone of voice + content rules | `design-system-readme.md` (CONTENT FUNDAMENTALS section) |
| Visual rules summary | `design-system-readme.md` (VISUAL FOUNDATIONS section) |

## Open questions for the developer / product owner

Not specified in the design — resolve before coding:

1. **File-row right-click menu** — what actions? (Reveal in finder / Open / Copy path / Exclude from scan / Pin / …)
2. **"Re-scan" button behavior** — full rescan or incremental? Progress UI?
3. **Adding a folder** — file picker dialog flow not designed
4. **Settings screen** — settings icon is wired but the screen itself isn't designed (excluded folders, scan interval, file-size limits, …)
5. **Notifications** — should newly-detected files trigger an OS notification?
6. **Cross-platform** — macOS-only or also Windows/Linux? The mockup uses macOS title-bar styling.
