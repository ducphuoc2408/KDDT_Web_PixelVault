-- ==============================================================================
-- TỰ ĐỘNG ĐỒNG BỘ SỐ ĐƠN HÀNG (order_count) VÀ TỔNG CHI TIÊU (total_spent)
-- TỪ BẢNG orders VÀO BẢNG profiles
--
-- Quy tắc:
-- 1. order_count: Đếm các đơn hàng có status = 'completed' (Đã hoàn thành)
-- 2. total_spent: Tính tổng tiền total của các đơn có status = 'completed'
-- ==============================================================================

-- BƯỚC 1: Đảm bảo bảng profiles có đầy đủ 2 cột cần thiết
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS order_count integer DEFAULT 0;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS total_spent numeric DEFAULT 0;

-- ==============================================================================
-- BƯỚC 2: Tạo hàm tính toán & đồng bộ số liệu cho khách hàng
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.recalculate_customer_order_stats(p_user_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_user_id IS NOT NULL THEN
    -- Cập nhật cho 1 khách hàng cụ thể
    UPDATE public.profiles p
    SET 
      order_count = COALESCE((
        SELECT COUNT(*)::integer 
        FROM public.orders o 
        WHERE o.user_id = p.id AND o.status = 'completed'
      ), 0),
      total_spent = COALESCE((
        SELECT SUM(o.total) 
        FROM public.orders o 
        WHERE o.user_id = p.id AND o.status = 'completed'
      ), 0)
    WHERE p.id = p_user_id;
  ELSE
    -- Cập nhật cho toàn bộ khách hàng trong database
    UPDATE public.profiles p
    SET 
      order_count = COALESCE((
        SELECT COUNT(*)::integer 
        FROM public.orders o 
        WHERE o.user_id = p.id AND o.status = 'completed'
      ), 0),
      total_spent = COALESCE((
        SELECT SUM(o.total) 
        FROM public.orders o 
        WHERE o.user_id = p.id AND o.status = 'completed'
      ), 0);
  END IF;
END;
$$;

-- ==============================================================================
-- BƯỚC 3: Tạo Trigger Function tự động kích hoạt khi có thay đổi trên bảng orders
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.trigger_sync_profile_order_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Xác định user_id bị ảnh hưởng
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- Đồng bộ cho user_id hiện tại
  IF v_user_id IS NOT NULL THEN
    PERFORM public.recalculate_customer_order_stats(v_user_id);
  END IF;

  -- Trường hợp đặc biệt: Đơn hàng bị đổi chủ sở hữu (user_id thay đổi khi UPDATE)
  IF TG_OP = 'UPDATE' AND OLD.user_id IS NOT NULL AND OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    PERFORM public.recalculate_customer_order_stats(OLD.user_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ==============================================================================
-- BƯỚC 4: Gắn Trigger vào bảng orders (INSERT, UPDATE, DELETE)
-- ==============================================================================
DROP TRIGGER IF EXISTS trg_sync_profile_order_stats ON public.orders;

CREATE TRIGGER trg_sync_profile_order_stats
AFTER INSERT OR UPDATE OR DELETE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.trigger_sync_profile_order_stats();

-- ==============================================================================
-- BƯỚC 5: Cấp quyền thực thi hàm cho người dùng
-- ==============================================================================
GRANT EXECUTE ON FUNCTION public.recalculate_customer_order_stats(uuid) TO authenticated, service_role, anon;

-- ==============================================================================
-- BƯỚC 6: CHẠY ĐỒNG BỘ NGAY LẬP TỨC CHO TẤT CẢ KHÁCH HÀNG HIỆN CÓ
-- ==============================================================================
SELECT public.recalculate_customer_order_stats();

-- Kiểm tra kết quả sau khi đồng bộ
SELECT id, name, email, order_count, total_spent 
FROM public.profiles 
ORDER BY total_spent DESC;
