// ==========================================================
// Формирование карточек из products.json
// ==========================================================
(function () {
  const MENU_URL = 'products.json';

  // Сопоставление категории → путь к папке с картинками
  // (если у вас структура img/menu/coffee/irish-coffee.png)
  const IMG_BASE = {
    coffee:  './img/menu/coffee/',
    tea:     './img/menu/tea/',
    dessert: './img/menu/dessert/',
  };

  // Функция slug из имени: "Irish coffee" → "irish-coffee"
  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Формирование одной карточки
  function createCard(product) {
    const li = document.createElement('li');
    li.className = 'menu-card';
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.dataset.modalOpen = '';
    li.dataset.name = product.name;      // ← только имя, остальное в JSON

    const imgSrc = IMG_BASE[product.category] + slugify(product.name) + '.png';

    li.innerHTML = `
      <div class="menu-card__img-wrap">
        <img class="menu-card__img"
             src="${imgSrc}"
             alt="${product.name}"
             width="310" height="310" loading="lazy">
      </div>
      <div class="menu-card__body">
        <h3 class="menu-card__title">${product.name}</h3>
        <p class="menu-card__desc">${product.description}</p>
        <p class="menu-card__price">$${product.price}</p>
      </div>
    `;

    return li;
  }

  // Заполнение всех .menu-grid на странице
  function renderAll(products) {
    document.querySelectorAll('.menu-grid[data-category]').forEach((grid) => {
      const category = grid.dataset.category;
      const items = products.filter((p) => p.category === category);

      grid.innerHTML = '';
      items.forEach((product) => {
        grid.appendChild(createCard(product));
      });
    });

    // Сообщаем другим скриптам, что карточки готовы
    document.dispatchEvent(new CustomEvent('menu:rendered'));
  }

  // Загрузка и рендер
  fetch(MENU_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(renderAll)
    .catch((err) => {
      console.error('Не удалось загрузить products.json:', err);
    });
})();