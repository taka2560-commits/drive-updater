Centered placeholder for "no results" / "no folders watched yet" states. Always offer an `action` (Add Folder, Reset filter) to recover.

```jsx
<EmptyState
  icon="folder-open"
  title="まだ監視中のフォルダがありません"
  description="左側の「追加」ボタンからフォルダを選んでください。"
  action={<Button variant="primary" leftIcon="plus">フォルダを追加</Button>}
/>
```
