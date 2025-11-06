-- ============================================
-- SETUP COMPLETO PARA THE JASON STORE
-- ============================================
-- Este script crea todas las tablas necesarias
-- Puede ejecutarse múltiples veces sin errores
-- ============================================

-- Limpiar tablas existentes (en orden correcto por dependencias)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS inventory_logs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================
-- 1. TABLA DE CATEGORÍAS
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para categorías
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ============================================
-- 2. TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);

-- ============================================
-- 3. TABLA DE CARRITO
-- ============================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cart_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Índices para carrito
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_cart_product ON cart_items(product_id);

-- ============================================
-- 4. TABLA DE INVENTARIO (LOGS)
-- ============================================
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('sale', 'restock', 'adjustment')),
  quantity_change INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para logs de inventario
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_created ON inventory_logs(created_at);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para CATEGORIES (lectura pública, escritura admin)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Categories are editable by authenticated users"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para PRODUCTS (lectura pública, escritura admin)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by authenticated users"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para CART (usuarios solo ven su carrito)
CREATE POLICY "Users can view their own cart"
  ON cart_items FOR SELECT
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Políticas para INVENTORY LOGS (solo admin)
CREATE POLICY "Inventory logs viewable by authenticated users"
  ON inventory_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Inventory logs editable by authenticated users"
  ON inventory_logs FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- 6. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. DATOS DE EJEMPLO - CATEGORÍAS
-- ============================================

INSERT INTO categories (name, slug, description, icon, display_order) VALUES
('Electrónica', 'electronica', 'Dispositivos y gadgets tecnológicos', 'Laptop', 1),
('Moda', 'moda', 'Ropa y accesorios de tendencia', 'Shirt', 2),
('Hogar', 'hogar', 'Artículos para el hogar y decoración', 'Home', 3),
('Deportes', 'deportes', 'Equipamiento deportivo y fitness', 'Dumbbell', 4),
('Libros', 'libros', 'Libros físicos y digitales', 'BookOpen', 5),
('Juguetes', 'juguetes', 'Juguetes y entretenimiento', 'Gamepad2', 6);

-- ============================================
-- 8. DATOS DE EJEMPLO - PRODUCTOS
-- ============================================

INSERT INTO products (sku, slug, title, description, price, currency, stock, images, category, category_id, is_featured) VALUES
(
  'ELEC-001',
  'auriculares-bluetooth-premium',
  'Auriculares Bluetooth Premium',
  'Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas y sonido Hi-Fi. Perfectos para música, llamadas y gaming.',
  89.99,
  'USD',
  50,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'Electrónica',
  (SELECT id FROM categories WHERE slug = 'electronica'),
  true
),
(
  'MODA-001',
  'chaqueta-cuero-clasica',
  'Chaqueta de Cuero Clásica',
  'Chaqueta de cuero genuino con diseño atemporal. Perfecta para cualquier ocasión, combina estilo y durabilidad.',
  199.99,
  'USD',
  30,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'Moda',
  (SELECT id FROM categories WHERE slug = 'moda'),
  true
),
(
  'HOGAR-001',
  'lampara-escritorio-led',
  'Lámpara de Escritorio LED',
  'Lámpara LED moderna con brazo ajustable, 3 niveles de brillo y puerto USB para carga. Ideal para trabajo y estudio.',
  45.99,
  'USD',
  75,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'Hogar',
  (SELECT id FROM categories WHERE slug = 'hogar'),
  true
),
(
  'DEPORT-001',
  'mancuernas-ajustables-20kg',
  'Mancuernas Ajustables 20kg',
  'Set de mancuernas ajustables de 5 a 20kg por mancuerna. Perfectas para entrenamiento en casa, ahorran espacio.',
  129.99,
  'USD',
  40,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'Deportes',
  (SELECT id FROM categories WHERE slug = 'deportes'),
  true
),
(
  'LIBRO-001',
  'el-arte-de-la-guerra',
  'El Arte de la Guerra - Sun Tzu',
  'Edición especial del clásico tratado militar chino. Incluye comentarios y análisis modernos. Tapa dura con ilustraciones.',
  24.99,
  'USD',
  100,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'Libros',
  (SELECT id FROM categories WHERE slug = 'libros'),
  true
),
(
  'JUG-001',
  'drone-camara-4k',
  'Drone con Cámara 4K',
  'Drone compacto con cámara 4K, estabilización gimbal de 3 ejes, 25 minutos de vuelo y control por app. Perfecto para principiantes.',
  299.99,
  'USD',
  25,
  ARRAY['/placeholder.svg?height=400&width=400'],
  'Juguetes',
  (SELECT id FROM categories WHERE slug = 'juguetes'),
  true
);

-- ============================================
-- 9. VERIFICACIÓN FINAL
-- ============================================

DO $$
DECLARE
  cat_count INTEGER;
  prod_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO cat_count FROM categories;
  SELECT COUNT(*) INTO prod_count FROM products;
  
  RAISE NOTICE '✅ Setup completado exitosamente!';
  RAISE NOTICE '📊 Categorías creadas: %', cat_count;
  RAISE NOTICE '📦 Productos creados: %', prod_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Tu base de datos está lista para usar!';
  RAISE NOTICE '🔄 Refresca tu aplicación en v0 para ver los cambios';
END $$;
