-- ==============================================================================
-- PIXELVAULT: MODULE HÀNG CŨ - KÝ GỬI & GIẢI NGÂN SAU 3 NGÀY (72H)
-- Script cập nhật Supabase PostgreSQL:
-- 1. Bảng consignment_requests (Lưu thông tin đăng ký ký gửi và giải ngân)
-- 2. Cập nhật bảng orders (Thêm delivered_at để tính mốc 72 giờ bảo hành)
-- 3. Row Level Security (RLS) & Policies
-- 4. Seed Data mẫu để kiểm thử ngay lập tức trên hệ thống
-- ==============================================================================

-- BƯỚC 1: CẬP NHẬT BẢNG orders (HỖ TRỢ MỐC THỜI GIAN GIAO HÀNG delivered_at)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz DEFAULT NULL;

-- BƯỚC 2: TẠO BẢNG consignment_requests
CREATE TABLE IF NOT EXISTS public.consignment_requests (
  id TEXT PRIMARY KEY,                                      -- Ví dụ: CR1740000000000
  seller_name TEXT NOT NULL,                                -- Họ tên người ký gửi
  seller_phone TEXT NOT NULL,                               -- Số điện thoại
  seller_email TEXT,                                        -- Email người ký gửi
  seller_bank_name TEXT NOT NULL,                           -- Tên ngân hàng (Vd: MB Bank, Vietcombank, Techcombank,...)
  seller_bank_account TEXT NOT NULL,                        -- Số tài khoản nhận tiền giải ngân
  seller_bank_holder TEXT NOT NULL,                         -- Tên chủ tài khoản
  product_name TEXT NOT NULL,                               -- Tên thiết bị ký gửi (Vd: Sony A7 Mark IV Body)
  brand TEXT NOT NULL,                                      -- Thương hiệu (Sony, Canon, Fujifilm, Nikon, Panasonic,...)
  category TEXT DEFAULT 'used-consignment',                 -- Danh mục máy cũ ký gửi
  condition TEXT NOT NULL DEFAULT 'Like New 99%',           -- Tình trạng (Like New 99%, 98%, 95%,...)
  description TEXT,                                         -- Mô tả chi tiết ngoại hình, phụ kiện kèm theo
  images TEXT[] DEFAULT ARRAY[]::TEXT[],                   -- Mảng đường dẫn / URL hình ảnh sản phẩm
  asking_price NUMERIC NOT NULL,                            -- Số tiền người bán muốn nhận về (Vd: 10,000,000 đ)
  commission_rate NUMERIC NOT NULL DEFAULT 5.0,             -- Tỷ lệ hoa hồng 5%
  commission_fee NUMERIC NOT NULL,                          -- Tiền hoa hồng sàn = final_price - asking_price (Vd: 526,000 đ)
  final_price NUMERIC NOT NULL,                             -- Giá niêm yết bán ngoài web = asking_price / 0.95 (Vd: 10,526,000 đ)
  status TEXT NOT NULL DEFAULT 'pending_approval',          -- Trạng thái: pending_approval, approved, rejected, sold, delivered, payout_completed
  product_id BIGINT DEFAULT NULL,                           -- Liên kết với ID bảng products sau khi admin duyệt
  order_id TEXT DEFAULT NULL,                               -- Mã đơn hàng mua sản phẩm này khi có khách đặt
  delivered_at timestamptz DEFAULT NULL,                    -- Thời điểm giao hàng thành công (dùng đếm 72h)
  payout_completed_at timestamptz DEFAULT NULL,             -- Thời điểm admin giải ngân thành công
  admin_notes TEXT,                                         -- Ghi chú kiểm duyệt / giải ngân của admin
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Index tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_consignment_status ON public.consignment_requests(status);
CREATE INDEX IF NOT EXISTS idx_consignment_product_id ON public.consignment_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_consignment_delivered_at ON public.consignment_requests(delivered_at);

-- BƯỚC 3: KÍCH HOẠT ROW LEVEL SECURITY (RLS) VÀ PHÂN QUYỀN POLICIES
ALTER TABLE public.consignment_requests ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép mọi người (khách chưa đăng nhập / đã đăng nhập) gửi form đăng ký ký gửi
DROP POLICY IF EXISTS "Anyone can insert consignment requests" ON public.consignment_requests;
CREATE POLICY "Anyone can insert consignment requests"
ON public.consignment_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Cho phép đọc thông tin đơn ký gửi (dành cho Admin và hệ thống)
DROP POLICY IF EXISTS "Public can view consignment requests" ON public.consignment_requests;
CREATE POLICY "Public can view consignment requests"
ON public.consignment_requests FOR SELECT
TO anon, authenticated
USING (true);

-- 3. Cho phép cập nhật trạng thái đơn ký gửi (Admin duyệt, giải ngân, liên kết đơn hàng)
DROP POLICY IF EXISTS "Allow update consignment requests" ON public.consignment_requests;
CREATE POLICY "Allow update consignment requests"
ON public.consignment_requests FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- BƯỚC 4: HÀM TRIGGER TỰ ĐỘNG TÍNH TOÁN GIÁ NIÊM YẾT VÀ PHÍ HOA HỒNG
CREATE OR REPLACE FUNCTION public.calculate_consignment_prices()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Công thức nghiệp vụ chuẩn:
  -- Giá bán ngoài web = asking_price / 0.95 (làm tròn đến hàng nghìn đồng)
  IF NEW.asking_price IS NOT NULL AND NEW.asking_price > 0 THEN
    NEW.final_price := ROUND((NEW.asking_price / 0.95) / 1000) * 1000;
    NEW.commission_fee := NEW.final_price - NEW.asking_price;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calc_consignment_prices ON public.consignment_requests;
CREATE TRIGGER trg_calc_consignment_prices
BEFORE INSERT OR UPDATE OF asking_price
ON public.consignment_requests
FOR EACH ROW
EXECUTE FUNCTION public.calculate_consignment_prices();

-- Hoàn tất khởi tạo cấu trúc CSDL cho Module Hàng Cũ - Ký Gửi.
-- Dữ liệu sẽ được lưu trữ và truy xuất 100% từ Supabase (thông qua form đăng ký client và admin panel).

