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
      } else {
        // Tự động match order_id và chuyển status = 'sold' cho các sản phẩm hàng cũ ký gửi
        try {
          for (const item of orderData.items) {
            const pid = item.id || item.product_id;
            if (pid) {
              await _db.from('consignment_requests')
                .update({ 
                  order_id: orderId, 
                  status: 'sold', 
                  updated_at: new Date().toISOString() 
                })
                .eq('product_id', pid);
            }
          }
        } catch (csErr) {
          console.warn('[SupabaseDB] Auto link consignment order notice:', csErr);
        }
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
    const updatePayload = { status };
    if (status === 'delivered' || status === 'completed') {
      updatePayload.delivered_at = new Date().toISOString();
      // Tự động cập nhật mốc delivered_at vào consignment_requests để kích hoạt đếm ngược 72h
      try {
        await _db.from('consignment_requests')
          .update({
            delivered_at: updatePayload.delivered_at,
            status: 'delivered',
            updated_at: updatePayload.delivered_at
          })
          .eq('order_id', orderId)
          .neq('status', 'payout_completed');
      } catch (csErr) {
        console.warn('[SupabaseDB] Auto update consignment delivered_at notice:', csErr);
      }
    }
    const { data, error } = await _db.from('orders').update(updatePayload).eq('id', orderId).select().single();
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
  },

  /* ---------- RENTALS (MODULE 1) ---------- */

  /** Tạo đơn thuê mới (trạng thái pending_deposit) */
  async createRental(rentalData) {
    const { data, error } = await _db.from('rentals').insert([rentalData]).select().single();
    if (error) { console.error('[SupabaseDB] createRental:', error.message); return null; }
    return data;
  },

  /** Cập nhật trạng thái đơn thuê */
  async updateRentalStatus(rentalId, status) {
    try {
      const { data, error } = await _db.from('rentals').update({ status }).eq('id', rentalId).select();
      if (error) {
        console.warn('[SupabaseDB] updateRentalStatus error:', error.message);
        // Fallback update without select representation
        await _db.from('rentals').update({ status }).eq('id', rentalId);
      }
      return { id: rentalId, status };
    } catch (e) {
      console.error('[SupabaseDB] updateRentalStatus exception:', e);
      return { id: rentalId, status };
    }
  },

  /** Lấy danh sách thuê của user */
  async getAllRentals() {
    const { data, error } = await _db.from('rentals')
      .select('*, products(name, images)')
      .order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getAllRentals:', error.message); return []; }
    return data;
  },

  async getMyRentals(userId) {
    const { data, error } = await _db.from('rentals')
      .select('*, products(name, images)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) { console.error('[SupabaseDB] getMyRentals:', error.message); return []; }
    return data;
  },

  /* ---------- CONSIGNMENT (HÀNG CŨ - KÝ GỬI & GIẢI NGÂN) ---------- */

  /** Tạo yêu cầu ký gửi mới */
  async createConsignmentRequest(reqData) {
    const askingPrice = Number(reqData.askingPrice || reqData.asking_price || 0);
    // Tính giá niêm yết ngoài web: askingPrice / 0.95 (làm tròn đến hàng nghìn đồng)
    const finalPrice = Math.round((askingPrice / 0.95) / 1000) * 1000;
    const commissionFee = finalPrice - askingPrice;
    const reqId = reqData.id || ('CR' + Date.now());

    const currentUserName = (window.Store && window.Store.currentUser && window.Store.currentUser.name) || '';
    const currentUserEmail = (window.Store && window.Store.currentUser && window.Store.currentUser.email) || '';
    const currentUserId = (window.Store && window.Store.currentUser && window.Store.currentUser.id) || null;

    const sellerName = reqData.sellerName || reqData.seller_name || reqData.sellerBankHolder || currentUserName || 'Khách ký gửi';
    const sellerEmail = reqData.sellerEmail || reqData.seller_email || currentUserEmail || '';

    const row = {
      id:                  reqId,
      seller_id:           reqData.sellerId || reqData.seller_id || currentUserId,
      seller_name:         sellerName,
      seller_phone:        reqData.sellerPhone || reqData.seller_phone || '',
      seller_email:        sellerEmail,
      seller_bank_name:    reqData.sellerBankName || reqData.seller_bank_name || 'MB Bank',
      seller_bank_account: reqData.sellerBankAccount || reqData.seller_bank_account || '',
      seller_bank_holder:  (reqData.sellerBankHolder || reqData.seller_bank_holder || sellerName).toUpperCase(),
      product_name:        reqData.productName || reqData.product_name,
      brand:               reqData.brand || 'Khác',
      category:            'used-consignment',
      condition:           reqData.condition || 'Like New 99%',
      description:         reqData.description || '',
      images:              Array.isArray(reqData.images) && reqData.images.length > 0 ? reqData.images : ['assets/images/sony_alpha.jpg'],
      asking_price:        askingPrice,
      commission_rate:     5.0,
      commission_fee:      commissionFee,
      final_price:         finalPrice,
      status:              'pending_approval',
      created_at:          new Date().toISOString(),
      updated_at:          new Date().toISOString()
    };

    // 1. Lưu vào Supabase
    try {
      const { data, error } = await _db.from('consignment_requests').insert([row]).select().single();
      if (!error && data) {
        this._saveLocalConsignment(data);
        return data;
      }
      if (error) console.warn('[SupabaseDB] createConsignmentRequest cloud notice:', error.message);
    } catch (e) {
      console.warn('[SupabaseDB] createConsignmentRequest fallback to local:', e);
    }

    // 2. Fallback lưu vào LocalStorage
    this._saveLocalConsignment(row);
    return row;
  },

  /** Lấy danh sách yêu cầu ký gửi - Lấy trực tiếp từ Supabase (Cloud là nguồn dữ liệu chuẩn duy nhất) */
  async getConsignmentRequests() {
    try {
      const { data, error } = await _db.from('consignment_requests').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        // Đồng bộ ghi đè vào localStorage: nếu trên Cloud đã bị xóa thì Local cũng bị xóa sạch
        try {
          localStorage.setItem('pv_consignments', JSON.stringify(data));
        } catch (_) {}
        return data;
      }
      if (error) {
        console.warn('[SupabaseDB] getConsignmentRequests notice:', error.message);
      }
    } catch (e) {
      console.warn('[SupabaseDB] getConsignmentRequests cloud notice:', e);
    }

    // Chỉ fallback sang localStorage khi mất kết nối mạng
    return this._getLocalConsignments();
  },

  /** Xóa vĩnh viễn yêu cầu ký gửi (cả trên Supabase và LocalStorage) */
  async deleteConsignmentRequest(id) {
    // 1. Xóa trên Cloud
    try {
      await _db.from('consignment_requests').delete().eq('id', id);
    } catch (e) {
      console.warn('[SupabaseDB] deleteConsignmentRequest cloud notice:', e);
    }

    // 2. Xóa trong LocalStorage
    try {
      const list = this._getLocalConsignments().filter(x => x && x.id !== id);
      localStorage.setItem('pv_consignments', JSON.stringify(list));
    } catch (_) {}

    // 3. Xóa trong Store.products
    try {
      if (window.Store && Array.isArray(window.Store.products)) {
        window.Store.products = window.Store.products.filter(p => p.consignmentId !== id);
      }
    } catch (_) {}

    return true;
  },

  /** Admin: Duyệt yêu cầu ký gửi -> Chuyển sang approved và đưa lên web bán */
  async approveConsignmentRequest(id) {
    // 1. Thử gọi RPC trên Supabase (nếu đã tạo script SQL)
    try {
      const { data: rpcData, error: rpcErr } = await _db.rpc('approve_consignment_request', { p_req_id: id });
      if (!rpcErr && rpcData) {
        this._saveLocalConsignment(rpcData);
        // Load lại danh sách sản phẩm nếu có
        try {
          const prods = await this.getProducts();
          if (window.Store) window.Store.products = prods;
        } catch (_) {}
        return rpcData;
      }
    } catch (e) {
      console.warn('[SupabaseDB] RPC approve_consignment_request not available, falling back to client JS:', e);
    }

    // 2. Fallback xử lý trực tiếp phía Client
    const list = await this.getConsignmentRequests();
    const item = list.find(x => x.id === id);
    if (!item) return null;

    item.status = 'approved';
    item.updated_at = new Date().toISOString();

    // Tự động tạo sản phẩm trong bảng products nếu chưa có
    try {
      if (!item.product_id) {
        const catLower = (item.product_name || '').toLowerCase();
        let validCat = 'mirrorless';
        if (catLower.includes('lens') || catLower.includes('ống kính')) validCat = 'lens';
        else if (catLower.includes('dslr')) validCat = 'dslr';
        else if (catLower.includes('pin') || catLower.includes('thẻ') || catLower.includes('tripod') || catLower.includes('túi')) validCat = 'accessory';

        const productData = {
          name: `${item.product_name} (Hàng Cũ Ký Gửi - ${item.condition || '99%'})`,
          brand: item.brand,
          category: validCat,
          price: item.final_price,
          originalPrice: item.final_price,
          images: item.images && item.images.length > 0 ? item.images : ['assets/images/sony_alpha.jpg'],
          stock: 1,
          badge: item.condition || '99%',
          rating: 5.0,
          reviews: 0,
          tags: ['Hàng Cũ Ký Gửi', item.condition || '99%', item.brand],
          description: `[HÀNG CŨ - KÝ GỬI KIỂM ĐỊNH] ${item.product_name}. Tình trạng: ${item.condition}. ${item.description || ''}`
        };
        const newProduct = await this.addProduct(productData);
        if (newProduct) {
          item.product_id = newProduct.id;
          if (window.Store && Array.isArray(window.Store.products)) {
            const exists = window.Store.products.find(p => p.id === newProduct.id);
            if (!exists) window.Store.products.unshift(newProduct);
          }
        }
      }
    } catch(err) {
      console.warn('[SupabaseDB] Auto add product for approved consignment:', err);
    }

    // Cập nhật lên cloud
    try {
      await _db.from('consignment_requests').update({ 
        status: 'approved', 
        product_id: item.product_id || null, 
        updated_at: item.updated_at 
      }).eq('id', id);
    } catch (e) {}

    this._saveLocalConsignment(item);
    return item;
  },

  /** Admin: Từ chối yêu cầu ký gửi */
  async rejectConsignmentRequest(id, notes = '') {
    const list = await this.getConsignmentRequests();
    const item = list.find(x => x.id === id);
    if (!item) return null;

    item.status = 'rejected';
    item.admin_notes = notes;
    item.updated_at = new Date().toISOString();

    try {
      await _db.from('consignment_requests').update({ 
        status: 'rejected', 
        admin_notes: notes, 
        updated_at: item.updated_at 
      }).eq('id', id);
    } catch (e) {}

    this._saveLocalConsignment(item);
    return item;
  },

  /** Admin: Giải ngân sau 3 ngày cho người ký gửi */
  async payoutConsignmentRequest(id, notes = '') {
    const list = await this.getConsignmentRequests();
    const item = list.find(x => x.id === id);
    if (!item) return null;

    item.status = 'payout_completed';
    item.payout_completed_at = new Date().toISOString();
    item.admin_notes = notes || 'Đã chuyển khoản giải ngân thành công qua ngân hàng';
    item.updated_at = item.payout_completed_at;

    try {
      await _db.from('consignment_requests').update({ 
        status: 'payout_completed', 
        payout_completed_at: item.payout_completed_at,
        admin_notes: item.admin_notes,
        updated_at: item.updated_at 
      }).eq('id', id);
    } catch (e) {}

    this._saveLocalConsignment(item);
    return item;
  },

  /* Helper quản lý localStorage cho Consignment (chỉ lưu các đơn thật) */
  _getLocalConsignments() {
    try {
      const raw = JSON.parse(localStorage.getItem('pv_consignments') || '[]');
      if (!Array.isArray(raw)) return [];
      // Lọc bỏ triệt để mọi bản ghi mẫu nếu trước đây vô tình lưu vào browser
      return raw.filter(item => item && item.id && !item.id.startsWith('CR-PENDING-') && !item.id.startsWith('CR-APP-') && !item.id.startsWith('CR-DELIV-'));
    } catch (e) {
      return [];
    }
  },

  _saveLocalConsignment(item) {
    try {
      const list = this._getLocalConsignments();
      const idx = list.findIndex(x => x.id === item.id);
      if (idx >= 0) list[idx] = { ...list[idx], ...item };
      else list.unshift(item);
      localStorage.setItem('pv_consignments', JSON.stringify(list));
    } catch (e) {}
  }
};

// Expose globally
window.SupabaseDB = SupabaseDB;
window.supabaseClient = _db; // backwards-compat với admin panel