const fs = require('fs');

// 1. Add CSS
let css = fs.readFileSync('assets/css/style.css', 'utf8');
const newCss = `
.product-action-buttons {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
}
.btn-buy-now {
  flex: 1;
  background: var(--gold-400);
  color: #000;
  border: none;
  border-radius: var(--r-sm);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--dur-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}
.btn-buy-now:hover:not(.out-of-stock) {
  background: var(--gold-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212,168,67,0.3);
}
.btn-buy-now.out-of-stock {
  background: var(--bg-surface);
  color: var(--text-400);
  cursor: not-allowed;
}
.btn-add-cart {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: transparent;
  color: var(--text-200);
  border: 1px solid var(--border-2);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--dur-fast);
}
.btn-add-cart svg {
  width: 18px;
  height: 18px;
}
.btn-add-cart:hover:not(.out-of-stock) {
  border-color: var(--gold-400);
  color: var(--gold-400);
  background: rgba(212,168,67,0.05);
}
.btn-add-cart.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

if (!css.includes('.product-action-buttons')) {
  css += newCss;
  fs.writeFileSync('assets/css/style.css', css, 'utf8');
}

// 2. Update main.js
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
const searchMain = `<div style="display:flex; gap:6px; margin-top:auto; padding-top:10px;">
          <button class="product-add-cart \${p.stock === 0 ? 'out-of-stock' : ''}" style="flex:1;"
            onclick="event.stopPropagation(); \${p.stock > 0 ? \`cartAdd(\${p.id})\` : ''}">
            \${SVG.cart}
            \${p.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
          \${p.stock > 0 ? \`<button class="btn btn-primary btn-sm" style="flex-shrink:0; padding:0 10px; white-space:nowrap; height:auto;" onclick="event.stopPropagation(); buyNow(\${p.id})" title="Đặt hàng ngay">
            <svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>\` : ''}
        </div>`;

const replaceMain = `<div class="product-action-buttons">
          \${p.stock > 0 ? \`
          <button class="btn-add-cart" onclick="event.stopPropagation(); cartAdd(\${p.id})" title="Thêm vào giỏ">
            \${SVG.cart}
          </button>
          <button class="btn-buy-now" onclick="event.stopPropagation(); buyNow(\${p.id})">
            Mua ngay
          </button>
          \` : \`
          <button class="btn-buy-now out-of-stock" disabled>
            Hết hàng
          </button>
          \`}
        </div>`;

mainJs = mainJs.replace(searchMain, replaceMain);
fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');

console.log('Fixed buttons');
