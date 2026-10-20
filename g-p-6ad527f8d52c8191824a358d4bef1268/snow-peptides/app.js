(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = $('.toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  // Fine, drifting snow particles are drawn locally so the hero has motion without media dependencies.
  const canvas = $('.snow-canvas');
  const ctx = canvas?.getContext('2d');
  let flakes = [];
  let frame;
  const resizeSnow = () => {
    if (!canvas || !ctx) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(bounds.width * dpr);
    canvas.height = Math.floor(bounds.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flakes = Array.from({ length: Math.min(80, Math.floor(bounds.width / 13)) }, () => ({
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
      radius: Math.random() * 1.6 + .35,
      speed: Math.random() * .34 + .12,
      drift: Math.random() * .28 - .14,
      alpha: Math.random() * .35 + .12,
    }));
  };
  const drawSnow = () => {
    if (!canvas || !ctx) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    for (const flake of flakes) {
      flake.y += flake.speed;
      flake.x += flake.drift + Math.sin(flake.y / 62) * .12;
      if (flake.y > height + 4) { flake.y = -4; flake.x = Math.random() * width; }
      if (flake.x > width + 4) flake.x = -4;
      if (flake.x < -4) flake.x = width + 4;
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(102, 133, 168, ${flake.alpha})`;
      ctx.fill();
    }
    frame = requestAnimationFrame(drawSnow);
  };
  if (canvas && ctx) {
    resizeSnow();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) drawSnow();
    window.addEventListener('resize', resizeSnow, { passive: true });
  }

  const header = $('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealNodes = $$('.section-heading, .product-card, .trust-item, .manifesto-copy, .newsletter-copy, .newsletter-form, .faq-list details, .contact-option');
  revealNodes.forEach((node, index) => {
    node.classList.add('reveal');
    if (node.classList.contains('product-card')) node.style.transitionDelay = `${(index % 4) * 75}ms`;
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .13 });
  revealNodes.forEach((node) => revealObserver.observe(node));

  const productData = [
    {slug:'ghk-cu',name:'GHK-Cu',category:'peptide',study:'Haut- & Matrixforschung',price:49,color:'visual-blue',summary:'Kupferbindendes Tripeptid, das in der Literatur im Kontext von Haut- und Extrazellulärmatrix-Modellen untersucht wird.'},
    {slug:'kpv',name:'KPV',category:'peptide',study:'Entzündungsmodelle',price:39,color:'visual-lilac',summary:'Kurzes α-MSH-abgeleitetes Peptid; publizierte Arbeiten untersuchen es in präklinischen Entzündungsmodellen.'},
    {slug:'bpc-157',name:'BPC-157',category:'peptide',study:'Gewebe- & Reparaturmodelle',price:59,color:'visual-mint',summary:'In der präklinischen Literatur vor allem in Modellen zu Gewebe- und Reparaturprozessen untersucht; klinische Aussagekraft ist begrenzt.'},
    {slug:'tb-500',name:'Thymosin β4 (TB-500)',category:'peptide',study:'Zellmigration & Gewebemodelle',price:69,color:'visual-sand',summary:'Thymosin-β4-bezogene Forschung betrachtet unter anderem Zellmigration und Gewebeprozesse; Produktidentität und Fragmentbezeichnung beachten.'},
    {slug:'cjc-1295',name:'CJC-1295',category:'peptide',study:'Endokrine Signalwege',price:79,color:'visual-blue',summary:'In der Literatur als langwirksames GHRH-Analog im Zusammenhang mit endokrinen Signalwegen beschrieben.'},
    {slug:'ipamorelin',name:'Ipamorelin',category:'peptide',study:'Endokrine Signalwege',price:59,color:'visual-lilac',summary:'Ghrelin-Rezeptor-Agonist, der in pharmakologischen und endokrinen Forschungszusammenhängen untersucht wurde.'},
    {slug:'mots-c',name:'MOTS-c',category:'peptide',study:'Mitochondriale & metabolische Forschung',price:89,color:'visual-mint',summary:'Mitochondrien-kodiertes Peptid; Forschungsarbeiten betrachten mitochondriale und metabolische Signalwege.'},
    {slug:'semax',name:'Semax',category:'peptide',study:'Neuropeptid- & ZNS-Forschung',price:54,color:'visual-sand',summary:'ACTH-abgeleitetes Peptid, das in neurobiologischen Forschungsarbeiten beschrieben wird.'},
    {slug:'selank',name:'Selank',category:'peptide',study:'Neuropeptid- & ZNS-Forschung',price:54,color:'visual-blue',summary:'Tuftsin-abgeleitetes Peptid; Literatur beschreibt Untersuchungen in neuropharmakologischen Kontexten.'},
    {slug:'epitalon',name:'Epitalon',category:'peptide',study:'Chronobiologie & Zellmodelle',price:64,color:'visual-lilac',summary:'Synthetisches Tetrapeptid, das in begrenzten Zell- und präklinischen Literaturkontexten untersucht wird.'},
    {slug:'aod-9604',name:'AOD-9604',category:'peptide',study:'Stoffwechsel- & Peptidfragmentforschung',price:74,color:'visual-mint',summary:'GH-Fragment-Analog; Forschungsarbeiten untersuchten pharmakologische und metabolische Fragestellungen.'},
    {slug:'kisspeptin-10',name:'Kisspeptin-10',category:'peptide',study:'Reproduktive Neuroendokrinologie',price:69,color:'visual-sand',summary:'Kisspeptin-Sequenz aus der Forschung zur neuroendokrinen Regulation der Reproduktionsachse.'},
    {slug:'probenroehrchen',name:'Probenröhrchen Set',category:'accessory',study:'Labororganisation',price:19,color:'visual-blue',summary:'Zubehör-Prototyp für die strukturierte Aufbewahrung und Kennzeichnung von Proben.'},
    {slug:'kryo-etiketten',name:'Kryo-Etiketten',category:'accessory',study:'Labororganisation',price:14,color:'visual-lilac',summary:'Zubehör-Prototyp für eine gut lesbare Probenkennzeichnung.'}
  ];
  const grid = $('.product-grid');
  const cards = [];
  const emptyResults = $('#empty-results');
  const renderProductCard = (product, index) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal visible';
    card.dataset.category = product.category; card.dataset.name = product.name; card.dataset.price = product.price; card.dataset.study = product.study; card.dataset.slug = product.slug;
    card.tabIndex = 0; card.setAttribute('aria-label', `${product.name} öffnen`);
    const accessoryArt = product.category === 'accessory' ? (product.slug === 'probenroehrchen' ? '<div class="tube-set"><i></i><i></i><i></i></div>' : '<div class="label-roll"><i></i><b>SNOW<br>PEPTIDES</b><small>LOT NO.</small></div>') : `<div class="product-vial-wrap"><img class="product-vial-photo" src="./assets/snow-vial.png" alt=""><span>${product.name}</span></div>`;
    card.innerHTML = `<div class="product-visual ${product.color}"><span class="product-badge">${product.category === 'peptide' ? 'PEPTID' : 'ZUBEHÖR'}</span><a class="product-art-link" href="./produkt.html?produkt=${product.slug}" aria-label="${product.name} Produktdetails"><span class="visual-orbit"></span>${accessoryArt}</a><button class="wishlist-card-button" type="button" data-wishlist="${product.name}" aria-label="${product.name} zur Wunschliste hinzufügen" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.8 4.8 0 0 1 12 6.5a4.8 4.8 0 0 1 8.8 2.3Z"/></svg></button></div><div class="product-meta"><div><h3><a href="./produkt.html?produkt=${product.slug}">${product.name}</a></h3><p>${product.study}</p></div><span class="product-index">${String(index + 1).padStart(2,'0')}</span></div><div class="product-bottom"><span class="demo-price">€${product.price}</span></div>`;
    card.addEventListener('click', (event) => { if (!event.target.closest('a,button')) location.href = `./produkt.html?produkt=${product.slug}`; });
    card.addEventListener('keydown', (event) => { if (event.target === card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); location.href = `./produkt.html?produkt=${product.slug}`; } });
    grid?.append(card); cards.push(card);
  };
  if (grid) productData.forEach(renderProductCard);
  const updateEmptyResults = () => {
    if (emptyResults) emptyResults.hidden = cards.some((card) => !card.classList.contains('hidden'));
  };
  const filters = $$('.filter');
  const priceMin = $('#price-min'), priceMax = $('#price-max'), rangeMin = $('#price-range-min'), rangeMax = $('#price-range-max'), studyFilter = $('#study-filter');
  const studies = [...new Set(productData.map((p) => p.study))];
  if (studyFilter) studies.forEach((study) => studyFilter.add(new Option(study, study)));
  let activeCategory = 'all', activeQuery = '';
  const filterCards = () => {
    const min = Number(priceMin?.value || 0), max = Number(priceMax?.value || 100), study = studyFilter?.value || 'all';
    cards.forEach((card) => {
      const searchable = `${card.dataset.name} ${card.dataset.study}`.toLocaleLowerCase('de');
      const visible = (activeCategory === 'all' || card.dataset.category === activeCategory) && searchable.includes(activeQuery) && Number(card.dataset.price) >= min && Number(card.dataset.price) <= max && (study === 'all' || card.dataset.study === study);
      card.classList.toggle('hidden', !visible);
    });
    updateEmptyResults();
  };
  filters.forEach((button) => button.addEventListener('click', () => {
    filters.forEach((filter) => filter.classList.remove('active'));
    button.classList.add('active'); activeCategory = button.dataset.filter; filterCards();
  }));
  const sortSelect = $('.sort-trigger');
  sortSelect?.addEventListener('change', () => {
    const sorted = [...cards];
    if (sortSelect.value === 'price-asc') sorted.sort((a,b) => Number(a.dataset.price)-Number(b.dataset.price));
    if (sortSelect.value === 'price-desc') sorted.sort((a,b) => Number(b.dataset.price)-Number(a.dataset.price));
    if (sortSelect.value === 'name-asc') sorted.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name,'de'));
    if (sortSelect.value === 'recommended') sorted.sort((a,b) => productData.findIndex(p => p.slug===a.dataset.slug)-productData.findIndex(p => p.slug===b.dataset.slug));
    sorted.forEach(card => grid.append(card)); showToast('Sortierung aktualisiert');
  });
  const syncPrice = (source) => {
    let min = Number(priceMin?.value || 0), max = Number(priceMax?.value || 100);
    if (source === 'min-range') min = Number(rangeMin.value);
    if (source === 'max-range') max = Number(rangeMax.value);
    min = Math.max(0,Math.min(100,min)); max = Math.max(0,Math.min(100,max));
    if (min > max) { if (source.includes('min')) max = min; else min = max; }
    if (priceMin) priceMin.value = min; if (priceMax) priceMax.value = max;
    if (rangeMin) rangeMin.value = min; if (rangeMax) rangeMax.value = max;
    filterCards();
  };
  priceMin?.addEventListener('input', () => syncPrice('min-input')); priceMax?.addEventListener('input', () => syncPrice('max-input'));
  rangeMin?.addEventListener('input', () => syncPrice('min-range')); rangeMax?.addEventListener('input', () => syncPrice('max-range'));
  studyFilter?.addEventListener('change', filterCards);
  const filterPanel = $('.catalog-filter-panel');
  const filterPanelTrigger = $('.filter-panel-trigger');
  filterPanelTrigger?.addEventListener('click', () => {
    const expanded = filterPanelTrigger.getAttribute('aria-expanded') !== 'true';
    filterPanelTrigger.setAttribute('aria-expanded', String(expanded));
    filterPanel.hidden = !expanded;
  });

  const dialog = $('.product-dialog');
  const setDialogProduct = (name) => {
    if (!dialog) return;
    $('.dialog-title').textContent = name;
    const isReference = name.startsWith('Peptid');
    $('.dialog-desc').textContent = isReference
      ? 'Referenzmaterial für qualifizierte Labor- und Forschungsumgebungen. Weitere Produktangaben und Verfügbarkeit teilen wir gerne persönlich.'
      : 'Sorgfältig ausgewählter Laborbedarf für eine klare und organisierte Arbeitsumgebung. Weitere Produktangaben und Verfügbarkeit teilen wir gerne persönlich.';
    if (!dialog.open) dialog.showModal();
  };
  $$('[data-product]').forEach((button) => button.addEventListener('click', () => setDialogProduct(button.dataset.product)));
  $$('.dialog-close').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  const drawer = $('.drawer');
  const overlay = $('.overlay');
  if (drawer) drawer.inert = true;
  if (overlay) overlay.inert = true;
  const cartStorageKey = 'snow-peptides-cart-v1';
  const readCart = (value) => {
    try {
      const saved = JSON.parse(value || '[]');
      const items = Array.isArray(saved) ? saved : (Array.isArray(saved?.items) ? saved.items : []);
      return new Map(items.flatMap((item) => {
        const name = typeof item === 'string' ? item : item?.name;
        const product = productData.find((entry) => entry.name === name);
        if (!product) return [];
        const quantity = typeof item === 'string' ? 1 : Math.max(1, Math.min(99, Math.floor(Number(item.quantity ?? item.qty) || 1)));
        return [[product.name, quantity]];
      }));
    } catch { return new Map(); }
  };
  let initialCart = '[]';
  try { initialCart = localStorage.getItem(cartStorageKey) || '[]'; } catch { /* Storage may be unavailable in private contexts. */ }
  const cart = readCart(initialCart);
  const money = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value);
  const refreshCart = () => {
    const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
    const cartCount = $('.cart-count');
    const cartTrigger = $('.cart-trigger');
    const drawerCount = $('.drawer-count');
    const cartItems = $('.cart-items');
    const emptyCart = $('.empty-cart');
    let totalNode = $('.cart-subtotal-value');
    const checkoutButton = $('.checkout-trigger');
    const subtotal = [...cart].reduce((sum, [name, quantity]) => sum + (productData.find((product) => product.name === name)?.price || 0) * quantity, 0);
    if (!totalNode && drawer) {
      const summary = document.createElement('div'); summary.className = 'cart-subtotal';
      const label = document.createElement('span'); label.textContent = 'Zwischensumme · Demo';
      totalNode = document.createElement('strong'); totalNode.className = 'cart-subtotal-value';
      summary.append(label, totalNode);
      const bottom = $('.drawer-bottom', drawer);
      if (bottom) bottom.insertBefore(summary, bottom.firstElementChild);
    }
    let activeCheckoutButton = checkoutButton;
    if (!activeCheckoutButton && drawer) {
      const bottom = $('.drawer-bottom', drawer);
      if (bottom && $('.checkout-dialog')) {
        activeCheckoutButton = document.createElement('button');
        activeCheckoutButton.type = 'button'; activeCheckoutButton.className = 'button button-dark checkout-trigger';
        activeCheckoutButton.innerHTML = 'Bestellablauf ansehen <span>↗</span>';
        const contactLink = $('.drawer-contact-link', bottom);
        bottom.insertBefore(activeCheckoutButton, contactLink || null);
      }
    }
    if (cartCount) cartCount.textContent = count;
    if (cartTrigger) cartTrigger.setAttribute('aria-label', `Warenkorb öffnen, ${count} ${count === 1 ? 'Artikel' : 'Artikel'}`);
    if (drawerCount) drawerCount.textContent = `(${count})`;
    if (totalNode) totalNode.textContent = money(subtotal);
    const subtotalRow = $('.cart-subtotal');
    if (subtotalRow) subtotalRow.hidden = count === 0;
    if (activeCheckoutButton) activeCheckoutButton.disabled = count === 0;
    if (cartItems) {
      cartItems.replaceChildren();
      cart.forEach((quantity, name) => {
        const product = productData.find((entry) => entry.name === name);
        if (!product) return;
        const row = document.createElement('li'); row.className = 'cart-item';
        const art = document.createElement('span'); art.className = `cart-item-art ${product.color}`;
        if (product.category === 'peptide') {
          const image = document.createElement('img'); image.src = './assets/snow-vial.png'; image.alt = ''; art.append(image);
        } else { art.textContent = product.slug === 'probenroehrchen' ? '▥' : '▤'; }
        const details = document.createElement('div'); details.className = 'cart-item-details';
        const title = document.createElement('b'); title.textContent = name;
        const study = document.createElement('small'); study.textContent = product.study;
        const lineTotal = document.createElement('strong'); lineTotal.textContent = money(product.price * quantity);
        details.append(title, study, lineTotal);
        const controls = document.createElement('div'); controls.className = 'cart-item-controls';
        const decrement = document.createElement('button'); decrement.type = 'button'; decrement.dataset.cartQuantity = name; decrement.dataset.delta = '-1'; decrement.textContent = '−'; decrement.setAttribute('aria-label', `${name} Anzahl verringern`); decrement.disabled = quantity <= 1;
        const amount = document.createElement('span'); amount.textContent = quantity; amount.setAttribute('aria-label', `Anzahl ${quantity}`);
        const increment = document.createElement('button'); increment.type = 'button'; increment.dataset.cartQuantity = name; increment.dataset.delta = '1'; increment.textContent = '+'; increment.setAttribute('aria-label', `${name} Anzahl erhöhen`); increment.disabled = quantity >= 99;
        const remove = document.createElement('button'); remove.type = 'button'; remove.dataset.remove = name; remove.className = 'cart-remove'; remove.setAttribute('aria-label', `${name} aus dem Warenkorb entfernen`); remove.textContent = 'Entfernen';
        controls.append(decrement, amount, increment, remove);
        row.append(art, details, controls); cartItems.append(row);
      });
    }
    if (emptyCart) emptyCart.hidden = count > 0;
    if (cartItems) cartItems.hidden = count === 0;
    try { localStorage.setItem(cartStorageKey, JSON.stringify([...cart].map(([name, quantity]) => ({ name, quantity })))); } catch { /* Storage may be unavailable in private contexts. */ }
  };
  let savedWishlist = [];
  try { savedWishlist = JSON.parse(localStorage.getItem('snow-peptides-wishlist-v1') || '[]'); } catch { savedWishlist = []; }
  const wishlist = new Set(Array.isArray(savedWishlist) ? savedWishlist.filter((item) => typeof item === 'string') : []);
  const wishlistDialog = $('.wishlist-dialog');
  const refreshWishlist = () => {
    const count = wishlist.size;
    const trigger = $('.wishlist-trigger');
    const countNode = $('.wishlist-count');
    const dialogCount = $('.wishlist-dialog-count');
    const list = $('.wishlist-items');
    const empty = $('.wishlist-empty');
    if (countNode) countNode.textContent = count;
    if (dialogCount) dialogCount.textContent = `(${count})`;
    if (trigger) trigger.setAttribute('aria-label', `Wunschliste öffnen, ${count} ${count === 1 ? 'Artikel' : 'Artikel'}`);
    if (list) {
      list.replaceChildren();
      wishlist.forEach((name) => {
        const item = productData.find((product) => product.name === name);
        const row = document.createElement('li');
        const link = document.createElement('a');
        link.href = item ? `./produkt.html?produkt=${item.slug}` : './sortiment.html';
        link.textContent = name;
        const remove = document.createElement('button');
        remove.type = 'button'; remove.dataset.wishlistRemove = name; remove.textContent = 'Entfernen ×';
        remove.setAttribute('aria-label', `${name} aus der Wunschliste entfernen`);
        row.append(link, remove); list.append(row);
      });
    }
    if (empty) empty.hidden = count > 0;
    $$('[data-wishlist]').forEach((button) => {
      const isSaved = wishlist.has(button.dataset.wishlist);
      button.classList.toggle('is-saved', isSaved);
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute('aria-label', `${button.dataset.wishlist} ${isSaved ? 'aus Wunschliste entfernen' : 'zur Wunschliste hinzufügen'}`);
      if (button.classList.contains('wishlist-detail-button')) {
        button.lastChild.textContent = isSaved ? 'Auf der Wunschliste' : 'Auf die Wunschliste';
        button.setAttribute('aria-label', `${button.dataset.wishlist} ${isSaved ? 'aus Wunschliste entfernen' : 'zur Wunschliste hinzufügen'}`);
      }
    });
    try { localStorage.setItem('snow-peptides-wishlist-v1', JSON.stringify([...wishlist])); } catch { /* Storage may be unavailable in private browsing. */ }
  };
  const flyHeartToWishlist = (source) => {
    const target = $('.wishlist-trigger');
    if (!source || !target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
    const heart = document.createElement('span');
    heart.className = 'wishlist-fly-heart'; heart.setAttribute('aria-hidden', 'true'); heart.textContent = '♥';
    heart.style.left = `${from.left + from.width / 2}px`; heart.style.top = `${from.top + from.height / 2}px`;
    document.body.append(heart);
    if (typeof heart.animate !== 'function') { heart.remove(); return; }
    const dx = to.left + to.width / 2 - from.left - from.width / 2;
    const dy = to.top + to.height / 2 - from.top - from.height / 2;
    const animation = heart.animate([
      { transform: 'translate(-50%, -50%) scale(.65) rotate(-18deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.15) rotate(8deg)', opacity: 1, offset: .16 },
      { transform: `translate(calc(-50% + ${dx * .58}px), calc(-50% + ${dy * .58 - 24}px)) scale(.82) rotate(-8deg)`, opacity: .95, offset: .7 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.22) rotate(0deg)`, opacity: 0 }
    ], { duration: 760, easing: 'cubic-bezier(.18,.72,.24,1)' });
    animation.onfinish = () => heart.remove();
    target.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
  };
  const openDrawer = () => {
    if (!drawer || !overlay) return;
    drawer.returnFocusTo = document.activeElement;
    drawer.inert = false;
    drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true');
    drawer.classList.add('open'); overlay.classList.add('open'); document.body.classList.add('locked');
    drawer.setAttribute('aria-hidden', 'false'); overlay.setAttribute('aria-hidden', 'false'); overlay.inert = false;
    $('.cart-trigger')?.setAttribute('aria-expanded', 'true');
    $('.drawer-close').focus();
  };
  const closeDrawer = () => {
    if (!drawer || !overlay || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.classList.remove('locked');
    drawer.setAttribute('aria-hidden', 'true'); drawer.removeAttribute('aria-modal'); drawer.inert = true; overlay.setAttribute('aria-hidden', 'true'); overlay.inert = true;
    $('.cart-trigger')?.setAttribute('aria-expanded', 'false');
    if (drawer.returnFocusTo?.isConnected) drawer.returnFocusTo.focus();
  };
  $('.cart-trigger')?.addEventListener('click', openDrawer);
  $('.wishlist-trigger')?.addEventListener('click', () => wishlistDialog?.showModal());
  $$('.wishlist-close').forEach((button) => button.addEventListener('click', () => wishlistDialog?.close()));
  wishlistDialog?.addEventListener('click', (event) => { if (event.target === wishlistDialog) wishlistDialog.close(); });
  $('.drawer-close')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  $$('.close-drawer').forEach((link) => link.addEventListener('click', closeDrawer));
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      const current = cart.get(addButton.dataset.add) || 0;
      cart.set(addButton.dataset.add, Math.min(current + 1, 99));
      refreshCart(); openDrawer();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) $('.cart-trigger')?.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
      showToast('Zum Warenkorb hinzugefügt');
    }
    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) { cart.delete(removeButton.dataset.remove); refreshCart(); showToast('Artikel aus dem Warenkorb entfernt'); }
    const quantityButton = event.target.closest('[data-cart-quantity]');
    if (quantityButton) {
      const name = quantityButton.dataset.cartQuantity;
      const next = Math.max(1, Math.min(99, (cart.get(name) || 1) + Number(quantityButton.dataset.delta)));
      cart.set(name, next); refreshCart();
      const controls = $$('[data-cart-quantity]').filter((button) => button.dataset.cartQuantity === name && !button.disabled);
      const nextControl = controls.find((button) => button.dataset.delta === quantityButton.dataset.delta) || controls[0];
      nextControl?.focus();
    }
    const wishlistButton = event.target.closest('[data-wishlist]');
    if (wishlistButton) {
      const name = wishlistButton.dataset.wishlist;
      if (wishlist.has(name)) { wishlist.delete(name); showToast('Aus der Wunschliste entfernt'); }
      else { wishlist.add(name); flyHeartToWishlist(wishlistButton); showToast('Zur Wunschliste hinzugefügt'); }
      refreshWishlist();
    }
    const wishlistRemove = event.target.closest('[data-wishlist-remove]');
    if (wishlistRemove) { wishlist.delete(wishlistRemove.dataset.wishlistRemove); refreshWishlist(); }
  });
  refreshCart();
  refreshWishlist();
  window.addEventListener('storage', (event) => {
    if (event.key === 'snow-peptides-cart-v1') {
      const next = readCart(event.newValue);
      cart.clear(); next.forEach((quantity, name) => cart.set(name, quantity));
      refreshCart();
    }
    if (event.key === 'snow-peptides-wishlist-v1') {
      let next = [];
      try { next = JSON.parse(event.newValue || '[]'); } catch { next = []; }
      wishlist.clear(); if (Array.isArray(next)) next.filter((item) => typeof item === 'string').forEach((item) => wishlist.add(item));
      refreshWishlist();
    }
  });

  const checkoutDialog = $('.checkout-dialog');
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.checkout-trigger')) return;
    if ([...cart.values()].reduce((sum, quantity) => sum + quantity, 0) === 0) return;
    closeDrawer(); checkoutDialog?.showModal();
  });
  $$('.checkout-close').forEach((button) => button.addEventListener('click', () => checkoutDialog?.close()));
  checkoutDialog?.addEventListener('click', (event) => { if (event.target === checkoutDialog) checkoutDialog.close(); });
  $('.dialog-inquiry')?.addEventListener('click', () => dialog?.close());

  const searchTrigger = $('.search-trigger');
  const searchPanel = document.createElement('div');
  searchPanel.className = 'search-panel';
  searchPanel.innerHTML = `<div class="search-shell"><div class="search-topline"><span>SNOW SEARCH</span><button class="search-close" type="button" aria-label="Suche schließen">×</button></div><div class="search-input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><label class="sr-only" for="site-search">Produkte suchen</label><input id="site-search" type="search" placeholder="Wonach suchst du?" autocomplete="off"><kbd>ESC</kbd></div><div class="search-hint"><span>Sortiment entdecken</span><span class="search-result-count"></span></div><div class="search-rail-wrap"><div class="search-rail-heading"><b>Passend für dich</b><div><button class="search-rail-arrow" type="button" data-scroll="-1" aria-label="Produkte nach links">‹</button><button class="search-rail-arrow" type="button" data-scroll="1" aria-label="Produkte nach rechts">›</button></div></div><div class="search-product-rail" role="list" tabindex="0" aria-label="Produkte zum Durchstöbern"></div><p class="search-no-results" hidden>Keine passenden Produkte gefunden.</p></div></div>`;
  document.body.appendChild(searchPanel);
  const searchInput = $('#site-search');
  const searchRail = $('.search-product-rail');
  const renderSearchRail = (query = '') => {
    const normalized = query.trim().toLocaleLowerCase('de');
    const matches = productData.filter((product) => `${product.name} ${product.study} ${product.category === 'accessory' ? 'zubehör laborbedarf' : 'peptid'}`.toLocaleLowerCase('de').includes(normalized));
    const count = $('.search-result-count');
    const noResults = $('.search-no-results');
    if (count) count.textContent = `${matches.length} ${matches.length === 1 ? 'Treffer' : 'Produkte'}`;
    if (noResults) noResults.hidden = matches.length > 0;
    searchRail.replaceChildren();
    matches.forEach((product) => {
      const link = document.createElement('a'); link.className = `search-product-card ${product.color}`;
      link.href = `./produkt.html?produkt=${product.slug}`; link.setAttribute('role', 'listitem');
      const art = document.createElement('span'); art.className = 'search-product-art';
      if (product.category === 'peptide') {
        const image = document.createElement('img'); image.src = './assets/snow-vial.png'; image.alt = ''; art.append(image);
      } else { art.textContent = product.slug === 'probenroehrchen' ? '▥' : '▤'; }
      const type = document.createElement('small'); type.textContent = product.category === 'peptide' ? 'PEPTID' : 'ZUBEHÖR';
      const name = document.createElement('b'); name.textContent = product.name;
      const study = document.createElement('span'); study.textContent = product.study;
      const price = document.createElement('strong'); price.textContent = money(product.price);
      link.append(art, type, name, study, price); searchRail.append(link);
    });
  };
  renderSearchRail();
  searchTrigger?.addEventListener('click', () => {
    const open = searchPanel.classList.toggle('open');
    searchTrigger.setAttribute('aria-expanded', String(open));
    if (open) searchInput.focus();
  });
  $('.search-close')?.addEventListener('click', () => { searchPanel.classList.remove('open'); searchTrigger?.setAttribute('aria-expanded', 'false'); searchTrigger?.focus(); });
  $$('.search-rail-arrow').forEach((button) => button.addEventListener('click', () => {
    searchRail.scrollBy({ left: Number(button.dataset.scroll) * Math.max(250, searchRail.clientWidth * .78), behavior: 'smooth' });
  }));
  document.addEventListener('click', (event) => {
    if (!searchPanel.classList.contains('open')) return;
    if (event.target.closest('.search-panel, .search-trigger')) return;
    searchPanel.classList.remove('open'); searchTrigger?.setAttribute('aria-expanded', 'false');
  });
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase('de');
    renderSearchRail(searchInput.value);
    if (!cards.length) return;
    activeQuery = query; filterCards();
    if (query) document.querySelector('#sortiment').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  const initialSearch = new URLSearchParams(window.location.search).get('search');
  if (cards.length && initialSearch) {
    searchInput.value = initialSearch;
    searchPanel.classList.add('open');
    searchTrigger?.setAttribute('aria-expanded', 'true');
    renderSearchRail(initialSearch);
    activeQuery = initialSearch.trim().toLocaleLowerCase('de'); filterCards();
  }
  searchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || cards.length) return;
    const query = searchInput.value.trim();
    if (query) window.location.href = `./sortiment.html?search=${encodeURIComponent(query)}`;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeDrawer(); searchPanel.classList.remove('open'); searchTrigger?.setAttribute('aria-expanded', 'false'); }
    if (drawer?.classList.contains('open') && event.key === 'Tab') {
      const focusable = $$('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex]:not([tabindex="-1"])', drawer).filter((element) => !element.hidden);
      if (!focusable.length) { event.preventDefault(); drawer.focus(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === drawer)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchPanel.classList.add('open'); searchInput.focus(); }
  });

  const mobileMenu = $('.menu-trigger');
  const nav = $('.main-nav');
  mobileMenu?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('menu-open');
    nav.classList.toggle('nav-open', open);
    nav.classList.toggle('mobile-open', open);
    mobileMenu.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    mobileMenu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('mobile-open', 'nav-open'); mobileMenu.classList.remove('menu-open'); mobileMenu.setAttribute('aria-label', 'Menü öffnen'); mobileMenu.setAttribute('aria-expanded', 'false');
  }));

  const loginDialog = $('.login-dialog');
  $('.login-trigger')?.addEventListener('click', () => loginDialog?.showModal());
  $$('.login-close').forEach((button) => button.addEventListener('click', () => loginDialog?.close()));
  loginDialog?.addEventListener('click', (event) => { if (event.target === loginDialog) loginDialog.close(); });

  $('.newsletter-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('#email').value.trim();
    if (!email) return;
    const status = $('.newsletter-status');
    if (status) status.textContent = 'Vorschau: Die Anmeldung wurde nicht übermittelt. Die Newsletter-Anbindung fehlt noch.';
    showToast('Newsletter-Anbindung noch nicht eingerichtet. Es wurde nichts übermittelt.');
  });
})();
