const fs = require('fs');

let adminHtml = fs.readFileSync('admin/index.html', 'utf8');

// Replace table header
const oldHeader = `<thead><tr><th>ID</th><th>Khách hàng</th><th>Số điện thoại</th><th>Ngày mua đầu</th><th>Tổng chi tiêu</th><th>Hạng thành viên</th><th>Số đơn</th></tr></thead>`;
const newHeader = `<thead><tr><th>ID</th><th>Khách hàng</th><th>Email</th><th>Số điện thoại</th><th>Tổng chi tiêu</th><th>Hạng thành viên</th><th>Số đơn</th></tr></thead>`;
adminHtml = adminHtml.replace(oldHeader, newHeader);

// Replace renderCustomers function
const searchRender = `function renderCustomers() {
  const customerMap = {};
  Store.orders.forEach(o => {
    // We group by phone if available, else by customer name
    const key = (o.address && o.address.phone) ? o.address.phone : o.customer;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.customer,
        phone: (o.address && o.address.phone) ? o.address.phone : 'N/A',
        totalSpent: 0,
        orderCount: 0,
        firstOrder: o.date || ''
      };
    }
    if (o.status !== 'cancelled') {
       customerMap[key].totalSpent += o.total;
    }
    customerMap[key].orderCount += 1;
    if (o.date && (!customerMap[key].firstOrder || o.date < customerMap[key].firstOrder)) {
       customerMap[key].firstOrder = o.date;
    }
  });

  const customers = Object.values(customerMap).sort((a,b) => b.totalSpent - a.totalSpent);

  document.getElementById('customers-body').innerHTML = customers.map((c, idx) => {
    let tier = 'Thành viên';
    let tierClass = 'status-confirmed'; // default (greenish)
    if (c.totalSpent >= 1000000000) { tier = 'Kim cương'; tierClass = 'status-processing'; }
    else if (c.totalSpent >= 500000000) { tier = 'Vàng'; tierClass = 'status-pending'; }
    else if (c.totalSpent >= 100000000) { tier = 'Bạc'; tierClass = 'status-completed'; }

    return \`
    <tr>
      <td style="color:var(--text-400);">CUS-\${String(idx + 1).padStart(4,'0')}</td>
      <td style="font-weight:600; color:var(--text-100);">\${c.name}</td>
      <td>\${c.phone}</td>
      <td style="font-size:0.85rem; color:var(--text-400);">\${c.firstOrder.split(' ')[0] || 'N/A'}</td>
      <td style="font-weight:700; color:var(--gold-400);">\${formatPrice(c.totalSpent)}</td>
      <td><span class="order-status \${tierClass}">\${tier}</span></td>
      <td>\${c.orderCount} đơn</td>
    </tr>\`;
  }).join('');
}`;

const replaceRender = `async function renderCustomers() {
  if (!window.supabaseClient) return;
  const { data: profiles, error } = await window.supabaseClient.from('profiles').select('*').order('total_spent', { ascending: false, nullsFirst: false });
  if (error) { console.error('Error fetching customers:', error); return; }

  document.getElementById('customers-body').innerHTML = profiles.map((c, idx) => {
    let tier = 'Thành viên';
    let tierClass = 'status-confirmed'; // default (greenish)
    const spent = c.total_spent || 0;
    if (spent >= 1000000000) { tier = 'Kim cương'; tierClass = 'status-processing'; }
    else if (spent >= 500000000) { tier = 'Vàng'; tierClass = 'status-pending'; }
    else if (spent >= 100000000) { tier = 'Bạc'; tierClass = 'status-completed'; }

    return \`
    <tr>
      <td style="color:var(--text-400);">CUS-\${String(idx + 1).padStart(4,'0')}</td>
      <td style="font-weight:600; color:var(--text-100);">\${c.name || 'N/A'}</td>
      <td>\${c.email || 'N/A'}</td>
      <td>\${c.phone || 'N/A'}</td>
      <td style="font-weight:700; color:var(--gold-400);">\${formatPrice(spent)}</td>
      <td><span class="order-status \${tierClass}">\${tier}</span></td>
      <td>\${c.order_count || 0} đơn</td>
    </tr>\`;
  }).join('');
}`;

adminHtml = adminHtml.replace(searchRender, replaceRender);

// Also update updateOrderStatus to increment/decrement order_count
const adminUpdateSearch = `        if (profile) {
          const newTotal = (profile.total_spent || 0) + updated.total;
          await window.supabaseClient.from('profiles').update({ total_spent: newTotal }).eq('id', updated.userId);
        }
      } else if (oldStatus === 'completed' && status !== 'completed') {
        const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', updated.userId).single();
        if (profile) {
          const newTotal = Math.max(0, (profile.total_spent || 0) - updated.total);
          await window.supabaseClient.from('profiles').update({ total_spent: newTotal }).eq('id', updated.userId);
        }`;

const adminUpdateReplace = `        if (profile) {
          const newTotal = (profile.total_spent || 0) + updated.total;
          const newCount = (profile.order_count || 0) + 1;
          await window.supabaseClient.from('profiles').update({ total_spent: newTotal, order_count: newCount }).eq('id', updated.userId);
        }
      } else if (oldStatus === 'completed' && status !== 'completed') {
        const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent, order_count').eq('id', updated.userId).single();
        if (profile) {
          const newTotal = Math.max(0, (profile.total_spent || 0) - updated.total);
          const newCount = Math.max(0, (profile.order_count || 0) - 1);
          await window.supabaseClient.from('profiles').update({ total_spent: newTotal, order_count: newCount }).eq('id', updated.userId);
        }`;

adminHtml = adminHtml.replace(adminUpdateSearch, adminUpdateReplace);
fs.writeFileSync('admin/index.html', adminHtml, 'utf8');

// Now in assets/js/main.js, when user logs in, we need to save their email to profiles
let mainHtml = fs.readFileSync('assets/js/main.js', 'utf8');
const handleSessionSearch = `if (!profile) {
      // Create profile
      const { data: newProfile } = await window.supabaseClient.from('profiles').insert([{ id: user.id, name: user.user_metadata.name || user.email.split('@')[0], total_spent: 0 }]).select().single();
      profile = newProfile;
    }`;

const handleSessionReplace = `if (!profile) {
      // Create profile
      const { data: newProfile } = await window.supabaseClient.from('profiles').insert([{ id: user.id, name: user.user_metadata.name || user.email.split('@')[0], total_spent: 0, email: user.email, order_count: 0 }]).select().single();
      profile = newProfile;
    } else if (!profile.email) {
      // Backfill email
      await window.supabaseClient.from('profiles').update({ email: user.email }).eq('id', user.id);
      profile.email = user.email;
    }`;

mainHtml = mainHtml.replace(handleSessionSearch, handleSessionReplace);
fs.writeFileSync('assets/js/main.js', mainHtml, 'utf8');

console.log('Fixed customers tracking');
