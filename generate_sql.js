const fs = require('fs');

const brands = ['Sony', 'Canon', 'Fujifilm', 'Nikon', 'Panasonic', 'Olympus'];
const categories = ['mirrorless', 'dslr', 'lens', 'accessory'];
const tagPool = ['Full-Frame', 'APS-C', '4K Video', '8K Video', 'IBIS', 'Vlog', 'Chuyên nghiệp', 'Nhỏ gọn', 'Cảm biến BSI', 'Weather Sealed', 'Touchscreen', 'Wifi/Bluetooth'];
const imagePool = {
  'mirrorless': ['assets/images/sony_alpha.jpg', 'assets/images/canon_eos_r5.jpg', 'assets/images/fujifilm_xt5.jpg'],
  'dslr': ['assets/images/canon_eos_r5.jpg'],
  'lens': ['assets/images/canon_lens.jpg'],
  'accessory': ['assets/images/sony_alpha.jpg']
};
const badges = ['HOT', 'NEW', 'SALE', null, null, null];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const numProducts = 600;
let sql = `INSERT INTO public.products (name, brand, category, price, original_price, images, specs, tags, rating, reviews, stock, badge, description) VALUES\n`;

for (let i = 0; i < numProducts; i++) {
  const brand = getRandomItem(brands);
  const category = getRandomItem(categories);
  const isLens = category === 'lens';
  
  // Generate name
  const suffix = isLens ? `${getRandomInt(14, 200)}mm f/${getRandomItem(['1.4','1.8','2.8','4.0'])}` : `Mark ${getRandomInt(1,5)}`;
  const model = isLens ? 'PRO Lens' : getRandomItem(['Alpha', 'EOS', 'Lumix', 'OM-D', 'Z', 'X-T']);
  const name = `${brand} ${model} ${suffix} - Series ${getRandomInt(100, 999)}`;
  
  // Generate price
  const basePrice = getRandomInt(5, 100) * 1000000;
  const isSale = Math.random() > 0.7;
  const price = isSale ? Math.floor(basePrice * (getRandomInt(70, 95) / 100)) : basePrice;
  
  // Generate tags
  const numTags = getRandomInt(2, 5);
  const tags = [];
  for(let t=0; t<numTags; t++) {
    const tag = getRandomItem(tagPool);
    if (!tags.includes(tag)) tags.push(tag);
  }
  
  // Generate specs
  const specs = {
    'Bảo hành': `${getRandomItem(['12', '24'])} tháng`,
    'Trọng lượng': `${getRandomInt(300, 1500)}g`,
  };
  if (!isLens) {
    specs['Cảm biến'] = getRandomItem(['Full-Frame 24MP', 'APS-C 26MP', 'Micro Four Thirds 20MP', 'Full-Frame 45MP']);
    specs['ISO'] = `100-${getRandomItem(['25600', '51200', '102400'])}`;
  } else {
    specs['Ngàm'] = `${brand} Mount`;
    specs['Đường kính filter'] = `${getRandomItem(['67mm', '72mm', '77mm', '82mm'])}`;
  }
  
  const rating = (Math.random() * 2 + 3).toFixed(1);
  const reviews = getRandomInt(0, 500);
  const stock = getRandomInt(0, 50);
  const badge = getRandomItem(badges);
  const description = `${name} là một sản phẩm tuyệt vời của ${brand}, mang lại hiệu năng cao và thiết kế bền bỉ. Đáp ứng mọi nhu cầu nhiếp ảnh chuyên nghiệp và nghiệp dư.`;
  const image = getRandomItem(imagePool[category]);

  const escapeStr = str => str ? "'" + str.replace(/'/g, "''") + "'" : 'NULL';
  
  const values = `(
    ${escapeStr(name)},
    ${escapeStr(brand)},
    ${escapeStr(category)},
    ${price},
    ${basePrice},
    ARRAY[${escapeStr(image)}]::TEXT[],
    '${JSON.stringify(specs).replace(/'/g, "''")}'::JSONB,
    ARRAY[${tags.map(escapeStr).join(',')}]::TEXT[],
    ${rating},
    ${reviews},
    ${stock},
    ${escapeStr(badge)},
    ${escapeStr(description)}
  )`;
  
  sql += values;
  if (i < numProducts - 1) sql += ',\n';
  else sql += ';\n';
}

fs.writeFileSync('g:/KDDT/website/seed_600_products.sql', sql);
console.log('Generated seed_600_products.sql successfully!');
