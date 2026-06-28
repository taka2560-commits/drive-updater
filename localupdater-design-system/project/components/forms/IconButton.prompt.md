Icon-only square button (28px default). Always supply a `title` for the tooltip — accessibility falls back to it as aria-label.

```jsx
<IconButton icon="refresh" title="再スキャン" />
<IconButton icon="list" active title="リスト表示" />
<IconButton icon="settings" size="lg" />
```

Use `active` on view-mode toggles so the current mode glows amber.
