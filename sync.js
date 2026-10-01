const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract navbar from index.html
const navStart = indexHtml.indexOf('<nav class="navbar" id="main-navbar">');
const navEnd = indexHtml.indexOf('</nav>', navStart) + 6;
let navHtml = indexHtml.substring(navStart, navEnd);

// Extract footer from index.html
const footerStart = indexHtml.indexOf('<footer class="footer" id="main-footer">');
const footerEnd = indexHtml.indexOf('</footer>', footerStart) + 9;
let footerHtml = indexHtml.substring(footerStart, footerEnd);

// Adjust links for the pages/ directory
let pageNavHtml = navHtml
  .replace(/href="index.html"/g, 'href="../index.html"')
  .replace(/href="pages\//g, 'href="')
  .replace(/src="assets\//g, 'src="../assets/');

let pageFooterHtml = footerHtml
  .replace(/href="index.html"/g, 'href="../index.html"')
  .replace(/href="pages\//g, 'href="')
  .replace(/src="assets\//g, 'src="../assets/');

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace navbar
  const fileNavStart = content.indexOf('<nav class="navbar"');
  if (fileNavStart !== -1) {
    const fileNavEnd = content.indexOf('</nav>', fileNavStart) + 6;
    
    // adjust active state in pageNavHtml for this specific file
    let localNav = pageNavHtml.replace('class="nav-link active"', 'class="nav-link"');
    // very basic active state mapping
    if (file === 'products.html') localNav = localNav.replace('id="nl-products"', 'id="nl-products" class="nav-link active"');
    if (file === 'compare.html') localNav = localNav.replace('id="nl-compare"', 'id="nl-compare" class="nav-link active"');
    if (file === 'contact.html') localNav = localNav.replace('id="nl-contact"', 'id="nl-contact" class="nav-link active"');

    content = content.substring(0, fileNavStart) + localNav + content.substring(fileNavEnd);
  }

  // Replace footer
  const fileFooterStart = content.indexOf('<footer');
  if (fileFooterStart !== -1) {
    const fileFooterEnd = content.indexOf('</footer>', fileFooterStart) + 9;
    content = content.substring(0, fileFooterStart) + pageFooterHtml + content.substring(fileFooterEnd);
  } else {
    // If no footer, append it before </body>
    content = content.replace('</body>', pageFooterHtml + '\n</body>');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
