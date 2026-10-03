const fs = require('fs');
let html = fs.readFileSync('pages/account.html', 'utf8');

const search = `onerror="this.src='../assets/images/placeholder.jpg'"`;
const replace = `onerror="this.style.display='none'"`;

if (html.includes(search)) {
  html = html.split(search).join(replace);
  fs.writeFileSync('pages/account.html', html, 'utf8');
  console.log('Fixed onerror');
} else {
  console.log('onerror not found');
}
