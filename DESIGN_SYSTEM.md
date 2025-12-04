# Design System - Pilates Platform

> [!IMPORTANT]
> Este design system refleja los valores de una instructora de pilates profesional, financista, que busca transmitir sofisticación, claridad y equilibrio. Evita los estereotipos de colores pasteles típicos del pilates femenino, optando por una paleta tierra y minimalista.

---

## 🎯 Valores de Marca y Principios de Diseño

### Valores Fundamentales

1. **Sofisticación Profesional**
   - La instructora es financista y profesional del pilates
   - El diseño debe reflejar seriedad, credibilidad y expertise
   - Evitar lo "dulce" o excesivamente femenino

2. **Claridad y Minimalismo**
   - Pilates es sobre control, precisión y consciencia corporal
   - El diseño debe ser limpio, espacioso y fácil de navegar
   - Menos es más: cada elemento tiene un propósito

3. **Equilibrio Natural**
   - Conexión con la tierra, lo orgánico, lo auténtico
   - Colores que evocan naturaleza sin ser obvios
   - Armonía entre fortaleza y suavidad

4. **Accesibilidad Inclusiva**
   - Aunque el target principal son mujeres, el diseño es universal
   - Funcionalidad sobre decoración
   - Legibilidad y usabilidad prioritarias

### Principios de Diseño

#### 1. **Jerarquía Visual Clara**
- Uso estratégico de espacios en blanco
- Tipografía con contraste marcado entre títulos y cuerpo
- Elementos de acción (CTAs) claramente diferenciados

#### 2. **Contraste Sofisticado**
- Blanco como base de claridad y respiro
- Tierras oscuras para profundidad y seriedad
- Bronce como acento cálido y premium

#### 3. **Movimiento Sutil**
- Animaciones suaves que reflejan fluidez del pilates
- Transiciones que no distraen pero mejoran la experiencia
- Micro-interacciones que dan feedback inmediato

#### 4. **Responsive & Mobile-First**
- La mayoría de usuarias accederán desde móvil
- Diseño que funciona perfectamente en todos los dispositivos
- Touch-friendly: botones y áreas de toque amplias

---

## 🎨 Sistema de Color

### Paleta Principal

```css
/* Tierras Oscuras - Fundamento y Profundidad */
--color-tierra-oscura: #262422;      /* Negro cálido, base principal */
--color-carbon: #1A1816;             /* Casi negro para énfasis */
--color-arcilla-oscura: #3D3935;     /* Gris oscuro cálido */

/* Neutros Claros - Claridad y Espacio */
--color-blanco: #FFFFFF;             /* Blanco puro */
--color-lino: #FAF8F6;               /* Off-white cálido */
--color-piedra-suave: #DCD8D3;       /* Beige claro */
--color-arena: #E8E4DF;              /* Gris cálido muy claro */

/* Acentos Tierra - Calidez y Premium */
--color-bronce-envejecido: #986C4A;  /* Acento principal */
--color-terracota: #A67C52;          /* Variante más clara */
--color-cobre-oscuro: #7A5538;       /* Hover states */

/* Grises Funcionales */
--color-gris-oscuro: #333333;        /* Texto principal */
--color-gris-medio: #6B6B6B;         /* Texto secundario */
--color-gris-claro: #CCCCCC;         /* Bordes y divisores */
```

### Paleta Semántica

```css
/* Colores de Marca */
--color-primary: var(--color-tierra-oscura);
--color-secondary: var(--color-piedra-suave);
--color-accent: var(--color-bronce-envejecido);

/* Backgrounds */
--bg-primary: var(--color-blanco);
--bg-secondary: var(--color-lino);
--bg-dark: var(--color-tierra-oscura);
--bg-overlay: rgba(38, 36, 34, 0.95);

/* Texto */
--text-primary: var(--color-gris-oscuro);
--text-secondary: var(--color-gris-medio);
--text-on-dark: var(--color-blanco);
--text-accent: var(--color-bronce-envejecido);

/* Estados */
--color-success: #5A7A5A;            /* Verde tierra */
--color-warning: #C9A86A;            /* Dorado apagado */
--color-error: #8B5A5A;              /* Rojo tierra */
--color-info: var(--color-bronce-envejecido);
```

### Uso de Color por Contexto

| Contexto | Color Principal | Color Secundario | Acento |
|----------|----------------|------------------|--------|
| **Hero Section** | Blanco (texto) sobre imagen oscura | Piedra suave (subtítulos) | Bronce (CTA) |
| **Navegación** | Tierra oscura (fondo) | Blanco (texto) | Bronce (hover) |
| **Secciones Claras** | Gris oscuro (texto) sobre blanco | Gris medio (secundario) | Bronce (links) |
| **Secciones Oscuras** | Blanco (texto) sobre tierra oscura | Arena (secundario) | Terracota (CTA) |
| **Cards** | Blanco (fondo) | Piedra suave (bordes) | Bronce (iconos) |
| **Botones Primarios** | Bronce (fondo) | Blanco (texto) | Cobre oscuro (hover) |
| **Botones Secundarios** | Transparente | Bronce (borde/texto) | Bronce 10% (hover bg) |

---

## ✍️ Tipografía

### Familias de Fuentes

```css
/* Headings - Elegante y con presencia */
--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body - Legible y profesional */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace - Para datos técnicos */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Escala Tipográfica

```css
/* Display - Para hero sections */
--text-display: clamp(3rem, 8vw, 5rem);        /* 48-80px */
--line-height-display: 1.1;
--weight-display: 700;

/* H1 - Títulos principales */
--text-h1: clamp(2rem, 5vw, 4rem);             /* 32-64px */
--line-height-h1: 1.2;
--weight-h1: 700;

/* H2 - Títulos de sección */
--text-h2: clamp(1.5rem, 4vw, 3rem);           /* 24-48px */
--line-height-h2: 1.3;
--weight-h2: 600;

/* H3 - Subtítulos */
--text-h3: clamp(1.25rem, 3vw, 2rem);          /* 20-32px */
--line-height-h3: 1.4;
--weight-h3: 600;

/* H4 - Títulos pequeños */
--text-h4: clamp(1.125rem, 2.5vw, 1.5rem);     /* 18-24px */
--line-height-h4: 1.5;
--weight-h4: 500;

/* Body Large - Intro text */
--text-body-lg: 1.125rem;                      /* 18px */
--line-height-body-lg: 1.7;
--weight-body-lg: 400;

/* Body - Texto principal */
--text-body: 1rem;                             /* 16px */
--line-height-body: 1.6;
--weight-body: 400;

/* Body Small - Texto secundario */
--text-body-sm: 0.875rem;                      /* 14px */
--line-height-body-sm: 1.5;
--weight-body-sm: 400;

/* Caption - Etiquetas y notas */
--text-caption: 0.75rem;                       /* 12px */
--line-height-caption: 1.4;
--weight-caption: 500;
```

### Jerarquía de Peso

- **700 (Bold)**: Títulos principales, CTAs importantes
- **600 (Semi-Bold)**: Subtítulos, navegación activa
- **500 (Medium)**: Botones, labels, énfasis moderado
- **400 (Regular)**: Texto de cuerpo, contenido general

---

## 📐 Espaciado y Layout

### Sistema de Espaciado (Base 8px)

```css
--spacing-0: 0;
--spacing-1: 4px;      /* 0.25rem */
--spacing-2: 8px;      /* 0.5rem */
--spacing-3: 12px;     /* 0.75rem */
--spacing-4: 16px;     /* 1rem */
--spacing-5: 20px;     /* 1.25rem */
--spacing-6: 24px;     /* 1.5rem */
--spacing-8: 32px;     /* 2rem */
--spacing-10: 40px;    /* 2.5rem */
--spacing-12: 48px;    /* 3rem */
--spacing-16: 64px;    /* 4rem */
--spacing-20: 80px;    /* 5rem */
--spacing-24: 96px;    /* 6rem */
--spacing-32: 128px;   /* 8rem */
```

### Contenedores

```css
/* Max-width para legibilidad */
--container-xs: 640px;   /* Formularios, contenido estrecho */
--container-sm: 768px;   /* Artículos, contenido de lectura */
--container-md: 1024px;  /* Contenido general */
--container-lg: 1280px;  /* Layout principal */
--container-xl: 1536px;  /* Secciones amplias */

/* Padding horizontal responsivo */
--container-padding-mobile: var(--spacing-6);   /* 24px */
--container-padding-tablet: var(--spacing-8);   /* 32px */
--container-padding-desktop: var(--spacing-12); /* 48px */
```

### Grid System

```css
/* 12-column grid */
--grid-columns: 12;
--grid-gap: var(--spacing-6);

/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 🎭 Sombras y Elevación

```css
/* Sombras sutiles y orgánicas */
--shadow-xs: 0 1px 2px rgba(38, 36, 34, 0.05);
--shadow-sm: 0 2px 8px rgba(38, 36, 34, 0.06);
--shadow-md: 0 4px 12px rgba(38, 36, 34, 0.08);
--shadow-lg: 0 8px 24px rgba(38, 36, 34, 0.12);
--shadow-xl: 0 16px 48px rgba(38, 36, 34, 0.16);

/* Sombra de acento (para elementos premium) */
--shadow-accent: 0 6px 20px rgba(152, 108, 74, 0.3);
--shadow-accent-lg: 0 12px 32px rgba(152, 108, 74, 0.4);

/* Sombra interior (para inputs) */
--shadow-inner: inset 0 2px 4px rgba(38, 36, 34, 0.06);
```

### Niveles de Elevación

| Nivel | Uso | Sombra |
|-------|-----|--------|
| **0** | Superficie base | Ninguna |
| **1** | Cards en reposo | `shadow-sm` |
| **2** | Cards hover, dropdowns | `shadow-md` |
| **3** | Modals, popovers | `shadow-lg` |
| **4** | Overlays importantes | `shadow-xl` |
| **Accent** | CTAs premium, elementos destacados | `shadow-accent` |

---

## 🔘 Border Radius

```css
--radius-none: 0;
--radius-sm: 4px;      /* Inputs, tags */
--radius-md: 8px;      /* Botones, cards pequeñas */
--radius-lg: 12px;     /* Cards grandes */
--radius-xl: 16px;     /* Secciones, contenedores */
--radius-2xl: 24px;    /* Hero sections, imágenes destacadas */
--radius-full: 9999px; /* Botones circulares, avatares */
```

---

## ⚡ Transiciones y Animaciones

### Duraciones

```css
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### Easing Functions

```css
/* Movimientos naturales */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Movimientos elásticos (para micro-interacciones) */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Animaciones Predefinidas

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In from Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Shimmer (para loading states) */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

---

## 🧩 Componentes Base

### Botones

#### Primario (CTA Principal)
```css
.btn-primary {
  background: var(--color-bronce-envejecido);
  color: var(--color-blanco);
  padding: 16px 32px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 16px;
  transition: all var(--duration-base) var(--ease-out);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-cobre-oscuro);
  transform: translateY(-2px);
  box-shadow: var(--shadow-accent);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### Secundario (Acciones alternativas)
```css
.btn-secondary {
  background: transparent;
  color: var(--color-bronce-envejecido);
  border: 1.5px solid var(--color-bronce-envejecido);
  padding: 14px 30px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: all var(--duration-base) var(--ease-out);
}

.btn-secondary:hover {
  background: rgba(152, 108, 74, 0.1);
  border-width: 2px;
  padding: 13px 29px; /* Compensar border */
}
```

#### Ghost (Navegación, acciones sutiles)
```css
.btn-ghost {
  background: transparent;
  color: var(--color-gris-oscuro);
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-ghost:hover {
  background: var(--color-arena);
  color: var(--color-bronce-envejecido);
}
```

### Cards

```css
.card {
  background: var(--color-blanco);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-base) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.card-header {
  margin-bottom: var(--spacing-6);
}

.card-title {
  font-size: var(--text-h3);
  font-weight: var(--weight-h3);
  color: var(--color-gris-oscuro);
  margin-bottom: var(--spacing-2);
}

.card-description {
  font-size: var(--text-body);
  color: var(--color-gris-medio);
  line-height: var(--line-height-body);
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--color-gris-claro);
  border-radius: var(--radius-sm);
  font-size: var(--text-body);
  color: var(--color-gris-oscuro);
  background: var(--color-blanco);
  transition: all var(--duration-fast) var(--ease-out);
}

.input:focus {
  outline: none;
  border-color: var(--color-bronce-envejecido);
  box-shadow: 0 0 0 3px rgba(152, 108, 74, 0.1);
}

.input::placeholder {
  color: var(--color-gris-medio);
}

.input-error {
  border-color: var(--color-error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(139, 90, 90, 0.1);
}
```

---

## 📱 Patrones de Diseño Específicos

### Hero Section

**Características:**
- Imagen de fondo de alta calidad (mujer haciendo pilates, ambiente natural)
- Overlay oscuro gradiente para legibilidad
- Texto blanco con jerarquía clara
- CTA prominente en bronce
- Altura: 100vh en desktop, 80vh en mobile

**Paleta:**
- Fondo: Imagen + overlay `rgba(38, 36, 34, 0.5)`
- Título: Blanco (#FFFFFF)
- Subtítulo: Piedra suave (#DCD8D3)
- CTA: Bronce envejecido (#986C4A)

### Sección de Beneficios

**Características:**
- Fondo blanco o lino
- Grid de 3 columnas (desktop) / 1 columna (mobile)
- Iconos en bronce
- Títulos en gris oscuro
- Descripción en gris medio

### Sección de Planes/Pricing

**Características:**
- Fondo tierra oscura para contraste
- Cards blancas elevadas
- Plan destacado con borde bronce
- Precios grandes y claros
- Lista de beneficios con checkmarks en bronce

### Footer

**Características:**
- Fondo tierra oscura
- Texto blanco/arena
- Links con hover en bronce
- Divisores sutiles en gris oscuro
- Redes sociales con iconos circulares

---

## 🎨 Gradientes

```css
/* Overlay para imágenes */
--gradient-overlay-dark: linear-gradient(
  to right,
  rgba(38, 36, 34, 0.7) 0%,
  rgba(38, 36, 34, 0.4) 50%,
  transparent 100%
);

--gradient-overlay-bottom: linear-gradient(
  to top,
  rgba(38, 36, 34, 0.8) 0%,
  transparent 100%
);

/* Gradiente de acento sutil */
--gradient-accent: linear-gradient(
  135deg,
  var(--color-bronce-envejecido) 0%,
  var(--color-terracota) 100%
);

/* Gradiente de fondo suave */
--gradient-bg-soft: linear-gradient(
  180deg,
  var(--color-blanco) 0%,
  var(--color-lino) 100%
);
```

---

## ♿ Accesibilidad

### Contraste de Color

Todos los pares de colores cumplen con **WCAG 2.1 AA** mínimo:

| Combinación | Ratio | Nivel |
|-------------|-------|-------|
| Gris oscuro (#333) sobre Blanco | 12.6:1 | AAA |
| Bronce (#986C4A) sobre Blanco | 4.8:1 | AA |
| Blanco sobre Tierra oscura (#262422) | 15.2:1 | AAA |
| Gris medio (#6B6B6B) sobre Blanco | 5.7:1 | AA |

### Focus States

```css
/* Focus visible para teclado */
*:focus-visible {
  outline: 2px solid var(--color-bronce-envejecido);
  outline-offset: 2px;
}

/* Remover outline para mouse */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Tamaños Mínimos

- **Botones**: Mínimo 44x44px (touch target)
- **Texto de cuerpo**: Mínimo 16px
- **Contraste**: Mínimo 4.5:1 para texto normal

---

## 📐 Iconografía

### Estilo de Iconos

- **Librería**: Lucide React (ya instalada)
- **Peso**: Stroke width 1.5-2px
- **Tamaños**:
  - Pequeño: 16px (inline con texto)
  - Mediano: 24px (botones, navegación)
  - Grande: 32px (features, beneficios)
  - Extra grande: 48px (hero, secciones destacadas)

### Iconos Recomendados

```typescript
import {
  Activity,      // Movimiento, ejercicio
  Heart,         // Bienestar, salud
  Target,        // Objetivos, metas
  Zap,           // Energía, dinamismo
  Shield,        // Seguridad, confianza
  Users,         // Comunidad
  Play,          // Videos, contenido
  CheckCircle,   // Confirmación, beneficios
  Calendar,      // Planes, rutinas
  Star,          // Premium, destacado
} from 'lucide-react';
```

---

## 🌐 Responsive Design

### Mobile First Approach

```css
/* Base: Mobile (< 640px) */
.hero-title {
  font-size: 2rem;
  padding: var(--spacing-6);
}

/* Tablet (≥ 768px) */
@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
    padding: var(--spacing-8);
  }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .hero-title {
    font-size: 4rem;
    padding: var(--spacing-12);
  }
}
```

### Breakpoints Strategy

| Device | Breakpoint | Layout |
|--------|------------|--------|
| **Mobile** | < 640px | 1 columna, stack vertical |
| **Tablet** | 640px - 1023px | 2 columnas, navegación adaptada |
| **Desktop** | ≥ 1024px | 3-4 columnas, layout completo |
| **Large Desktop** | ≥ 1280px | Max-width contenedor, más espacio |

---

## 🎯 Mensajes de Marca (Copywriting)

### Tono de Voz

- **Profesional pero accesible**: No intimidante, pero sí experta
- **Empoderador**: Enfocado en logros y transformación
- **Claro y directo**: Sin jerga innecesaria
- **Inclusivo**: Para todas las mujeres, sin estereotipos

### Palabras Clave

✅ **Usar**: Transformación, equilibrio, fuerza, claridad, control, precisión, bienestar, empoderamiento, consciencia

❌ **Evitar**: "Cute", "dulce", "suave", "delicado", lenguaje infantilizante

### Ejemplos de Headlines

- "Transforma tu cuerpo con precisión y control"
- "Pilates para mujeres que buscan resultados reales"
- "Fortalece tu cuerpo, clarifica tu mente"
- "Rutinas profesionales, resultados medibles"

---

**Creado para**: Plataforma Pilates  
**Versión**: 1.0  
**Fecha**: Diciembre 2025
