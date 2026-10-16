-- ==============================================================================
-- GIẢI PHÁP CÁCH B: CHUẨN HÓA MÔ HÌNH ERD VỚI KHÓA NGOẠI KÉP (DUAL FOREIGN KEYS)
-- orders (1)  <---- (N) transactions (order_id REFERENCES orders.id)
-- rentals (1) <---- (N) transactions (rental_id REFERENCES rentals.id)
-- Copy toàn bộ file này vào Supabase SQL Editor và bấm Run.
-- ==============================================================================

-- 1. Xóa các hàm cũ để tránh lỗi trùng lặp (PGRST203)
DROP FUNCTION IF EXISTS sepay_webhook(bigint, text, text, text, text, text, text, text, numeric, numeric, text, text);
DROP FUNCTION IF EXISTS sepay_webhook(bigint, text, text, text, text, text, text, text, numeric, numeric, text, text, text, text, text);
DROP FUNCTION IF EXISTS sepay_webhook(json);
DROP FUNCTION IF EXISTS sepay_webhook();

-- 2. THIẾT LẬP CẤU TRÚC VÀ DI CHUYỂN DỮ LIỆU CŨ SANG CHUẨN CÁCH B
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS rental_id text;

-- Cho phép order_id là NULL khi là giao dịch thuê máy (PVR)
ALTER TABLE public.transactions 
  ALTER COLUMN order_id DROP NOT NULL;

-- Tạm gỡ ràng buộc cũ (nếu có) để làm sạch dữ liệu hiện hữu
ALTER TABLE public.transactions 
  DROP CONSTRAINT IF EXISTS transactions_order_id_fkey;

ALTER TABLE public.transactions 
  DROP CONSTRAINT IF EXISTS transactions_rental_id_fkey;

-- [QUAN TRỌNG] Chuyển các giao dịch PVR cũ đang lưu ở order_id sang rental_id
UPDATE public.transactions 
SET rental_id = order_id, 
    order_id = NULL 
WHERE upper(order_id) LIKE 'PVR%';

-- Làm sạch các order_id không có trong bảng orders (dữ liệu test hoặc không tồn tại)
UPDATE public.transactions 
SET order_id = NULL 
WHERE order_id IS NOT NULL 
  AND order_id NOT IN (SELECT id FROM public.orders);

-- Làm sạch các rental_id không có trong bảng rentals (dữ liệu test hoặc không tồn tại)
UPDATE public.transactions 
SET rental_id = NULL 
WHERE rental_id IS NOT NULL 
  AND rental_id NOT IN (SELECT id FROM public.rentals);

-- Thiết lập ràng buộc khóa ngoại chuẩn ERD (Cách B)
ALTER TABLE public.transactions 
  ADD CONSTRAINT transactions_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

ALTER TABLE public.transactions 
  ADD CONSTRAINT transactions_rental_id_fkey 
  FOREIGN KEY (rental_id) REFERENCES public.rentals(id) ON DELETE SET NULL;

-- 3. TẠO HÀM WEBHOOK SEPAY THEO CHUẨN CÁCH B
CREATE OR REPLACE FUNCTION sepay_webhook(
    id bigint DEFAULT NULL,
    gateway text DEFAULT NULL,
    "transactionDate" text DEFAULT NULL,
    "accountNumber" text DEFAULT NULL,
    "subAccount" text DEFAULT NULL,
    code text DEFAULT NULL,
    content text DEFAULT NULL,
    "transferType" text DEFAULT NULL,
    "transferAmount" numeric DEFAULT NULL,
    accumulated numeric DEFAULT NULL,
    "referenceCode" text DEFAULT NULL,
    description text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id text;
    v_order record;
BEGIN
    -- Chỉ xử lý tiền vào (in)
    IF "transferType" != 'in' THEN
        RETURN json_build_object('success', false, 'message', 'Ignored out transfer');
    END IF;

    -- Tìm mã đơn hàng (PV) hoặc mã đơn thuê (PVR)
    v_order_id := substring(upper(content) from 'PVR?-?[0-9]+');

    IF v_order_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'No valid order/rental ID found in content');
    END IF;

    -- Kiểm tra xem đây là đơn thuê (PVR) hay đơn mua (PV)
    IF v_order_id LIKE 'PVR%' THEN
        SELECT * INTO v_order FROM rentals WHERE replace(rentals.id, '-', '') = replace(v_order_id, '-', '') LIMIT 1;
        
        IF NOT FOUND THEN
            RETURN json_build_object('success', false, 'message', 'Rental not found: ' || v_order_id);
        END IF;
        
        -- Cập nhật đơn thuê sang trạng thái active (Đang thuê)
        UPDATE rentals SET status = 'active' WHERE rentals.id = v_order.id;

        -- Lưu vào transactions: order_id = NULL, rental_id = v_order.id (Chuẩn ERD)
        INSERT INTO transactions (
          order_id, rental_id, transaction_id, amount, content, payment_time, gateway
        ) VALUES (
          NULL,
          v_order.id, 
          sepay_webhook.id::text, 
          sepay_webhook."transferAmount"::numeric::int8, 
          sepay_webhook.content, 
          sepay_webhook."transactionDate"::timestamptz, 
          sepay_webhook.gateway
        ) ON CONFLICT (transaction_id) DO UPDATE SET
          rental_id = EXCLUDED.rental_id,
          amount = EXCLUDED.amount,
          payment_time = EXCLUDED.payment_time;

    ELSE
        SELECT * INTO v_order FROM orders WHERE replace(orders.id, '-', '') = replace(v_order_id, '-', '') LIMIT 1;
        
        IF NOT FOUND THEN
            RETURN json_build_object('success', false, 'message', 'Order not found: ' || v_order_id);
        END IF;
        
        -- Cập nhật đơn hàng sang trạng thái confirmed (Đã xác nhận)
        UPDATE orders SET status = 'confirmed' WHERE orders.id = v_order.id;

        -- Lưu vào transactions: order_id = v_order.id, rental_id = NULL (Chuẩn ERD)
        INSERT INTO transactions (
          order_id, rental_id, transaction_id, amount, content, payment_time, gateway
        ) VALUES (
          v_order.id, 
          NULL,
          sepay_webhook.id::text, 
          sepay_webhook."transferAmount"::numeric::int8, 
          sepay_webhook.content, 
          sepay_webhook."transactionDate"::timestamptz, 
          sepay_webhook.gateway
        ) ON CONFLICT (transaction_id) DO UPDATE SET
          order_id = EXCLUDED.order_id,
          amount = EXCLUDED.amount,
          payment_time = EXCLUDED.payment_time;
    END IF;

    RETURN json_build_object('success', true, 'message', 'Order/Rental ' || v_order.id || ' paid successfully!');
END;
$$;

-- 4. CẤP QUYỀN THỰC THI CHO USER NẶC DANH (ANON)
GRANT EXECUTE ON FUNCTION sepay_webhook(bigint, text, text, text, text, text, text, text, numeric, numeric, text, text) TO anon;
