-- Xóa d? li?u rác (n?u có) gây l?i không th? t?o khóa ngo?i
DELETE FROM order_items WHERE order_id NOT IN (SELECT id FROM orders);
DELETE FROM order_items WHERE product_id NOT IN (SELECT id FROM products);

-- Xóa các khóa ngo?i cu (n?u có b? l?i tên)
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS fk_order_items_order;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS fk_order_items_product;

-- Kh?i t?o l?i khóa ngo?i chu?n cho order_items
ALTER TABLE order_items 
  ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items 
  ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- C?p nh?t Schema Cache c?a Supabase PostgREST d? web nh?n di?n ngay l?p t?c
NOTIFY pgrst, 'reload schema';
