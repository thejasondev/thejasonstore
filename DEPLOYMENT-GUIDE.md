# Guía Completa de Despliegue - Tienda E-commerce

Esta guía te llevará paso a paso para desplegar tu tienda online completa (frontend + backend) en Vercel con Supabase.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase (Backend)](#configuración-de-supabase-backend)
3. [Configuración del Proyecto Local](#configuración-del-proyecto-local)
4. [Despliegue en Vercel (Frontend)](#despliegue-en-vercel-frontend)
5. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
6. [Ejecución de Scripts de Base de Datos](#ejecución-de-scripts-de-base-de-datos)
7. [Configuración de Autenticación](#configuración-de-autenticación)
8. [Verificación y Pruebas](#verificación-y-pruebas)
9. [Solución de Problemas](#solución-de-problemas)

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta de GitHub (gratuita)
- ✅ Cuenta de Vercel (gratuita) - [vercel.com/signup](https://vercel.com/signup)
- ✅ Cuenta de Supabase (gratuita) - [supabase.com](https://supabase.com)
- ✅ Node.js 18+ instalado localmente
- ✅ Git instalado
- ✅ Número de WhatsApp para recibir pedidos

---

## 2. Configuración de Supabase (Backend)

### 2.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Completa los datos:
   - **Name**: `tienda-ecommerce` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura y **guárdala**
   - **Region**: Selecciona la más cercana a tu ubicación
   - **Pricing Plan**: Free (suficiente para empezar)
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras Supabase configura tu base de datos

### 2.2 Obtener Credenciales de Supabase

Una vez creado el proyecto:

1. Ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API**
3. Copia y guarda estos valores (los necesitarás después):

\`\`\`
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (¡SECRETO!)
\`\`\`

### 2.3 Crear Tablas en la Base de Datos

1. Ve a **SQL Editor** en el menú lateral de Supabase
2. Haz clic en **"New query"**
3. Copia y pega el contenido del archivo `scripts/001_create_products_table.sql`:

\`\`\`sql
-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MXN',
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer productos
CREATE POLICY "Productos visibles públicamente"
  ON products FOR SELECT
  USING (true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Solo autenticados pueden insertar productos"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Solo autenticados pueden actualizar
CREATE POLICY "Solo autenticados pueden actualizar productos"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política: Solo autenticados pueden eliminar
CREATE POLICY "Solo autenticados pueden eliminar productos"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');
\`\`\`

4. Haz clic en **"Run"** (▶️)
5. Deberías ver el mensaje: **"Success. No rows returned"**

### 2.4 Insertar Productos de Ejemplo

1. Crea una **nueva query** en el SQL Editor
2. Copia y pega el contenido de `scripts/002_seed_products.sql`:

\`\`\`sql
-- Insertar productos de ejemplo
INSERT INTO products (sku, slug, title, description, price, currency, stock, images, category)
VALUES
  (
    'PROD-001',
    'auriculares-bluetooth-premium',
    'Auriculares Bluetooth Premium',
    'Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas y sonido Hi-Fi.',
    1299.00,
    'MXN',
    15,
    ARRAY['/placeholder.svg?height=600&width=600'],
    'Electrónica'
  ),
  (
    'PROD-002',
    'mochila-minimalista-negra',
    'Mochila Minimalista Negra',
    'Mochila urbana de diseño minimalista con compartimento para laptop de 15", resistente al agua.',
    899.00,
    'MXN',
    25,
    ARRAY['/placeholder.svg?height=600&width=600'],
    'Accesorios'
  ),
  (
    'PROD-003',
    'reloj-inteligente-deportivo',
    'Reloj Inteligente Deportivo',
    'Smartwatch con monitor de frecuencia cardíaca, GPS integrado y resistencia al agua 5ATM.',
    2499.00,
    'MXN',
    10,
    ARRAY['/placeholder.svg?height=600&width=600'],
    'Electrónica'
  ),
  (
    'PROD-004',
    'lampara-escritorio-led',
    'Lámpara de Escritorio LED',
    'Lámpara LED regulable con carga inalámbrica integrada y 3 modos de iluminación.',
    599.00,
    'MXN',
    30,
    ARRAY['/placeholder.svg?height=600&width=600'],
    'Hogar'
  ),
  (
    'PROD-005',
    'botella-termica-acero',
    'Botella Térmica de Acero',
    'Botella térmica de acero inoxidable que mantiene bebidas frías 24h y calientes 12h.',
    449.00,
    'MXN',
    50,
    ARRAY['/placeholder.svg?height=600&width=600'],
    'Accesorios'
  ),
  (
    'PROD-006',
    'teclado-mecanico-rgb',
    'Teclado Mecánico RGB',
    'Teclado mecánico gaming con switches azules, iluminación RGB personalizable y reposamuñecas.',
    1899.00,
    'MXN',
    12,
    ARRAY['/placeholder.svg?height=600&width=600'],
    'Electrónica'
  );
\`\`\`

3. Haz clic en **"Run"** (▶️)
4. Deberías ver: **"Success. 6 rows affected"**

### 2.5 Verificar que Todo Funciona

1. Ve a **Table Editor** en el menú lateral
2. Selecciona la tabla **products**
3. Deberías ver los 6 productos insertados

✅ **¡Backend configurado correctamente!**

---

## 3. Configuración del Proyecto Local

### 3.1 Clonar o Descargar el Proyecto

Si tienes el proyecto en GitHub:
\`\`\`bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
\`\`\`

Si descargaste el ZIP desde v0:
\`\`\`bash
unzip proyecto.zip
cd proyecto
\`\`\`

### 3.2 Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3.3 Configurar Variables de Entorno Locales

1. Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`bash
touch .env.local
\`\`\`

2. Abre `.env.local` y agrega tus credenciales de Supabase:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# WhatsApp (formato E.164: código país + número sin espacios ni guiones)
NEXT_PUBLIC_WHATSAPP_PHONE=521331234567

# Supabase Auth Redirect (para desarrollo local)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

**⚠️ IMPORTANTE:**
- Reemplaza los valores con tus credenciales reales de Supabase
- El `NEXT_PUBLIC_WHATSAPP_PHONE` debe estar en formato E.164
  - México: `521` + 10 dígitos (ej: `521331234567`)
  - España: `34` + 9 dígitos (ej: `34612345678`)
  - Argentina: `54` + código área + número

### 3.4 Probar Localmente

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

Deberías ver:
- ✅ La página de inicio con productos
- ✅ Botón flotante de WhatsApp
- ✅ Productos cargados desde Supabase

---

## 4. Despliegue en Vercel (Frontend)

### 4.1 Subir Código a GitHub

Si aún no has subido tu código a GitHub:

1. Crea un nuevo repositorio en [github.com/new](https://github.com/new)
2. Sigue las instrucciones para subir tu código:

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
\`\`\`

### 4.2 Importar Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio de GitHub
4. Haz clic en **"Import"**

### 4.3 Configurar el Proyecto

En la pantalla de configuración:

1. **Framework Preset**: Next.js (detectado automáticamente)
2. **Root Directory**: `./` (dejar por defecto)
3. **Build Command**: `npm run build` (por defecto)
4. **Output Directory**: `.next` (por defecto)

**NO hagas clic en "Deploy" todavía** - primero configuraremos las variables de entorno.

---

## 5. Configuración de Variables de Entorno

### 5.1 Agregar Variables en Vercel

En la misma pantalla de configuración, expande **"Environment Variables"**:

Agrega las siguientes variables **una por una**:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (secreto) | Production |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | `521331234567` | Production, Preview, Development |

**⚠️ IMPORTANTE:**
- Marca **Production**, **Preview** y **Development** para las variables públicas (`NEXT_PUBLIC_*`)
- Solo marca **Production** para `SUPABASE_SERVICE_ROLE_KEY` (es secreto)

### 5.2 Desplegar

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye y despliega tu aplicación
3. Una vez completado, verás: **"Congratulations! 🎉"**

### 5.3 Obtener URL de Producción

Vercel te asignará una URL como:
\`\`\`
https://tu-proyecto.vercel.app
\`\`\`

Haz clic en **"Visit"** para ver tu tienda en vivo.

---

## 6. Configuración de Autenticación

Para que el panel de administración funcione, necesitas configurar la autenticación en Supabase.

### 6.1 Configurar URL de Redirección en Supabase

1. Ve a tu proyecto en Supabase
2. Ve a **Authentication** → **URL Configuration**
3. En **Site URL**, agrega tu URL de Vercel:
   \`\`\`
   https://tu-proyecto.vercel.app
   \`\`\`
4. En **Redirect URLs**, agrega:
   \`\`\`
   https://tu-proyecto.vercel.app/**
   http://localhost:3000/**
   \`\`\`
5. Haz clic en **"Save"**

### 6.2 Crear Usuario Administrador

1. Ve a **Authentication** → **Users** en Supabase
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: tu-email@ejemplo.com
   - **Password**: Una contraseña segura
   - **Auto Confirm User**: ✅ (activado)
4. Haz clic en **"Create user"**

### 6.3 Probar el Login

1. Ve a `https://tu-proyecto.vercel.app/auth/login`
2. Ingresa el email y contraseña que creaste
3. Deberías ser redirigido a `/admin`
4. Verás el panel de administración con la tabla de productos

✅ **¡Autenticación configurada!**

---

## 7. Verificación y Pruebas

### 7.1 Checklist de Funcionalidades

Verifica que todo funcione correctamente:

- [ ] **Página de inicio** carga correctamente
- [ ] **Productos** se muestran desde Supabase
- [ ] **Búsqueda** de productos funciona
- [ ] **Filtros** por categoría funcionan
- [ ] **Página de producto individual** carga
- [ ] **Botón de WhatsApp** abre con mensaje pre-llenado
- [ ] **Botón flotante de WhatsApp** aparece en mobile
- [ ] **Login** en `/auth/login` funciona
- [ ] **Panel admin** en `/admin` es accesible
- [ ] **CRUD de productos** funciona en admin
- [ ] **Responsive design** se ve bien en mobile

### 7.2 Probar Botón de WhatsApp

1. Ve a cualquier producto
2. Haz clic en **"Comprar por WhatsApp"**
3. Verifica que el mensaje contenga:
   - ✅ Nombre del producto
   - ✅ SKU
   - ✅ Precio
   - ✅ URL del producto
4. Haz clic en **"Abrir WhatsApp"**
5. Deberías ver WhatsApp Web/App con el mensaje pre-llenado

### 7.3 Probar Panel de Administración

1. Inicia sesión en `/auth/login`
2. Ve a `/admin`
3. Prueba:
   - ✅ Ver lista de productos
   - ✅ Crear nuevo producto
   - ✅ Editar producto existente
   - ✅ Eliminar producto

---

## 8. Solución de Problemas

### Problema: "No se cargan los productos"

**Causa**: Error de conexión con Supabase

**Solución**:
1. Verifica que las variables de entorno estén correctas en Vercel
2. Ve a Vercel → Settings → Environment Variables
3. Compara con las credenciales de Supabase
4. Si hiciste cambios, haz un nuevo deploy:
   \`\`\`bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   \`\`\`

### Problema: "Error 401 al crear productos en admin"

**Causa**: RLS (Row Level Security) bloqueando la operación

**Solución**:
1. Ve a Supabase → SQL Editor
2. Ejecuta:
   \`\`\`sql
   -- Ver políticas actuales
   SELECT * FROM pg_policies WHERE tablename = 'products';
   \`\`\`
3. Asegúrate de que las políticas permitan operaciones para usuarios autenticados

### Problema: "WhatsApp no abre correctamente"

**Causa**: Formato incorrecto del número de teléfono

**Solución**:
1. Verifica que `NEXT_PUBLIC_WHATSAPP_PHONE` esté en formato E.164
2. Debe ser: código país + número (sin +, espacios, guiones)
3. Ejemplo correcto: `521331234567`
4. Ejemplo incorrecto: `+52 133 123 4567`

### Problema: "Error 500 en producción"

**Causa**: Variable de entorno faltante o incorrecta

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que todas las variables estén presentes
3. Revisa los logs en Vercel → Deployments → [último deploy] → Logs

### Problema: "No puedo acceder a /admin"

**Causa**: No estás autenticado o el middleware no funciona

**Solución**:
1. Asegúrate de haber iniciado sesión en `/auth/login`
2. Verifica que el archivo `middleware.ts` exista en la raíz
3. Revisa que las cookies de Supabase se estén guardando correctamente

---

## 9. Mantenimiento y Actualizaciones

### 9.1 Actualizar Productos

**Opción 1: Panel de Administración**
1. Ve a `/admin`
2. Usa la interfaz para agregar/editar/eliminar productos

**Opción 2: SQL Editor de Supabase**
1. Ve a Supabase → SQL Editor
2. Ejecuta queries SQL directamente

### 9.2 Hacer Cambios en el Código

1. Edita los archivos localmente
2. Prueba con `npm run dev`
3. Sube los cambios:
   \`\`\`bash
   git add .
   git commit -m "Descripción de cambios"
   git push
   \`\`\`
4. Vercel desplegará automáticamente

### 9.3 Monitoreo

- **Analytics**: Ve a Vercel → Analytics para ver tráfico
- **Logs**: Ve a Vercel → Deployments → Logs para errores
- **Supabase**: Ve a Supabase → Database → Logs para queries

---

## 10. Recursos Adicionales

- **Documentación de Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Documentación de Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Documentación de Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Soporte de v0**: [vercel.com/help](https://vercel.com/help)

---

## 11. Checklist Final de Despliegue

Antes de considerar tu proyecto 100% funcional:

- [ ] Supabase configurado con tablas y datos
- [ ] Variables de entorno configuradas en Vercel
- [ ] Proyecto desplegado en Vercel
- [ ] URL de producción funcionando
- [ ] Productos visibles en la tienda
- [ ] WhatsApp funcionando correctamente
- [ ] Usuario admin creado
- [ ] Panel de administración accesible
- [ ] CRUD de productos funcional
- [ ] Responsive design verificado
- [ ] SEO configurado (meta tags, sitemap)
- [ ] PWA manifest configurado
- [ ] Analytics de Vercel activado

---

## 🎉 ¡Felicidades!

Tu tienda e-commerce está completamente desplegada y funcional. Ahora puedes:

1. Compartir tu URL con clientes
2. Agregar productos desde el panel admin
3. Recibir pedidos por WhatsApp
4. Monitorear el tráfico en Vercel Analytics

**¿Necesitas ayuda?** Abre un ticket en [vercel.com/help](https://vercel.com/help)
