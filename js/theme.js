// ==========================================================
// Переключение светлой / тёмной темы
// ==========================================================
(function () {
  const STORAGE_KEY = 'coffee-house-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  // 1. Восстанавливаем тему из localStorage (или системную)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  // 2. Клик по кнопке — переключаем
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  // 3. Реакция на смену системной темы (если пользователь не задавал вручную)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---------- helpers ----------
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);

    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggle.setAttribute('aria-label',
        theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
    }
  }
})();