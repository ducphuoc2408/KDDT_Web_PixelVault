const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

const oldTabOrders = html.substring(
  html.indexOf('<div id="tab-orders"'),
  html.indexOf('</div>', html.indexOf('</table>')) + 6
);

const newTabOrders = `<div id="tab-orders" style="display:none; background:var(--bg-card); border:1px solid var(--border-1); border-radius:var(--r-lg); padding:32px;">
          <style>
            .order-tabs { display:flex; gap:20px; border-bottom:1px solid var(--border-1); overflow-x:auto; margin-bottom:20px; }
            .order-tab { padding:10px 4px; font-weight:600; font-size:0.9rem; color:var(--text-400); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:all 0.2s; }
            .order-tab:hover { color:var(--text-200); }
            .order-tab.active { color:var(--gold-400); border-bottom-color:var(--gold-400); }
          </style>
          <div style="margin-bottom:24px;">
            <h2 style="font-size:1.25rem; font-family:'Outfit',sans-serif; color:var(--text-100); margin-bottom:16px;">Lịch sử đơn hàng</h2>
            <div class="order-tabs">
              <div class="order-tab active" data-status="all" onclick="setOrderTab('all')">Tất cả</div>
              <div class="order-tab" data-status="pending" onclick="setOrderTab('pending')">Chờ xác nhận</div>
              <div class="order-tab" data-status="confirmed" onclick="setOrderTab('confirmed')">Đã xác nhận</div>
              <div class="order-tab" data-status="processing" onclick="setOrderTab('processing')">Đang xử lý</div>
              <div class="order-tab" data-status="shipping" onclick="setOrderTab('shipping')">Đang giao</div>
              <div class="order-tab" data-status="completed" onclick="setOrderTab('completed')">Hoàn tất</div>
              <div class="order-tab" data-status="cancelled" onclick="setOrderTab('cancelled')">Đã hủy</div>
            </div>
          </div>
          <div id="user-orders-list" style="display:flex; flex-direction:column; gap:16px;"></div>
        </div>`;

if (html.includes(oldTabOrders)) {
    html = html.replace(oldTabOrders, newTabOrders);
} else {
    console.log('Failed to replace tab-orders HTML');
}

// JS logic
const oldFilterJS = html.substring(
  html.indexOf('function filterOrders() {'),
  html.indexOf('}', html.indexOf('function filterOrders() {')) + 1
);

const newFilterJS = `let _currentFilter = 'all';
function setOrderTab(status) {
  _currentFilter = status;
  document.querySelectorAll('.order-tab').forEach(el => {
    if (el.getAttribute('data-status') === status) el.classList.add('active');
    else el.classList.remove('active');
  });
  filterOrders();
}

function filterOrders() {
  const filtered = _currentFilter === 'all' ? _myOrdersCache : _myOrdersCache.filter(o => o.status === _currentFilter);
  _renderOrders(filtered);
}`;

if (html.includes(oldFilterJS)) {
    html = html.replace(oldFilterJS, newFilterJS);
} else {
    console.log('Failed to replace filter JS');
}

const oldRenderJS = html.substring(
  html.indexOf('function _renderOrders(myOrders) {'),
  html.indexOf('function renderWishlist()')
);

const newRenderJS = `function _renderOrders(myOrders) {
  const container = document.getElementById('user-orders-list');
  const statusMap = {
    pending:    ['status-pending',    'CHỜ XÁC NHẬN'],
    confirmed:  ['status-confirmed',  'ĐÃ XÁC NHẬN'],
    processing: ['status-processing', 'ĐANG XỬ LÝ'],
    shipping:   ['status-shipping',   'ĐANG GIAO'],
    completed:  ['status-completed',  'HOÀN TẤT'],
    cancelled:  ['status-cancelled',  'ĐÃ HỦY'],
  };

  if (myOrders.length === 0) {
    container.innerHTML = \`<div style="text-align:center; padding:60px 20px; background:var(--bg-secondary); border-radius:var(--r-md); border:1px dashed var(--border-1); color:var(--text-400);">Chưa có đơn hàng nào.</div>\`;
    return;
  }

  container.innerHTML = myOrders.map(o => {
    const [cls, label] = statusMap[o.status] || [];
    const reviewBtn = (o.status === 'completed' && o.items && o.items.length > 0)
      ? \`<a href="product-detail.html?id=\${o.items[0].id}#tab-reviews" class="btn btn-primary" style="padding:8px 20px;">Đánh giá</a>\`
      : '';

    // Render items
    let itemsHtml = '';
    if (o.items && o.items.length > 0) {
      itemsHtml = o.items.map(item => {
        const prod = Store.products.find(p => p.id === item.id) || {};
        const img = prod.images && prod.images[0] ? prod.images[0] : '../assets/images/placeholder.jpg';
        return \`<div style="display:flex; gap:16px; margin-top:16px; padding-top:16px; border-top:1px dashed var(--border-1);">
          <div style="width:80px; height:80px; border-radius:var(--r-sm); background:var(--bg-secondary); overflow:hidden; border:1px solid var(--border-1);">
             <img src="\${img}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='../assets/images/placeholder.jpg'">
          </div>
          <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
             <div style="font-weight:600; font-size:1.05rem; color:var(--text-100); margin-bottom:4px;">\${item.name}</div>
             <div style="color:var(--text-400); font-size:0.9rem;">x\${item.qty}</div>
          </div>
          <div style="display:flex; align-items:center; font-weight:700; color:var(--gold-400); font-size:1.1rem;">
             \${formatPrice(item.price || 0)}
          </div>
        </div>\`;
      }).join('');
    } else {
      itemsHtml = \`<div style="margin-top:16px; padding-top:16px; border-top:1px dashed var(--border-1); font-weight:500;">\${o.product}</div>\`;
    }

    return \`<div style="background:var(--bg-primary); border:1px solid var(--border-1); border-radius:var(--r-md); overflow:hidden;">
      <div style="padding:16px 20px; border-bottom:1px solid var(--border-1); display:flex; justify-content:space-between; align-items:center;">
        <div>
           <div style="font-weight:700; color:var(--text-100); font-size:1.0rem;">\${o.id}</div>
           <div style="font-size:0.85rem; color:var(--text-400); margin-top:2px;">Ngày đặt: \${o.date}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--red-400); text-transform:uppercase; font-size:0.9rem; font-weight:700;">\${label}</span>
        </div>
      </div>
      
      <div style="padding:0 20px 16px 20px;">
        \${itemsHtml}
      </div>
      
      <div style="background:var(--bg-secondary); padding:16px 20px; border-top:1px solid var(--border-1); display:flex; justify-content:flex-end; align-items:center; gap:24px;">
        <div style="display:flex; align-items:center; gap:12px;">
           <span style="color:var(--text-200); font-size:0.95rem;">Thành tiền:</span>
           <span style="font-size:1.3rem; font-weight:800; color:var(--red-400);">\${formatPrice(o.total)}</span>
        </div>
        \${reviewBtn}
      </div>
    </div>\`;
  }).join('');
}
`;

if (html.includes(oldRenderJS)) {
    html = html.replace(oldRenderJS, newRenderJS);
    fs.writeFileSync('pages/account.html', html, 'utf8');
    console.log('Successfully replaced all!');
} else {
    console.log('Failed to replace render JS');
}
