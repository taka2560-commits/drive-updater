/** What a right-click acts on: the whole selection when the clicked item is part of it. */
export function menuTargetsFor(path: string, selected: Set<string>): string[] {
  return selected.size > 1 && selected.has(path) ? [...selected] : [path];
}
