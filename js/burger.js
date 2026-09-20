// ==========================================================
// Мобильное меню (бургер)
// ==========================================================
(function () {
  const menuBtn = document.querySelector('.header__menu-btn');
  const nav     = document.getElementById('nav');

  if (!menuBtn || !nav) return;

  const MOBILE_BREAKPOINT = 768; // совпадает с $bp-tablet
  const body = document.body;

  function openMenu() {
    nav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Закрыть меню');
    body.classList.add('no-scroll');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Открыть меню');
    body.classList.remove('no-scroll');
  }

  function toggleMenu() {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  // Клик по кнопке
  menuBtn.addEventListener('click', toggleMenu);

  // Клик по ссылке внутри меню — закрываем
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuBtn.focus();
    }
  });

  // Клик вне меню (но не по кнопке)
  document.addEventListener('click', (e) => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;
    if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
    closeMenu();
  });

  // Автоматическое закрытие при переходе на десктоп
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        closeMenu();
      }
    }, 150);
  });
})();