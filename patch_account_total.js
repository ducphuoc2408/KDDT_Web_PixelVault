const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

const searchCode = `  // Tính tổng chi tiêu (bỏ qua đơn bị hủy)
  const totalSpent = myOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);`;

const replaceCode = `  // Lấy tổng chi tiêu chính xác từ database
  let totalSpent = Store.currentUser._totalSpent || 0;
  if (window.supabaseClient) {
    const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', u.id).single();
    if (profile) {
      totalSpent = profile.total_spent || 0;
      Store.currentUser._totalSpent = totalSpent;
      localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));
    }
  }`;

html = html.replace(searchCode, replaceCode);
fs.writeFileSync('pages/account.html', html, 'utf8');
console.log('Fixed account totalSpent');
