const fs = require('fs');

let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

const sessionRegex = /async function handleSession\(userRecord\) \{[\s\S]*?updateAuthUI\(\);\n\}/;
const sessionMatch = mainJs.match(sessionRegex);

if (sessionMatch) {
  const newSession = `async function handleSession(userRecord) {
  let { data: profile, error } = await supabaseClient.from('profiles').select('*').eq('id', userRecord.id).maybeSingle();
  
  if (!profile) {
    const newProfile = {
      id: userRecord.id,
      name: userRecord.user_metadata?.name || userRecord.email.split('@')[0],
      email: userRecord.email,
      role: 'customer'
    };
    await supabaseClient.from('profiles').insert([newProfile]);
    profile = newProfile;
  }
  
  const user = { 
    id: userRecord.id, 
    name: profile.name, 
    email: userRecord.email, 
    role: profile.role,
    phone: profile.phone || '',
    address: profile.address || '',
    _totalSpent: profile.total_spent || 0
  };

  Store.currentUser = user;
  localStorage.setItem('pv_user', JSON.stringify(user));
  
  updateAuthUI();
  cartUpdate(); // Update cart with member discount!
}`;
  mainJs = mainJs.replace(sessionRegex, newSession);
}

const loginRegex = /async function handleLoginSuccess\(user\) \{[\s\S]*?cartUpdate\(\); \/\/ refresh cart to show member discount\n\}/;
const loginMatch = mainJs.match(loginRegex);
if (loginMatch) {
  const newLogin = `async function handleLoginSuccess(user) {
  Store.currentUser = user;
  localStorage.setItem('pv_user', JSON.stringify(user));
  updateAuthUI();
  showToast(\`Chào mừng, \${user.name}!\`, 'success');
  cartUpdate();
}`;
  mainJs = mainJs.replace(loginRegex, newLogin);
}

const loginSubmitRegex = /const userRecord = data\.user;\n\s*const \{ data: profile \} = await supabaseClient.from\('profiles'\).select\('\*'\).eq\('id', userRecord\.id\).single\(\);\n\s*const name = profile\?\.name[\s\S]*?handleLoginSuccess\(\{ id: userRecord\.id, name, email: userRecord\.email, role \}\);/;

const newLoginSubmit = `const userRecord = data.user;
    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userRecord.id).single();
    
    const userObj = {
      id: userRecord.id,
      name: profile?.name || userRecord.user_metadata?.name || userRecord.email.split('@')[0],
      email: userRecord.email,
      role: profile?.role || 'customer',
      phone: profile?.phone || '',
      address: profile?.address || '',
      _totalSpent: profile?.total_spent || 0
    };
    
    handleLoginSuccess(userObj);`;
    
mainJs = mainJs.replace(loginSubmitRegex, newLoginSubmit);

fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
console.log('Fixed handleSession');
