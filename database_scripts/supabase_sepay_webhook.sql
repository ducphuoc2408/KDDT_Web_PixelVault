-- 1. Xóa tất cả các hàm cũ để tránh lỗi trùng lặp (PGRST203)
DROP FUNCTION IF EXISTS sepay_webhook(bigint, text, text, text, text, text, text, text, numeric, numeric, text, text);
DROP FUNCTION IF EXISTS sepay_webhook(bigint, text, text, text, text, text, text, text, numeric, numeric, text, text, text, text, text);
DROP FUNCTION IF EXISTS sepay_webhook(json);
DROP FUNCTION IF EXISTS sepay_webhook();

-- 2. Tạo hàm mới hỗ trợ trực tiếp chuẩn dữ liệu của SePay
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

    -- Trích xuất mã đơn hàng có định dạng PV-XXXX hoặc PVXXXX từ nội dung chuyển khoản
    -- Ngân hàng thường tự động xóa ký tự đặc biệt (dấu trừ), nên ta tìm cả 2 trường hợp
    v_order_id := substring(upper(content) from 'PV-?[0-9]+');

    -- Nếu không tìm thấy mã PV- trong nội dung
    IF v_order_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'No valid order ID found in content');
    END IF;

    -- Tìm đơn hàng trong hệ thống (So sánh không tính dấu gạch ngang)
    SELECT * INTO v_order FROM orders WHERE replace(orders.id, '-', '') = replace(v_order_id, '-', '') LIMIT 1;

    -- Nếu không tồn tại đơn hàng
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Order not found: ' || v_order_id);
    END IF;

    UPDATE orders 
    SET status = 'confirmed'
    WHERE orders.id = v_order.id;

    -- Lưu lại thông tin giao dịch vào bảng transactions
    INSERT INTO transactions (
      order_id, transaction_id, amount, content, payment_time, gateway
    ) VALUES (
      v_order.id, 
      sepay_webhook.id::text, 
      sepay_webhook."transferAmount"::numeric::int8, 
      sepay_webhook.content, 
      sepay_webhook."transactionDate"::timestamptz, 
      sepay_webhook.gateway
    ) ON CONFLICT (transaction_id) DO NOTHING;

    RETURN json_build_object('success', true, 'message', 'Order ' || v_order.id || ' paid successfully!');
END;
$$;

-- 3. Cấp quyền cho user nặc danh (anon)
GRANT EXECUTE ON FUNCTION sepay_webhook(bigint, text, text, text, text, text, text, text, numeric, numeric, text, text) TO anon;
