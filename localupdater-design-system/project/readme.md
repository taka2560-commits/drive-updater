# LocalUpdater Design System

A focused, single-purpose design system for **LocalUpdater** — a Japanese-first PC utility that surfaces recently-updated files across the user's watched folders.

> "最近どのファイル更新したか、もう一度確認したい。" を、3 つの表示モード（リスト・タイムライン・カレンダー）で素早く解決するためのデスクトップツールです。

## What this system is for

This system exists to author **personal PC tools** in Japanese — utilities used by one person (the user themselves), not customer-facing surfaces. Every decision (density, type sizes, hover affordances, language) is tuned for a single, attentive user on a desktop screen.

If you are building a marketing page, mobile app, or anything customer-facing, **this is not the right system** — it will look too dense.

## Sources

- **Reference images** uploaded by the user — UI mood / color references and three rough view mockups:
  - `uploads/2222.png`, `uploads/3333.png`, `uploads/4444.png` — UI taste references (dark-blue with warm accents, light/mint variant)
  - `uploads/A リスト.png` — list mode
  - `uploads/B タイムライン.png` — timeline mode
  - `uploads/C カレンダー.png` — calendar / heatmap mode
- No codebase or Figma was attached. The system is built from the user's verbal notes (PC tools, Japanese-first, Google Fonts) and the visual mood of the references — **not** a recreation of an existing product.

## Index

```
styles.css                       — global entry, just `@import` lines
tokens/
  fonts.css                      — Google Fonts loader
  colors.css                     — Earth (default), Night, Light themes
  typography.css                 — families + scale + leading/tracking
  spacing.css                    — 4px scale + layout aliases
  radii.css                      — corner radii
  shadows.css                    — elevation
  motion.css                     — durations + easings
  base.css                       — body resets

guidelines/                      — foundation specimen cards (per Design System tab)
  brand-wordmark.html
  color-*.html
  type-*.html
  spacing-*.html

components/
  Icon.jsx / .d.ts               — stroke icon set (Lucide-style)
  forms/Button, IconButton, Input, Chip
  display/Card, Badge, FileTypeBadge, FileRow, EmptyState
  navigation/Toolbar, TabBar, SidebarItem, StatusBar, WindowFrame

ui_kits/localupdater/
  LocalUpdaterApp.jsx            — full-window composition
  Sidebar / ListView / TimelineView / CalendarView
  data.js                        — sample folders + files + bucketing
  index.html                     — interactive prototype (click view modes & theme dots)

SKILL.md                         — Agent-Skills entry point
```

## Content fundamentals

- **Language** — Japanese primary, with English/PC terms (CAD, PDF, GB, NEW) mixed in. Both must look right.
- **Tone** — short, neutral, instrument-like. Labels are nouns or short noun-phrases ("最近更新されたファイル", "監視中フォルダ", "再スキャン"). Avoid politeness levels like ですます on chips and table headers; use them only in empty-state / dialog copy where you're actually addressing the user.
- **Person** — neither I nor you. The app is a tool; the copy is signage on it.
- **Numbers** — always tabular figures + half-width digits in mono spans (`109 MB`, `35 件`, `12:34`). Pair number + counter (`件 / 個 / フォルダ / 日`) where unit isn't obvious.
- **No emoji.** Status / category is conveyed with the stroke-icon set + color, never with 🚀 / ✅. Unicode arrows (↓ ↑) are OK inside very short labels ("更新日 ↓").
- **Casing** — UPPERCASE only on short mono labels (NEW, CAD, PDF, ALL). Sentence case in Latin headings. Japanese has no case.
- **Examples**:
  - Empty state title: `まだ監視中のフォルダがありません`
  - Empty state body:  `左側の「追加」ボタンからフォルダを選んでください。`
  - Status bar:        `監視中: 3 フォルダ · 35 件 · 109 MB · 最終スキャン 12:34`
  - Filter label:      `種別`, `表示期間`, `更新日 ↓`

## Visual foundations

**Vibe.** A small, dense, instrument-like tool. Calm steel-blue base; one warm amber for the single thing that matters in any given view (the active mode, the focused folder, the freshest file). No decoration that doesn't earn its place.

**Color.**
- Default theme is **Earth** — a deep steel-blue family (`#161C24` → `#303B4A`) with one warm accent (amber `#E8A05A`) and one cool brand color (sky `#7BA9CE`). Semantic colors (success / warning / danger) are muted, never neon.
- **Night** flips to deep navy + bright blue + a vivid yellow accent.
- **Light** is a near-white surface with mint brand + coral accent.
- All three are accessed via a single `data-theme="…"` attribute on a parent (body or a wrapper). Default is Earth; no class needed for it.

**Type.**
- `Inter` (Latin/numbers) + `Noto Sans JP` (Japanese) + `JetBrains Mono` (paths, sizes, time). Both sans families set in the same stack so a mixed Japanese+ASCII line renders without baseline jumps.
- Body size is **13px** — desktop UI density, not web reading size. Headings 18–32px. The smallest UI label is 11px.
- `font-feature-settings: "palt"` is on at the body level so Japanese punctuation isn't double-spaced. `letter-spacing` is a hair positive (0.01em) for readability.
- Line height is generous (**1.65**) on body — Japanese reads better with breathing room.

**Spacing.** A tight 4px scale (2, 4, 6, 8, 12, 16, 20, 24, …). Most UI uses 8 / 12 / 16. The most common card padding is **16px**; the most common row gap is **12px**.

**Backgrounds.** Solid color only — no gradients, no patterns, no images, no textures. The window is a single steel-blue panel; the sidebar is half a step darker; the elevated surface is half a step lighter. That's the entire system.

**Corners.** Always slight. `--radius-sm` (4) for chips and selected rows; `--radius-md` (6) for inputs and buttons; `--radius-lg` (8) for cards; `--radius-pill` for filter chips. Nothing fully square; nothing dramatically round.

**Borders.** 1px hairline at `rgba(255,255,255,0.06)` (subtle) / `0.10` (default) / `0.18` (strong). They divide; they don't decorate.

**Shadows.** Minimal. Cards default to **flat** (no shadow, just a hairline border). The window itself takes the only large shadow. The "selected" state uses an inset amber glow (`--glow-accent`), not a drop shadow.

**Animation.** Subtle. UI transitions are 140ms with a soft `ease-out`. No bounces; no scale pops; nothing infinite. Hover state is a one-step background swap, not a fade. Selection state is instant.

**Hover & press.** Hover = next surface step up (e.g. `--surface` → `--surface-hover`). Press = same surface, +0.5px Y translate. No opacity dimming. Selected items get a thin amber left bar (sidebar) or amber tint (rows).

**Transparency & blur.** Rare. Used in the heatmap scale (amber at various alpha values) and the accent-soft bg for selection / chips. No glassmorphism. No backdrop-filter.

**Imagery vibe.** Cool, calm, almost no imagery. If anything is shown, it's a 32px file-type badge — a tinted-color square with the stroke icon for that file family.

**Fixed elements.** Title bar (28px), main toolbar (56px), status bar (28px), sidebar (220px). Everything else flows.

## Iconography

- A small **inline stroke-icon set** lives in `components/Icon.jsx`. ~30 glyphs, 1.75 stroke, round caps, 24×24 viewBox, color from `currentColor`. Add new ones by appending to the `ICONS` map in that file.
- The vocabulary is Lucide-style (not Material, not Heroicons). Stroke width is on the heavier side of "thin" so glyphs read clearly at 14–16px in a list row.
- **No icon font.** No PNG icons. No emoji. No Unicode symbols except `↓ ↑` in short sort labels.
- **File-type badges** are color-tinted squares with the stroke icon for that family (CAD blue, image green, PDF coral, etc) — see `FileTypeBadge`.
- If a glyph is missing, **add it to the set** rather than dropping in an SVG inline. Keeps the look consistent.

## Theming

Three themes via `data-theme="…"`:

```html
<body data-theme="earth"> <!-- default; can be omitted -->
<body data-theme="night">
<body data-theme="light">
```

Every component reads `var(--accent)`, `var(--surface)`, etc. — so a theme swap is a single attribute change. The `LocalUpdaterApp` wires this to its sidebar swatches.

## Caveats

- Fonts are Google Fonts (Inter / Noto Sans JP / JetBrains Mono). If you want a different family — Noto IBM Plex / 源ノ角ゴシック / etc — swap the names in `tokens/fonts.css` and `tokens/typography.css`.
- No real OS integration (file watch, IPC, tray) — this is a design system, not the actual app.
- No icons for the small set of CAD-vendor file formats (SLDPRT, CATPART, IGES) — they fall back to the generic "cad" badge with the file's extension printed.
