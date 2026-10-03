const fs = require('fs');

// Patch main.js
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

mainJs = mainJs.replace(/localStorage\.getItem\('pv_coupon'\)/g, "sessionStorage.getItem('pv_coupon')");
mainJs = mainJs.replace(/localStorage\.setItem\('pv_coupon'/g, "sessionStorage.setItem('pv_coupon'");

// When cart becomes empty, clear coupon
const updateStr = 'const count = Store.cart.reduce((s, i) => s + i.qty, 0);';
const updateReplace = `const count = Store.cart.reduce((s, i) => s + i.qty, 0);
  if (count === 0) {
    _cartCouponPct = 0;
    _cartCouponCode = '';
    sessionStorage.removeItem('pv_coupon');
  }`;
mainJs = mainJs.replace(updateStr, updateReplace);

fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');

// Patch checkout.html
let checkoutHtml = fs.readFileSync('pages/checkout.html', 'utf8');
checkoutHtml = checkoutHtml.replace(/localStorage\.getItem\('pv_coupon'\)/g, "sessionStorage.getItem('pv_coupon')");
checkoutHtml = checkoutHtml.replace(/localStorage\.setItem\('pv_coupon'/g, "sessionStorage.setItem('pv_coupon'");

fs.writeFileSync('pages/checkout.html', checkoutHtml, 'utf8');
console.log('Fixed to sessionStorage');
