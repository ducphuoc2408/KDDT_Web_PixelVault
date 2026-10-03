const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

// Replace the table with a div for cards and the select with tabs
const searchHtml = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
            <h2 style="font-size:1.25rem; font-family:'Outfit',sans-serif; color:var(--text-100); margin:0;">Lịch sử đơn hàng</h2>
            <select id="order-filter" class="form-input" style="width:200px;" onchange="filterOrders()">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Hoàn tất</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div class="data-table-wrap" style="margin:0; border:none; padding:0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody id="user-orders-list"></tbody>
            </table>
          </div>`;

const replaceHtml = `<style>
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
          <div id="user-orders-list" style="display:flex; flex-direction:column; gap:16px;"></div>`;

html = html.replace(searchHtml, replaceHtml);

// Now patch the JavaScript functions
const jsSearch = `function filterOrders() {
  const filter = document.getElementById('order-filter').value;
  const filtered = filter === 'all' ? _myOrdersCache : _myOrdersCache.filter(o => o.status === filter);
  _renderOrders(filtered);
}`;

const jsReplace = `let _currentFilter = 'all';
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

html = html.replace(jsSearch, jsReplace);

// Rewrite _renderOrders
const renderSearch = `function _renderOrders(myOrders) {
  const tbody = document.getElementById('user-orders-list');`;

// I will just replace the whole body of _renderOrders using regex
const regexRender = /function _renderOrders\(myOrders\) \{[\s\S]*?\}\n(?=function renderWishlist)/;

const newRender = `function _renderOrders(myOrders) {
  const container = document.getElementById('user-orders-list');
  const statusMap = {
    pending:    ['status-pending',    'Chờ xác nhận'],
    confirmed:  ['status-confirmed',  'Đã xác nhận'],
    processing: ['status-processing', 'Đang xử lý'],
    shipping:   ['status-shipping',   'Đang giao'],
    completed:  ['status-completed',  'Hoàn tất'],
    cancelled:  ['status-cancelled',  'Đã hủy'],
  };

  const steps = ['pending', 'confirmed', 'processing', 'shipping', 'completed'];

  if (myOrders.length === 0) {
    container.innerHTML = \`<div style="text-align:center; padding:60px 20px; background:var(--bg-secondary); border-radius:var(--r-md); border:1px dashed var(--border-1); color:var(--text-400);">Chưa có đơn hàng nào.</div>\`;
    return;
  }

  container.innerHTML = myOrders.map(o => {
    const [cls, label] = statusMap[o.status] || [];
    const reviewBtn = (o.status === 'completed' && o.items && o.items.length > 0)
      ? \`<a href="product-detail.html?id=\${o.items[0].id}#tab-reviews" class="btn btn-primary" style="padding:8px 20px;">Đánh giá</a>\`
      : '';
      
    // Shopee-style step progress
    let trackingHtml = '';
    if (o.status !== 'cancelled') {
      const currentStepIdx = steps.indexOf(o.status);
      trackingHtml = \`<div style="display:flex; justify-content:space-between; position:relative; margin-top:20px; padding:0 20px;">
        <div style="position:absolute; top:8px; left:30px; right:30px; height:2px; background:var(--border-1); z-index:0;"></div>
        \`;
      steps.forEach((st, idx) => {
        const isPast = idx <= currentStepIdx;
        const color = isPast ? 'var(--green-400)' : 'var(--text-400)';
        const bg = isPast ? 'var(--green-400)' : 'var(--bg-secondary)';
        trackingHtml += \`<div style="display:flex; flex-direction:column; align-items:center; gap:6px; position:relative; z-index:1; width:60px;">
           <div style="width:18px; height:18px; border-radius:50%; background:\${bg}; border:2px solid \${isPast ? 'var(--bg-primary)' : 'var(--border-1)'}; box-shadow:0 0 0 2px \${isPast ? color : 'transparent'};"></div>
           <div style="font-size:0.7rem; color:\${color}; text-align:center; font-weight:600; white-space:nowrap;">\${statusMap[st][1]}</div>
        </div>\`;
      });
      
      // Draw active line
      if (currentStepIdx > 0) {
        const pct = (currentStepIdx / (steps.length - 1)) * 100;
        trackingHtml += \`<div style="position:absolute; top:8px; left:30px; height:2px; width:calc(\${pct}% - 60px); background:var(--green-400); z-index:0;"></div>\`;
      }
      
      trackingHtml += \`</div>\`;
    }

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
      <div style="padding:20px; border-bottom:1px solid var(--border-1); display:flex; justify-content:space-between; align-items:center;">
        <div>
           <div style="font-weight:700; color:var(--gold-400); font-size:1.1rem;">\${o.id}</div>
           <div style="font-size:0.85rem; color:var(--text-400); margin-top:4px;">Đặt ngày: \${o.date}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--text-400); text-transform:uppercase; font-size:0.8rem; font-weight:600;">Trạng thái:</span>
          <span class="order-status \${cls}" style="font-size:0.9rem; padding:6px 14px;">\${label}</span>
        </div>
      </div>
      
      <div style="padding:0 20px 20px 20px;">
        \${trackingHtml}
        \${itemsHtml}
      </div>
      
      <div style="background:var(--bg-secondary); padding:20px; border-top:1px solid var(--border-1); display:flex; justify-content:flex-end; align-items:center; gap:24px;">
        <div style="display:flex; align-items:center; gap:12px;">
           <span style="color:var(--text-200); font-size:0.95rem;">Thành tiền:</span>
           <span style="font-size:1.4rem; font-weight:800; color:var(--red-400);">\${formatPrice(o.total)}</span>
        </div>
        \${reviewBtn}
      </div>
    </div>\`;
  }).join('');
}
`;

html = html.replace(regexRender, newRender);
fs.writeFileSync('pages/account.html', html, 'utf8');

console.log('Fixed shopee layout');
