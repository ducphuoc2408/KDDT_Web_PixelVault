const URL = 'https://cklxpfaylobqcymnyahm.supabase.co/rest/v1/products';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbHhwZmF5bG9icWN5bW55YWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTc4MTcsImV4cCI6MjEwNjA5MzgxN30.URLcP2ISCqdnw_IUHwW6Bv-hx5_qJAnbGnT1U4qnfew';

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

function generateProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
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
    
    products.push({
      name,
      brand,
      category,
      price,
      original_price: basePrice,
      images: [getRandomItem(imagePool[category])],
      specs,
      tags,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      reviews: getRandomInt(0, 500),
      stock: getRandomInt(0, 50),
      badge: getRandomItem(badges),
      description: `${name} là một sản phẩm tuyệt vời của ${brand}, mang lại hiệu năng cao và thiết kế bền bỉ. Đáp ứng mọi nhu cầu nhiếp ảnh chuyên nghiệp và nghiệp dư.`
    });
  }
  return products;
}

async function insertProducts(products) {
  const BATCH_SIZE = 100;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    console.log(`Inserting batch ${i / BATCH_SIZE + 1} (${batch.length} items)...`);
    
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(batch)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error inserting batch:', errorText);
    } else {
      console.log(`Batch ${i / BATCH_SIZE + 1} inserted successfully.`);
    }
  }
}

const numProducts = 600;
console.log(`Generating ${numProducts} dummy products...`);
const productsToInsert = generateProducts(numProducts);
insertProducts(productsToInsert).then(() => console.log('Done!'));
