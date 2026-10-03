const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

const startIdx = html.indexOf('function renderUserOrders(myOrders) {');
const endIdx = html.indexOf('function renderWishlist() {');

if (startIdx !== -1 && endIdx !== -1) {
  const oldCode = html.substring(startIdx, endIdx);
  const newCode = `let _myOrdersCache = [];
let _currentFilter = 'all';

function setOrderTab(status) {
  _currentFilter = status;
  document.querySelectorAll('.order-tab').forEach(el => {
    if (el.getAttribute('data-status') === status) el.classList.add('active');
    else el.classList.remove('active');
  });
  filterOrders();
}

function updateOrderBadges() {
  const counts = { all: _myOrdersCache.length, pending: 0, confirmed: 0, processing: 0, shipping: 0, completed: 0, cancelled: 0 };
  _myOrdersCache.forEach(o => {
    if (counts[o.status] !== undefined) counts[o.status]++;
  });
  
  Object.keys(counts).forEach(k => {
    const b = document.getElementById('badge-' + k);
    if (b) {
      if (counts[k] > 0 && k !== 'all' && k !== 'completed') { 
        b.textContent = counts[k];
        b.style.display = 'inline-block';
      } else {
        b.style.display = 'none';
      }
    }
  });
}

function filterOrders() {
  const filtered = _currentFilter === 'all' ? _myOrdersCache : _myOrdersCache.filter(o => o.status === _currentFilter);
  
  const container = document.getElementById('user-orders-list');
  const statusMap = {
    pending:    ['status-pending',    'CHỜ XÁC NHẬN'],
    confirmed:  ['status-confirmed',  'ĐÃ XÁC NHẬN'],
    processing: ['status-processing', 'ĐANG XỬ LÝ'],
    shipping:   ['status-shipping',   'ĐANG GIAO'],
    completed:  ['status-completed',  'HOÀN TẤT'],
    cancelled:  ['status-cancelled',  'ĐÃ HỦY'],
  };

  if (filtered.length === 0) {
    container.innerHTML = \`<div style="text-align:center; padding:60px 20px; background:var(--bg-secondary); border-radius:var(--r-md); border:1px dashed var(--border-1); color:var(--text-400);">Không có đơn hàng nào.</div>\`;
    return;
  }

  container.innerHTML = filtered.map(o => {
    const [cls, label] = statusMap[o.status] || [];
    const reviewBtn = (o.status === 'completed' && o.items && o.items.length > 0)
      ? \`<a href="product-detail.html?id=\${o.items[0].id}#tab-reviews" class="btn btn-primary" style="padding:8px 20px;">Đánh giá</a>\`
      : '';

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

function renderUserOrders(myOrders) {
  _myOrdersCache = myOrders;
  updateOrderBadges();
  filterOrders();
}

`;
  html = html.replace(oldCode, newCode);
  fs.writeFileSync('pages/account.html', html, 'utf8');
  console.log('Successfully replaced JS using indexOf');
} else {
  console.log('Failed to find start/end indices: ', startIdx, endIdx);
}
