/**
 * Shared sample data + helpers for the LocalUpdater UI kit screens.
 * Times are computed once at module load so dates feel "live" but stable
 * across the screens in a single page-load.
 */

import React from "react";

const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const NOW = now;

/**
 * Folder tree — nested via `parent`. `depth` is the visual indent in the
 * sidebar. Counts are computed at runtime by `countFor()` so they stay
 * accurate when files are added or filters change.
 */
export const FOLDERS = [
  { id: "all",        label: "すべて",        icon: "star",     depth: 0 },

  { id: "desktop",    label: "デスクトップ",   icon: "desktop",  depth: 0 },
  { id: "assets",     label: "素材",          icon: "folder",   depth: 1, parent: "desktop" },

  { id: "dropbox",    label: "Dropbox",       icon: "folder",   depth: 0 },
  { id: "drawings",   label: "図面",          icon: "folder",   depth: 1, parent: "dropbox" },
  { id: "fy2026",     label: "2026年度",      icon: "folder",   depth: 2, parent: "drawings" },
  { id: "parts",      label: "部品",          icon: "folder",   depth: 2, parent: "drawings" },
  { id: "review",     label: "レビュー",      icon: "folder",   depth: 1, parent: "dropbox" },

  { id: "downloads",  label: "ダウンロード",   icon: "download", depth: 0 },
];

export const FILES = [
  // Today
  { name: "hub_assembly_v4.dwg",        ext: "dwg",  size: 2_457_600, modified: now - 18 * MIN,  path: "Dropbox / 図面 / 2026年度",    isNew: true,  folder: "fy2026" },
  { name: "bracket-rev-3.step",         ext: "step", size: 1_120_000, modified: now - 42 * MIN,  path: "Dropbox / 図面 / 部品",        isNew: true,  folder: "parts" },
  { name: "client-review_2026-06-25.pdf", ext: "pdf", size: 4_200_000, modified: now - 2 * HOUR,  path: "Dropbox / レビュー",                          folder: "review" },
  { name: "概算見積り_v2.xlsx",          ext: "xlsx", size:   86_400, modified: now - 3 * HOUR,  path: "デスクトップ",                                folder: "desktop" },
  { name: "進捗説明.pptx",                ext: "pptx", size: 12_400_000, modified: now - 4 * HOUR, path: "デスクトップ",                                folder: "desktop" },

  // Yesterday
  { name: "frame_section.dxf",          ext: "dxf",  size:   620_000, modified: now - 1 * DAY - 2 * HOUR, path: "Dropbox / 図面 / 2026年度", folder: "fy2026" },
  { name: "site_photo_03.jpg",          ext: "jpg",  size: 3_800_000, modified: now - 1 * DAY - 5 * HOUR, path: "ダウンロード",              folder: "downloads" },
  { name: "打合せメモ.md",                ext: "md",   size:    4_200, modified: now - 1 * DAY - 6 * HOUR, path: "デスクトップ",              folder: "desktop" },
  { name: "specs_outline.docx",         ext: "docx", size:   42_000, modified: now - 1 * DAY - 9 * HOUR, path: "Dropbox",                   folder: "dropbox" },

  // 2 days
  { name: "render_top.png",             ext: "png",  size: 8_400_000, modified: now - 2 * DAY - 1 * HOUR, path: "デスクトップ / 素材",       folder: "assets" },
  { name: "render_side.png",            ext: "png",  size: 7_900_000, modified: now - 2 * DAY - 1 * HOUR, path: "デスクトップ / 素材",       folder: "assets" },
  { name: "BOM_revC.xlsx",              ext: "xlsx", size:  220_000, modified: now - 2 * DAY - 4 * HOUR, path: "Dropbox / 図面 / 部品",      folder: "parts" },

  // 3-7 days
  { name: "shaft_revB.dwg",             ext: "dwg",  size: 1_900_000, modified: now - 3 * DAY,           path: "Dropbox / 図面 / 部品",      folder: "parts" },
  { name: "client_brief.pdf",           ext: "pdf",  size: 1_200_000, modified: now - 4 * DAY,           path: "Dropbox / レビュー",         folder: "review" },
  { name: "logo_marks.svg",             ext: "svg",  size:   18_000, modified: now - 5 * DAY,           path: "デスクトップ / 素材",       folder: "assets" },
  { name: "site_photo_01.jpg",          ext: "jpg",  size: 3_200_000, modified: now - 6 * DAY,           path: "ダウンロード",              folder: "downloads" },

  // 7-14 days
  { name: "machine-housing_v2.SLDPRT",  ext: "sldprt", size: 920_000, modified: now - 8 * DAY,           path: "Dropbox / 図面 / 2026年度", folder: "fy2026" },
  { name: "manufacturing_v1.pdf",       ext: "pdf",  size: 5_400_000, modified: now - 9 * DAY,           path: "Dropbox / レビュー",        folder: "review" },
  { name: "宛先リスト.csv",                ext: "csv",  size:    8_400, modified: now - 11 * DAY,          path: "デスクトップ",              folder: "desktop" },
  { name: "old_revision.dwg",           ext: "dwg",  size: 2_100_000, modified: now - 13 * DAY,          path: "Dropbox / 図面",           folder: "drawings" },
];

// ---------------------------------------------------------------------------
// Folder-tree helpers
// ---------------------------------------------------------------------------

const FOLDER_BY_ID = Object.fromEntries(FOLDERS.map((f) => [f.id, f]));

/** Look up a folder by id. */
export function getFolder(id) {
  return FOLDER_BY_ID[id];
}

/**
 * Return all descendant folder ids (including the folder itself).
 * Used for filtering: "show files in this folder or any nested one".
 */
export function getDescendantIds(id) {
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
export function getBreadcrumb(id) {
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
export function countFor(id) {
  if (id === "all") return FILES.length;
  const ids = new Set(getDescendantIds(id) || []);
  return FILES.filter((f) => ids.has(f.folder)).length;
}

export const FILE_TYPE_TABS = [
  { value: "all",  label: "すべて",       count: FILES.length },
  { value: "cad",  label: "CAD",          count: FILES.filter(f => ["dwg","dxf","step","sldprt","stp"].includes(f.ext)).length },
  { value: "img",  label: "画像",         count: FILES.filter(f => ["png","jpg","jpeg","gif","svg"].includes(f.ext)).length },
  { value: "doc",  label: "ドキュメント", count: FILES.filter(f => ["docx","md","txt","pptx","xlsx","csv"].includes(f.ext)).length },
  { value: "pdf",  label: "PDF",          count: FILES.filter(f => f.ext === "pdf").length },
];

/** Bucket files into a Today / Yesterday / This week / Last week structure. */
export function bucketByTime(files) {
  const startOfDay = (offsetDays = 0) => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime() - offsetDays * DAY;
  };
  const today = startOfDay(0);
  const yesterday = startOfDay(1);
  const week = startOfDay(7);

  const buckets = {
    today: [], yesterday: [], thisWeek: [], lastWeek: [], older: [],
  };
  for (const f of files) {
    if (f.modified >= today) buckets.today.push(f);
    else if (f.modified >= yesterday) buckets.yesterday.push(f);
    else if (f.modified >= week) buckets.thisWeek.push(f);
    else if (f.modified >= week - 7 * DAY) buckets.lastWeek.push(f);
    else buckets.older.push(f);
  }
  return buckets;
}

/** Group by YYYY-MM-DD for the calendar heatmap. */
export function activityByDay(files, days = 28) {
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
    out.push({ date: d, key, count: map.get(key) || 0 });
  }
  return out;
}
