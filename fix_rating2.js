const fs = require('fs');

// Fix main.js
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
const searchMain = `  const ratingHtml = \`<div class="product-rating" style="display:flex; align-items:center; gap:4px; min-height:18px;">
    \${p.rating ? \`<span style="font-weight:700; color:var(--text-100); font-size:0.85rem;">\${p.rating.toFixed(1)}</span>\` : '<span style="font-weight:700; color:var(--text-400); font-size:0.85rem;">0.0</span>'}
    <div class="stars" style="display:flex; margin-top:-2px;">\${getStarsHTML(p.rating || 0)}</div>
    <span class="rating-count" style="font-size:0.75rem; color:var(--text-400); margin-left:2px;">(\${p.reviews || 0})</span>
  </div>\`;`;

const replaceMain = `  const ratingHtml = \`<div class="product-rating" style="display:flex; align-items:center; gap:4px; min-height:16px;">
    \${p.rating ? \`<span style="font-weight:700; color:var(--text-100); font-size:0.75rem;">\${p.rating.toFixed(1)}</span>\` : '<span style="font-weight:700; color:var(--text-400); font-size:0.75rem;">0.0</span>'}
    <div class="stars" style="display:flex; align-items:center;">\${getStarsHTML(p.rating || 0)}</div>
    <span class="rating-count" style="font-size:0.7rem; color:var(--text-400); margin-left:1px;">(\${p.reviews || 0})</span>
  </div>\`;`;

mainJs = mainJs.replace(searchMain, replaceMain);
fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');

// Fix product-detail.html
let detailHtml = fs.readFileSync('pages/product-detail.html', 'utf8');
const searchDetail = `      <div class="product-rating" style="margin-bottom:20px; display:flex; align-items:center; gap:6px;">
        \${p.rating ? \`<span style="font-weight:700; color:var(--text-100); font-size:1.1rem;">\${p.rating.toFixed(1)}</span>\` : '<span style="font-weight:700; color:var(--text-400); font-size:1.1rem;">0.0</span>'}
        <div class="stars" style="display:flex;">\${getStarsHTML(p.rating || 0)}</div>
        <span class="rating-count" style="font-size:0.9rem; color:var(--text-400); margin-left:4px;">(\${p.reviews || 0} đánh giá)</span>
      </div>`;

const replaceDetail = `      <div class="product-rating" style="margin-bottom:20px; display:flex; align-items:center; gap:6px;">
        \${p.rating ? \`<span style="font-weight:700; color:var(--text-100); font-size:0.9rem;">\${p.rating.toFixed(1)}</span>\` : '<span style="font-weight:700; color:var(--text-400); font-size:0.9rem;">0.0</span>'}
        <div class="stars" style="display:flex; align-items:center; transform:scale(1.15); transform-origin:left center; margin:0 4px;">\${getStarsHTML(p.rating || 0)}</div>
        <span class="rating-count" style="font-size:0.8rem; color:var(--text-400); margin-left:4px;">(\${p.reviews || 0} đánh giá)</span>
      </div>`;

detailHtml = detailHtml.replace(searchDetail, replaceDetail);
fs.writeFileSync('pages/product-detail.html', detailHtml, 'utf8');

console.log('Fixed alignment and size');
