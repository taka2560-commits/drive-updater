App-header toolbar: three slots, 56px tall, sits below the title bar. Put the page title left, view-mode segmented bar center, search + actions right.

```jsx
<Toolbar
  left={<h2 style={{ fontSize: 18, fontWeight: 600 }}>最近更新されたファイル</h2>}
  center={<TabBar variant="segmented" tabs={...} />}
  right={<><Input leftIcon="search" /><IconButton icon="refresh" /></>}
/>
```
