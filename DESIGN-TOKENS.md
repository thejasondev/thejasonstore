# Design Tokens - Tienda Minimalista

Este documento describe el sistema de diseño y tokens utilizados en el proyecto.

## Paleta de Colores

### Colores Principales

\`\`\`css
/* Blanco y Negro */
--background: oklch(1 0 0);        /* #FFFFFF - Fondo principal */
--foreground: oklch(0 0 0);        /* #000000 - Texto principal */
--primary: oklch(0 0 0);           /* #000000 - Botones primarios */
--primary-foreground: oklch(1 0 0); /* #FFFFFF - Texto en primarios */

/* Acento Turquesa */
--accent: oklch(0.65 0.15 192);    /* #00BFA6 - Color de acento */
--accent-foreground: oklch(1 0 0);  /* #FFFFFF - Texto en acento */
\`\`\`

### Colores Secundarios

\`\`\`css
/* Grises */
--secondary: oklch(0.95 0 0);      /* #F2F2F2 - Fondo secundario */
--muted: oklch(0.96 0 0);          /* #F5F5F5 - Elementos apagados */
--muted-foreground: oklch(0.45 0 0); /* #737373 - Texto secundario */

/* Bordes */
--border: oklch(0.9 0 0);          /* #E5E5E5 - Bordes */
--input: oklch(0.9 0 0);           /* #E5E5E5 - Inputs */
\`\`\`

### Modo Oscuro

\`\`\`css
.dark {
  --background: oklch(0 0 0);       /* #000000 */
  --foreground: oklch(1 0 0);       /* #FFFFFF */
  --primary: oklch(1 0 0);          /* #FFFFFF */
  --primary-foreground: oklch(0 0 0); /* #000000 */
  --accent: oklch(0.65 0.15 192);   /* #00BFA6 - Mantiene acento */
}
\`\`\`

## Tipografía

### Familias de Fuentes

\`\`\`css
--font-sans: 'Geist', 'Geist Fallback';
--font-mono: 'Geist Mono', 'Geist Mono Fallback';
\`\`\`

### Escala Tipográfica

| Elemento | Clase Tailwind | Tamaño | Uso |
|----------|---------------|--------|-----|
| Hero | `text-4xl md:text-6xl` | 36px / 60px | Títulos principales |
| H1 | `text-4xl` | 36px | Títulos de página |
| H2 | `text-3xl` | 30px | Secciones |
| H3 | `text-2xl` | 24px | Subsecciones |
| H4 | `text-xl` | 20px | Títulos menores |
| Body Large | `text-lg` | 18px | Texto destacado |
| Body | `text-base` | 16px | Texto normal |
| Small | `text-sm` | 14px | Texto secundario |
| XSmall | `text-xs` | 12px | Etiquetas, badges |

### Line Height

\`\`\`css
/* Títulos */
leading-tight: 1.25

/* Cuerpo */
leading-relaxed: 1.625
leading-6: 1.5
\`\`\`

## Espaciado

### Escala de Espaciado Tailwind

\`\`\`
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
32: 128px
\`\`\`

### Uso Común

| Contexto | Espaciado |
|----------|-----------|
| Padding de cards | `p-4` (16px) |
| Gap entre elementos | `gap-4` (16px) |
| Margin entre secciones | `mb-8` (32px) |
| Padding de contenedor | `px-4 py-8` |

## Bordes y Radios

\`\`\`css
--radius: 0.5rem;              /* 8px - Radio base */
--radius-sm: calc(var(--radius) - 4px);  /* 4px */
--radius-md: calc(var(--radius) - 2px);  /* 6px */
--radius-lg: var(--radius);              /* 8px */
--radius-xl: calc(var(--radius) + 4px);  /* 12px */
\`\`\`

### Uso

\`\`\`tsx
/* Botones */
rounded-lg

/* Cards */
rounded-lg

/* Inputs */
rounded-md

/* Badges */
rounded-full
\`\`\`

## Sombras

\`\`\`css
/* Hover en cards */
hover:shadow-lg

/* Botón flotante */
shadow-lg
\`\`\`

## Transiciones

\`\`\`css
/* Estándar */
transition-colors
transition-transform
transition-all

/* Duración */
duration-200 (por defecto)
\`\`\`

## Breakpoints

\`\`\`css
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
\`\`\`

## Componentes

### Botones

\`\`\`tsx
/* Primario */
<Button className="bg-primary text-primary-foreground">

/* Acento */
<Button className="bg-accent text-accent-foreground">

/* Outline */
<Button variant="outline">

/* Ghost */
<Button variant="ghost">
\`\`\`

### Cards

\`\`\`tsx
<Card className="overflow-hidden transition-all hover:shadow-lg">
  <CardContent className="p-4">
    {/* Contenido */}
  </CardContent>
</Card>
\`\`\`

### Badges

\`\`\`tsx
/* Stock */
<Badge variant="outline" className="bg-accent/10 text-accent border-accent">

/* Agotado */
<Badge variant="secondary">

/* Categoría */
<Badge variant="outline">
\`\`\`

## Iconos

### Tamaños

\`\`\`tsx
/* Pequeño */
className="h-4 w-4"

/* Mediano */
className="h-5 w-5"

/* Grande */
className="h-6 w-6"

/* Extra grande */
className="h-8 w-8"
\`\`\`

### Librería

Lucide React - Iconos minimalistas y consistentes

## Imágenes

### Aspect Ratios

\`\`\`tsx
/* Cuadrado (productos) */
aspect-square

/* 16:9 (hero) */
aspect-video

/* 4:3 */
aspect-[4/3]
\`\`\`

### Optimización

\`\`\`tsx
<Image
  src={src || "/placeholder.svg"}
  alt={alt}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
\`\`\`

## Accesibilidad

### Contraste

- Texto normal: 4.5:1 mínimo
- Texto grande: 3:1 mínimo
- Elementos interactivos: 3:1 mínimo

### Focus

\`\`\`css
outline-ring/50
focus-visible:ring-2
focus-visible:ring-ring
\`\`\`

## Micro-interacciones

\`\`\`tsx
/* Hover en cards */
group-hover:scale-105

/* Hover en botones */
hover:bg-accent/90

/* Hover en links */
hover:text-accent

/* Botón flotante */
hover:scale-110
\`\`\`

## Grid Layouts

### Productos

\`\`\`tsx
/* Mobile: 1 columna */
/* Tablet: 2 columnas */
/* Desktop: 3 columnas */
/* Desktop XL: 4 columnas */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
\`\`\`

### Categorías

\`\`\`tsx
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4
\`\`\`

## Mejores Prácticas

1. **Usa tokens semánticos**: Prefiere `bg-background` sobre `bg-white`
2. **Mantén consistencia**: Usa la escala de espaciado de Tailwind
3. **Mobile-first**: Diseña primero para móvil, luego escala
4. **Accesibilidad**: Siempre verifica contraste y navegación por teclado
5. **Performance**: Optimiza imágenes y usa lazy loading
6. **Semántica**: Usa HTML semántico (`main`, `header`, `footer`, etc.)

---

Este sistema de diseño asegura consistencia visual y una experiencia de usuario cohesiva en toda la aplicación.
