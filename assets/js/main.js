/* ============================================================
   PIXELVAULT – Core JavaScript (v2)
   Store · Cart · Auth · Compare · Wishlist · UI helpers
   ============================================================ */

/* ---- SVG Icon Library ---- */
const SVG = {
  cart:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  heart:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartFill:  `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  compare:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  search:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  user:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  x:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  info:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  alert:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  star:       `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starEmpty:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  trash:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  minus:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  plus:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  camera:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  grid:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  list:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  package:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  chartBar:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  settings:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  dollar:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  users:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  tag:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  receipt:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  star2:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  trending:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  shield:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  truck:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  refresh:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  creditCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  mapPin:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.91z"/></svg>`,
  mail:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  logout:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  home:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  eye:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  edit:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  lock:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
};

/* ---- In-Memory Data Store ---- */
const Store = {
  // Populated async from Supabase via initStore()
  products:    [],
  orders:      [],

  cart:        [],
  wishlist:    [],
  compareList: [],
  currentUser: null,
};

// supabaseClient is set by data.js (loaded before main.js)
const supabaseClient = window.supabaseClient;

/* ---- Load Store data từ Supabase ---- */
async function initStore() {
  try {
    const [products, orders] = await Promise.all([
      window.SupabaseDB.getProducts(),
      window.SupabaseDB.getOrders().catch(() => []),
    ]);
    Store.products = products;
    Store.orders   = orders;
  } catch (err) {
    console.error('[Store] initStore failed:', err);
  }
  // Thông báo cho các page biết Store đã sẵn sàng
  document.dispatchEvent(new CustomEvent('store:ready', { detail: Store }));
}

/* ---- Restore session ---- */
(function init() {
  const saved = localStorage.getItem('pv_user');
  if (saved) {
    try { Store.currentUser = JSON.parse(saved); } catch {}
  }

  // Check Supabase session
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) handleSession(session.user);
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
      handleSession(session.user);
    } else {
      Store.currentUser = null;
      updateAuthUI();
    }
  });

  const savedCart = localStorage.getItem('pv_cart');
  if (savedCart) {
    try { Store.cart = JSON.parse(savedCart); } catch {}
  }
  const savedWL = localStorage.getItem('pv_wishlist');
  if (savedWL) {
    try { Store.wishlist = JSON.parse(savedWL); } catch {}
  }

  window.addEventListener('DOMContentLoaded', () => {
    cartUpdate();
    updateAuthUI();
    initNavScroll();
    initScrollAnimations();
    // Fetch data from Supabase
    initStore();
  });
})();

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavScroll() {
  const nav = document.getElementById('main-navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function updateAuthUI() {
  const u = Store.currentUser;
  const loginBtn = document.getElementById('btn-login');
  const userBtn  = document.getElementById('btn-user');
  const adminShortcut = document.getElementById('admin-shortcut');
  const sidebarAdminLink = document.getElementById('sidebar-admin-link');
  const dropdownName = document.getElementById('user-dropdown-name');
  if (u) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userBtn) {
      userBtn.style.display = 'flex';
      if (adminShortcut) adminShortcut.style.display = u.role === 'admin' ? 'block' : 'none';
      if (sidebarAdminLink) sidebarAdminLink.style.display = u.role === 'admin' ? 'flex' : 'none';
      if (dropdownName) dropdownName.textContent = u.name;
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userBtn)  userBtn.style.display = 'none';
  }
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

/* ============================================================
   CART
   ============================================================ */
function cartAdd(productId, qty = 1) {
  const p = Store.products.find(x => x.id === productId);
  if (!p || p.stock === 0) return;
  const existing = Store.cart.find(x => x.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, p.stock);
  } else {
    Store.cart.push({ ...p, qty });
  }
  cartPersist();
  cartUpdate();
  showToast(`Đã thêm "${p.name}" vào giỏ hàng`, 'success');
}

function cartRemove(productId) {
  Store.cart = Store.cart.filter(x => x.id !== productId);
  cartPersist();
  cartUpdate();
}

function cartSetQty(productId, qty) {
  const item = Store.cart.find(x => x.id === productId);
  if (!item) return;
  if (qty <= 0) { cartRemove(productId); return; }
  item.qty = Math.min(qty, item.stock);
  cartPersist();
  cartUpdate();
}

function cartGetTotal() {
  return Store.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartPersist() {
  localStorage.setItem('pv_cart', JSON.stringify(Store.cart));
}

function cartUpdate() {
  const count = Store.cart.reduce((s, i) => s + i.qty, 0);

  // Update all badge elements
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });

  // Render cart items
  const itemsEl = document.getElementById('cart-items');
  if (!itemsEl) return;

  if (Store.cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">${SVG.cart}</div>
        <p>Giỏ hàng đang trống</p>
      </div>`;
  } else {
    itemsEl.innerHTML = Store.cart.map(item => `
      <div class="cart-item" id="cart-item-${item.id}">
        <img class="cart-item-img" src="${getProductImageSrc(item.images, false)}" alt="${item.name}" onerror="this.style.opacity='.3'">
        <div class="cart-item-info">
          <div class="cart-item-brand">${item.brand}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button class="qty-btn" onclick="cartSetQty(${item.id}, ${item.qty - 1})">${SVG.minus}</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="cartSetQty(${item.id}, ${item.qty + 1})">${SVG.plus}</button>
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
            <button class="cart-item-remove" onclick="cartRemove(${item.id})">${SVG.trash}</button>
          </div>
        </div>
      </div>`
    ).join('');
  }

  // Footer totals
  const totalEl = document.getElementById('cart-total');
  if (totalEl) {
    const total = cartGetTotal();
    totalEl.innerHTML = `
      <div class="cart-summary-row"><span>Tạm tính (${count} SP)</span><span>${formatPrice(total)}</span></div>
      <div class="cart-summary-row"><span>Phí vận chuyển</span><span>${total >= 50000000 ? 'Miễn phí' : '30.000đ'}</span></div>
      <div class="cart-summary-row total"><span>Tổng cộng</span><span class="price">${formatPrice(total >= 50000000 ? total : total + 30000)}</span></div>`;
  }
}

function cartOpen() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cartClose() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cart-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('cart-overlay')) cartClose();
  });
});

/* ============================================================
   AUTH
   ============================================================ */
document.addEventListener('submit', async (e) => {
  if (e.target.id === 'login-form') {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) { showToast('Lỗi: ' + error.message, 'error'); return; }
    
    closeModal('auth-modal');
    
    // Đọc thông tin từ bảng profiles trong Supabase
    const userRecord = data.user;
    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userRecord.id).single();
    
    const name = profile?.name || userRecord.user_metadata?.name || userRecord.email.split('@')[0];
    const role = profile?.role || 'customer';
    
    handleLoginSuccess({ id: userRecord.id, name, email: userRecord.email, role });
  } else if (e.target.id === 'register-form') {
    e.preventDefault();
    const name = document.getElementById('reg-name')?.value;
    const email = document.getElementById('reg-email')?.value;
    const password = document.getElementById('reg-password')?.value;
    
    const { data, error } = await supabaseClient.auth.signUp({
      email, password, options: { data: { name, role: 'customer' } }
    });
    
    if (error) { showToast('Lỗi đăng ký: ' + error.message, 'error'); return; }
    closeModal('auth-modal');
    showToast('Đăng ký thành công! Hãy kiểm tra email.', 'success');
  }
});

async function handleSession(userRecord) {
  // Đọc thông tin từ bảng profiles
  let { data: profile, error } = await supabaseClient.from('profiles').select('*').eq('id', userRecord.id).maybeSingle();
  
  if (!profile) {
    // Nếu chưa có profile trong bảng (do thiếu trigger), frontend tự tạo luôn!
    const newProfile = {
      id: userRecord.id,
      name: userRecord.user_metadata?.name || userRecord.email.split('@')[0],
      email: userRecord.email,
      role: 'customer'
    };
    await supabaseClient.from('profiles').insert([newProfile]);
    profile = newProfile;
  }
  
  const name = profile.name;
  const role = profile.role;
  
  const user = { id: userRecord.id, name, email: userRecord.email, role };
  Store.currentUser = user;
  localStorage.setItem('pv_user', JSON.stringify(user));
  
  updateAuthUI();
}

function handleLoginSuccess(user) {
  Store.currentUser = user;
  localStorage.setItem('pv_user', JSON.stringify(user));
  updateAuthUI();
  showToast(`Chào mừng, ${user.name}!`, 'success');
  
  setTimeout(() => {
    const inPages = window.location.pathname.includes('/pages/');
    const inAdmin = window.location.pathname.includes('/admin/');
    if (inPages || inAdmin) window.location.href = '../index.html';
    else window.location.href = 'index.html';
  }, 800);
}

window.socialLogin = async function(provider) {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: provider.toLowerCase(),
  });
  if (error) showToast('Lỗi đăng nhập: ' + error.message, 'error');
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('register-form');
  const loginTab = document.getElementById('tab-login');
  const regTab = document.getElementById('tab-register');
  if (loginForm) {
    loginForm.style.display = tab === 'login' ? 'block' : 'none';
    if (tab === 'login') {
      loginForm.style.animation = 'none';
      loginForm.offsetHeight;
      loginForm.style.animation = 'fadeScale 0.3s ease forwards';
    }
  }
  if (regForm) {
    regForm.style.display = tab === 'register' ? 'block' : 'none';
    if (tab === 'register') {
      regForm.style.animation = 'none';
      regForm.offsetHeight;
      regForm.style.animation = 'fadeScale 0.3s ease forwards';
    }
  }
  const indicator = document.getElementById('auth-tab-indicator');
  
  if (tab === 'login') {
    if (loginTab) loginTab.style.color = 'var(--text-100)';
    if (regTab) regTab.style.color = 'var(--text-400)';
    if (indicator && loginTab) {
      indicator.style.width = loginTab.offsetWidth + 'px';
      indicator.style.transform = 'translateX(0)';
    }
  } else {
    if (loginTab) loginTab.style.color = 'var(--text-400)';
    if (regTab) regTab.style.color = 'var(--text-100)';
    if (indicator && regTab && loginTab) {
      indicator.style.width = regTab.offsetWidth + 'px';
      indicator.style.transform = `translateX(${loginTab.offsetWidth + 20}px)`;
    }
  }
}

function logout() {
  supabaseClient.auth.signOut().then(() => {
    Store.currentUser = null;
    localStorage.removeItem('pv_user');
    updateAuthUI();
    showToast('Đã đăng xuất', 'info');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    setTimeout(() => {
      const inPages = window.location.pathname.includes('/pages/');
      const inAdmin = window.location.pathname.includes('/admin/');
      if (inPages || inAdmin) window.location.href = '../index.html';
      else window.location.href = 'index.html';
    }, 500);
  });
}

function toggleUserDropdown() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
}

document.addEventListener('click', (e) => {
  const container = document.getElementById('user-menu-container');
  if (container && !container.contains(e.target)) {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
});

/* ============================================================
   COMPARE
   ============================================================ */
function compareToggle(productId) {
  const idx = Store.compareList.indexOf(productId);
  if (idx >= 0) {
    Store.compareList.splice(idx, 1);
    showToast('Đã xóa khỏi danh sách so sánh', 'info');
  } else {
    if (Store.compareList.length >= 3) { showToast('Chỉ so sánh tối đa 3 sản phẩm', 'error'); return; }
    Store.compareList.push(productId);
    showToast('Đã thêm vào danh sách so sánh', 'success');
  }
  updateCompareBar();
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  if (!bar) return;
  bar.classList.toggle('active', Store.compareList.length > 0);
  const slots = document.getElementById('compare-slots');
  if (!slots) return;
  const items = Store.compareList.map(id => Store.products.find(p => p.id === id)).filter(Boolean);
  slots.innerHTML = items.map(p => `
    <div class="compare-slot">
      <img src="${p.images[0].startsWith('assets') ? '../' : ''}${p.images[0]}" alt="${p.name}" onerror="this.style.opacity='.3'">
    </div>`).join('');
  for (let i = items.length; i < 3; i++) {
    slots.innerHTML += `<div class="compare-slot">+</div>`;
  }
}

function goCompare() {
  if (Store.compareList.length < 2) { showToast('Chọn ít nhất 2 sản phẩm để so sánh', 'error'); return; }
  window.location.href = `compare.html?ids=${Store.compareList.join(',')}`;
}

/* ============================================================
   WISHLIST
   ============================================================ */
function wishlistToggle(productId) {
  const idx = Store.wishlist.indexOf(productId);
  if (idx >= 0) {
    Store.wishlist.splice(idx, 1);
    showToast('Đã xóa khỏi danh sách yêu thích', 'info');
  } else {
    Store.wishlist.push(productId);
    showToast('Đã thêm vào danh sách yêu thích', 'success');
  }
  localStorage.setItem('pv_wishlist', JSON.stringify(Store.wishlist));
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (id === 'auth-modal') setTimeout(() => switchAuthTab('login'), 10);
  el.addEventListener('click', (e) => { if (e.target === el) closeModal(id); }, { once: true });
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: SVG.check, error: SVG.alert, info: SVG.info };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-icon">${icons[type] || icons.info}</div><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ============================================================
   FORMATTING HELPERS
   ============================================================ */
function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function getDiscountPct(price, original) {
  return '-' + Math.round((1 - price / original) * 100) + '%';
}

function getStarsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      html += `<span style="color:var(--gold-400);">${SVG.star}</span>`;
    } else if (i === full && half) {
      html += `<span style="color:var(--gold-400); opacity:0.6;">${SVG.star}</span>`;
    } else {
      html += `<span style="color:var(--text-400);">${SVG.starEmpty}</span>`;
    }
  }
  return html;
}

function getBadgeHTML(badge) {
  if (!badge) return '';
  const map = { 'HOT': 'badge-hot', 'NEW': 'badge-new', 'SALE': 'badge-sale', 'HÀNG HẾT': 'badge-soldout' };
  return `<span class="badge ${map[badge] || ''}">${badge}</span>`;
}

/** Normalize image src: Supabase URL / relative path / placeholder */
function getProductImageSrc(images, fromRoot = true) {
  let src = '';
  if (Array.isArray(images) && images.length > 0) src = images[0];
  else if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed) && parsed.length > 0) src = parsed[0];
    } catch { src = images; }
  }
  
  if (!src) return ''; // onerror handles empty
  if (src.startsWith('http')) return src; // Supabase Storage URL
  if (src.startsWith('assets/')) return fromRoot ? src : '../' + src;
  return src;
}

function renderProductCard(p, fromRoot = null) {
  // Auto-detect page context
  if (fromRoot === null) fromRoot = !window.location.pathname.includes('/pages/');
  const discount = p.originalPrice > p.price ? getDiscountPct(p.price, p.originalPrice) : '';
  const imgSrc   = getProductImageSrc(p.images, fromRoot);
  const detailUrl = fromRoot ? `pages/product-detail.html?id=${p.id}` : `product-detail.html?id=${p.id}`;
  return `
    <div class="product-card" id="pcard-${p.id}" onclick="window.location.href='${detailUrl}'">
      <div class="product-image-wrap">
        <img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.style.opacity='.2'">
        <div class="product-badges">${getBadgeHTML(p.badge)}</div>
        <div class="product-quick-actions">
          <button class="quick-action-btn" onclick="event.stopPropagation(); wishlistToggle(${p.id})" title="Yêu thích">${SVG.heart}</button>
          <button class="quick-action-btn" onclick="event.stopPropagation(); compareToggle(${p.id})" title="So sánh">${SVG.compare}</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-specs">${(Array.isArray(p.tags) ? p.tags : []).map(t => `<span class="spec-tag">${t}</span>`).join('')}</div>
        <div class="product-rating">
          <div class="stars">${getStarsHTML(p.rating)}</div>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <div>
            <div class="price-current">${formatPrice(p.price)}</div>
            ${p.originalPrice > p.price ? `<div class="price-original">${formatPrice(p.originalPrice)}</div>` : ''}
          </div>
          ${discount ? `<span class="price-discount">${discount}</span>` : ''}
        </div>
        <button class="product-add-cart ${p.stock === 0 ? 'out-of-stock' : ''}"
          onclick="event.stopPropagation(); ${p.stock > 0 ? `cartAdd(${p.id})` : ''}">
          ${SVG.cart}
          ${p.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>`;
}
function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') !== 'light';
  if (isDark) {
    document.body.setAttribute('data-theme', 'light');
    const tIcon = document.getElementById('theme-icon');
    if(tIcon) tIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.removeAttribute('data-theme');
    const tIcon = document.getElementById('theme-icon');
    if(tIcon) tIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    localStorage.setItem('theme', 'dark');
  }
}
if (localStorage.getItem('theme') === 'light') {
  document.body.setAttribute('data-theme', 'light');
  window.addEventListener('DOMContentLoaded', () => {
    const tIcon = document.getElementById('theme-icon');
    if(tIcon) tIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  });
}

