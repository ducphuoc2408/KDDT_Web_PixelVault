-- =========================================================================
-- FILE SQL HOÀN CHỈNH CHO PHẦN ĐÁNH GIÁ (REVIEWS) VÀ CẬP NHẬT RATING
-- =========================================================================

-- 1. Tạo bảng reviews để lưu đánh giá sản phẩm thực tế
-- Sửa lỗi type: product_id dùng kiểu bigint để khớp với cột id của bảng products
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id bigint NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  status text DEFAULT 'pending', -- 'pending' (chờ duyệt), 'approved' (đã duyệt), 'rejected' (từ chối)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật bảo mật mức dòng (Row Level Security) cho bảng reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Cấp quyền truy cập cho bảng reviews
-- Xóa policy cũ nếu có để tránh lỗi trùng lặp
DROP POLICY IF EXISTS "Cho phép tất cả mọi người đọc reviews" ON public.reviews;
DROP POLICY IF EXISTS "Cho phép insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Cho phép update reviews" ON public.reviews;

CREATE POLICY "Cho phép tất cả mọi người đọc reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Cho phép insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Cho phép update reviews" ON public.reviews FOR UPDATE USING (true);

-- =========================================================================

-- 4. Xóa toàn bộ số liệu đánh giá ảo trong bảng products
UPDATE public.products
SET rating = 0, reviews = 0;

-- 5. Tạo hàm tự động cập nhật rating và reviews cho sản phẩm khi có đánh giá mới được duyệt
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Tính toán lại trung bình rating và tổng số đánh giá (chỉ đếm những đánh giá đã duyệt - 'approved')
  UPDATE public.products
  SET 
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE product_id = NEW.product_id AND status = 'approved'), 0),
    reviews = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id AND status = 'approved')
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Gắn Trigger vào bảng reviews (mỗi khi Admin duyệt đánh giá thì tự cập nhật số sao của sản phẩm)
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating();
