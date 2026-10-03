const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

const regex = /function renderRevenueChart\(\) \{[\s\S]*?\}, 50\);\r?\n\}/;
const match = html.match(regex);
if (match) {
  console.log('Regex matches!');
  html = html.replace(regex, `function renderRevenueChart() {
  const el = document.getElementById('revenue-chart');
  if (!el) return;
  const filterVal = parseInt(document.getElementById('revenue-time-filter')?.value || 7);
  
  const daily = {};
  Store.orders.forEach(o => {
    if (!o.date) return;
    const d = new Date(o.date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = yyyy + '-' + mm + '-' + dd;
    if (!daily[key]) daily[key] = 0;
    daily[key] += Number(o.total || 0);
  });
  
  const sortedKeys = [];
  const today = new Date();
  for (let i = filterVal - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    sortedKeys.push(yyyy + '-' + mm + '-' + dd);
  }
  
  const maxVal = Math.max(...sortedKeys.map(k => daily[k] || 0));
  const chartData = sortedKeys.map(k => {
    const val = (daily[k] || 0) / 1000000;
    const pct = maxVal > 0 ? ((daily[k] || 0) / maxVal) * 100 : 0;
    const [y, m, d] = k.split('-');
    return { label: d + '/' + m, value: val.toFixed(1), pct: Math.min(Math.max(pct, 5), 100) };
  });

  el.innerHTML = chartData.map(d => \`
    <div class="chart-row">
      <div class="chart-label">\${d.label}</div>
      <div class="chart-track">
        <div class="chart-fill" data-pct="\${d.pct}">\${d.value >= 0.1 ? d.value + 'M' : ''}</div>
      </div>
      <div class="chart-value">\${d.value}M đ</div>
    </div>\`).join('');

  setTimeout(() => {
    el.querySelectorAll('.chart-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-pct') + '%';
    });
  }, 50);
}`);

  // Replace DOANH THU THÁNG 9 to DOANH THU HÔM NAY
  const monthRegex = /DOANH THU THÁNG [0-9]+/g;
  html = html.replace(monthRegex, 'DOANH THU HÔM NAY');

  const jsRenderStats = /const currentMonth = today\.getMonth\(\) \+ 1;[\s\S]*?document\.getElementById\('stat-revenue'\)\.textContent = formatPrice\(thisMonthRev\);/;
  const jsRenderStatsReplace = `const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let todayRev = 0;
  let yesterdayRev = 0;

  Store.orders.forEach(o => {
    if (!o.date) return;
    const dStr = o.date.split('T')[0];
    if (dStr === todayStr) {
      todayRev += Number(o.total || 0);
    } else if (dStr === yesterdayStr) {
      yesterdayRev += Number(o.total || 0);
    }
  });

  document.getElementById('stat-revenue').textContent = formatPrice(todayRev);`;
  
  if (html.match(jsRenderStats)) {
    html = html.replace(jsRenderStats, jsRenderStatsReplace);
  }

  fs.writeFileSync('admin/index.html', html, 'utf8');
  console.log('Success!');
} else {
  console.log('Regex did NOT match!');
}
