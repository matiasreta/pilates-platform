# Pilates Platform - Configuración de Autenticación

## ✅ Fase 1 Completada: Arquitectura de Datos y Autenticación

### 📋 Lo que se ha implementado:

1. **Clientes de Supabase**
   - ✅ Cliente para componentes del servidor (`@/lib/supabase/server`)
   - ✅ Cliente para componentes del cliente (`@/lib/supabase/client`)
   - ✅ Middleware helper para gestión de sesiones

2. **Rutas de Autenticación**
   - ✅ `/login` - Página de inicio de sesión y registro
   - ✅ `/dashboard` - Panel de control protegido
   - ✅ `/auth/callback` - Callback para OAuth y confirmación de email

3. **Middleware de Protección**
   - ✅ Protege la ruta `/dashboard`
   - ✅ Redirige usuarios no autenticados a `/login`
   - ✅ Redirige usuarios autenticados de `/login` a `/dashboard`

4. **Características de la UI**
   - ✅ Diseño moderno con gradientes y animaciones
   - ✅ Formulario de login/registro combinado
   - ✅ Manejo de errores
   - ✅ Estados de carga
   - ✅ Dashboard con información de perfil y suscripción

---

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Asegúrate de que tu archivo `.env.local` contenga las siguientes variables de Supabase:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
\`\`\`

**Dónde encontrar estos valores:**
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a Settings > API
3. Copia la "Project URL" y la "anon/public" key

### 2. Configurar el Callback URL en Supabase

1. Ve a Authentication > URL Configuration en tu proyecto de Supabase
2. Añade las siguientes URLs a "Redirect URLs":
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://tu-dominio.com/auth/callback` (producción)

### 3. Habilitar Email Auth en Supabase

1. Ve a Authentication > Providers
2. Asegúrate de que "Email" esté habilitado
3. Configura las opciones según tus necesidades:
   - Confirm email: Opcional (recomendado para producción)
   - Secure email change: Habilitado
   - Secure password change: Habilitado

---

## 🚀 Cómo Usar

### Registro de Nuevo Usuario

1. Navega a `/login`
2. Haz clic en "Regístrate"
3. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña
4. Haz clic en "Crear Cuenta"
5. Serás redirigido automáticamente a `/dashboard`

### Inicio de Sesión

1. Navega a `/login`
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido a `/dashboard`

### Cerrar Sesión

1. En el dashboard, haz clic en "Cerrar Sesión" en el header
2. Serás redirigido a `/login`

---

## 📁 Estructura de Archivos Creados

\`\`\`
src/
├── lib/
│   └── supabase/
│       ├── client.ts          # Cliente para componentes del cliente
│       ├── server.ts          # Cliente para componentes del servidor
│       └── middleware.ts      # Helper para middleware
├── app/
│   ├── login/
│   │   └── page.tsx          # Página de login/registro
│   ├── dashboard/
│   │   ├── page.tsx          # Página del dashboard (Server Component)
│   │   └── DashboardClient.tsx # UI del dashboard (Client Component)
│   └── auth/
│       └── callback/
│           └── route.ts      # Route handler para callbacks
└── middleware.ts             # Middleware de Next.js
\`\`\`

---

## 🔐 Seguridad Implementada

1. **Row Level Security (RLS)** - Ya configurado en Supabase
2. **Middleware Protection** - Protege rutas del lado del servidor
3. **Server Components** - Valida sesión antes de renderizar
4. **Secure Cookies** - Gestión segura de tokens de sesión

---

## 🎨 Características de UI

### Página de Login
- Diseño moderno con gradientes purple/pink
- Animaciones suaves con Framer Motion
- Formulario combinado de login/registro
- Validación de formularios
- Manejo de errores visual
- Estados de carga

### Dashboard
- Header con navegación
- Cards informativos:
  - Perfil del usuario
  - Estado de suscripción
  - Acceso rápido a contenido
- Sección de contenido bloqueado/desbloqueado según suscripción
- Diseño responsive

---

## 🧪 Probar la Implementación

1. **Inicia el servidor de desarrollo:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Prueba el flujo de registro:**
   - Ve a `http://localhost:3000/login`
   - Crea una nueva cuenta
   - Verifica que seas redirigido a `/dashboard`

3. **Prueba la protección de rutas:**
   - Cierra sesión
   - Intenta acceder a `http://localhost:3000/dashboard`
   - Deberías ser redirigido a `/login`

4. **Verifica en Supabase:**
   - Ve a Authentication > Users en tu dashboard de Supabase
   - Deberías ver el nuevo usuario creado
   - Ve a Table Editor > profiles
   - Deberías ver el perfil del usuario

---

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- Verifica que el email y contraseña sean correctos
- Asegúrate de que el usuario existe en Supabase

### Error: "Failed to fetch"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que la URL de Supabase sea correcta

### Usuario no redirigido después de login
- Verifica que el middleware esté funcionando
- Revisa la consola del navegador para errores
- Asegúrate de que las cookies estén habilitadas

### No se crea el perfil del usuario
- Verifica que la tabla `profiles` exista en Supabase
- Revisa las políticas RLS de la tabla
- Verifica que el trigger de creación de perfil esté configurado (si aplica)

---

## 📝 Próximos Pasos

Ahora que la autenticación está implementada, los siguientes pasos serían:

1. **Fase 2: Integración de Stripe**
   - Configurar productos y precios en Stripe
   - Implementar checkout de suscripción
   - Webhook para sincronizar suscripciones

2. **Fase 3: Gestión de Videos**
   - Integración con Cloudflare Stream
   - Subida y gestión de videos
   - Protección de contenido basada en suscripción

3. **Mejoras Adicionales**
   - Recuperación de contraseña
   - Actualización de perfil
   - OAuth providers (Google, Facebook, etc.)
   - Email de bienvenida

---

## 📚 Recursos

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
- [@supabase/ssr Package](https://github.com/supabase/auth-helpers)
