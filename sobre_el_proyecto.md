¡Claro que sí\! Aquí tienes la documentación técnica inicial. Está pensada para que tú (o tu equipo) preparen el entorno de desarrollo hoy mismo y puedan empezar a construir la **Landing Page** de inmediato, pero dejando el terreno listo para integrar el MVP (Supabase/Stripe) sin tener que refactorizar después.

Copia y pega esto en tu Notion, README.md o gestor de tareas.

-----

# 🚀 Documentación de Inicialización: Plataforma Pilates MVP

## 1\. Stack Tecnológico Seleccionado

  * **Core:** Next.js 16 (App Router) + React.
  * **Lenguaje:** TypeScript (Estándar de industria, evita bugs tontos).
  * **Estilos:** Tailwind CSS (Indispensable para usar Lovable/v0).
  * **UI Components:** Shadcn/ui (Recomendado por flexibilidad y velocidad).
  * **Iconos:** Lucide React.

## 2\. Inicialización del Proyecto

Abre tu terminal (preferiblemente en **Cursor**) y ejecuta:

### Paso A: Crear la app

```bash
npx create-next-app@latest pilates-platform
```

*Durante la instalación, selecciona estas opciones:*

  * Would you like to use TypeScript? **Yes**
  * Would you like to use ESLint? **Yes**
  * Would you like to use Tailwind CSS? **Yes**
  * Would you like to use `src/` directory? **Yes** (Mantiene la raíz limpia)
  * Would you like to use App Router? **Yes** (Obligatorio para Server Actions)
  * Would you like to customize the default import alias (@/\*)? **Yes** (Ayuda a importar componentes limpio)

### Paso B: Instalar dependencias base (UI & Landing Page)

Estas librerías son las que usarás para maquetar la Landing Page y darle un aspecto profesional rápido.

```bash
cd pilates-platform

# Utilidades para clases CSS (indispensable para componentes modernos)
npm install clsx tailwind-merge

# Iconos (ligeros y bonitos)
npm install lucide-react

# Animaciones (Opcional, pero vende mucho en una Landing)
npm install framer-motion
```

### Paso C: Instalar dependencias del MVP (Backend & Pagos)

Aunque hoy solo hagas la Landing, instala esto ya para tener las librerías listas y evitar conflictos de versiones luego.

```bash
# Conexión con Base de Datos y Auth
npm install @supabase/supabase-js @supabase/ssr

# Pagos
npm install stripe @stripe/stripe-js
```

## 3\. Configuración del Entorno (Variables)

Crea un archivo `.env.local` en la raíz del proyecto. Por ahora, déjalo preparado con estas llaves (aunque estén vacías hoy, sabrás qué te falta).

```bash
# .env.local

# SUPABASE (Lo llenaremos en la Fase 2)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# STRIPE (Lo llenaremos en la Fase 3)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# CLOUDFLARE STREAM (Lo llenaremos en la Fase 4)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

## 4\. Estructura de Carpetas Recomendada (`/src`)

Organiza tu código así desde el día 1 para no volverte loco cuando la app crezca.

```text
src/
├── app/
│   ├── (marketing)/      # Grupo de rutas para la Landing (sin sidebar ni auth)
│   │   ├── page.tsx      # Tu Landing Page principal
│   │   └── layout.tsx    # Navbar y Footer público
│   ├── (app)/            # Grupo de rutas para la App (protegidas)
│   │   ├── dashboard/    # Donde ven los videos
│   │   └── layout.tsx    # Sidebar y Auth check
│   ├── api/              # Webhooks de Stripe y rutas API
│   └── globals.css
├── components/
│   ├── ui/               # Botones, Inputs (Shadcn/ui o Lovable)
│   ├── landing/          # Hero, Features, Pricing (Solo para marketing)
│   └── dashboard/        # VideoPlayer, SubscriptionStatus
├── lib/
│   ├── supabase/         # Clientes de Supabase (client & server)
│   ├── stripe.ts         # Inicialización de Stripe
│   └── utils.ts          # Helpers de CSS
└── types/                # Definiciones de TypeScript (DB types)
```
