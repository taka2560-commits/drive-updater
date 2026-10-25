// Apply the saved theme before the app bundle loads (avoids a flash of the default theme).
(function () {
  try {
    var t = localStorage.getItem('localUpdater.theme');
    if (t === 'earth' || t === 'night' || t === 'light') {
      document.documentElement.dataset.theme = t;
    }
  } catch (e) {}
})();
