const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

// 1. total_spent sync in DOMContentLoaded
const domContentLoadedSearch = `  let totalSpent = u._totalSpent || 0;`;
const domContentLoadedReplace = `  let totalSpent = u._totalSpent || 0;
  if (window.supabaseClient) {
    const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', u.id).single();
    if (profile) {
      totalSpent = profile.total_spent || 0;
      Store.currentUser._totalSpent = totalSpent;
      localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));
    }
  }`;
html = html.replace(domContentLoadedSearch, domContentLoadedReplace);

// 2. saveProfile fields
const saveProfileSearch = `  const newName = document.getElementById('pf-name').value;
  Store.currentUser.name = newName;
  localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));

  // Cập nhật lên Supabase
  if (Store.currentUser.id) {
    await window.SupabaseDB.updateProfile(Store.currentUser.id, { name: newName });
  }

  document.getElementById('acc-name').textContent = newName;
  document.getElementById('acc-avatar').textContent = newName[0].toUpperCase();
  showToast('Đã cập nhật hồ sơ cá nhân', 'success');`;

const saveProfileReplace = `  const newName = document.getElementById('pf-name').value;
  const newPhone = document.getElementById('pf-phone')?.value || '';
  const newAddress = document.getElementById('pf-address')?.value || '';
  
  Store.currentUser.name = newName;
  Store.currentUser.phone = newPhone;
  Store.currentUser.address = newAddress;
  localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));

  // Cập nhật lên Supabase
  if (Store.currentUser.id) {
    if (window.SupabaseDB && window.SupabaseDB.updateProfile) {
      await window.SupabaseDB.updateProfile(Store.currentUser.id, { name: newName, phone: newPhone, address: newAddress });
    } else if (window.supabaseClient) {
      await window.supabaseClient.from('profiles').update({ name: newName, phone: newPhone, address: newAddress }).eq('id', Store.currentUser.id);
    }
  }

  document.getElementById('acc-name').textContent = newName;
  document.getElementById('acc-avatar').textContent = newName[0].toUpperCase();
  
  if (typeof showToast === 'function') {
    showToast('Cập nhật thông tin thành công!', 'success');
  } else {
    alert('Cập nhật thông tin thành công!');
  }`;
html = html.replace(saveProfileSearch, saveProfileReplace);

// 3. Shopee UI
// Replace tab-orders HTML
const tabOrdersSearch = `<div id="tab-orders" style="display:none; background:var(--bg-card); border:1px solid var(--border-1); border-radius:var(--r-lg); padding:32px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
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
          </div>
        </div>`;

const tabOrdersReplace = `<div id="tab-orders" style="display:none; background:var(--bg-card); border:1px solid var(--border-1); border-radius:var(--r-lg); padding:32px;">
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
html = html.replace(tabOrdersSearch, tabOrdersReplace);

// JS logic filterOrders
const filterOrdersSearch = `function filterOrders() {
  const filter = document.getElementById('order-filter').value;
  const filtered = filter === 'all' ? _myOrdersCache : _myOrdersCache.filter(o => o.status === filter);
  _renderOrders(filtered);
}`;
const filterOrdersReplace = `let _currentFilter = 'all';
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
html = html.replace(filterOrdersSearch, filterOrdersReplace);

// JS logic _renderOrders
const renderOrdersSearch = `function _renderOrders(myOrders) {
  const tbody = document.getElementById('user-orders-list');
  const statusMap = {
    pending:    ['status-pending',    'Chờ xác nhận'],
    confirmed:  ['status-confirmed',  'Đã xác nhận'],
    processing: ['status-processing', 'Đang xử lý'],
    shipping:   ['status-shipping',   'Đang giao'],
    completed:  ['status-completed',  'Hoàn tất'],
    cancelled:  ['status-cancelled',  'Đã hủy'],
  };

  if (myOrders.length === 0) {
    tbody.innerHTML = \`<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-400);">Bạn chưa có đơn hàng nào.</td></tr>\`;
    return;
  }

  tbody.innerHTML = myOrders.map(o => {
    const [cls, label] = statusMap[o.status] || [];
    const reviewBtn = (o.status === 'completed' && o.items && o.items.length > 0)
      ? \`<a href="product-detail.html?id=\${o.items[0].id}#tab-reviews" class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:0.75rem; border-color:var(--gold-500); color:var(--gold-400);">Đánh giá</a>\`
      : '';
    return \`<tr>
      <td style="font-weight:700; color:var(--gold-400);">\${o.id}</td>
      <td style="font-size:0.875rem; color:var(--text-300);">\${o.date}</td>
      <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${o.product}</td>
      <td style="font-weight:700;">\${formatPrice(o.total)}</td>
      <td><span class="order-status \${cls}">\${label}</span></td>
      <td>\${reviewBtn}</td>
    </tr>\`;
  }).join('');
}`;

const renderOrdersReplace = `function _renderOrders(myOrders) {
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
}`;
html = html.replace(renderOrdersSearch, renderOrdersReplace);

fs.writeFileSync('pages/account.html', html, 'utf8');
console.log('Restored all fixes!');
