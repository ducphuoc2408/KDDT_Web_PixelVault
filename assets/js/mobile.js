/**
 * PixelVault - Mobile Responsive JS
 * Handles: mobile nav drawer, filter panel, touch interactions
 */
(function() {
  'use strict';

  // ============================================
  // INJECT MOBILE NAV DRAWER HTML
  // ============================================
  function injectMobileNav() {
    var isSubPage = window.location.pathname.indexOf('/pages/') !== -1;
    var base = isSubPage ? '../' : '';

    var drawerHTML = '<div class="mobile-nav-overlay" id="mobile-nav-overlay" onclick="closeMobileNav()"></div>' +
    '<div class="mobile-nav-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu điều hướng">' +
    '<div class="mobile-nav-header">' +
    '<a href="' + base + 'index.html" class="nav-logo" style="text-decoration:none;">' +
    '<div class="logo-mark"><svg class="logo-icon-svg" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>' +
    '<span class="logo-text">PixelVault</span></a>' +
    '<button class="mobile-nav-close" onclick="closeMobileNav()" aria-label="Đóng menu">' +
    '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>' +

    '<div class="mobile-nav-search">' +
    '<div class="mobile-search-wrap">' +
    '<input class="mobile-search-input" id="mobile-nav-q" type="search" placeholder="Tìm kiếm máy ảnh..." ' +
    'onkeypress="if(event.key===\'Enter\'){window.location.href=\'' + base + 'pages/products.html?q=\'+this.value;}">' +
    '<button class="mobile-search-btn" aria-label="Tìm kiếm" ' +
    'onclick="window.location.href=\'' + base + 'pages/products.html?q=\'+document.getElementById(\'mobile-nav-q\').value;">' +
    '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
    '</button></div></div>' +

    '<nav class="mobile-nav-links" aria-label="Điều hướng chính">' +
    '<div class="mobile-nav-label">Menu</div>' +

    '<a href="' + base + 'index.html" class="mobile-nav-link" id="mnl-home">' +
    '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
    'Trang chủ</a>' +

    '<div>' +
    '<button class="mobile-nav-link mobile-nav-submenu-toggle" id="mnl-products-toggle" ' +
    'onclick="toggleMobileSubmenu(\'mobile-products-sub\')" ' +
    'style="width:100%;text-align:left;background:none;border:1px solid transparent;border-radius:var(--r-sm);padding:12px 14px;color:var(--text-300);font-size:0.9rem;font-weight:500;cursor:pointer;transition:all var(--dur-fast);display:flex;align-items:center;gap:12px;">' +
    '<svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
    '<span style="flex:1;">Sản phẩm</span>' +
    '<svg class="toggle-arrow" viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;"><polyline points="6 9 12 15 18 9"/></svg>' +
    '</button>' +
    '<div class="mobile-nav-submenu" id="mobile-products-sub">' +
    '<a href="' + base + 'pages/products.html" class="mobile-nav-link" style="font-size:0.85rem;padding:10px 14px;">' +
    '<svg viewBox="0 0 24 24" style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' +
    'Tất cả sản phẩm</a>' +
    '<a href="' + base + 'pages/products.html?cat=mirrorless" class="mobile-nav-link" style="font-size:0.85rem;padding:10px 14px;">' +
    '<svg viewBox="0 0 24 24" style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
    'Mirrorless</a>' +
    '<a href="' + base + 'pages/products.html?cat=dslr" class="mobile-nav-link" style="font-size:0.85rem;padding:10px 14px;">' +
    '<svg viewBox="0 0 24 24" style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="12" cy="14" r="3"/></svg>' +
    'DSLR</a>' +
    '<a href="' + base + 'pages/products.html?cat=lens" class="mobile-nav-link" style="font-size:0.85rem;padding:10px 14px;">' +
    '<svg viewBox="0 0 24 24" style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' +
    'Ống kính</a>' +
    '<a href="' + base + 'pages/products.html?cat=compact" class="mobile-nav-link" style="font-size:0.85rem;padding:10px 14px;">' +
    '<svg viewBox="0 0 24 24" style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;"><rect x="1" y="6" width="22" height="15" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M8 6l1-2h6l1 2"/></svg>' +
    'Compact</a></div></div>' +

    '<a href="' + base + 'pages/compare.html" class="mobile-nav-link" id="mnl-compare">' +
    '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' +
    'So sánh</a>' +

    '<a href="' + base + 'pages/contact.html" class="mobile-nav-link" id="mnl-contact">' +
    '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.91z"/></svg>' +
    'Liên hệ</a>' +
    '</nav>' +

    '<div class="mobile-nav-footer" id="mobile-nav-footer">' +
    '<button class="btn btn-primary" style="justify-content:center;" id="mobile-btn-login" ' +
    'onclick="closeMobileNav();setTimeout(function(){openModal(\'auth-modal\');},200);">' +
    '<svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
    'Đăng nhập / Đăng ký</button>' +
    '<a href="' + base + 'pages/account.html" class="btn btn-secondary" style="justify-content:center;display:none;" id="mobile-btn-account">' +
    '<svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
    'Tài khoản của tôi</a>' +
    '<button class="btn btn-secondary" style="justify-content:center;display:none;border-color:rgba(239,68,68,0.3);color:var(--red-400);" id="mobile-btn-logout" onclick="logout();closeMobileNav();">' +
    'Đăng xuất</button></div></div>';

    document.body.insertAdjacentHTML('beforeend', drawerHTML);
    setActiveNavLink(base);
    syncMobileAuthState();
  }

  // ============================================
  // OPEN / CLOSE
  // ============================================
  window.openMobileNav = function() {
    var overlay = document.getElementById('mobile-nav-overlay');
    var drawer  = document.getElementById('mobile-nav-drawer');
    var ham     = document.querySelector('.hamburger');
    if (!overlay || !drawer) return;
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    if(document.getElementById('pv-chatbot-toggle')) document.getElementById('pv-chatbot-toggle').style.display = 'none';
    if (ham) { ham.classList.add('open'); ham.setAttribute('aria-expanded', 'true'); }
    setTimeout(function() {
      var close = drawer.querySelector('.mobile-nav-close');
      if (close) close.focus();
    }, 300);
  };

  window.closeMobileNav = function() {
    var overlay = document.getElementById('mobile-nav-overlay');
    var drawer  = document.getElementById('mobile-nav-drawer');
    if (!overlay || !drawer) return;
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    if(document.getElementById('pv-chatbot-toggle')) document.getElementById('pv-chatbot-toggle').style.display = 'flex';
    var ham = document.querySelector('.hamburger');
    if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); ham.focus(); }
  };

  // ============================================
  // SUBMENU TOGGLE
  // ============================================
  window.toggleMobileSubmenu = function(id) {
    var sub = document.getElementById(id);
    if (!sub) return;
    var isOpen = sub.classList.contains('open');
    document.querySelectorAll('.mobile-nav-submenu').forEach(function(el) { el.classList.remove('open'); });
    document.querySelectorAll('.mobile-nav-submenu-toggle').forEach(function(t) { t.classList.remove('open'); });
    if (!isOpen) {
      sub.classList.add('open');
      var triggers = document.querySelectorAll('[onclick*="' + id + '"]');
      triggers.forEach(function(t) { t.classList.add('open'); });
    }
  };

  // ============================================
  // HAMBURGER WIRE
  // ============================================
  function wireHamburger() {
    var ham = document.querySelector('.hamburger');
    if (!ham) return;
    ham.addEventListener('click', window.openMobileNav);
    ham.setAttribute('aria-label', 'Mo menu');
    ham.setAttribute('aria-expanded', 'false');
  }

  // ============================================
  // ACTIVE LINK
  // ============================================
  function setActiveNavLink(base) {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    var map = {
      'index.html':   'mnl-home',
      '':             'mnl-home',
      'products.html': null,
      'compare.html': 'mnl-compare',
      'contact.html': 'mnl-contact',
      'account.html': null,
      'checkout.html': null
    };
    var id = map[page];
    if (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('active');
    }
    if (page === 'products.html') {
      var sub = document.getElementById('mobile-products-sub');
      if (sub) sub.classList.add('open');
      var toggle = document.getElementById('mnl-products-toggle');
      if (toggle) toggle.classList.add('open');
    }
  }

  // ============================================
  // SYNC AUTH STATE
  // ============================================
  function syncMobileAuthState() {
    document.addEventListener('store:ready', updateMobileAuthButtons);
    document.addEventListener('auth:changed', updateMobileAuthButtons);
    setTimeout(updateMobileAuthButtons, 1000);
  }

  function updateMobileAuthButtons() {
    var loginBtn   = document.getElementById('mobile-btn-login');
    var accountBtn = document.getElementById('mobile-btn-account');
    var logoutBtn  = document.getElementById('mobile-btn-logout');
    var btnUser    = document.getElementById('btn-user');
    if (!loginBtn || !accountBtn || !logoutBtn) return;
    var loggedIn = btnUser && btnUser.style.display !== 'none';
    loginBtn.style.display   = loggedIn ? 'none' : 'flex';
    accountBtn.style.display = loggedIn ? 'flex' : 'none';
    logoutBtn.style.display  = loggedIn ? 'flex' : 'none';
    
    if (loggedIn) {
      var userName = 'Tài khoản của tôi';
      if (window.Store && window.Store.currentUser && window.Store.currentUser.name) {
        userName = window.Store.currentUser.name;
      } else if (document.getElementById('user-dropdown-name')) {
        userName = document.getElementById('user-dropdown-name').textContent;
      }
      accountBtn.innerHTML = '<svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;margin-right:6px;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' + userName;
    }
  }

  // ============================================
  // MOBILE FILTER PANEL
  // ============================================
  function injectFilterPanel() {
    var filterSidebar = document.querySelector('.filter-sidebar');
    if (!filterSidebar) return;
    var shopLayout = document.querySelector('.shop-layout');
    if (!shopLayout) return;

    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-filter-toggle';
    toggleBtn.id = 'mobile-filter-toggle-btn';
    toggleBtn.innerHTML = '<svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg> Bộ lọc sản phẩm';
    toggleBtn.onclick = window.openFilterPanel;
    shopLayout.parentNode.insertBefore(toggleBtn, shopLayout);

    var panelHTML =
      '<div class="filter-sidebar-mobile-overlay" id="filter-mobile-overlay" onclick="closeFilterPanel()"></div>' +
      '<div class="filter-sidebar-panel" id="filter-mobile-panel">' +
      '<div class="filter-panel-header">' +
      '<span class="filter-panel-title">Bộ lọc sản phẩm</span>' +
      '<button onclick="closeFilterPanel()" style="background:var(--bg-surface);border:1px solid var(--border-1);border-radius:var(--r-sm);width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-300);">' +
      '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button></div>' +
      '<div id="filter-panel-content" style="padding:16px 20px 100px;"></div></div>';
    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  window.openFilterPanel = function() {
    var sidebar = document.querySelector('.filter-sidebar');
    var panelContent = document.getElementById('filter-panel-content');
    if (sidebar && panelContent) {
      panelContent.innerHTML = sidebar.innerHTML;
    }
    var overlay = document.getElementById('filter-mobile-overlay');
    var panel   = document.getElementById('filter-mobile-panel');
    if (!overlay || !panel) return;
    overlay.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeFilterPanel = function() {
    var overlay = document.getElementById('filter-mobile-overlay');
    var panel   = document.getElementById('filter-mobile-panel');
    if (!overlay || !panel) return;
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  };

  // ============================================
  // KEYBOARD / ESC
  // ============================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeMobileNav();
      window.closeFilterPanel();
    }
  });

  // ============================================
  // SWIPE TO CLOSE (right-side drawer)
  // ============================================
  var touchStartX = 0;
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var deltaX = e.changedTouches[0].clientX - touchStartX;
    var drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer || !drawer.classList.contains('open')) return;
    if (deltaX > 60) window.closeMobileNav();
  }, { passive: true });

  // ============================================
  // CART BOTTOM SHEET CLOSE ON BACKDROP
  // ============================================
  function patchCartDrawer() {
    var overlay = document.querySelector('.cart-overlay');
    if (!overlay) return;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay && window.innerWidth <= 768) {
        if (typeof cartClose === 'function') cartClose();
      }
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    injectMobileNav();
    wireHamburger();
    patchCartDrawer();
    if (window.location.pathname.indexOf('products') !== -1) {
      setTimeout(injectFilterPanel, 700);
    }
    document.dispatchEvent(new CustomEvent('mobile:ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
