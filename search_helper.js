const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

const regex = /const revenueStat = document\.querySelector\('\.stat-card\.gold \.stat-value'\);/g;
const matchIdx = html.indexOf("const revenueStat = document.querySelector('.stat-card.gold .stat-value');");
console.log(matchIdx);

if (matchIdx !== -1) {
    console.log(html.substring(matchIdx - 1500, matchIdx + 1000));
}
