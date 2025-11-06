# 📱 Guía de Generación de Íconos PWA

## Pasos para Generar Íconos Profesionales

### 1. Preparar el Logo Original

Necesitas un logo en formato **SVG** o **PNG de alta resolución** (mínimo 512x512px, recomendado 1024x1024px).

**Requisitos:**
- Fondo transparente
- Diseño centrado
- Márgenes apropiados (padding ~10%)
- Formato cuadrado

---

## 2. Usar RealFaviconGenerator.net

### Paso a Paso:

1. **Ve a:** https://realfavicongenerator.net/

2. **Sube tu logo** en la página principal

3. **Configura cada plataforma:**

#### 🍎 iOS - Web Clip
- **Opciones recomendadas:**
  - Background color: `#F59E0B` (tu accent color dorado)
  - Margin: 10%
  - Add solid background: ✅

#### 🤖 Android Chrome
- **Opciones recomendadas:**
  - Theme color: `#F59E0B`
  - Name: "The Jason Store"
  - Display: Standalone
  - Orientation: Portrait
  - Create maskable icon: ✅ **IMPORTANTE**

#### 💻 Windows Metro
- **Opciones recomendadas:**
  - Background color: `#000000` (negro)
  - Tile color: `#F59E0B`

#### 🌐 Favicon
- **Opciones recomendadas:**
  - Generate all sizes
  - Background: Transparent

4. **Configuración de Path:**
   - Favicon location: `/`
   - No usar subdirectorio

5. **Generar y Descargar**

---

## 3. Archivos Generados

Después de descargar, obtendrás estos archivos:

```
public/
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── android-chrome-maskable-192x192.png  ← IMPORTANTE
├── android-chrome-maskable-512x512.png  ← IMPORTANTE
├── apple-touch-icon.png (180x180)
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── mstile-150x150.png
├── safari-pinned-tab.svg
├── browserconfig.xml
└── site.webmanifest
```

---

## 4. Instalación de Archivos

### A. Copiar a /public
```bash
# Copia TODOS los archivos generados a la carpeta public/
# Reemplaza los existentes si los hay
```

### B. Actualizar manifest.json

Reemplaza el contenido de `public/manifest.json` con:

```json
{
  "name": "The Jason Store",
  "short_name": "Jason Store",
  "description": "Tu Marketplace de Confianza",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#F59E0B",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/android-chrome-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/android-chrome-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "shortcuts": [
    {
      "name": "Ver Productos",
      "short_name": "Productos",
      "description": "Explorar catálogo completo",
      "url": "/productos",
      "icons": [
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "Contactar",
      "short_name": "Contacto",
      "description": "Contactar por WhatsApp",
      "url": "/contacto",
      "icons": [
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-mobile.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

### C. Actualizar app/layout.tsx

El layout ya tiene la configuración básica. Verifica que tenga:

```tsx
export const metadata: Metadata = {
  // ... otras configs
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
  // ...
}
```

---

## 5. Verificación

### A. Lighthouse Audit
```bash
# 1. Build de producción
pnpm build

# 2. Servir localmente
pnpm start

# 3. Abrir Chrome DevTools > Lighthouse
# 4. Ejecutar audit de PWA
# 5. Verificar score de 100/100
```

### B. Checklist Manual

- [ ] Los íconos se ven bien en todos los tamaños
- [ ] El maskable icon tiene margen suficiente (10-20%)
- [ ] El manifest.json está accesible en `/manifest.json`
- [ ] Los shortcuts funcionan correctamente
- [ ] El color del theme coincide con el diseño
- [ ] La app es instalable en Android/iOS
- [ ] El nombre de la app es correcto
- [ ] Los screenshots son actuales (si los tienes)

---

## 6. Íconos Maskable - IMPORTANTE ⚠️

Los íconos **maskable** son críticos para Android 8+. Estos íconos:

- Tienen un "safe zone" en el centro
- Se adaptan a diferentes formas (círculo, cuadrado, squircle)
- Requieren padding adicional (~20% del tamaño total)

### Verificar Maskable Icon:
1. Ve a: https://maskable.app/editor
2. Sube tu ícono maskable
3. Verifica que se vea bien en todas las formas
4. Ajusta el padding si es necesario

---

## 7. Screenshots (Opcional pero Recomendado)

Para mejor experiencia de instalación en Android:

### Móvil (Narrow):
- Tamaño: 540x720px o 1080x1920px
- Muestra: Página principal o productos

### Desktop (Wide):
- Tamaño: 1280x720px o 2560x1440px
- Muestra: Experiencia completa del sitio

**Cómo capturar:**
1. Usa Chrome DevTools (responsive mode)
2. Ajusta al tamaño correcto
3. Captura con extensión o herramienta
4. Guarda en `/public/`

---

## 8. Alternativas a RealFaviconGenerator

Si prefieres otras herramientas:

### A. PWA Asset Generator
```bash
npm install -g pwa-asset-generator

pwa-asset-generator logo.svg ./public \
  --background "#F59E0B" \
  --type png \
  --padding "10%"
```

### B. Figma + Export
1. Crea frames de cada tamaño necesario
2. Aplica padding y background
3. Exporta como PNG
4. Nombra según convención

### C. Canva
1. Usa templates de íconos de app
2. Sube tu logo
3. Ajusta para cada tamaño
4. Descarga en PNG

---

## 9. Testing en Dispositivos Reales

### iOS:
1. Safari > Share > Add to Home Screen
2. Verifica el ícono en la pantalla de inicio
3. Abre la app y verifica el splash screen

### Android:
1. Chrome > Menu > Install app
2. Verifica el ícono en el launcher
3. Prueba diferentes formas de ícono (en Settings)

### Desktop (Chrome/Edge):
1. Barra de direcciones > Install icon
2. Verifica en el sistema operativo

---

## 10. Problemas Comunes

### ❌ Ícono se ve recortado en Android
**Solución:** Aumenta el padding del maskable icon a 20%

### ❌ Colores incorrectos
**Solución:** Verifica `theme_color` en manifest.json y meta tags

### ❌ App no es instalable
**Solución:** 
- Verifica HTTPS en producción
- Asegúrate que manifest.json sea válido
- Revisa service worker (si lo tienes)

### ❌ Ícono no se actualiza
**Solución:**
- Clear cache del navegador
- Desinstala y reinstala la PWA
- Usa nombres únicos para íconos (versionados)

---

## 📚 Recursos Adicionales

- [MDN - Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Maskable Icons](https://web.dev/maskable-icon/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Adaptive Icons](https://web.dev/maskable-icon-audit/)

---

## ✅ Checklist Final

Antes de desplegar a producción:

- [ ] Todos los íconos generados y en /public
- [ ] manifest.json actualizado
- [ ] Íconos maskable creados
- [ ] Layout.tsx tiene metadata correcta
- [ ] Testeado en Chrome DevTools
- [ ] Lighthouse PWA audit > 90
- [ ] Testeado en dispositivo Android real
- [ ] Testeado en dispositivo iOS real
- [ ] Screenshots agregados (opcional)
- [ ] Cache invalidado después de deploy

---

**¡Tu PWA estará lista para instalar en cualquier dispositivo! 🚀**
