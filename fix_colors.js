const fs = require('fs');

// Fix main.js
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
mainJs = mainJs.replace(' style="${isWishlisted ? \'color:var(--danger);\' : \'\'}"', '');
mainJs = mainJs.replace("btn.style.color = isNowWishlisted ? 'var(--danger)' : '';", "");
fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');

// Fix product-detail.html
let detailHtml = fs.readFileSync('pages/product-detail.html', 'utf8');
detailHtml = detailHtml.replace(' style="${isWishlisted ? \'color:var(--danger);\' : \'\'}"', '');
detailHtml = detailHtml.replace("btn.style.color = isNow ? 'var(--danger)' : '';", "");
fs.writeFileSync('pages/product-detail.html', detailHtml, 'utf8');

console.log('Fixed inline colors');
