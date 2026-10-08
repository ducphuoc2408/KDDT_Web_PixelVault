-- 1. Xóa toàn bộ số liệu đánh giá ảo trong bảng products
UPDATE public.products
SET rating = 0, reviews = 0;

-- 2. Tạo hàm tự động cập nhật rating và reviews cho sản phẩm
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Tính toán lại trung bình rating và tổng số đánh giá (chỉ lấy những đánh giá đã duyệt)
  UPDATE public.products
  SET 
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE product_id = NEW.product_id AND status = 'approved'), 0),
    reviews = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id AND status = 'approved')
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Gắn Trigger vào bảng reviews (mỗi khi thêm/sửa đánh giá thì tự chạy hàm trên)
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating();
