const fs = require('fs');

// Fix main.js
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
const searchMain = `  const ratingHtml = p.rating > 0
    ? \`<div class="product-rating">
        <div class="stars">\${getStarsHTML(p.rating)}</div>
        <span class="rating-count">\${p.reviews > 0 ? \`(\${p.reviews})\` : ''}</span>
       </div>\`
    : \`<div class="product-rating" style="min-height:18px;"></div>\`;`;

const replaceMain = `  const ratingHtml = \`<div class="product-rating" style="display:flex; align-items:center; gap:4px; min-height:18px;">
    \${p.rating ? \`<span style="font-weight:700; color:var(--text-100); font-size:0.85rem;">\${p.rating.toFixed(1)}</span>\` : '<span style="font-weight:700; color:var(--text-400); font-size:0.85rem;">0</span>'}
    <div class="stars" style="display:flex; margin-top:-2px;">\${getStarsHTML(p.rating || 0)}</div>
    <span class="rating-count" style="font-size:0.75rem; color:var(--text-400); margin-left:2px;">(\${p.reviews || 0})</span>
  </div>\`;`;

mainJs = mainJs.replace(searchMain, replaceMain);
fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');

// Fix product-detail.html
let detailHtml = fs.readFileSync('pages/product-detail.html', 'utf8');
const searchDetail = `      <div class="product-rating" style="margin-bottom:20px;">
        \${p.rating > 0 ? \`
          <div class="stars">\${getStarsHTML(p.rating)}</div>
          <span class="rating-count">\${p.rating.toFixed(1)} ★ &nbsp; \${p.reviews > 0 ? \`(\${p.reviews} đánh giá)\` : ''}</span>
        \` : \`<span style="color:var(--text-400); font-size:0.85rem;">Chưa có đánh giá</span>\`}
      </div>`;

const replaceDetail = `      <div class="product-rating" style="margin-bottom:20px; display:flex; align-items:center; gap:6px;">
        \${p.rating ? \`<span style="font-weight:700; color:var(--text-100); font-size:1.1rem;">\${p.rating.toFixed(1)}</span>\` : '<span style="font-weight:700; color:var(--text-400); font-size:1.1rem;">0</span>'}
        <div class="stars" style="display:flex;">\${getStarsHTML(p.rating || 0)}</div>
        <span class="rating-count" style="font-size:0.9rem; color:var(--text-400); margin-left:4px;">(\${p.reviews || 0} đánh giá)</span>
      </div>`;

detailHtml = detailHtml.replace(searchDetail, replaceDetail);
fs.writeFileSync('pages/product-detail.html', detailHtml, 'utf8');

console.log('Fixed rating display');
