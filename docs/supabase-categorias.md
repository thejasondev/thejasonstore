# Guía de trabajo con categorías desde Supabase

Esta guía explica cómo está conectada la sección de categorías de la aplicación con Supabase y qué pasos debes seguir para gestionarlas correctamente.

## 1. Requisitos previos

1. **Variables de entorno**: asegúrate de tener configuradas las variables en `.env.local` (o en el entorno correspondiente):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<tu_anon_key>"
   ```
2. **Tablas y políticas**: ejecuta el script `scripts/SETUP_FINAL.sql` desde el editor SQL de Supabase para crear las tablas `categories` y `products`, junto con las políticas de seguridad (RLS) necesarias.

## 2. Flujo de datos en la aplicación

### 2.1 Server Actions

- `lib/actions/categories.ts#getCategories` es el punto central que consulta Supabase:
  - Filtra solo categorías activas (`is_active = true`).
  - Ordena por `display_order` para mantener un orden determinístico en el UI.
  - Se reutiliza tanto en la página principal como en la vista de productos con filtros.

- `lib/actions/categories.ts` también expone acciones para crear, actualizar y eliminar categorías. Estas acciones invalidan cachés relevantes (`/productos` y `/admin`) mediante `revalidatePath` para que la interfaz refleje cambios recientes.

### 2.2 Página principal (`app/page.tsx`)

- Carga productos y categorías en paralelo con `Promise.all` para optimizar el tiempo de respuesta.
- Las categorías obtenidas dinámicamente sustituyen al listado estático. Si aún no existen categorías en la base de datos, se muestra un mensaje informativo.
- Cada tarjeta utiliza `components/category-icon.tsx`, que resuelve el ícono en función del slug o del valor `icon` almacenado en la tabla.

### 2.3 Filtros en la vista de productos (`app/productos/page.tsx`)

- Esta página ya consume `getCategories`. Al crear, editar o desactivar categorías desde Supabase, la vista de filtros se actualiza automáticamente al recargarse.

### 2.4 Formulario de productos (`components/admin/product-form.tsx`)

- Al iniciar el formulario, se crea un cliente de Supabase del lado del navegador (`lib/supabase/client.ts`) para leer las categorías disponibles.
- El selector de categorías muestra un estado de carga, errores de conexión y deshabilita el envío si no hay datos válidos.
- El valor guardado en la columna `category` de la tabla `products` corresponde al `slug` de la categoría, lo que permite filtrar productos fácilmente.

## 3. Gestión de categorías desde Supabase

1. **Crear**:
   - En el panel de Supabase, abre `Table Editor > categories`.
   - Añade una fila con los campos mínimos: `name`, `slug` (en minúsculas y sin espacios), `icon` (opcional), `display_order` (entero), `is_active` (true/false).
   - Guarda los cambios; la página principal y el formulario de productos reflejarán la nueva categoría tras recargar.

2. **Editar**:
   - Modifica los campos necesarios (por ejemplo, nombre o icono) directamente en la tabla.
   - Si cambias el `slug`, recuerda actualizar los productos existentes que dependan de él.
   - `updated_at` se ajusta automáticamente gracias al trigger configurado en el script SQL.

3. **Desactivar / Eliminar**:
   - Establecer `is_active = false` oculta la categoría en la interfaz sin borrar la información histórica.
   - Eliminarla definitivamente (`DELETE`) también es posible; la política RLS permite estas acciones a usuarios autenticados.

## 4. Buenas prácticas

- Mantén los slugs en minúsculas y sin espacios (`electronica`, `hogar`, etc.) para evitar inconsistencias en los filtros.
- Utiliza el campo `icon` para mapear iconos compatibles con `lucide-react` (por ejemplo `Laptop`, `Home`). Si el icono no existe, el componente `CategoryIcon` mostrará un icono genérico.
- Alinea el `display_order` para controlar el orden en el que se muestran las categorías en el frontend.
- Cuando agregues scripts o migraciones nuevas, procura versionarlas en la carpeta `scripts/` para poder recrear el entorno fácilmente.

Con estos pasos podrás gestionar categorías directamente desde Supabase, asegurando que cualquier cambio se refleje en la aplicación sin modificaciones adicionales en el código.
