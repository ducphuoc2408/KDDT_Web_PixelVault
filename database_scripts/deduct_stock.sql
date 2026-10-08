-- Hàm x? lý tr? t?n kho
CREATE OR REPLACE FUNCTION deduct_stock_on_complete()
RETURNS TRIGGER AS $$
DECLARE
    item record;
BEGIN
    -- Ch? th?c hi?n khi status chuy?n t? tr?ng thái khác sang 'confirmed' (t?c là dã thanh toán)
    IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') THEN
        -- Duy?t qua t?t c? các s?n ph?m trong don hàng dó
        FOR item IN (SELECT product_id, quantity FROM order_items WHERE order_id = NEW.id)
        LOOP
            -- Tr? s? lu?ng t?n kho (không cho phép âm)
            UPDATE products 
            SET stock = GREATEST(stock - item.quantity, 0)
            WHERE id = item.product_id;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- T?o Trigger g?n vào b?ng orders
DROP TRIGGER IF EXISTS trg_deduct_stock_on_complete ON orders;
CREATE TRIGGER trg_deduct_stock_on_complete
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION deduct_stock_on_complete();
