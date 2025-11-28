-- Migration: Add currency support to products table
-- Run this in Supabase SQL Editor

-- Step 1: Add currency column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'currency'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
  END IF;
END $$;

-- Step 2: Update existing products with NULL currency to USD
UPDATE products 
SET currency = 'USD' 
WHERE currency IS NULL OR currency = '';

-- Step 3: Add constraint to ensure currency is always set
ALTER TABLE products 
ALTER COLUMN currency SET NOT NULL;

-- Step 4: Add check constraint for valid currencies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'products_currency_check'
  ) THEN
    ALTER TABLE products 
    ADD CONSTRAINT products_currency_check 
    CHECK (currency IN ('USD', 'EUR', 'CUP'));
  END IF;
END $$;

-- Verification: Check the results
SELECT 
  COUNT(*) as total_products,
  currency,
  COUNT(*) as count_by_currency
FROM products
GROUP BY currency;
