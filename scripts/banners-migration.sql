-- ============================================
-- BANNERS SYSTEM MIGRATION
-- Sistema de gestión de banners y secciones
-- ============================================

-- Limpiar tabla existente si existe
DROP TABLE IF EXISTS banners CASCADE;

-- ============================================
-- TABLA DE BANNERS
-- ============================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contenido
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  
  -- Call to Action
  cta_text TEXT,
  cta_link TEXT,
  cta_style TEXT DEFAULT 'primary' CHECK (cta_style IN ('primary', 'secondary', 'outline')),
  
  -- Configuración
  position TEXT NOT NULL CHECK (position IN ('hero', 'slider', 'info', 'sidebar')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Programación automática
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Estilo personalizado
  background_color TEXT,
  text_color TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_banners_position ON banners(position);
CREATE INDEX idx_banners_active ON banners(is_active);
CREATE INDEX idx_banners_order ON banners(display_order);
CREATE INDEX idx_banners_dates ON banners(start_date, end_date);
CREATE INDEX idx_banners_position_order ON banners(position, display_order);

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER PARA updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_banners_updated_at ON banners;
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Policy: Todos pueden ver banners activos
DROP POLICY IF EXISTS "Banners are viewable by everyone" ON banners;
CREATE POLICY "Banners are viewable by everyone"
  ON banners FOR SELECT
  USING (true);

-- Policy: Solo usuarios autenticados pueden crear
DROP POLICY IF EXISTS "Authenticated users can create banners" ON banners;
CREATE POLICY "Authenticated users can create banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Solo usuarios autenticados pueden actualizar
DROP POLICY IF EXISTS "Authenticated users can update banners" ON banners;
CREATE POLICY "Authenticated users can update banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Solo usuarios autenticados pueden eliminar
DROP POLICY IF EXISTS "Authenticated users can delete banners" ON banners;
CREATE POLICY "Authenticated users can delete banners"
  ON banners FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- STORAGE BUCKET PARA IMÁGENES
-- ============================================
-- Nota: Ejecutar en el panel de Supabase Storage o mediante API

-- Crear bucket 'banners' (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS DE STORAGE
-- ============================================
-- Policy: Usuarios autenticados pueden subir
DROP POLICY IF EXISTS "Authenticated users can upload banner images" ON storage.objects;
CREATE POLICY "Authenticated users can upload banner images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners');

-- Policy: Usuarios autenticados pueden actualizar
DROP POLICY IF EXISTS "Authenticated users can update banner images" ON storage.objects;
CREATE POLICY "Authenticated users can update banner images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners')
  WITH CHECK (bucket_id = 'banners');

-- Policy: Usuarios autenticados pueden eliminar
DROP POLICY IF EXISTS "Authenticated users can delete banner images" ON storage.objects;
CREATE POLICY "Authenticated users can delete banner images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners');

-- Policy: Todos pueden ver imágenes (bucket público)
DROP POLICY IF EXISTS "Public can view banner images" ON storage.objects;
CREATE POLICY "Public can view banner images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'banners');

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================
-- Banner Hero de ejemplo
INSERT INTO banners (
  title,
  description,
  image_url,
  image_alt,
  cta_text,
  cta_link,
  cta_style,
  position,
  display_order,
  is_active
) VALUES (
  'Bienvenido a The Jason Store',
  'Descubre miles de productos de vendedores verificados. Compra fácil y seguro por WhatsApp.',
  '/placeholder.svg?height=600&width=1200',
  'Banner de bienvenida',
  'Ver Productos',
  '/productos',
  'primary',
  'hero',
  1,
  true
);

-- Banner Info de ejemplo
INSERT INTO banners (
  title,
  description,
  image_url,
  cta_text,
  cta_link,
  position,
  display_order,
  is_active
) VALUES (
  '🚚 Envío Gratis',
  'En compras mayores a $50',
  '/placeholder.svg?height=200&width=400',
  'Ver más',
  '/productos',
  'info',
  1,
  true
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar que la tabla se creó correctamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'banners'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'banners';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
