-- 1. Tạo bảng reviews để lưu đánh giá sản phẩm thực tế
CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  status text DEFAULT 'pending', -- 'pending' (chờ duyệt), 'approved' (đã duyệt), 'rejected' (từ chối)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật bảo mật mức dòng (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Cấp quyền truy cập
-- Cho phép mọi người đọc các đánh giá
CREATE POLICY "Cho phép tất cả mọi người đọc reviews" ON public.reviews FOR SELECT USING (true);

-- Tạm thời cho phép thêm/sửa để User gửi đánh giá và Admin duyệt
CREATE POLICY "Cho phép insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Cho phép update reviews" ON public.reviews FOR UPDATE USING (true);
