---
name: adam-grafica-brazos
description: Sistema de brazos por rubro para adamgrafica.online. Cada rubro (comida-rapida, restaurant, panaderia, cafeteria, botilleria) es un brazo del sitio madre. Mismo layout, distinto contenido, centralizado. Para agregar un nuevo brazo: crear pages/brazos/<slug>.ts y registrarlo en pages/brazos/index.ts.
---

# ADAM GRÁFICA — Sistema de Brazos por Rubro

## Concepto

adamgrafica.online tiene múltiples **brazos** (sub-páginas), uno por rubro. Cada brazo:
- Comparte el mismo layout (mismas secciones, mismo estilo)
- Tiene contenido propio (puntos de dolor, soluciones, oferta, testimonios)
- Comparte pixel FB, GTM, Analytics, branding
- Cuando se actualiza la página madre, todos los brazos heredan el cambio

## Estructura del proyecto

```
adam-grafica-landing-work/
├── src/
│   ├── App.tsx                    # Router principal
│   ├── pages/
│   │   ├── BrazoIndex.tsx         # /brazos (muestra todos)
│   │   ├── Rubro.tsx              # /brazo/:slug
│   │   └── brazos/
│   │       ├── types.ts           # RubroConfig (tipo base)
│   │       ├── comida-rapida.ts   # Brazo 1
│   │       ├── restaurant.ts      # Brazo 2 (próximo)
│   │       ├── panaderia.ts       # Brazo 3 (próximo)
│   │       ├── cafeteria.ts       # Brazo 4 (próximo)
│   │       ├── botilleria.ts      # Brazo 5 (próximo)
│   │       └── index.ts           # Registro central
│   ├── layouts/
│   │   └── BrazoLayout.tsx        # Layout compartido
│   ├── sections/
│   │   ├── ...                    # Secciones del sitio madre
│   │   └── rubro/                 # Secciones compartidas por brazos
│   │       ├── RubroHero.tsx
│   │       ├── RubroPain.tsx
│   │       ├── RubroSolution.tsx
│   │       ├── RubroBeforeAfter.tsx
│   │       ├── RubroOferta.tsx
│   │       ├── RubroTestimonios.tsx
│   │       └── RubroCTAFinal.tsx
│   └── ...
├── public/                        # Assets estáticos
│   ├── burger-antes.jpg           # Ejemplo brazo 1
│   └── ...
└── ...
```

## Cómo agregar un nuevo brazo

### 1. Crear archivo de configuración

```typescript
// src/pages/brazos/<slug>.ts
import type { RubroConfig } from './types';

export const miBrazo: RubroConfig = {
  slug: 'mi-rubro',
  nombre: 'Mi Rubro',
  emoji: '🍕',
  tagline: 'Mi categoría',
  descripcionCorta: '...',
  descripcionLarga: '...',

  heroEyebrow: '🍕 Para mi rubro',
  heroHeadline: ['Línea 1', 'Línea destacada', 'Línea 3'],
  heroSubheadline: '...',

  painPoints: ['...', '...'],
  soluciones: [
    { emoji: '🎨', titulo: '...', descripcion: '...' },
    // ...
  ],
  testimonios: [
    { nombre: '...', cargo: '...', quote: '...' },
  ],

  ctaLabel: 'Quiero el pack',
  ctaWhatsapp: 'https://wa.me/...',

  color: { primary: '#0066FF', accent: '#00D4FF' },

  stats: [
    { numero: '24/7', label: 'soporte' },
    // ...
  ],

  ofertaPrincipal: {
    titulo: '...',
    precio: '$XX.XXX',
    precioOriginal: '$XX.XXX',
    tiempo: 'Entrega en X días',
    incluye: ['✓ ...', '✓ ...'],
  },

  ejemplos: [
    {
      nombre: 'Producto 1',
      antes: '/assets/producto1-antes.jpg',
      despues: '/assets/producto1-despues.jpg',
    },
  ],
};
```

### 2. Registrar en el índice

```typescript
// src/pages/brazos/index.ts
import { miBrazo } from './mi-rubro';

export const brazos: Record<string, RubroConfig> = {
  'comida-rapida': comidaRapida,
  'mi-rubro': miBrazo,
  // ...
};
```

### 3. Copiar assets

Copiar imágenes a `public/` con nombres `<slug>-antes.jpg` y `<slug>-despues.jpg`.

### 4. Commit + push

```bash
git add .
git commit -m "feat: brazo mi-rubro"
git push origin main
```

## Deploy

El proyecto se deploya automáticamente cuando se hace push a `main` en GitHub. El trigger de CapRover lo lee y hace rebuild.

## Convenciones

- **Slug**: kebab-case (`mi-rubro`)
- **Nombres**: español, mayúscula inicial
- **Colores**: primary = `#0066FF`, accent = `#00D4FF` (pueden personalizarse)
- **Assets**: rutas relativas desde `/public/`
- **WhatsApp**: URL completa con texto pre-llenado

## Archivos clave del proyecto

| Archivo | Función |
|---------|---------|
| `src/App.tsx` | Router con `/`, `/brazos`, `/brazo/:slug` |
| `src/pages/Rubro.tsx` | Página dinámica de brazo |
| `src/pages/BrazoIndex.tsx` | Index de todos los brazos |
| `src/layouts/BrazoLayout.tsx` | Layout compartido |
| `src/pages/brazos/types.ts` | Tipos TypeScript |
| `src/pages/brazos/index.ts` | Registro de brazos |
| `src/sections/rubro/*.tsx` | 7 secciones reutilizables |
| `src/sections/Footer.tsx` | Links dinámicos a brazos |
| `Dockerfile` | Build multi-stage + nginx |
| `nginx.conf` | Configuración nginx con SPA fallback |

## Reglas críticas

1. **NO duplicar** componentes — si necesitas una nueva sección, agregarla a `sections/rubro/`
2. **SIEMPRE actualizar el registro** en `pages/brazos/index.ts` cuando agregues un brazo
3. **SEO dinámico** en `pages/Rubro.tsx` — actualiza title y meta por brazo
4. **WhatsApp** específico por brazo — cada uno tiene su número/URL
5. **Estilo consistente** — no modificar las secciones compartidas sin actualizar todos los brazos