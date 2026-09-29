// ==========================================================
// Модальное окно товара
// ==========================================================
(function () {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  // Ссылки на элементы внутри модалки
 
  
  const imgEl      = modal.querySelector('#modal-img');
  const titleEl    = modal.querySelector('#modal-title');
  const descEl     = modal.querySelector('#modal-desc');
  const sizesEl    = modal.querySelector('#modal-sizes');
  const addsEl     = modal.querySelector('#modal-additives');
  const sizeGroup  = modal.querySelector('#modal-size-group');
  const addGroup   = modal.querySelector('#modal-additives-group');
  const totalEl    = modal.querySelector('#modal-total');
  const noteEl     = modal.querySelector('#modal-note');

   // Состояние
  let products   = [];       // все товары из JSON
  let lastFocused = null;
  let currentProduct = null;
  let currentSize    = null; // { key, size, addPrice }
  let selectedAdditives = []; // [{ name, addPrice }]

  // ---------- Инициализация: загрузка JSON ----------
  async function loadProducts() {
    try {
      const res = await fetch('products.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      products = await res.json();
    } catch (err) {
      console.error('Не удалось загрузить products.json:', err);
      products = [];
    }
  }

  // ---------- Открытие ----------
  function open(card) {
    const name = card.dataset.name;
    if (!name) return;

    // Находим товар по имени
    const product = products.find((p) => p.name === name);
    if (!product) {
      console.warn('Товар не найден:', name);
      return;
    }

    currentProduct = product;
    selectedAdditives = [];

    // Заголовок, описание, изображение
    titleEl.textContent = product.name;
    descEl.textContent  = product.description;

    // Картинка: ищем в самой карточке (там уже есть <img>)
    const cardImg = card.querySelector('.menu-card__img');
    if (cardImg) {
      imgEl.src = cardImg.currentSrc || cardImg.src;
      imgEl.alt = cardImg.alt || product.name;
    }

    // Размеры: из product.sizes
    renderSizes(product.sizes);

    // Добавки: из product.additives
    renderAdditives(product.additives);

    // Пересчитываем итог
    updateTotal();

    // Открытие
    lastFocused = document.activeElement;
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('no-scroll');

    modal.querySelector('.modal__close')?.focus();
  }

  // ---------- Рендер размеров ----------
  function renderSizes(sizes) {
    sizesEl.innerHTML = '';

    const keys = Object.keys(sizes); // ["s", "m", "l"]
    if (!keys.length) {
      sizeGroup.setAttribute('hidden', '');
      currentSize = null;
      return;
    }

    sizeGroup.removeAttribute('hidden');

    keys.forEach((key, i) => {
      const item = sizes[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modal__option';
      btn.dataset.label = (i + 1); // 1, 2, 3
      btn.dataset.value = item.size;
      btn.dataset.key   = key;
      btn.dataset.addPrice = item['add-price'];
      btn.textContent = item.size;

      btn.addEventListener('click', () => {
        // снять активность со всех
        sizesEl.querySelectorAll('.modal__option')
              .forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        // запомнить выбор
        currentSize = {
          key,
          size: item.size,
          addPrice: parseFloat(item['add-price']) || 0,
        };
        updateTotal();
      });

      // первый активен
      if (i === 0) {
        btn.classList.add('is-active');
        currentSize = {
          key,
          size: item.size,
          addPrice: parseFloat(item['add-price']) || 0,
        };
      }

      sizesEl.appendChild(btn);
    });
  }

  // ---------- Рендер добавок ----------
  function renderAdditives(additives) {
    addsEl.innerHTML = '';
    selectedAdditives = [];

    if (!additives || !additives.length) {
      addGroup.setAttribute('hidden', '');
      return;
    }

    addGroup.removeAttribute('hidden');

    additives.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modal__option';
      btn.dataset.label = (i + 1);
      btn.dataset.value = item.name;
      btn.textContent = item.name;

      btn.addEventListener('click', () => {
        btn.classList.toggle('is-active');

        const addPrice = parseFloat(item['add-price']) || 0;

        if (btn.classList.contains('is-active')) {
          selectedAdditives.push({ name: item.name, addPrice });
        } else {
          selectedAdditives = selectedAdditives.filter((a) => a.name !== item.name);
        }

        updateTotal();
      });

      addsEl.appendChild(btn);
    });
  }

  // ---------- Подсчёт итога ----------
  function updateTotal() {
    if (!currentProduct) return;

    const base = parseFloat(currentProduct.price) || 0;
    const sizeAdd = currentSize ? currentSize.addPrice : 0;
    const addsSum = selectedAdditives.reduce((sum, a) => sum + a.addPrice, 0);

    const total = base + sizeAdd + addsSum;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // ---------- Закрытие ----------
  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');

    setTimeout(() => {
      modal.setAttribute('hidden', '');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }, 250);
  }

  // ---------- Слушатели ----------
  function bindListeners() {
    // Клик по карточке
    document.querySelectorAll('[data-modal-open]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        open(card);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card);
        }
      });
    });

    // Клик по оверлею / кнопкам закрытия
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) close();
    });

    // Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  // ---------- Старт ----------
  async function init() {
    await loadProducts();
    bindListeners();
  }

  init();
})();