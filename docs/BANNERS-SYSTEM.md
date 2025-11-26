# 🎨 Sistema de Banners y Secciones - Documentación

## 📋 Descripción General

El sistema de banners permite gestionar el contenido visual de la tienda (Homepage) directamente desde el panel de administración, sin necesidad de modificar el código.

### Características Principales

- **Gestión Visual**: Interfaz amigable para crear, editar y eliminar banners.
- **Tipos de Banners**:
  - 🦸‍♂️ **Hero**: Banner principal de ancho completo.
  - 🎠 **Slider**: Carrusel de imágenes con autoplay.
  - ℹ️ **Info**: Banners informativos pequeños (ej. envíos, ofertas).
- **Programación Automática**: Configura fecha de inicio y fin para campañas temporales.
- **Upload de Imágenes**: Subida directa a Supabase Storage con optimización.
- **Call to Actions (CTA)**: Botones personalizables con diferentes estilos.

---

## 🛠️ Guía de Uso (Admin)

### Acceso

Ve a `/admin/secciones` en tu navegador.

### Crear un Banner

1. Click en **"Nuevo Banner"**.
2. **Título**: Texto principal del banner.
3. **Imagen**: Arrastra o selecciona una imagen (Recomendado: 1920x800 para Hero).
4. **Posición**: Elige dónde aparecerá (Hero, Slider, Info).
5. **Call to Action**: Texto y enlace del botón (opcional).
6. **Programación**: Fechas de activación (opcional).

### Tipos de Posiciones

- **Hero**: Se muestra al inicio de la página. Si hay múltiples activos, se mostrará el primero o un slider si así se configura.
- **Slider**: Se muestra debajo del Hero (o reemplazándolo) como un carrusel rotativo.
- **Info**: Se muestra en una cuadrícula antes de las categorías. Ideal para anuncios secundarios.

---

## 🔧 Detalles Técnicos

### Base de Datos (`banners`)

| Columna      | Tipo      | Descripción                         |
| ------------ | --------- | ----------------------------------- |
| `id`         | UUID      | Identificador único                 |
| `title`      | TEXT      | Título del banner                   |
| `image_url`  | TEXT      | URL de la imagen en Storage         |
| `position`   | TEXT      | 'hero', 'slider', 'info', 'sidebar' |
| `is_active`  | BOOL      | Estado de visibilidad               |
| `start_date` | TIMESTAMP | Fecha de inicio programada          |
| `end_date`   | TIMESTAMP | Fecha de fin programada             |

### Componentes

- **`BannerForm`**: Formulario con validación Zod y manejo de estado.
- **`ImageUploader`**: Componente de subida con preview y drag & drop.
- **`BannerRenderer`**: Componente inteligente que decide qué renderizar según la posición.
- **`HeroBanner`**: Componente visual para banners principales.

### Server Actions (`lib/actions/banners.ts`)

- `getActiveBanners()`: Obtiene banners filtrando por `is_active` y fechas actuales.
- `createBanner()` / `updateBanner()`: CRUD con revalidación de cache (`revalidatePath`).

---

## 🚀 Integración en Homepage

El sistema es **dinámico**:

1. Si hay banners tipo `hero` o `slider` activos, **reemplazan** automáticamente al Hero estático por defecto.
2. Si no hay banners activos, se muestra el diseño original (Hero estático).
3. Los banners `info` se muestran automáticamente si existen.

Esto permite "apagar" el sistema de banners y volver al diseño original simplemente desactivando los banners en el admin.
