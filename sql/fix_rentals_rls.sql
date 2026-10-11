-- FIX RLS CHO BẢNG RENTALS
-- Cho phép Admin và hệ thống cập nhật trạng thái đơn thuê mà không bị chặn bởi RLS

ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- 1. Bật chính sách SELECT cho mọi người đọc (hoặc đọc đơn của mình)
DROP POLICY IF EXISTS "Cho phép đọc rentals" ON public.rentals;
CREATE POLICY "Cho phép đọc rentals" ON public.rentals FOR SELECT USING (true);

-- 2. Bật chính sách INSERT
DROP POLICY IF EXISTS "Cho phép insert rentals" ON public.rentals;
CREATE POLICY "Cho phép insert rentals" ON public.rentals FOR INSERT WITH CHECK (true);

-- 3. Bật chính sách UPDATE trạng thái đơn thuê
DROP POLICY IF EXISTS "Cho phép update rentals" ON public.rentals;
CREATE POLICY "Cho phép update rentals" ON public.rentals FOR UPDATE USING (true) WITH CHECK (true);
