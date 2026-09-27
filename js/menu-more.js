(function () {
  const MOBILE_BREAKPOINT = 768;
  const LIMIT_ON_MOBILE  = 4;

  const moreRoot = document.querySelector('[data-more]');
  if (!moreRoot) return;

  const btn = moreRoot.querySelector('.menu-page__more-btn');
  if (!btn) return;

  // Скрыть карточки сверх лимита (только на мобиле)
  function hideExtraCards() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    document.querySelectorAll('.menu-grid').forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll('.menu-card'));
      cards.forEach((card, index) => {
        const shouldHide = isMobile && index >= LIMIT_ON_MOBILE;
        card.classList.toggle('is-hidden', shouldHide);
      });
    });
  }

  // Показать все карточки в активной панели
  function showAllCards() {
    const activePanel = document.querySelector('.tabs__panel.is-active');
    if (!activePanel) return;

    activePanel.querySelectorAll('.menu-card').forEach((card) => {
      card.classList.remove('is-hidden');
    });
  }

  // Свернуть всё обратно
  function resetExpanded() {
    btn.setAttribute('aria-expanded', 'false');
    hideExtraCards();
  }

  // Клик по кнопке
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      resetExpanded();
    } else {
      showAllCards();
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  // При смене таба — свернуть обратно
  document.querySelectorAll('.tabs__btn').forEach((tabBtn) => {
    tabBtn.addEventListener('click', resetExpanded);
  });

  // При изменении ширины окна
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Если перешли на десктоп — сбрасываем состояние
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        btn.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.menu-card').forEach((c) => c.classList.remove('is-hidden'));
      } else {
        // Если вернулись на мобиле — заново прячем
        if (btn.getAttribute('aria-expanded') !== 'true') {
          hideExtraCards();
        }
      }
    }, 150);
  });

  // Инициализация при загрузке
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    hideExtraCards();
  }
})();