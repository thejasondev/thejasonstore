# The Jason Store - E-commerce Minimalista con WhatsApp

Tienda online minimalista y moderna construida con Next.js 16, TypeScript, Tailwind CSS y Supabase. Diseño profesional con efectos glassmorphism estilo iOS y compras directas por WhatsApp.

## 🎨 Características de Diseño

- ✨ **Glassmorphism moderno** con efectos de vidrio líquido estilo iOS
- 🎨 **Paleta profesional**: Negro, blanco y acento dorado (#F59E0B)
- 🎯 **Iconos por categoría** para mejor UX/UI
- 🎠 **Carrusel interactivo** de productos destacados con auto-play
- 📱 **Menú móvil mejorado** con animaciones suaves
- ✨ **Micro-interacciones** y transiciones elegantes
- 📲 **PWA ready** - instalable en dispositivos móviles

## Características Principales

- ✅ Catálogo de productos con filtros por categoría
- ✅ Integración con WhatsApp para compras directas
- ✅ Panel de administración protegido con Supabase Auth
- ✅ Base de datos PostgreSQL con Supabase
- ✅ SEO optimizado con meta tags dinámicos
- ✅ Sitemap y robots.txt automáticos
- ✅ JSON-LD para Schema.org
- ✅ Tests unitarios (Jest) y E2E (Playwright)
- ✅ CI/CD con GitHub Actions

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4 con glassmorphism
- **UI Components:** shadcn/ui personalizado
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Testing:** Jest + Playwright
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel

## Quick Start (5 pasos)

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar WhatsApp

Edita `lib/constants.ts` y actualiza tu número de WhatsApp:

\`\`\`typescript
export const WHATSAPP_PHONE = "521331234567" // Tu número en formato E.164
\`\`\`

### 3. Ejecutar scripts de base de datos

Los scripts SQL en `/scripts` crean las tablas y datos de ejemplo:
- `001_create_products_table.sql` - Crea la tabla de productos
- `002_seed_products.sql` - Inserta 6 productos de ejemplo

En v0, estos scripts se ejecutan automáticamente desde el panel lateral.

### 4. Iniciar servidor de desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Probar el botón de WhatsApp

1. Navega a `/productos`
2. Haz clic en cualquier producto
3. Presiona "Comprar por WhatsApp"
4. Verás el mensaje pre-llenado con datos del producto

## Estructura del Proyecto

\`\`\`
├── app/                      # Next.js App Router
│   ├── admin/               # Panel de administración
│   ├── auth/                # Páginas de autenticación
│   ├── producto/[slug]/     # Detalle de producto
│   ├── productos/           # Listado de productos
│   ├── contacto/            # Página de contacto
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página de inicio
├── components/              # Componentes React
│   ├── admin/              # Componentes del admin
│   ├── ui/                 # Componentes shadcn/ui
│   ├── header.tsx          # Header con menú móvil mejorado
│   ├── footer.tsx          # Footer
│   ├── product-card.tsx    # Tarjeta de producto con glassmorphism
│   ├── products-carousel.tsx # Carrusel moderno
│   ├── category-icon.tsx   # Iconos de categorías
│   ├── whatsapp-button.tsx # Botón de WhatsApp
│   └── whatsapp-float.tsx  # Botón flotante
├── lib/                     # Utilidades y lógica
│   ├── actions/            # Server Actions
│   ├── supabase/           # Clientes Supabase
│   ├── utils/              # Funciones auxiliares
│   ├── types.ts            # Tipos TypeScript
│   └── constants.ts        # Constantes (STORE_NAME, etc.)
├── scripts/                 # Scripts SQL
├── e2e/                     # Tests E2E (Playwright)
├── __tests__/              # Tests unitarios (Jest)
└── public/                  # Archivos estáticos
\`\`\`

## Scripts Disponibles

\`\`\`bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run test         # Tests unitarios
npm run test:e2e     # Tests E2E
\`\`\`

## 🎨 Personalización

### Cambiar nombre de la tienda

Edita `lib/constants.ts`:

\`\`\`typescript
export const STORE_NAME = "The Jason Store"
export const STORE_DESCRIPTION = "Tu tienda de confianza para productos de calidad"
\`\`\`

### Cambiar colores

Edita `app/globals.css` para cambiar la paleta:

\`\`\`css
:root {
  --accent: oklch(0.75 0.15 75); /* Color dorado actual */
}
\`\`\`

### Agregar categorías con iconos

Edita `lib/constants.ts`:

\`\`\`typescript
export const CATEGORIES = [
  { id: "1", name: "Electrónica", slug: "electronica", icon: "Laptop" },
  { id: "2", name: "Moda", slug: "moda", icon: "Shirt" },
  // Agrega más categorías...
]
\`\`\`

**Iconos disponibles:** Laptop, Shirt, Home, Dumbbell, BookOpen, Gamepad2

## Desplegar en Vercel

### Opción 1: Desde v0 (Recomendado)

1. Haz clic en "Publish" en la esquina superior derecha
2. v0 configurará automáticamente Vercel con todas las variables de entorno

### Opción 2: Desde GitHub

1. Sube tu código a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_PHONE`
4. Despliega

### Opción 3: CLI de Vercel

\`\`\`bash
npm i -g vercel
vercel login
vercel
\`\`\`

## 📱 Configuración de WhatsApp

El número debe estar en formato E.164:

- **México:** 521331234567 (52 + código de área + número)
- **España:** 34612345678 (34 + número)
- **Argentina:** 5491123456789 (54 + 9 + código de área + número)

El mensaje pre-llenado incluye:
- Nombre del producto
- SKU
- Precio
- URL del producto

## 🔐 Panel de Administración

Para acceder al panel admin:

1. Crea un usuario en Supabase Auth
2. Ve a `/auth/login`
3. Inicia sesión con tus credenciales
4. Accede a `/admin` para gestionar productos

## 🎯 Características de Diseño Implementadas

### Glassmorphism
- Backdrop blur con saturación
- Bordes translúcidos
- Sombras suaves
- Efectos hover elegantes

### Carrusel Moderno
- Auto-play con pausa al hover
- Navegación por flechas y teclado
- Indicadores de posición
- Barra de progreso animada
- Soporte para gestos táctiles

### Menú Móvil Mejorado
- Animaciones de entrada suaves
- Backdrop blur
- Transiciones fluidas
- Iconos por sección
- Diseño compacto y moderno

### Iconos de Categorías
- Iconos específicos por categoría
- Animaciones hover
- Mejora la navegación visual
- Consistencia en toda la app

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Autenticación para operaciones admin
- ✅ Variables de entorno para datos sensibles
- ✅ Validación de datos en servidor
- ✅ Headers de seguridad configurados

## 📊 SEO

- ✅ Meta tags dinámicos por producto
- ✅ Open Graph y Twitter Cards
- ✅ JSON-LD para Schema.org (Product)
- ✅ Sitemap.xml automático
- ✅ Robots.txt configurado
- ✅ URLs semánticas

## ♿ Accesibilidad

- ✅ Roles ARIA apropiados
- ✅ Navegación por teclado
- ✅ Contraste WCAG AA
- ✅ Textos alternativos
- ✅ Focus visible
- ✅ Etiquetas semánticas

## 🚀 Performance

- ✅ Imágenes optimizadas con next/image
- ✅ Lazy loading
- ✅ Code splitting automático
- ✅ Server Components por defecto
- ✅ ISR (Incremental Static Regeneration)
- ✅ Glassmorphism optimizado con GPU

## 💡 Decisiones Técnicas

### ¿Por qué Supabase?
- PostgreSQL completo con RLS
- Autenticación integrada
- Storage para imágenes
- Real-time capabilities
- Generoso free tier

### ¿Por qué WhatsApp?
- Menor fricción para el cliente
- Conversación directa con el vendedor
- Ideal para negocios pequeños/medianos
- Sin necesidad de pasarela de pagos
- Flexibilidad en negociación

### ¿Por qué Glassmorphism?
- Diseño moderno y profesional
- Diferenciación visual
- Tendencia actual en UI/UX
- Mejora la jerarquía visual
- Experiencia premium

## 💰 Costos Aproximados

- **Vercel:** Gratis (Hobby) o $20/mes (Pro)
- **Supabase:** Gratis hasta 500MB DB + 1GB storage
- **Dominio:** ~$10-15/año

**Total:** Puede ser $0/mes para empezar.

## ✅ Checklist de Producción

- [ ] Configurar dominio personalizado
- [ ] Configurar número de WhatsApp real
- [ ] Crear usuario admin en Supabase
- [ ] Subir imágenes reales de productos
- [ ] Configurar Google Analytics (opcional)
- [ ] Configurar backups de Supabase
- [ ] Revisar políticas RLS
- [ ] Probar en múltiples dispositivos
- [ ] Ejecutar Lighthouse audit
- [ ] Configurar monitoreo (Vercel Analytics)

## 🔮 Mejoras Futuras

- [ ] Búsqueda con Algolia/Meilisearch
- [ ] Filtros avanzados (precio, disponibilidad)
- [ ] Wishlist/Favoritos
- [ ] Comparador de productos
- [ ] Reviews y ratings
- [ ] Newsletter
- [ ] Blog/Contenido
- [ ] Multi-idioma (i18n)
- [ ] Carrito y checkout (Stripe)

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Guía de Despliegue Completa](./DEPLOYMENT-GUIDE.md)

## 📄 Licencia

MIT

## 👨‍💻 Autor

The Jason Store - Desarrollado con ❤️ usando v0 by Vercel

---

**¿Necesitas ayuda?** Consulta la [Guía de Despliegue](./DEPLOYMENT-GUIDE.md) para instrucciones detalladas sobre cómo desplegar tanto el frontend como el backend.
