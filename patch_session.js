const fs = require('fs');

let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

const sessionCode = `async function handleSession(userRecord) {
  // Đọc thông tin từ bảng profiles
  let { data: profile, error } = await supabaseClient.from('profiles').select('*').eq('id', userRecord.id).maybeSingle();
  
  if (!profile) {
    // Nếu chưa có profile trong bảng (do thiếu trigger), frontend tự tạo luôn!
    const newProfile = {
      id: userRecord.id,
      name: userRecord.user_metadata?.name || userRecord.email.split('@')[0],
      email: userRecord.email,
      role: 'customer'
    };
    await supabaseClient.from('profiles').insert([newProfile]);
    profile = newProfile;
  }
  
  const name = profile.name;
  const role = profile.role;
  
  const user = { id: userRecord.id, name, email: userRecord.email, role };
  
  // Calculate total spent for membership discount
  const { data: userOrders } = await supabaseClient.from('orders').select('total_amount, status').eq('user_id', user.id);
  let spent = 0;
  if (userOrders) {
    spent = userOrders.filter(o => o.status === 'completed' || o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0);
  }
  user._totalSpent = spent;

  Store.currentUser = user;
  localStorage.setItem('pv_user', JSON.stringify(user));
  
  updateAuthUI();
}`;

mainJs = mainJs.replace(/async function handleSession\(userRecord\) \{[\s\S]*?updateAuthUI\(\);\n\}/, sessionCode);

const loginSuccessCode = `async function handleLoginSuccess(user) {
  // Calculate total spent for membership discount
  const { data: userOrders } = await supabaseClient.from('orders').select('total_amount, status').eq('user_id', user.id);
  let spent = 0;
  if (userOrders) {
    spent = userOrders.filter(o => o.status === 'completed' || o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0);
  }
  user._totalSpent = spent;

  Store.currentUser = user;
  localStorage.setItem('pv_user', JSON.stringify(user));
  updateAuthUI();
  showToast(\`Chào mừng, \${user.name}!\`, 'success');
  // Không redirect – giữ nguyên trang hiện tại
  cartUpdate(); // refresh cart to show member discount
}`;

mainJs = mainJs.replace(/function handleLoginSuccess\(user\) \{[\s\S]*?cartUpdate\(\);\n\}/, loginSuccessCode);
// Handle the case where the replacement didn't work because we replaced the 'function' part. Wait, if I replace the whole thing it works, but I must make sure it was found. Let's just do an index replacement.

fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
console.log('Done');
