---
name: localupdater-design
description: Use this skill to generate well-branded interfaces and assets for LocalUpdater (a Japanese-first desktop file-update tool), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files (especially `tokens/`, `components/`, and `ui_kits/localupdater/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `styles.css` (the only file the consumer needs to wire) and reference the design tokens via `var(--accent)` etc. — never inline hex codes from this system.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design. Common asks:

- "ファイルリストみたいな画面を作って" → use the List view from `ui_kits/localupdater/`
- "別のテーマで見せて" → swap `data-theme="…"` (earth / night / light)
- "新しいツールのモックを" → start from `WindowFrame` + `Toolbar` + content of choice; keep the dense desktop density (13px body, 28px title bar, 56px toolbar)

Then ask a couple of focused questions and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key constraints to honor unprompted:

- Japanese primary, with English/PC terms mixed in. Body line-height 1.65, palt on, +0.01em tracking.
- Body text 13px. Headings 18 / 22 / 32. Smallest label 11px.
- 4px spacing scale. Default card padding 16, row gap 12.
- Steel-blue base + one warm amber accent (Earth) by default. Solid backgrounds only — no gradients, no images, no patterns.
- Stroke-icon set only. No emoji. No icon fonts.
- Hover = next surface step up. Press = 0.5px Y translate. Selection = amber tint or amber 2px left bar.
- Components live on `window.LocalUpdaterDesignSystem_672f59` after loading `_ds_bundle.js`. Use `const { Button, FileRow, … } = window.LocalUpdaterDesignSystem_672f59`.
