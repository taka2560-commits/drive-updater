// Windows file-name rules shared by the rename UI (the main process re-checks
// the same rules before touching the disk).

const INVALID_CHARS = /[\\/:*?"<>|]/;
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

function hasControlChar(s: string): boolean {
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) < 32) return true;
  return false;
}

/** Returns a Japanese error message, or null when the name is acceptable. */
export function validateFileName(name: string): string | null {
  if (!name.trim()) return '名前を入力してください';
  if (name === '.' || name === '..') return '「.」「..」は使用できません';
  if (INVALID_CHARS.test(name) || hasControlChar(name)) return '次の文字は使用できません: \\ / : * ? " < > |';
  if (/[. ]$/.test(name)) return '名前の末尾にピリオドや空白は使用できません';
  if (RESERVED.test(name)) return 'Windows の予約名のため使用できません';
  if (name.length > 255) return '名前が長すぎます';
  return null;
}
