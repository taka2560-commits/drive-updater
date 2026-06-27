Dense file-list row. Default 36px tall; switch to `compact` (30px) for very long lists.

```jsx
<FileRow
  name="hub_assembly_v4.dwg"
  path="C:\\Users\\taka\\Desktop\\図面"
  ext="dwg"
  size={2_400_000}
  modified={Date.now() - 1000 * 60 * 18}
  isNew
/>
```

Stack rows in a flex column with no gaps — the row's hover state provides visual separation. Add `selected` for the focused row.
