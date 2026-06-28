Two flavors:
- `underline` — primary section navigation; active tab gets an amber underline.
- `segmented` — view-mode pickers (List / Timeline / Calendar); active tab fills amber.

```jsx
<TabBar
  variant="segmented"
  value={mode}
  onChange={setMode}
  tabs={[
    { value: 'list',     label: 'リスト',     icon: <Icon name="list" size={14} /> },
    { value: 'timeline', label: 'タイムライン', icon: <Icon name="timeline" size={14} /> },
    { value: 'calendar', label: 'カレンダー',   icon: <Icon name="calendar" size={14} /> },
  ]}
/>
```
