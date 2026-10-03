const fs = require('fs');
let content = fs.readFileSync('pages/product-detail.html', 'utf8');

// Replace button
content = content.replace(
  '<button class="btn btn-ghost" id="detail-wishlist-btn" onclick="toggleDetailWishlist(${p.id})">',
  '<button class="btn btn-ghost" id="detail-wishlist-btn" onclick="toggleDetailWishlist(${p.id})" style="${isWishlisted ? \'color:var(--danger);\' : \'\'}">'
);

// Replace SVG
content = content.replace(
  '<svg style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24">',
  '<svg style="width:16px;height:16px;fill:${isWishlisted ? \'currentColor\' : \'none\'};stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24">'
);

// Replace text
content = content.replace(
  'Yêu thích\n        </button>',
  '${isWishlisted ? \'Đã yêu thích\' : \'Yêu thích\'}\n        </button>'
);

fs.writeFileSync('pages/product-detail.html', content, 'utf8');
console.log('Fixed wishlist button in product-detail.html');
