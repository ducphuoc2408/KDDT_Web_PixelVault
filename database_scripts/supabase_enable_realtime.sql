-- Bật tính năng Real-time cho bảng orders để web tự động cập nhật khi khách thanh toán
BEGIN;
  -- Thử thêm bảng orders vào luồng realtime. Nếu báo lỗi "already exists" thì bỏ qua.
  DO $$ 
  BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
          AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    END IF;
  END $$;
COMMIT;
