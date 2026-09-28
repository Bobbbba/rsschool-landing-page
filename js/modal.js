// ==========================================================
// Модальное окно товара
// ==========================================================
(function () {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  // Ссылки на элементы внутри модалки
  const overlay    = modal.querySelector('.modal__overlay');
  const windowEl   = modal.querySelector('.modal__window');
  const imgEl      = modal.querySelector('#modal-img');
  const titleEl    = modal.querySelector('#modal-title');
  const descEl     = modal.querySelector('#modal-desc');
  const sizesEl    = modal.querySelector('#modal-sizes');
  const addsEl     = modal.querySelector('#modal-additives');
  const sizeGroup  = modal.querySelector('#modal-size-group');
  const addGroup   = modal.querySelector('#modal-additives-group');
  const totalEl    = modal.querySelector('#modal-total');
  const noteEl     = modal.querySelector('#modal-note');

  // Фокус-ловушка
  let lastFocused = null;
  let basePrice   = 0;

  // ---------- Открытие ----------
  function open(card) {
    const d = card.dataset;

    // Заголовок и описание
    titleEl.textContent = d.name || '';
    descEl.textContent  = d.desc || '';

    // Картинка
    if (d.img) {
      imgEl.src = d.img;
      imgEl.alt = d.name || '';
    }

    // Цена
    basePrice = parsePrice(d.price);
    totalEl.textContent = d.price || '';

    // Размеры
    const sizes = safeParse(d.sizes);
    if (sizes.length) {
      sizeGroup.removeAttribute('hidden');
      renderOptions(sizesEl, sizes, 'size', true);
    } else {
      sizeGroup.setAttribute('hidden', '');
      sizesEl.innerHTML = '';
    }

    // Добавки
    const additives = safeParse(d.additives);
    if (additives.length) {
      addGroup.removeAttribute('hidden');
      renderOptions(addsEl, additives, 'additive', false);
    } else {
      addGroup.setAttribute('hidden', '');
      addsEl.innerHTML = '';
    }

    // Note
    noteEl.textContent = d.note || '';

    // Открытие
    lastFocused = document.activeElement;

    modal.removeAttribute('hidden');
    // дать браузеру отрисовать перед добавлением класса
    requestAnimationFrame(() => modal.classList.add('is-open'));

    document.body.classList.add('no-scroll');

    // Фокус на кнопку закрытия
    modal.querySelector('.modal__close')?.focus();
  }

  // ---------- Закрытие ----------
  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');

    // После анимации — hidden
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }, 250);
  }

  // ---------- Рендер опций (S/M/L и 1/2/3) ----------
  function renderOptions(container, items, name, allowSingleSelection) {
    container.innerHTML = '';

    items.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modal__option';
      btn.dataset.label = String(i + 1);   // номер 1, 2, 3
      btn.dataset.value = label;
      btn.dataset.group = name;
      btn.textContent = label;

      // активный по умолчанию
      if (i === 0) btn.classList.add('is-active');

      btn.addEventListener('click', () => {
        if (allowSingleSelection) {
          // снимаем активность со всех кнопок в этой группе
          container.querySelectorAll('.modal__option').forEach((b) => b.classList.remove('is-active'));
        } else {
          // additives — переключаем только текущую
          // (оставляем множественный выбор)
          btn.classList.toggle('is-active');
        }
        btn.classList.add('is-active');
        if (allowSingleSelection) btn.classList.add('is-active');
      });

      container.appendChild(btn);
    });
  }

  // ---------- helpers ----------
  function parsePrice(str) {
    const n = parseFloat(String(str || '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function safeParse(str) {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return []; }
  }

  // ---------- Слушатели ----------
  // Открытие: клик по любой части карточки
  document.querySelectorAll('[data-modal-open]').forEach((card) => {
    card.addEventListener('click', (e) => {
      // не открывать, если клик по кнопке внутри карточки (если такие появятся)
      if (e.target.closest('a, button')) return;
      open(card);
    });

    // Открытие с клавиатуры (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(card);
      }
    });
  });

  // Закрытие: клик по оверлею или по элементам с data-modal-close
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) {
      close();
    }
  });

  // Закрытие: Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      close();
    }
  });

  // Клик внутри окна — не закрывает
  // (обработчик выше срабатывает только по [data-modal-close] или оверлею,
  //  а оверлей — это отдельный слой, а не .modal__window)
})();