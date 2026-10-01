const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');
const products = fs.readFileSync('pages/products.html', 'utf8');

const getFooter = (html) => {
  const match = html.match(/<footer class="footer">[\s\S]*?<\/footer>/);
  return match ? match[0].length : 0;
};

console.log('Index footer length:', getFooter(index));
console.log('Products footer length:', getFooter(products));
