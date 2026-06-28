# LocalUpdater UI kit

Faithful recreation of the LocalUpdater desktop app surface.

- `LocalUpdaterApp.jsx` — top-level shell (window chrome + sidebar + toolbar + main + status bar)
- `Sidebar.jsx` — watched folders + filter periods + theme switcher
- `ListView.jsx` — dense grouped list (mirrors uploaded screen "A リスト")
- `TimelineView.jsx` — vertical timeline (mirrors "B タイムライン")
- `CalendarView.jsx` — month heatmap + side panel (mirrors "C カレンダー")
- `data.js` — sample folders/files, bucketing + activity-by-day helpers
- `index.html` — interactive entry. Click view-mode tabs, click filter chips, type into the search input, click theme swatches in the lower-left.

Open `ui_kits/localupdater/index.html` in the Design System tab to interact with the kit.
