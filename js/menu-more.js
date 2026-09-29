// ==========================================================
// Кнопка "Показать ещё" — работает с активной панелью
// ==========================================================
(function () {
  const MOBILE_BREAKPOINT = 768;
  const LIMIT = 4;

  const moreRoot = document.querySelector('[data-more]');
  if (!moreRoot) return;

  const btn = moreRoot.querySelector('.menu-page__more-btn');
  if (!btn) return;

  // Получить активную панель
  function getActivePanel() {
    return document.querySelector('.tabs__panel.is-active')
        || document.querySelector('.tabs__panel:not([hidden])');
  }

  // Скрыть карточки сверх лимита в активной панели
  function applyLimit() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const panel = getActivePanel();
    if (!panel) return;

    const cards = Array.from(panel.querySelectorAll('.menu-card'));

    // На десктопе — все видны, кнопку скрыть
    if (!isMobile) {
      cards.forEach((c) => c.classList.remove('is-hidden'));
      moreRoot.setAttribute('hidden', '');
      return;
    }

    // На мобиле — прячем всё, что дальше LIMIT
    cards.forEach((card, i) => {
      card.classList.toggle('is-hidden', i >= LIMIT);
    });

    // Показать кнопку, только если есть что скрывать
    const hasHidden = cards.length > LIMIT;
    if (hasHidden) {
      moreRoot.removeAttribute('hidden');
    } else {
      moreRoot.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  // Показать все карточки в активной панели
  function showAll() {
    const panel = getActivePanel();
    if (!panel) return;

    panel.querySelectorAll('.menu-card').forEach((card) => {
      card.classList.remove('is-hidden');
    });
    btn.setAttribute('aria-expanded', 'true');
  }

  // Свернуть обратно
  function collapse() {
    btn.setAttribute('aria-expanded', 'false');
    applyLimit();
  }

  // Клик по кнопке
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? collapse() : showAll();
  });

  // Смена таба — пересчитать состояние
  document.querySelectorAll('.tabs__btn').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      // дать tabs.js переключить панель, потом применить лимит
      setTimeout(applyLimit, 0);
    });
  });

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      btn.setAttribute('aria-expanded', 'false');
      applyLimit();
    }, 150);
  });

  // Инициализация
  applyLimit();
})();