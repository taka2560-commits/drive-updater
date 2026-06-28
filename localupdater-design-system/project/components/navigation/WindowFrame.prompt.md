macOS-style window chrome with traffic-light dots. Pure visual; no real close handling.

```jsx
<WindowFrame
  title="LocalUpdater"
  subtitle="35 件 · 109 MB"
  toolbar={<Toolbar … />}
  statusBar={<StatusBar … />}
>
  <Sidebar />
  <Main />
</WindowFrame>
```

Children are laid out in a flex row by default — perfect for sidebar + main.
