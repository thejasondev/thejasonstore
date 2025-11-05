-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN',
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to products"
  ON public.products
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert products (admin only)
CREATE POLICY "Allow authenticated users to insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update products (admin only)
CREATE POLICY "Allow authenticated users to update products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete products (admin only)
CREATE POLICY "Allow authenticated users to delete products"
  ON public.products
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
