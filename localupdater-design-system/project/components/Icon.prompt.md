Stroke-line icons used everywhere in LocalUpdater (file types, toolbar actions, chevrons). Default size 16; bump to 18–20 inside large buttons. Color through `currentColor` — set on the parent.

```jsx
<Icon name="folder" size={28} style={{ color: 'var(--accent)' }} />
<button><Icon name="refresh" /> 再スキャン</button>
```

Available names are exported as `iconNames`. Add new glyphs by appending to the `ICONS` map in `Icon.jsx`.
