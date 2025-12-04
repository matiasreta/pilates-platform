# Configuración de Stripe - Guía Paso a Paso

## 📋 Resumen

Has implementado exitosamente la integración de Stripe con:
- ✅ Webhook handler para sincronización automática
- ✅ API de checkout y portal de cliente
- ✅ Página de precios ($29/mes USD)
- ✅ Dashboard con gestión de suscripción

---

## 🔧 Pasos de Configuración

### 1. Crear Cuenta en Stripe

1. Ve a [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Crea una cuenta (usa modo TEST para desarrollo)
3. Completa la configuración básica

### 2. Obtener API Keys

1. Ve a **Developers → API keys** en el dashboard de Stripe
2. Copia las siguientes claves:
   - **Publishable key** (empieza con `pk_test_...`)
   - **Secret key** (empieza con `sk_test_...`)

### 3. Crear Producto y Precio

1. Ve a **Products → Add product**
2. Completa:
   - **Name**: "Pilates para Embarazadas"
   - **Description**: "Acceso completo a videos de pilates para embarazadas"
   - **Pricing**: Recurring
   - **Price**: $29.00 USD
   - **Billing period**: Monthly
3. Haz clic en **Save product**
4. **IMPORTANTE**: Copia el **Price ID** (empieza con `price_...`)

### 4. Configurar Variables de Entorno

Agrega estas variables a tu `.env.local`:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_PRICE_ID=price_tu_price_id_aqui

# Webhook Secret (lo obtendrás en el siguiente paso)
STRIPE_WEBHOOK_SECRET=whsec_pendiente
```

### 5. Configurar Webhook (Desarrollo Local)

Para desarrollo local, usa Stripe CLI:

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks a tu localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Esto te dará un **webhook secret** que empieza con `whsec_...`. Cópialo y agrégalo a `.env.local`.

### 6. Configurar Webhook (Producción)

Para producción:

1. Ve a **Developers → Webhooks** en Stripe
2. Haz clic en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/webhooks/stripe`
4. Selecciona estos eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing secret** y agrégalo a tus variables de entorno de producción

### 7. Habilitar Customer Portal

1. Ve a **Settings → Billing → Customer portal**
2. Haz clic en **Activate test link**
3. Configura las opciones:
   - ✅ Permitir cancelar suscripciones
   - ✅ Permitir actualizar método de pago
   - ✅ Ver historial de facturas

---

## 🧪 Probar la Integración

### 1. Reiniciar el Servidor

```bash
# Detén el servidor actual (Ctrl+C)
npm run dev
```

### 2. Iniciar Stripe CLI (en otra terminal)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 3. Probar el Flujo Completo

1. **Ir a la página de precios**:
   - Ve a `http://localhost:3000/pricing`
   - Haz clic en "Suscribirme Ahora"

2. **Completar el checkout**:
   - Usa la tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha de expiración: cualquier fecha futura
   - CVC: cualquier 3 dígitos
   - Completa el pago

3. **Verificar la suscripción**:
   - Deberías ser redirigido a `/dashboard?success=true`
   - Verás un mensaje de éxito
   - El estado de suscripción debe mostrar "Activa"

4. **Verificar en Stripe**:
   - Ve a **Customers** en Stripe Dashboard
   - Deberías ver el nuevo cliente
   - Ve a **Subscriptions** y verifica que esté activa

5. **Verificar en Supabase**:
   - Ve a **Table Editor → subscriptions**
   - Deberías ver el registro con `status = 'active'`

6. **Probar gestión de suscripción**:
   - En el dashboard, haz clic en "Gestionar Suscripción"
   - Deberías ser redirigido al Customer Portal de Stripe
   - Prueba cancelar y reactivar la suscripción

---

## 🎯 Tarjetas de Prueba

Stripe proporciona varias tarjetas de prueba:

| Tarjeta | Resultado |
|---------|-----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Pago rechazado |
| `4000 0000 0000 9995` | Fondos insuficientes |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

---

## 📊 Eventos del Webhook

El webhook maneja estos eventos automáticamente:

| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | Crea suscripción en DB |
| `customer.subscription.updated` | Actualiza estado y fecha |
| `customer.subscription.deleted` | Marca como cancelada |
| `invoice.payment_succeeded` | Actualiza a activa |
| `invoice.payment_failed` | Marca como past_due |

---

## 🔍 Debugging

### Ver logs del webhook

En la terminal donde corre `stripe listen`:
```bash
# Verás los eventos en tiempo real
```

### Ver logs en Stripe Dashboard

1. Ve a **Developers → Webhooks**
2. Haz clic en tu endpoint
3. Ve a la pestaña **Logs**

### Verificar base de datos

```sql
-- Ver todas las suscripciones
SELECT * FROM subscriptions;

-- Ver suscripciones activas
SELECT * FROM subscriptions WHERE status = 'active';
```

---

## ⚠️ Problemas Comunes

### "No price_id found"
→ Asegúrate de agregar `STRIPE_PRICE_ID` a `.env.local`

### "Webhook signature verification failed"
→ Verifica que `STRIPE_WEBHOOK_SECRET` sea correcto
→ Asegúrate de que Stripe CLI esté corriendo

### "Subscription not created in database"
→ Verifica los logs del webhook
→ Revisa que las políticas RLS permitan INSERT

### "Customer portal not working"
→ Activa el Customer Portal en Stripe Settings

---

## 🚀 Próximos Pasos

Una vez que todo funcione en desarrollo:

1. **Modo Producción**:
   - Cambia a claves de producción en Stripe
   - Configura webhook en producción
   - Actualiza variables de entorno en tu hosting

2. **Contenido Protegido**:
   - Implementar videos con Cloudflare Stream
   - Proteger acceso basado en suscripción

3. **Mejoras**:
   - Emails de bienvenida
   - Notificaciones de pago fallido
   - Descuentos y cupones

---

## 📚 Recursos

- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
