const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

// Replace totalSpent calculation
const calcRegex = /\/\/ Tính tổng chi tiêu \(bỏ qua đơn bị hủy\)[\s\S]*?sum \+ o\.total : sum, 0\);/;
const replaceCalc = `// Lấy tổng chi tiêu chính xác từ database
  let totalSpent = 0;
  if (window.supabaseClient) {
    const { data: profile } = await window.supabaseClient.from('profiles').select('total_spent').eq('id', u.id).single();
    if (profile) totalSpent = profile.total_spent || 0;
  }`;
html = html.replace(calcRegex, replaceCalc);

// Replace saveProfile
const saveRegex = /async function saveProfile\(e\) \{[\s\S]*?showToast\('Đã cập nhật hồ sơ cá nhân', 'success'\);\n\}/;
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
html = html.replace(saveRegex, replaceSave);

fs.writeFileSync('pages/account.html', html, 'utf8');
console.log('Replaced correctly!');
