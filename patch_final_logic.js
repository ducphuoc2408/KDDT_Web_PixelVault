const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

const searchSpent = `  // Tính tổng chi tiêu (bỏ qua đơn bị hủy)
  const totalSpent = myOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);`;

const replaceSpent = `  // Tính tổng chi tiêu từ profile database
  let totalSpent = 0;
  if (window.supabaseClient) {
    const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', u.id).single();
    if (profile) totalSpent = profile.total_spent || 0;
  }`;

if (html.includes(searchSpent)) {
  html = html.replace(searchSpent, replaceSpent);
  console.log('Fixed totalSpent calculation');
} else {
  console.log('searchSpent not found');
}

const searchSave = `async function saveProfile(e) {
  e.preventDefault();
  const newName = document.getElementById('pf-name').value;
  Store.currentUser.name = newName;
  localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));

  // Cập nhật lên Supabase
  if (Store.currentUser.id) {
    await window.SupabaseDB.updateProfile(Store.currentUser.id, { name: newName });
  }

  document.getElementById('acc-name').textContent = newName;
  document.getElementById('acc-avatar').textContent = newName[0].toUpperCase();
  showToast('Đã cập nhật hồ sơ cá nhân', 'success');
}`;

const replaceSave = `async function saveProfile(e) {
  e.preventDefault();
  const newName = document.getElementById('pf-name').value;
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
  }
}`;

if (html.includes(searchSave)) {
  html = html.replace(searchSave, replaceSave);
  console.log('Fixed saveProfile');
} else {
  console.log('searchSave not found');
}

fs.writeFileSync('pages/account.html', html, 'utf8');
