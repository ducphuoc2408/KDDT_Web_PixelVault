-- ==============================================================================
-- PIXELVAULT: LIÊN KẾT (MATCH) BẢNG consignment_requests VỚI CÁC BẢNG KHÁC
-- 1. Thêm Foreign Key nối sang bảng products (cột product_id -> products.id)
-- 2. Thêm Foreign Key nối sang bảng orders (cột order_id -> orders.id)
-- 3. Thêm Foreign Key nối sang bảng auth.users / profiles (cột seller_id)
-- 4. Cấp toàn quyền RLS cho products và consignment_requests (sửa lỗi 42501)
-- 5. Trigger tự động match dữ liệu (order_id khi mua hàng, delivered_at khi giao hàng)
-- 6. Khắc phục ngay lập tức bản ghi hiện có (gán product_id = 11 cho Sony ZVE10)
-- ==============================================================================

-- ==============================================================================
-- BƯỚC 1: LÀM SẠCH DỮ LIỆU RÁC (NẾU CÓ) ĐỂ KHÔNG BỊ XUNG ĐỘT KHI TẠO FOREIGN KEY
-- ==============================================================================
UPDATE public.consignment_requests
SET product_id = NULL
WHERE product_id IS NOT NULL 
  AND product_id NOT IN (SELECT id FROM public.products);

UPDATE public.consignment_requests
SET order_id = NULL
WHERE order_id IS NOT NULL 
  AND order_id NOT IN (SELECT id FROM public.orders);

-- ==============================================================================
-- BƯỚC 2: THÊM CÁC RÀNG BUỘC KHÓA NGOẠI (FOREIGN KEYS) ĐỂ MATCH CÁC BẢNG VỚI NHAU
-- Sau bước này, trên sơ đồ Supabase Schema Visualizer sẽ xuất hiện đầy đủ các dây nối!
-- ==============================================================================

-- 1. Match bảng consignment_requests với bảng products qua product_id
ALTER TABLE public.consignment_requests
  DROP CONSTRAINT IF EXISTS fk_consignment_product;

ALTER TABLE public.consignment_requests
  ADD CONSTRAINT fk_consignment_product
  FOREIGN KEY (product_id)
  REFERENCES public.products(id)
  ON DELETE SET NULL;

-- 2. Match bảng consignment_requests với bảng orders qua order_id
ALTER TABLE public.consignment_requests
  DROP CONSTRAINT IF EXISTS fk_consignment_order;

ALTER TABLE public.consignment_requests
  ADD CONSTRAINT fk_consignment_order
  FOREIGN KEY (order_id)
  REFERENCES public.orders(id)
  ON DELETE SET NULL;

-- 3. Thêm cột seller_id và match với bảng auth.users (nếu người ký gửi có tài khoản)
ALTER TABLE public.consignment_requests
  ADD COLUMN IF NOT EXISTS seller_id uuid DEFAULT NULL;

ALTER TABLE public.consignment_requests
  DROP CONSTRAINT IF EXISTS fk_consignment_seller;

ALTER TABLE public.consignment_requests
  ADD CONSTRAINT fk_consignment_seller
  FOREIGN KEY (seller_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- ==============================================================================
-- BƯỚC 3: MỞ QUYỀN RLS ĐỂ ADMIN VÀ WEB INSERT/UPDATE ĐƯỢC BẢNG products & consignment
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can insert products" ON public.products;
CREATE POLICY "Public can insert products"
ON public.products FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update products" ON public.products;
CREATE POLICY "Public can update products"
ON public.products FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete products" ON public.products;
CREATE POLICY "Public can delete products"
ON public.products FOR DELETE
TO anon, authenticated
USING (true);

-- Xóa bỏ check constraint cũ nếu có để cho phép đa dạng danh mục hàng cũ
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Quyền cho consignment_requests
ALTER TABLE public.consignment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert consignment requests" ON public.consignment_requests;
CREATE POLICY "Anyone can insert consignment requests"
ON public.consignment_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view consignment requests" ON public.consignment_requests;
CREATE POLICY "Public can view consignment requests"
ON public.consignment_requests FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow update consignment requests" ON public.consignment_requests;
CREATE POLICY "Allow update consignment requests"
ON public.consignment_requests FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- BƯỚC 4: HÀM RPC DUYỆT ĐƠN KÝ GỬI (TỰ ĐỘNG TẠO PRODUCT VÀ NỐI product_id)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.approve_consignment_request(p_req_id TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_req RECORD;
  v_new_product_id BIGINT;
  v_category TEXT;
  v_result json;
BEGIN
  SELECT * INTO v_req FROM public.consignment_requests WHERE id = p_req_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy yêu cầu ký gửi %', p_req_id;
  END IF;

  -- Xác định category hợp lệ
  IF v_req.product_name ILIKE '%lens%' OR v_req.product_name ILIKE '%ống kính%' THEN
    v_category := 'lens';
  ELSIF v_req.product_name ILIKE '%pin%' OR v_req.product_name ILIKE '%thẻ%' OR v_req.product_name ILIKE '%tripod%' THEN
    v_category := 'accessory';
  ELSIF v_req.product_name ILIKE '%dslr%' THEN
    v_category := 'dslr';
  ELSE
    v_category := 'mirrorless';
  END IF;

  -- Nếu chưa có product_id, tạo sản phẩm mới vào bảng products
  IF v_req.product_id IS NULL THEN
    INSERT INTO public.products (
      name,
      brand,
      category,
      price,
      original_price,
      images,
      specs,
      tags,
      rating,
      reviews,
      stock,
      badge,
      description
    ) VALUES (
      v_req.product_name || ' (Hàng Cũ Ký Gửi - ' || v_req.condition || ')',
      v_req.brand,
      v_category,
      v_req.final_price,
      v_req.final_price,
      COALESCE(v_req.images, ARRAY['assets/images/sony_alpha.jpg']::TEXT[]),
      jsonb_build_object('Tình trạng', v_req.condition, 'Nguồn gốc', 'Ký gửi chính hãng PixelVault'),
      ARRAY['Hàng Cũ Ký Gửi', v_req.condition, v_req.brand],
      5.0,
      0,
      1,
      v_req.condition,
      format('[HÀNG CŨ - KÝ GỬI KIỂM ĐỊNH] %s. Tình trạng: %s. %s', v_req.product_name, v_req.condition, COALESCE(v_req.description, ''))
    )
    RETURNING id INTO v_new_product_id;
  ELSE
    v_new_product_id := v_req.product_id;
  END IF;

  -- Cập nhật lại consignment_requests
  UPDATE public.consignment_requests
  SET 
    status = 'approved',
    product_id = v_new_product_id,
    updated_at = NOW()
  WHERE id = p_req_id;

  SELECT row_to_json(c) INTO v_result 
  FROM public.consignment_requests c 
  WHERE id = p_req_id;

  RETURN v_result;
END;
$$;

-- ==============================================================================
-- BƯỚC 5: TRIGGERS TỰ ĐỘNG ĐIỀN order_id VÀ delivered_at
-- ==============================================================================

-- 1. Khi khách mua hàng (order_items) -> Tự động điền order_id vào consignment_requests
CREATE OR REPLACE FUNCTION public.handle_consignment_order_matched()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.consignment_requests
  SET 
    order_id = NEW.order_id,
    status = 'sold',
    updated_at = NOW()
  WHERE product_id = NEW.product_id
    AND status IN ('approved', 'pending_approval');
    
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_consignment_order_matched ON public.order_items;
CREATE TRIGGER trg_consignment_order_matched
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.handle_consignment_order_matched();

-- 2. Khi đơn hàng được giao thành công (orders.status = delivered) -> Điền delivered_at
CREATE OR REPLACE FUNCTION public.handle_consignment_order_delivered()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status IN ('delivered', 'completed') AND (OLD.status IS NULL OR OLD.status NOT IN ('delivered', 'completed')) THEN
    UPDATE public.consignment_requests
    SET 
      delivered_at = COALESCE(NEW.delivered_at, NOW()),
      status = 'delivered',
      updated_at = NOW()
    WHERE order_id = NEW.id
      AND status NOT IN ('payout_completed');
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_consignment_order_delivered ON public.orders;
CREATE TRIGGER trg_consignment_order_delivered
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_consignment_order_delivered();

-- ==============================================================================
-- BƯỚC 6: KHẮC PHỤC NGAY LẬP TỨC DỮ LIỆU ĐANG BỊ THIẾU
-- 1. Điền Tên và Email cho người ký gửi từ thông tin chủ tài khoản ngân hàng
-- 2. Match sản phẩm Sony ZVE10 (ID: 11) vào product_id của bản ghi ký gửi
-- ==============================================================================
UPDATE public.consignment_requests
SET 
  seller_name = CASE 
    WHEN seller_name = 'Khách ký gửi' OR seller_name IS NULL OR seller_name = '' 
    THEN COALESCE(seller_bank_holder, 'Nguyễn Đức Phước') 
    ELSE seller_name 
  END,
  seller_email = CASE 
    WHEN seller_email IS NULL OR seller_email = '' 
    THEN 'phuocnguyen@pixelvault.vn' 
    ELSE seller_email 
  END,
  product_id = COALESCE(product_id, 11)
WHERE product_name ILIKE '%Sony%ZV%E10%' OR id = 'CR1791950189968';
