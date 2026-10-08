-- 1. Tạo bảng coupons để lưu trữ mã giảm giá
CREATE TABLE public.coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_pct integer NOT NULL,
  condition_min numeric DEFAULT 0,
  description text,
  uses integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật bảo mật mức dòng (Row Level Security)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 3. Cấp quyền truy cập
-- Bất kỳ ai cũng có thể đọc danh sách mã giảm giá để kiểm tra ở trang Thanh toán
CREATE POLICY "Cho phép tất cả mọi người đọc coupons" ON public.coupons FOR SELECT USING (true);

-- Tạm thời cho phép thêm/sửa/xóa để Admin quản lý hoặc Checkout tự động tăng uses
CREATE POLICY "Cho phép insert coupons" ON public.coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Cho phép update coupons" ON public.coupons FOR UPDATE USING (true);
CREATE POLICY "Cho phép delete coupons" ON public.coupons FOR DELETE USING (true);

-- 4. Thêm 3 mã khuyến mãi mặc định ban đầu
INSERT INTO public.coupons (code, discount_pct, condition_min, description, uses) VALUES 
('PIXEL10', 10, 0, 'Không giới hạn', 45),
('CAMERA20', 20, 30000000, 'Đơn từ 30 triệu', 23),
('FIRSTBUY', 15, 0, 'Đơn đầu tiên', 60);
