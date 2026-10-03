const fs = require('fs');
let html = fs.readFileSync('pages/checkout.html', 'utf8');

const oldCode = `if (newOrder && Store.currentUser && Store.currentUser.id) {
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

const newCode = `if (newOrder && Store.currentUser && Store.currentUser.id) {
    const cPhone = document.getElementById('co-phone')?.value;
    const cAddress = document.getElementById('co-address')?.value;
    const updates = {};
    let needsUpdate = false;

    if (!Store.currentUser.phone && cPhone) {
      updates.phone = cPhone;
      Store.currentUser.phone = cPhone;
      needsUpdate = true;
    }
    if (!Store.currentUser.address && cAddress) {
      updates.address = cAddress;
      Store.currentUser.address = cAddress;
      needsUpdate = true;
    }

    // Always update total_spent
    const newTotalSpent = (Store.currentUser._totalSpent || 0) + total;
    updates.total_spent = newTotalSpent;
    Store.currentUser._totalSpent = newTotalSpent;
    needsUpdate = true;

    if (needsUpdate) {
      localStorage.setItem('pv_user', JSON.stringify(Store.currentUser));
      if (window.SupabaseDB && window.SupabaseDB.updateProfile) {
        window.SupabaseDB.updateProfile(Store.currentUser.id, updates);
      } else if (window.supabaseClient) {
        window.supabaseClient.from('profiles').update(updates).eq('id', Store.currentUser.id);
      }
    }
  }`;

html = html.replace(oldCode, newCode);
fs.writeFileSync('pages/checkout.html', html, 'utf8');
console.log('Fixed total_spent update on checkout');
