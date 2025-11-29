-- ============================================
-- DISCOUNTS/SALES SUPPORT FOR THE JASON STORE
-- ============================================
-- This script adds sale/discount functionality to products
-- Using sale price model (not percentage) for clarity
-- Automatic activation/deactivation based on dates
-- ============================================

-- ============================================
-- 1. ADD COLUMNS TO PRODUCTS TABLE
-- ============================================

-- Add sale-related columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS sale_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN products.sale_price IS 'Discounted price when product is on sale';
COMMENT ON COLUMN products.sale_start_date IS 'Start date/time for sale period';
COMMENT ON COLUMN products.sale_end_date IS 'End date/time for sale period';
COMMENT ON COLUMN products.is_on_sale IS 'Flag indicating if product is currently on sale (auto-calculated)';

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for quickly finding products on sale
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(is_on_sale) WHERE is_on_sale = true;

-- Composite index for sale queries with dates
CREATE INDEX IF NOT EXISTS idx_products_sale_dates ON products(sale_start_date, sale_end_date) WHERE is_on_sale = true;

-- ============================================
-- 3. VALIDATION CONSTRAINTS
-- ============================================

-- Ensure sale price is positive and less than regular price
ALTER TABLE products
  ADD CONSTRAINT chk_sale_price_positive 
    CHECK (sale_price IS NULL OR sale_price > 0);

ALTER TABLE products
  ADD CONSTRAINT chk_sale_price_less_than_regular 
    CHECK (sale_price IS NULL OR sale_price < price);

-- Ensure sale dates are valid (end after start)
ALTER TABLE products
  ADD CONSTRAINT chk_sale_dates_valid 
    CHECK (
      (sale_start_date IS NULL AND sale_end_date IS NULL) OR
      (sale_start_date IS NOT NULL AND sale_end_date IS NOT NULL AND sale_end_date > sale_start_date)
    );

-- ============================================
-- 4. FUNCTION TO UPDATE SALE STATUS
-- ============================================

CREATE OR REPLACE FUNCTION update_product_sale_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically calculate is_on_sale based on:
  -- 1. sale_price must exist
  -- 2. sale_start_date must exist
  -- 3. sale_end_date must exist
  -- 4. Current time must be between start and end dates
  
  IF NEW.sale_price IS NOT NULL 
     AND NEW.sale_start_date IS NOT NULL 
     AND NEW.sale_end_date IS NOT NULL 
     AND NOW() BETWEEN NEW.sale_start_date AND NEW.sale_end_date THEN
    NEW.is_on_sale := true;
  ELSE
    NEW.is_on_sale := false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. CREATE TRIGGER FOR AUTOMATIC UPDATES
-- ============================================

-- Drop trigger if exists to allow re-running script
DROP TRIGGER IF EXISTS trigger_update_sale_status ON products;

-- Create trigger that runs on INSERT and UPDATE
CREATE TRIGGER trigger_update_sale_status
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_sale_status();

-- ============================================
-- 6. FUNCTION TO CLEAN EXPIRED SALES (Optional Cron Job)
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_sales()
RETURNS void AS $$
BEGIN
  -- Update all products where sale has expired
  UPDATE products
  SET is_on_sale = false
  WHERE is_on_sale = true
    AND (sale_end_date IS NULL OR sale_end_date < NOW());
    
  RAISE NOTICE 'Expired sales cleaned up successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. UPDATE EXISTING PRODUCTS
-- ============================================

-- Set is_on_sale to false for all existing products
UPDATE products SET is_on_sale = false WHERE is_on_sale IS NULL;

-- ============================================
-- 8. VERIFICATION
-- ============================================

DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'products'
    AND column_name IN ('sale_price', 'sale_start_date', 'sale_end_date', 'is_on_sale');
  
  IF col_count = 4 THEN
    RAISE NOTICE '✅ All discount columns added successfully!';
    RAISE NOTICE '📊 Columns: sale_price, sale_start_date, sale_end_date, is_on_sale';
    RAISE NOTICE '🔧 Triggers configured for automatic sale status updates';
    RAISE NOTICE '🎯 Indexes created for optimized queries';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Discount system is ready to use!';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Tips:';
    RAISE NOTICE '   - Set sale_price, sale_start_date, and sale_end_date to activate a sale';
    RAISE NOTICE '   - is_on_sale will be automatically calculated based on dates';
    RAISE NOTICE '   - Products can be both featured AND on sale';
    RAISE NOTICE '   - Run cleanup_expired_sales() periodically to clean up expired sales';
  ELSE
    RAISE WARNING '⚠️  Some columns may not have been added correctly';
    RAISE WARNING 'Expected 4 columns, found %', col_count;
  END IF;
END $$;
