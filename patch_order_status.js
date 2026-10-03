const fs = require('fs');
let html = fs.readFileSync('pages/checkout.html', 'utf8');

const searchCode = `    // Always update total_spent
    const newTotalSpent = (Store.currentUser._totalSpent || 0) + total;
    updates.total_spent = newTotalSpent;
    Store.currentUser._totalSpent = newTotalSpent;
    needsUpdate = true;`;
    
const removeCode = `    // Removed eager total_spent update since it should only happen when order is completed`;

html = html.replace(searchCode, removeCode);
fs.writeFileSync('pages/checkout.html', html, 'utf8');

let adminHtml = fs.readFileSync('admin/index.html', 'utf8');
const adminUpdateSearch = `async function updateOrderStatus(id, status) {
  const labels = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', processing:'Đang xử lý', shipping:'Đang giao', completed:'Hoàn tất', cancelled:'Đã hủy' };
  const updated = await window.SupabaseDB.updateOrderStatus(id, status);
  if (updated) {
    const idx = Store.orders.findIndex(x => x.id === id);
    if (idx >= 0) Store.orders[idx] = updated;
    showToast(\`Đơn \${id}: \${labels[status]}\`, 'success');`;

const adminUpdateReplace = `async function updateOrderStatus(id, status) {
  const labels = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', processing:'Đang xử lý', shipping:'Đang giao', completed:'Hoàn tất', cancelled:'Đã hủy' };
  
  const oldOrder = Store.orders.find(x => x.id === id);
  const oldStatus = oldOrder ? oldOrder.status : '';

  const updated = await window.SupabaseDB.updateOrderStatus(id, status);
  if (updated) {
    const idx = Store.orders.findIndex(x => x.id === id);
    if (idx >= 0) Store.orders[idx] = updated;
    showToast(\`Đơn \${id}: \${labels[status]}\`, 'success');
    
    if (updated.userId && window.supabaseClient) {
      if (status === 'completed' && oldStatus !== 'completed') {
        const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', updated.userId).single();
        if (profile) {
          const newTotal = (profile.total_spent || 0) + updated.total;
          await window.supabaseClient.from('profiles').update({ total_spent: newTotal }).eq('id', updated.userId);
        }
      } else if (oldStatus === 'completed' && status !== 'completed') {
        const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', updated.userId).single();
        if (profile) {
          const newTotal = Math.max(0, (profile.total_spent || 0) - updated.total);
          await window.supabaseClient.from('profiles').update({ total_spent: newTotal }).eq('id', updated.userId);
        }
      }
    }`;

adminHtml = adminHtml.replace(adminUpdateSearch, adminUpdateReplace);
fs.writeFileSync('admin/index.html', adminHtml, 'utf8');
console.log('Fixed completion update');
