// ==========================================================
// Табы Coffee / Tea / Dessert
// ==========================================================
(function () {
  const roots = document.querySelectorAll('[data-tabs]');
  if (!roots.length) return;

  roots.forEach((root) => {
    const buttons = Array.from(root.querySelectorAll('.tabs__btn'));
    const panels  = Array.from(root.querySelectorAll('.tabs__panel'));
    if (!buttons.length || !panels.length) return;

    function activate(tabName, focusBtn = false) {
      // Кнопки
      buttons.forEach((btn) => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive && focusBtn) btn.focus();
      });

      // Панели
      panels.forEach((panel) => {
        const isActive = panel.id === `panel-${tabName}`;
        panel.classList.toggle('is-active', isActive);
        if (isActive) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    }

    // Клик по табу
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => activate(btn.dataset.tab));
    });

    // Навигация клавиатурой
    const nav = root.querySelector('.tabs__nav');
    if (nav) {
      nav.addEventListener('keydown', (e) => {
        const currentIndex = buttons.findIndex((b) => b.classList.contains('is-active'));
        let nextIndex = null;

        if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
        if (e.key === 'ArrowLeft')  nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        if (e.key === 'Home')       nextIndex = 0;
        if (e.key === 'End')        nextIndex = buttons.length - 1;

        if (nextIndex !== null) {
          e.preventDefault();
          activate(buttons[nextIndex].dataset.tab, true);
        }
      });
    }
  });
})();