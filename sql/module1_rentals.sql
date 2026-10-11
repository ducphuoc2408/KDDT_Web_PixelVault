-- MODULE 1: HỆ THỐNG CHO THUÊ THIẾT BỊ (EQUIPMENT RENTAL SYSTEM)

-- 1. Tạo bảng rentals
CREATE TABLE public.rentals (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rental_days INTEGER NOT NULL CHECK (rental_days > 0),
    daily_rate NUMERIC NOT NULL CHECK (daily_rate >= 0),
    deposit_amount NUMERIC NOT NULL CHECK (deposit_amount >= 0),
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL CHECK (status IN ('pending_deposit', 'active', 'completed', 'cancelled')) DEFAULT 'pending_deposit',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- 2. Thiết lập chính sách (Policies) cho bảng rentals
-- Policy 1: User chỉ xem đơn thuê của mình
CREATE POLICY "Users can view their own rentals"
    ON public.rentals
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: User có thể tạo đơn thuê của chính mình
CREATE POLICY "Users can insert their own rentals"
    ON public.rentals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Admin có toàn quyền (Giả sử có bảng user_roles hoặc field role trong bảng user)
-- Ở đây cấu hình RLS cơ bản cho role admin (có role là service_role hoặc thông qua một claim tùy chỉnh)
CREATE POLICY "Admins have full access to rentals"
    ON public.rentals
    USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
        OR auth.role() = 'service_role'
    );

-- Cập nhật hàm xử lý update updated_at (Nếu chưa có trigger, tạo trigger function)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rentals_updated_at
BEFORE UPDATE ON public.rentals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Optional: Bật publication cho realtime (cập nhật status qua websocket)
ALTER PUBLICATION supabase_realtime ADD TABLE public.rentals;
