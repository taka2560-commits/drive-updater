Primary push-button for forms, dialogs, toolbars. Use `primary` for the single "do it" action per screen (再スキャン, 保存); `secondary` for everything else; `ghost` for tertiary inline actions; `danger` for destructive items.

```jsx
<Button variant="primary" leftIcon="refresh">再スキャン</Button>
<Button leftIcon="plus">フォルダを追加</Button>
<Button variant="ghost" size="sm" rightIcon="chevronDown">並び順</Button>
```

Sizes: `sm` 24px / `md` 30px / `lg` 36px. Pair with `IconButton` for icon-only triggers.
