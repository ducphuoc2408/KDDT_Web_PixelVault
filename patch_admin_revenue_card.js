const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

const jsSearch = `  const revenueStat = document.querySelector('.stat-card.gold .stat-value');
  if (revenueStat) {
    revenueStat.textContent = (totalRevenueThisMonth / 1000000).toFixed(1) + 'M đ';
    const diffEl = revenueStat.nextElementSibling;
    if (diffEl) {
      diffEl.innerHTML = \`<svg style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24"><polyline points="\${revDiffPct >= 0 ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"/></svg> \${Math.abs(revDiffPct)}% so với tháng trước\`;
      diffEl.className = \`stat-change \${revDiffPct >= 0 ? 'up' : 'down'}\`;
    }
  }`;

const jsReplace = `  const revenueStat = document.querySelector('.stat-card.gold .stat-value');
  if (revenueStat) {
    // TÍNH DOANH THU HÔM NAY
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    let todayRev = 0;
    let yesterdayRev = 0;

    Store.orders.forEach(o => {
      if (!o.date || o.status === 'cancelled') return;
      const dStr = o.date.split('T')[0];
      if (dStr === todayStr) {
        todayRev += Number(o.total || 0);
      } else if (dStr === yesterdayStr) {
        yesterdayRev += Number(o.total || 0);
      }
    });

    revenueStat.textContent = (todayRev / 1000000).toFixed(1) + 'M đ';
    
    let revDiffPctDaily = 0;
    if (yesterdayRev > 0) {
      revDiffPctDaily = ((todayRev - yesterdayRev) / yesterdayRev * 100).toFixed(1);
    } else if (todayRev > 0) {
      revDiffPctDaily = 100;
    }

    const diffEl = revenueStat.nextElementSibling;
    if (diffEl) {
      diffEl.innerHTML = \`<svg style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;" viewBox="0 0 24 24"><polyline points="\${revDiffPctDaily >= 0 ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"/></svg> \${Math.abs(revDiffPctDaily)}% so với hôm qua\`;
      diffEl.className = \`stat-change \${revDiffPctDaily >= 0 ? 'up' : 'down'}\`;
    }
  }`;

if (html.includes("const revenueStat = document.querySelector('.stat-card.gold .stat-value');")) {
    html = html.replace(jsSearch, jsReplace);
    fs.writeFileSync('admin/index.html', html, 'utf8');
    console.log('Successfully updated daily revenue JS calculation!');
} else {
    console.log('Could not find the target code to replace.');
}
