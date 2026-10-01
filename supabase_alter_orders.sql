-- Bổ sung cột discount_amount cho bảng orders để lưu số tiền khách hàng tiết kiệm được từ mã giảm giá
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
