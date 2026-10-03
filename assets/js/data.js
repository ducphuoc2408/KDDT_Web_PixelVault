/* ============================================================
   PIXELVAULT – Supabase Data Layer (v3)
   Toàn bộ data được lấy từ Supabase – không còn hardcode
   ============================================================ */

const SUPABASE_URL = 'https://cklxpfaylobqcymnyahm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbHhwZmF5bG9icWN5bW55YWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTc4MTcsImV4cCI6MjEwNjA5MzgxN30.URLcP2ISCqdnw_IUHwW6Bv-hx5_qJAnbGnT1U4qnfew';

// Khởi tạo Supabase client (window.supabase được load từ CDN)
// Singleton – tránh tạo duplicate client
if (!window._pvSupabase) {
  window._pvSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
const _db = window._pvSupabase;

/* ============================================================
   MAP: Chuyển row Supabase → định dạng Store dùng trong app
   ============================================================ */
function mapProduct(row) {
  return {
    id:            row.id,
    name:          row.name,
    brand:         row.brand,
    category:      row.category,
    price:         row.price,
    originalPrice: row.original_price,
    images:        row.images || [],
    specs:         row.specs  || {},
    tags:          row.tags   || [],
    rating:        parseFloat(row.rating) || 0,
    reviews:       row.reviews || 0,
    stock:         row.stock  || 0,
    badge:         row.badge  || null,
    description:   row.description || '',
  };
}

function mapOrder(row) {
  let items = row.items || [];
  if (row.order_items && Array.isArray(row.order_items) && row.order_items.length > 0) {
    items = row.order_items.map(oi => ({
      id: oi.product_id,
      quantity: oi.quantity,
      qty: oi.quantity,
      price: oi.price_at_purchase,
      name: oi.products ? oi.products.name : '',
      product: oi.products ? oi.products.name : ''
    }));
  }

  return {
    id:       row.id,
    customer: row.recipient_name || row.customer,
    product:  row.product || (items.length > 0 ? items[0].name : ''),
    total:    row.total,
    status:   row.status,
    payment:  row.payment_method || row.payment,
    date:     row.created_at ? row.created_at.split('T')[0] : '',
    items:          items,
    address:        row.address || {},
    userId:         row.user_id || null,
    discountAmount: row.discount_amount || 0,
  };
}

/* ============================================================
   SupabaseDB – API duy nhất để truy cập data
   ============================================================ */
const SupabaseDB = {

  /* ---------- PRODUCTS ---------- */

  /** Lấy toàn bộ sản phẩm */
  async getProducts() {
    const { data, error } = await _db.from('products').select('*').order('id');
    if (error) { console.error('[SupabaseDB] getProducts:', error.message); return []; }
    return data.map(mapProduct);
  },

  /** Lấy sản phẩm theo category */
  async getProductsByCategory(category) {
    const { data, error } = await _db.from('products').select('*').eq('category', category).order('id');
    if (error) { console.error('[SupabaseDB] getProductsByCategory:', error.message); return []; }
    return data.map(mapProduct);
  },

  /** Lấy 1 sản phẩm theo id */
  async getProductById(id) {
    const { data, error } = await _db.from('products').select('*').eq('id', id).single();
    if (error) { console.error('[SupabaseDB] getProductById:', error.message); return null; }
    return mapProduct(data);
  },

  /** Tìm kiếm sản phẩm theo tên */
  async searchProducts(query) {
    const { data, error } = await _db.from('products').select('*').ilike('name', `%${query}%`).order('id');
    if (error) { console.error('[SupabaseDB] searchProducts:', error.message); return []; }
    return data.map(mapProduct);
  },

  /** Admin: Thêm sản phẩm mới */
  async addProduct(productData) {
    const row = {
      name:           productData.name,
      brand:          productData.brand,
      category:       productData.category,
      price:          productData.price,
      original_price: productData.originalPrice || productData.price,
      images:         productData.images || [],
      specs:          productData.specs  || {},
      tags:           productData.tags   || [],
      rating:         productData.rating || 0,
      reviews:        productData.reviews || 0,
      stock:          productData.stock  || 0,
      badge:          productData.badge  || null,
      description:    productData.description || '',
    };
    const { data, error } = await _db.from('products').insert([row]).select().single();
    if (error) { console.error('[SupabaseDB] addProduct:', error.message); return null; }
    return mapProduct(data);
  },

  /** Admin: Cập nhật sản phẩm */
  async updateProduct(id, updates) {
    const row = {};
    if (updates.name          !== undefined) row.name           = updates.name;
    if (updates.brand         !== undefined) row.brand          = updates.brand;
    if (updates.category      !== undefined) row.category       = updates.category;
    if (updates.price         !== undefined) row.price          = updates.price;
    if (updates.originalPrice !== undefined) row.original_price = updates.originalPrice;
    if (updates.images        !== undefined) row.images         = updates.images;
    if (updates.specs         !== undefined) row.specs          = updates.specs;
    if (updates.tags          !== undefined) row.tags           = updates.tags;
    if (updates.rating        !== undefined) row.rating         = updates.rating;
    if (updates.reviews       !== undefined) row.reviews        = updates.reviews;
    if (updates.stock         !== undefined) row.stock          = updates.stock;
    if (updates.badge         !== undefined) row.badge          = updates.badge;
    if (updates.description   !== undefined) row.description    = updates.description;

    const { data, error } = await _db.from('products').update(row).eq('id', id).select().single();
    if (error) { console.error('[SupabaseDB] updateProduct:', error.message); return null; }
    return mapProduct(data);
  },

  /** Admin: Xóa sản phẩm */
  async deleteProduct(id) {
    const { error } = await _db.from('products').delete().eq('id', id);
    if (error) { console.error('[SupabaseDB] deleteProduct:', error.message); return false; }
    return true;
  },

  /* ---------- TRANSACTIONS ---------- */
  async getTransactions() {
    if (!window.supabaseClient) return [];
    try {
      const { data, error } = await window.supabaseClient.from('transactions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('Lỗi khi lấy giao dịch:', e);
      return [];
    }
  },

  /* ---------- ORDERS ---------- */

  /** Lấy tất cả đơn hàng (admin) */
  async getOrders() {
    const { data, error } = await _db.from('orders').select('*, order_items(*, products(name, images))').order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getOrders:', error.message); return []; }
    return data.map(mapOrder);
  },

  /** Lấy đơn hàng của user hiện tại */
  async getMyOrders(userId) {
    const { data, error } = await _db.from('orders').select('*, order_items(*, products(name, images))').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getMyOrders:', error.message); return []; }
    return data.map(mapOrder);
  },

  /** Tạo đơn hàng mới */
  async createOrder(orderData) {
    if (!orderData.userId) {
      console.error('[SupabaseDB] createOrder: userId is missing.');
      return null;
    }
    const orderId = 'PV' + Date.now();
    const row = {
      id:              orderId,
      user_id:         orderData.userId,
      recipient_name:  orderData.customer || (orderData.address && orderData.address.name) || 'Khách hàng',
      address:         orderData.address  || {},
      total:           orderData.total,
      discount_amount: orderData.discountAmount || 0,
      coupon_id:       orderData.couponId || null,
      payment_method:  orderData.payment  || 'COD',
      status:          orderData.status   || 'pending',
    };
    const { data, error } = await _db.from('orders').insert([row]).select().single();
    if (error) { console.error('[SupabaseDB] createOrder:', error.message); return null; }
    
    let orderItems = [];
    if (orderData.items && orderData.items.length > 0) {
      orderItems = orderData.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.qty || item.quantity || 1,
        price_at_purchase: item.price || 0
      }));
      const { error: itemsError } = await _db.from('order_items').insert(orderItems);
      if (itemsError) {
         console.error('[SupabaseDB] createOrder (order_items):', itemsError.message);
      }
    }
    
    const joinedData = { 
      ...data, 
      order_items: orderItems.map((oi, i) => ({
        ...oi,
        products: { name: orderData.items[i].name || orderData.items[i].product }
      })) 
    };
    return mapOrder(joinedData);
  },

  /** Admin: Cập nhật trạng thái đơn hàng */
  async updateOrderStatus(orderId, status) {
    const { data, error } = await _db.from('orders').update({ status }).eq('id', orderId).select().single();
    if (error) { console.error('[SupabaseDB] updateOrderStatus:', error.message); return null; }
    return mapOrder(data);
  },

  /* ---------- CONTACTS ---------- */

  /** Gửi tin nhắn liên hệ */
  async submitContact(formData) {
    const row = {
      name:    formData.name,
      email:   formData.email,
      subject: formData.subject || '',
      message: formData.message || '',
    };
    const { error } = await _db.from('contacts').insert([row]);
    if (error) { console.error('[SupabaseDB] submitContact:', error.message); return false; }
    return true;
  },

  /** Admin: Lấy danh sách liên hệ */
  async getContacts() {
    const { data, error } = await _db.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getContacts:', error.message); return []; }
    return data;
  },

  /* ---------- PROFILES ---------- */

  /** Lấy profile của user */
  async getProfile(userId) {
    const { data, error } = await _db.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) { console.error('[SupabaseDB] getProfile:', error.message); return null; }
    return data;
  },

  /** Cập nhật profile */
  async updateProfile(userId, updates) {
    const { data, error } = await _db.from('profiles').update(updates).eq('id', userId).select().single();
    if (error) { console.error('[SupabaseDB] updateProfile:', error.message); return null; }
    return data;
  },

  /* ---------- COUPONS ---------- */

  /** Lấy danh sách mã giảm giá */
  async getCoupons() {
    const { data, error } = await _db.from('coupons').select('*').order('created_at', { ascending: true });
    if (error) { console.error('[SupabaseDB] getCoupons:', error.message); return []; }
    return data;
  },

  /** Thêm mã giảm giá mới */
  async addCoupon(couponData) {
    const { data, error } = await _db.from('coupons').insert([couponData]).select().single();
    if (error) { console.error('[SupabaseDB] addCoupon:', error.message); return null; }
    return data;
  },

  /** Xóa mã giảm giá */
  async deleteCoupon(id) {
    const { error } = await _db.from('coupons').delete().eq('id', id);
    if (error) { console.error('[SupabaseDB] deleteCoupon:', error.message); return false; }
    return true;
  },

  /** Tăng lượt sử dụng */
  async incrementCouponUsage(id, currentUses) {
    const { error } = await _db.from('coupons').update({ uses: currentUses + 1 }).eq('id', id);
    if (error) { console.error('[SupabaseDB] incrementCouponUsage:', error.message); return false; }
    return true;
  },

  /* ---------- REVIEWS ---------- */

  /** Lấy đánh giá của một sản phẩm (chỉ những đánh giá đã duyệt) */
  async getProductReviews(productId) {
    const { data, error } = await _db.from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getProductReviews:', error.message); return []; }
    return data;
  },

  /** Admin: Lấy tất cả đánh giá */
  async getAllReviews() {
    const { data, error } = await _db.from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getAllReviews:', error.message); return []; }
    return data;
  },

  /** Gửi đánh giá mới */
  async submitReview(reviewData) {
    const { data, error } = await _db.from('reviews').insert([reviewData]).select().single();
    if (error) { console.error('[SupabaseDB] submitReview:', error.message); return null; }
    return data;
  },

  /** Admin: Cập nhật trạng thái đánh giá */
  async updateReviewStatus(reviewId, status) {
    const { error } = await _db.from('reviews').update({ status }).eq('id', reviewId);
    if (error) { console.error('[SupabaseDB] updateReviewStatus:', error.message); return false; }
    return true;
  }
};

// Expose globally
window.SupabaseDB = SupabaseDB;
window.supabaseClient = _db; // backwards-compat với admin panel