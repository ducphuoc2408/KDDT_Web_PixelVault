-- Thêm cột giới hạn số lượng, ngày hết hạn, và điều kiện đơn đầu tiên cho bảng coupons
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS max_uses integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_first_order boolean DEFAULT false;
