/**
 * Dress Shop — Cart, Wishlist, Search, Filters, Product Detail, Checkout
 */

const PRODUCTS = [
  { id: 1, name: 'Midi Slip Dress', category: 'dresses', price: 145, sizes: ['XS', 'S', 'M', 'L'], colors: ['Blush', 'Black', 'Ivory'], image: 'dress1' },
  { id: 2, name: 'Floral Maxi Dress', category: 'dresses', price: 168, sizes: ['S', 'M', 'L'], colors: ['Navy', 'Sage'], image: 'dress2' },
  { id: 3, name: 'Wrap Midi Dress', category: 'dresses', price: 125, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Terracotta', 'Black'], image: 'dress3' },
  { id: 4, name: 'Evening Gown', category: 'dresses', price: 289, sizes: ['S', 'M', 'L'], colors: ['Black', 'Emerald'], image: 'dress4' },
  { id: 5, name: 'Shirt Dress', category: 'dresses', price: 98, sizes: ['XS', 'S', 'M', 'L'], colors: ['White', 'Striped'], image: 'dress5' },
  { id: 6, name: 'Organic Cotton Tee', category: 'tops', price: 42, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Oat'], image: 'top1' },
  { id: 7, name: 'Linen Overshirt', category: 'tops', price: 128, sizes: ['S', 'M', 'L'], colors: ['Beige', 'Olive'], image: 'top2' },
  { id: 8, name: 'Silk Blouse', category: 'tops', price: 89, sizes: ['XS', 'S', 'M', 'L'], colors: ['Blush', 'White'], image: 'top3' },
  { id: 9, name: 'Wide-Leg Trousers', category: 'bottoms', price: 96, sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Cream'], image: 'bottom1' },
  { id: 10, name: 'High-Waist Skirt', category: 'bottoms', price: 72, sizes: ['S', 'M', 'L'], colors: ['Plaid', 'Black'], image: 'bottom2' },
  { id: 11, name: 'Linen Trousers', category: 'bottoms', price: 88, sizes: ['S', 'M', 'L'], colors: ['White', 'Navy'], image: 'bottom3' },
  { id: 12, name: 'Leather Crossbody', category: 'accessories', price: 165, sizes: ['One Size'], colors: ['Tan', 'Black'], image: 'acc1' },
  { id: 13, name: 'Wool Scarf', category: 'accessories', price: 58, sizes: ['One Size'], colors: ['Camel', 'Grey'], image: 'acc2' },
  { id: 14, name: 'Straw Tote', category: 'accessories', price: 78, sizes: ['One Size'], colors: ['Natural'], image: 'acc3' },
  { id: 15, name: 'Cocktail Dress', category: 'dresses', price: 195, sizes: ['XS', 'S', 'M', 'L'], colors: ['Red', 'Black'], image: 'dress6' },
  { id: 16, name: 'Casual Jumpsuit', category: 'dresses', price: 112, sizes: ['S', 'M', 'L'], colors: ['Denim', 'Black'], image: 'jumpsuit1' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'accessories', label: 'Accessories' },
];

const IMAGE_CLASSES = {
  dress1: 'img-dress1', dress2: 'img-dress2', dress3: 'img-dress3', dress4: 'img-dress4', dress5: 'img-dress5', dress6: 'img-dress6',
  top1: 'img-top1', top2: 'img-top2', top3: 'img-top3',
  bottom1: 'img-bottom1', bottom2: 'img-bottom2', bottom3: 'img-bottom3',
  acc1: 'img-acc1', acc2: 'img-acc2', acc3: 'img-acc3',
  jumpsuit1: 'img-jumpsuit1',
};

// State
let cart = JSON.parse(localStorage.getItem('dressShopCart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('dressShopWishlist') || '[]');
let currentFilter = { category: 'all', minPrice: '', maxPrice: '', search: '' };

// DOM
const headerCartCount = document.getElementById('cart-count');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartEmptyEl = document.getElementById('cart-empty');
const productModal = document.getElementById('product-modal');
const productModalContent = document.getElementById('product-modal-content');
const shopFilters = document.getElementById('shop-filters');
const shopGrid = document.getElementById('shop-grid');
const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const loginModal = document.getElementById('login-modal');
const accountBtn = document.getElementById('account-btn');

function saveCart() {
  localStorage.setItem('dressShopCart', JSON.stringify(cart));
  renderCartCount();
}

function saveWishlist() {
  localStorage.setItem('dressShopWishlist', JSON.stringify(wishlist));
}

function renderCartCount() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (headerCartCount) headerCartCount.textContent = count;
  if (count > 0) headerCartCount.classList.add('has-items'); else headerCartCount.classList.remove('has-items');
}

function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    if (currentFilter.category !== 'all' && p.category !== currentFilter.category) return false;
    if (currentFilter.minPrice && p.price < Number(currentFilter.minPrice)) return false;
    if (currentFilter.maxPrice && p.price > Number(currentFilter.maxPrice)) return false;
    if (currentFilter.search) {
      const q = currentFilter.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function renderProductCard(product, container) {
  const inWishlist = wishlist.includes(product.id);
  const div = document.createElement('article');
  div.className = 'product-card';
  div.dataset.id = product.id;
  div.innerHTML = `
    <div class="product-image ${IMAGE_CLASSES[product.image] || ''}" data-id="${product.id}"></div>
    <button class="wishlist-btn ${inWishlist ? 'active' : ''}" aria-label="Wishlist" data-id="${product.id}">♥</button>
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="btn btn-primary btn-add-cart">Add to Cart</button>
    </div>
  `;
  div.querySelector('.product-image, .product-name').addEventListener('click', () => openProductModal(product.id));
  div.querySelector('.btn-add-cart').addEventListener('click', (e) => { e.stopPropagation(); addToCart(product.id); });
  div.querySelector('.wishlist-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleWishlist(product.id); });
  container.appendChild(div);
}

function renderShopGrid() {
  if (!shopGrid) return;
  shopGrid.innerHTML = '';
  const products = getFilteredProducts();
  if (products.length === 0) {
    shopGrid.innerHTML = '<p class="no-results">No products match your filters. Try adjusting or clearing filters.</p>';
    return;
  }
  products.forEach(p => renderProductCard(p, shopGrid));
}

function openProductModal(id) {
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product || !productModalContent) return;
  const inWishlist = wishlist.includes(product.id);
  productModalContent.innerHTML = `
    <button class="modal-close" aria-label="Close">&times;</button>
    <div class="product-detail-grid">
      <div class="product-detail-image ${IMAGE_CLASSES[product.image] || ''}"></div>
      <div class="product-detail-info">
        <span class="product-category">${product.category}</span>
        <h2 class="product-detail-name">${product.name}</h2>
        <p class="product-detail-price">$${product.price.toFixed(2)}</p>
        <p class="product-detail-desc">Premium fabric, timeless fit. Free shipping on orders over $100.</p>
        <div class="product-options">
          <label>Size</label>
          <select class="product-size" data-id="${product.id}">
            ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
          <label>Color</label>
          <select class="product-color" data-id="${product.id}">
            ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <label>Quantity</label>
          <input type="number" class="product-qty" min="1" value="1" data-id="${product.id}">
        </div>
        <div class="product-detail-actions">
          <button class="btn btn-primary btn-add-cart-modal">Add to Cart</button>
          <button class="wishlist-btn large ${inWishlist ? 'active' : ''}" data-id="${product.id}">♥ Wishlist</button>
        </div>
      </div>
    </div>
  `;
  productModal.classList.add('open');
  document.body.classList.add('modal-open');

  productModalContent.querySelector('.modal-close').addEventListener('click', closeProductModal);
  productModalContent.querySelector('.btn-add-cart-modal').addEventListener('click', () => {
    const size = productModalContent.querySelector('.product-size').value;
    const color = productModalContent.querySelector('.product-color').value;
    const qty = Math.max(1, parseInt(productModalContent.querySelector('.product-qty').value, 10) || 1);
    addToCart(product.id, qty, size, color);
    closeProductModal();
  });
  productModalContent.querySelector('.wishlist-btn').addEventListener('click', () => {
    toggleWishlist(product.id);
    productModalContent.querySelector('.wishlist-btn').classList.toggle('active');
  });
}

function closeProductModal() {
  productModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function addToCart(productId, quantity = 1, size = '', color = '') {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId && i.size === size && i.color === color);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: size || product.sizes[0],
      color: color || product.colors[0],
      image: product.image,
    });
  }
  saveCart();
  if (cartDrawer) cartDrawer.classList.add('open');
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  if (cart.length === 0) cartDrawer.classList.remove('open');
}

function updateCartQuantity(index, delta) {
  const item = cart[index];
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cartItemsEl) return;
  cartEmptyEl.style.display = cart.length ? 'none' : 'block';
  cartItemsEl.style.display = cart.length ? 'block' : 'none';
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-image ${IMAGE_CLASSES[item.image] || ''}"></div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>${item.size} / ${item.color} × ${item.quantity}</p>
        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-action="minus">−</button>
          <span>${item.quantity}</span>
          <button type="button" class="qty-btn" data-action="plus">+</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" aria-label="Remove">×</button>
    `;
    div.querySelector('.qty-btn[data-action="minus"]').addEventListener('click', () => updateCartQuantity(index, -1));
    div.querySelector('.qty-btn[data-action="plus"]').addEventListener('click', () => updateCartQuantity(index, 1));
    div.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(index));
    cartItemsEl.appendChild(div);
  });
  if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function toggleWishlist(productId) {
  const i = wishlist.indexOf(productId);
  if (i === -1) wishlist.push(productId); else wishlist.splice(i, 1);
  saveWishlist();
  renderShopGrid();
}

function openSearch() {
  searchOverlay.classList.add('open');
  searchInput.value = '';
  searchInput.focus();
  runSearch();
}

function closeSearch() {
  searchOverlay.classList.remove('open');
}

function runSearch() {
  const q = (searchInput && searchInput.value.trim()) || '';
  if (!searchResults) return;
  if (!q) {
    searchResults.innerHTML = '<p class="search-hint">Type to search dresses, tops, and more.</p>';
    return;
  }
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);
  searchResults.innerHTML = '';
  if (results.length === 0) {
    searchResults.innerHTML = '<p class="search-hint">No products found.</p>';
    return;
  }
  results.forEach(p => {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'search-result-item';
    a.innerHTML = `
      <span class="search-result-image ${IMAGE_CLASSES[p.image] || ''}"></span>
      <div>
        <strong>${p.name}</strong>
        <span>$${p.price.toFixed(2)}</span>
      </div>
    `;
    a.addEventListener('click', (e) => { e.preventDefault(); closeSearch(); openProductModal(p.id); });
    searchResults.appendChild(a);
  });
}

function openCart() {
  cartDrawer.classList.add('open');
  renderCart();
}

function closeCart() {
  cartDrawer.classList.remove('open');
}

function openCheckout() {
  if (cart.length === 0) return;
  checkoutSection.classList.add('open');
  document.body.classList.add('modal-open');
  document.getElementById('checkout-order-total').textContent = `$${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`;
}

function closeCheckout() {
  checkoutSection.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function openLogin() {
  document.body.classList.add('modal-open');
  loginModal.classList.add('open');
}

function closeLogin() {
  document.body.classList.remove('modal-open');
  loginModal.classList.remove('open');
}

function submitCheckout(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const order = {
    name: data.get('name'),
    email: data.get('email'),
    address: data.get('address'),
    city: data.get('city'),
    zip: data.get('zip'),
    total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
    items: cart.length,
  };
  alert(`Thank you! Your order has been placed.\n\nTotal: $${order.total.toFixed(2)}\nWe'll send confirmation to ${order.email}.`);
  cart.length = 0;
  saveCart();
  renderCart();
  closeCheckout();
  closeCart();
  form.reset();
}

// Filters
if (shopFilters) {
  const catSelect = shopFilters.querySelector('[name="category"]');
  const minPrice = shopFilters.querySelector('[name="minPrice"]');
  const maxPrice = shopFilters.querySelector('[name="maxPrice"]');
  if (catSelect) {
    catSelect.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('');
    catSelect.addEventListener('change', () => { currentFilter.category = catSelect.value; renderShopGrid(); });
  }
  if (minPrice) minPrice.addEventListener('input', () => { currentFilter.minPrice = minPrice.value; renderShopGrid(); });
  if (maxPrice) maxPrice.addEventListener('input', () => { currentFilter.maxPrice = maxPrice.value; renderShopGrid(); });
}

if (searchInput) {
  searchInput.addEventListener('input', runSearch);
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
}

// Header actions
document.querySelector('.header-actions .icon-btn[aria-label="Search"]')?.addEventListener('click', openSearch);
document.querySelector('.header-actions .icon-btn[aria-label="Cart"]')?.addEventListener('click', openCart);
document.getElementById('search-close')?.addEventListener('click', closeSearch);
document.getElementById('cart-drawer-close')?.addEventListener('click', closeCart);
document.getElementById('cart-checkout-btn')?.addEventListener('click', openCheckout);
document.getElementById('account-btn')?.addEventListener('click', openLogin);

// Modals overlay
productModal?.addEventListener('click', (e) => { if (e.target === productModal) closeProductModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeProductModal(); closeSearch(); closeCart(); closeCheckout(); closeLogin(); } });

// Checkout
checkoutForm?.addEventListener('submit', submitCheckout);
document.getElementById('checkout-close')?.addEventListener('click', closeCheckout);

// Login modal
document.getElementById('login-close')?.addEventListener('click', closeLogin);
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Login is for display only. In a real site this would sign you in.');
  closeLogin();
});

// Category cards: filter shop on click
document.querySelectorAll('.category-card[data-category]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = el.getAttribute('data-category');
    currentFilter.category = cat;
    const select = document.querySelector('#shop-filters [name="category"]');
    if (select) select.value = cat;
    renderShopGrid();
  });
});

// Home featured: first 8 products
const featuredGrid = document.getElementById('featured-grid');
if (featuredGrid) {
  PRODUCTS.slice(0, 8).forEach(p => renderProductCard(p, featuredGrid));
}

// Shop page grid
renderShopGrid();
renderCartCount();
renderCart();
