-- Seed initial products
INSERT INTO public.products (sku, slug, title, description, price, currency, stock, images, category) VALUES
  (
    'ELEC-001',
    'auriculares-bluetooth-premium',
    'Auriculares Bluetooth Premium',
    'Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas y sonido de alta fidelidad. Perfectos para música, llamadas y gaming.',
    2499.00,
    'MXN',
    15,
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    'electronica'
  ),
  (
    'MODA-001',
    'reloj-minimalista-negro',
    'Reloj Minimalista Negro',
    'Reloj de pulsera minimalista con correa de cuero genuino y caja de acero inoxidable. Diseño atemporal y elegante para cualquier ocasión.',
    3999.00,
    'MXN',
    8,
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    'moda'
  ),
  (
    'HOGAR-001',
    'lampara-escritorio-led',
    'Lámpara de Escritorio LED',
    'Lámpara LED regulable con brazo articulado y base estable. Luz blanca ajustable, perfecta para trabajo y estudio. Bajo consumo energético.',
    899.00,
    'MXN',
    20,
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    'hogar'
  ),
  (
    'DEPORT-001',
    'botella-termica-acero',
    'Botella Térmica de Acero',
    'Botella térmica de acero inoxidable de 750ml. Mantiene bebidas frías por 24h y calientes por 12h. Libre de BPA, perfecta para deportes.',
    599.00,
    'MXN',
    30,
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    'deportes'
  ),
  (
    'ELEC-002',
    'cargador-inalambrico-rapido',
    'Cargador Inalámbrico Rápido',
    'Cargador inalámbrico de carga rápida compatible con todos los dispositivos Qi. Diseño minimalista con indicador LED y protección contra sobrecalentamiento.',
    799.00,
    'MXN',
    25,
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    'electronica'
  ),
  (
    'MODA-002',
    'mochila-minimalista-negra',
    'Mochila Minimalista Negra',
    'Mochila urbana de diseño minimalista con compartimento para laptop de 15", múltiples bolsillos organizadores y material resistente al agua.',
    1899.00,
    'MXN',
    12,
    ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
    'moda'
  )
ON CONFLICT (sku) DO NOTHING;
