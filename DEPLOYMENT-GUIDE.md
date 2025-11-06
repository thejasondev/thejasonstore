# 🚀 Guía de Despliegue - The Jason Store

## ✅ Pre-Despliegue Checklist

### 1. Verificación de Código
- [x] TypeScript sin errores
- [x] ESLint configurado
- [x] Componentes optimizados
- [x] Imágenes con Next/Image
- [x] SEO metadata completo
- [x] PWA manifest configurado
- [x] Headers de seguridad

### 2. Variables de Entorno
- [ ] Configurar `.env.local` en producción
- [ ] Verificar Supabase credentials
- [ ] Configurar WhatsApp phone
- [ ] Configurar site URL

### 3. Base de Datos (Supabase)
- [ ] Tablas creadas
- [ ] RLS policies configuradas
- [ ] Storage buckets configurados
- [ ] Índices optimizados

---

## 📋 Pasos para Despliegue en Vercel (Recomendado)

### Opción 1: Deploy desde GitHub (Recomendado)

#### Paso 1: Subir código a GitHub
```powershell
# 1. Verificar estado
git status

# 2. Agregar todos los cambios
git add .

# 3. Commit
git commit -m "feat: preparar proyecto para producción

- Simplificar CartButton (eliminar Sheet)
- Optimizar navegación con breadcrumbs
- Configurar headers de seguridad
- Agregar PWA manifest
- Implementar sistema de skeletons
- Mejorar UX móvil completo"

# 4. Subir a GitHub
git push origin main
```

#### Paso 2: Conectar con Vercel

1. **Ir a Vercel**
   - Ve a https://vercel.com
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub

2. **Configurar Proyecto**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm build (auto-detectado)
   Output Directory: .next (auto-detectado)
   Install Command: pnpm install (auto-detectado)
   ```

3. **Variables de Entorno**
   
   Agrega estas variables en Vercel:
   
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   
   # Site
   NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
   NEXT_PUBLIC_WHATSAPP_PHONE=5353118193
   
   # Analytics (Opcional)
   NEXT_PUBLIC_GA_ID=
   ```

4. **Deploy**
   - Click "Deploy"
   - Espera 2-3 minutos
   - ✅ ¡Listo!

#### Paso 3: Configurar Dominio (Opcional)

1. En Vercel → Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones
4. Esperar propagación (5-10 min)

---

### Opción 2: Deploy desde CLI

```powershell
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

---

## 🗄️ Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Click "New Project"
3. Configura:
   - Name: thejasonstore
   - Database Password: (guarda esto)
   - Region: South America (más cercano)

### 2. Crear Tablas

Ejecuta este SQL en Supabase SQL Editor:

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de carrito
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_session_id ON cart_items(session_id);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Productos: lectura pública
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Carrito: usuarios pueden ver/editar su propio carrito
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

CREATE POLICY "Users can insert own cart"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

CREATE POLICY "Users can delete own cart"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id');
```

### 3. Configurar Storage

1. En Supabase → Storage
2. Crear bucket "products"
3. Configurar como público
4. Subir imágenes de productos

### 4. Obtener Credentials

1. Settings → API
2. Copiar:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔧 Optimizaciones Post-Despliegue

### 1. Performance

```powershell
# Analizar bundle size
pnpm build
# Revisar .next/analyze/client.html
```

**Optimizaciones aplicadas:**
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático
- ✅ Compresión de assets
- ✅ Caché de API routes
- ✅ Skeletons para loading states

### 2. SEO

**Ya implementado:**
- ✅ Metadata en todas las páginas
- ✅ JSON-LD structured data
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Open Graph tags
- ✅ Twitter Cards

**Verificar:**
```bash
# Google Search Console
https://search.google.com/search-console

# PageSpeed Insights
https://pagespeed.web.dev/
```

### 3. Analytics

**Vercel Analytics (Incluido gratis):**
- Ya configurado con `@vercel/analytics`
- Se activa automáticamente en producción

**Google Analytics (Opcional):**
1. Crear propiedad en GA4
2. Agregar `NEXT_PUBLIC_GA_ID` en Vercel
3. Ya está integrado en el código

### 4. Monitoreo

**Vercel Dashboard:**
- Logs en tiempo real
- Métricas de performance
- Error tracking
- Analytics

**Supabase Dashboard:**
- Database health
- API usage
- Storage usage
- Logs

---

## 🧪 Testing Pre-Producción

### 1. Build Local

```powershell
# Limpiar caché
rm -rf .next

# Build
pnpm build

# Test producción local
pnpm start

# Abrir http://localhost:3000
```

### 2. Checklist de Testing

**Funcionalidad:**
- [ ] Búsqueda de productos funciona
- [ ] Agregar al carrito funciona
- [ ] Actualizar cantidades funciona
- [ ] Eliminar del carrito funciona
- [ ] WhatsApp checkout funciona
- [ ] Navegación entre páginas fluida
- [ ] Filtros de categorías funcionan

**Responsive:**
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

**Performance:**
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1

**SEO:**
- [ ] Titles únicos por página
- [ ] Meta descriptions
- [ ] Alt text en imágenes
- [ ] Structured data válido

---

## 🚨 Troubleshooting

### Error: "Module not found"
```powershell
# Limpiar node_modules
rm -rf node_modules
pnpm install
```

### Error: "Build failed"
```powershell
# Verificar TypeScript
pnpm type-check

# Verificar ESLint
pnpm lint
```

### Error: "Supabase connection failed"
- Verificar variables de entorno
- Verificar RLS policies
- Verificar API keys

### Error: "Images not loading"
- Verificar `next.config.mjs` → `remotePatterns`
- Verificar Storage bucket es público
- Verificar URLs de imágenes

---

## 📊 Métricas de Éxito

### Performance Goals
- **Lighthouse Score:** > 90
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Speed Index:** < 3s

### Business Goals
- **Tasa de conversión:** > 2%
- **Bounce rate:** < 50%
- **Tiempo en sitio:** > 2 min
- **Páginas por sesión:** > 3

---

## 🔄 Workflow de Desarrollo Continuo

### 1. Desarrollo Local
```powershell
git checkout -b feature/nueva-funcionalidad
# Hacer cambios
git add .
git commit -m "feat: descripción"
git push origin feature/nueva-funcionalidad
```

### 2. Preview Deploy
- Vercel crea preview automático en cada PR
- URL: `https://thejasonstore-git-branch.vercel.app`

### 3. Merge a Main
```powershell
# En GitHub: Create Pull Request
# Review → Merge
# Vercel deploya automáticamente a producción
```

---

## 📝 Notas Importantes

### Seguridad
- ✅ Headers de seguridad configurados
- ✅ CSP (Content Security Policy)
- ✅ HTTPS forzado
- ✅ RLS en Supabase
- ⚠️ Nunca commitear `.env.local`

### Backup
- Supabase hace backup automático diario
- Exportar DB manualmente: Settings → Database → Backups

### Costos
**Vercel (Hobby - Gratis):**
- 100GB bandwidth/mes
- Builds ilimitados
- Dominios ilimitados

**Supabase (Free Tier):**
- 500MB database
- 1GB storage
- 50,000 usuarios activos/mes

**Upgrade cuando:**
- Tráfico > 100GB/mes
- Database > 500MB
- Necesites más performance

---

## ✅ Checklist Final Pre-Deploy

- [ ] Código en GitHub
- [ ] Variables de entorno configuradas
- [ ] Supabase setup completo
- [ ] Build local exitoso
- [ ] Testing manual completo
- [ ] Lighthouse score > 90
- [ ] WhatsApp phone correcto
- [ ] Imágenes optimizadas
- [ ] README actualizado
- [ ] Documentación completa

---

## 🎉 Post-Deploy

### Inmediatamente después:
1. ✅ Verificar sitio en producción
2. ✅ Probar checkout de WhatsApp
3. ✅ Verificar Analytics funcionando
4. ✅ Compartir URL con stakeholders

### Primera semana:
1. 📊 Monitorear Vercel Analytics
2. 🐛 Revisar logs de errores
3. 📈 Verificar métricas de performance
4. 💬 Recopilar feedback de usuarios

### Primer mes:
1. 🔍 Analizar Google Analytics
2. 🚀 Optimizar según datos
3. 🎯 A/B testing de CTAs
4. 📱 Verificar comportamiento móvil

---

## 🆘 Soporte

**Documentación:**
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs

**Comunidad:**
- Next.js Discord
- Vercel Discord
- Supabase Discord

---

**¡Tu proyecto está listo para producción! 🚀**
