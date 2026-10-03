const fs = require('fs');

let checkoutHtml = fs.readFileSync('pages/checkout.html', 'utf8');

const oldCode = `    address: {
      address: document.getElementById('co-address')?.value || '',
      phone:   document.getElementById('co-phone')?.value   || '',
      email:   document.getElementById('co-email')?.value   || '',
      note:    document.getElementById('co-note')?.value    || '',
    },
  });`;

const newCode = `    address: {
      address: document.getElementById('co-address')?.value || '',
      phone:   document.getElementById('co-phone')?.value   || '',
      email:   document.getElementById('co-email')?.value   || '',
      note:    document.getElementById('co-note')?.value    || '',
    },
  });

  // Track member discount as coupon usage if they exist in DB
  if (memberDiscountAmt > 0 && window.supabaseClient) {
    let mCode = '';
    if (memberPct2 === 0.10) mCode = 'TVKIMCUONG';
    else if (memberPct2 === 0.05) mCode = 'TVVANG';
    else if (memberPct2 === 0.02) mCode = 'TVBAC';

    if (mCode) {
      const { data: mCoupon } = await window.supabaseClient.from('coupons').select('uses, total_saved').eq('code', mCode).single();
      if (mCoupon) {
        await window.supabaseClient.from('coupons').update({
          uses: (mCoupon.uses || 0) + 1,
          total_saved: (mCoupon.total_saved || 0) + memberDiscountAmt
        }).eq('code', mCode);
      }
    }
  }

  // Track normal coupon usage if applied
  if (discountAmt > 0 && appliedCode && window.supabaseClient) {
    const { data: cCoupon } = await window.supabaseClient.from('coupons').select('uses, total_saved').eq('code', appliedCode).single();
    if (cCoupon) {
      await window.supabaseClient.from('coupons').update({
        uses: (cCoupon.uses || 0) + 1,
        total_saved: (cCoupon.total_saved || 0) + discountAmt
      }).eq('code', appliedCode);
    }
  }`;

checkoutHtml = checkoutHtml.replace(oldCode, newCode);
fs.writeFileSync('pages/checkout.html', checkoutHtml, 'utf8');

// Update admin/index.html to display total_saved
let adminHtml = fs.readFileSync('admin/index.html', 'utf8');
const adminOld = `<td style="font-weight:700; color:var(--red-400);">\${c.discount_pct}%</td>
      <td>\${c.description}</td>
      <td>\${expiresHtml}</td>
      <td>\${usesHtml}</td>
      <td>`;
const adminNew = `<td style="font-weight:700; color:var(--red-400);">\${c.discount_pct}%</td>
      <td>\${c.description}</td>
      <td>\${expiresHtml}</td>
      <td>\${usesHtml}</td>
      <td style="color:var(--gold-400); font-weight:600;">\${c.total_saved ? formatPrice(c.total_saved) : '0đ'}</td>
      <td>`;
if(adminHtml.includes(adminOld)) {
   adminHtml = adminHtml.replace(adminOld, adminNew);
   const tableHeaderOld = `<th>Mã KM</th>
                  <th>Giảm</th>
                  <th>Mô tả</th>
                  <th>Hết hạn</th>
                  <th>Đã dùng</th>
                  <th>Thao tác</th>`;
   const tableHeaderNew = `<th>Mã KM</th>
                  <th>Giảm</th>
                  <th>Mô tả</th>
                  <th>Hết hạn</th>
                  <th>Đã dùng</th>
                  <th>Tổng giảm</th>
                  <th>Thao tác</th>`;
   adminHtml = adminHtml.replace(tableHeaderOld, tableHeaderNew);
   fs.writeFileSync('admin/index.html', adminHtml, 'utf8');
   console.log('Updated admin HTML');
} else {
   console.log('Could not find exact match in admin/index.html');
}

console.log('Patched checkout.html to track coupon uses and savings');
