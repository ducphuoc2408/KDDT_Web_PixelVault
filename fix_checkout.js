const fs = require('fs');
let html = fs.readFileSync('pages/checkout.html', 'utf8');

const oldCode = `document.addEventListener('DOMContentLoaded', () => {`;
const newCode = `document.addEventListener('store:ready', () => {`;

html = html.replace(oldCode, newCode);
fs.writeFileSync('pages/checkout.html', html, 'utf8');
console.log('Fixed checkout loading');
