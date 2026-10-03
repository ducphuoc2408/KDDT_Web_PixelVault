const fs = require('fs');

// Patch checkout.html
let checkoutHtml = fs.readFileSync('pages/checkout.html', 'utf8');

const oldCheckoutShipping = `const shipping = (subtotal - discountAmt - memberDiscountAmt) >= 50000000 ? 0 : 30000;`;
const newCheckoutShipping = `const shipping = subtotal >= 50000000 ? 0 : 30000;`;
checkoutHtml = checkoutHtml.replace(oldCheckoutShipping, newCheckoutShipping);

const oldProcessEnd = `    address: {
      address: document.getElementById('co-address')?.value || '',
      phone:   document.getElementById('co-phone')?.value   || '',
      email:   document.getElementById('co-email')?.value   || '',
      note:    document.getElementById('co-note')?.value    || '',
    },
  });`;

const newProcessEnd = `    address: {
      address: document.getElementById('co-address')?.value || '',
      phone:   document.getElementById('co-phone')?.value   || '',
      email:   document.getElementById('co-email')?.value   || '',
      note:    document.getElementById('co-note')?.value    || '',
    },
  });

  if (newOrder && Store.currentUser && Store.currentUser.id) {
    const cPhone = document.getElementById('co-phone')?.value;
    const cAddress = document.getElementById('co-address')?.value;
    if ((!Store.currentUser.phone && cPhone) || (!Store.currentUser.address && cAddress)) {
      const updates = {};
      if (!Store.currentUser.phone && cPhone) {
        updates.phone = cPhone;
        Store.currentUser.phone = cPhone;
      }
      if (!Store.currentUser.address && cAddress) {
        updates.address = cAddress;
        Store.currentUser.address = cAddress;
      }
      localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));
      if (window.SupabaseDB && window.SupabaseDB.updateProfile) {
        window.SupabaseDB.updateProfile(Store.currentUser.id, updates);
      } else if (window.supabaseClient) {
        window.supabaseClient.from('profiles').update(updates).eq('id', Store.currentUser.id);
      }
    }
  }`;

checkoutHtml = checkoutHtml.replace(oldProcessEnd, newProcessEnd);
fs.writeFileSync('pages/checkout.html', checkoutHtml, 'utf8');


// Patch account.html
let accountHtml = fs.readFileSync('pages/account.html', 'utf8');

const loadOld = `  document.getElementById('pf-name').value = u.name;
  document.getElementById('pf-email').value = u.email;
});`;

const loadNew = `  document.getElementById('pf-name').value = u.name || '';
  document.getElementById('pf-email').value = u.email || '';
  if (document.getElementById('pf-phone')) document.getElementById('pf-phone').value = u.phone || '';
  if (document.getElementById('pf-address')) document.getElementById('pf-address').value = u.address || '';
});`;

accountHtml = accountHtml.replace(loadOld, loadNew);

const oldSaveProfile = `function saveProfile(e) {
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
  alert('Cập nhật thông tin thành công!');
}`;

// Note that in account.html `saveProfile` might be async or not, we should just use regex
const saveRegex = /(async\s+)?function\s+saveProfile\(e\)\s*\{[\s\S]*?\n\}/;

const newSave = `async function saveProfile(e) {
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

accountHtml = accountHtml.replace(saveRegex, newSave);

fs.writeFileSync('pages/account.html', accountHtml, 'utf8');
console.log('Fixed save and first order updates');
