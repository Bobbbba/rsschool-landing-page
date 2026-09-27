(function () {
  const burger = document.querySelector('.header__burger');  // ← было .header__menu-btn
  const nav    = document.getElementById('nav');

  if (!burger || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню навигации');
    burger.classList.add('is-active')
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню навигации');
    burger.classList.remove('is-active')
    document.body.classList.remove('no-scroll');
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      burger.focus();
    }
  });

  // Автозакрытие при переходе на десктоп
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
})();