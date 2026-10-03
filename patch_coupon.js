const fs = require('fs');

// Patch main.js to save/load coupon
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

const oldVars = `// Cart coupon state
let _cartCouponPct = 0;
let _cartCouponCode = '';`;

const newVars = `// Cart coupon state
let _cartCouponPct = 0;
let _cartCouponCode = '';
try {
  const savedC = localStorage.getItem('pv_coupon');
  if (savedC) {
    const parsed = JSON.parse(savedC);
    _cartCouponPct = parsed.pct || 0;
    _cartCouponCode = parsed.code || '';
  }
} catch(e) {}`;

mainJs = mainJs.replace(oldVars, newVars);

const oldApply = `  _cartCouponPct = coupon.discount_pct / 100;
  _cartCouponCode = code;
  showToast(`;

const newApply = `  _cartCouponPct = coupon.discount_pct / 100;
  _cartCouponCode = code;
  localStorage.setItem('pv_coupon', JSON.stringify({ code: _cartCouponCode, pct: _cartCouponPct }));
  showToast(`;

mainJs = mainJs.replace(oldApply, newApply);

fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');


// Patch checkout.html
let checkoutHtml = fs.readFileSync('pages/checkout.html', 'utf8');

const oldCheckoutVars = `let discountPct = 0;
let appliedCode = '';`;

const newCheckoutVars = `let discountPct = 0;
let appliedCode = '';
try {
  const savedC = localStorage.getItem('pv_coupon');
  if (savedC) {
    const parsed = JSON.parse(savedC);
    discountPct = parsed.pct || 0;
    appliedCode = parsed.code || '';
  }
} catch(e) {}`;

checkoutHtml = checkoutHtml.replace(oldCheckoutVars, newCheckoutVars);

const oldShipping = `const shipping = (subtotal - discountAmt - memberDiscountAmt) >= 50000000 ? 0 : 30000;`;
const newShipping = `const shipping = subtotal >= 50000000 ? 0 : 30000;`;

checkoutHtml = checkoutHtml.replace(oldShipping, newShipping);

const oldCheckoutApply = `  discountPct = coupon.discount_pct / 100;
  appliedCode = code;`;

const newCheckoutApply = `  discountPct = coupon.discount_pct / 100;
  appliedCode = code;
  localStorage.setItem('pv_coupon', JSON.stringify({ code: appliedCode, pct: discountPct }));`;

checkoutHtml = checkoutHtml.replace(oldCheckoutApply, newCheckoutApply);

const oldRender = `  document.getElementById('co-total').textContent = formatPrice(total);`;
const newRender = `  document.getElementById('co-total').textContent = formatPrice(total);
  if (appliedCode) {
    const cInput = document.getElementById('coupon-input');
    if (cInput && !cInput.value) cInput.value = appliedCode;
  }`;

checkoutHtml = checkoutHtml.replace(oldRender, newRender);

fs.writeFileSync('pages/checkout.html', checkoutHtml, 'utf8');

console.log('Fixed coupon sync');
