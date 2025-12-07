# Guía de Configuración de Cloudflare Stream

## 📋 Paso 1: Crear Cuenta en Cloudflare Stream

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Si no tienes cuenta, créala (es gratis para empezar)
3. Ve a **Stream** en el menú lateral
4. Activa Cloudflare Stream (primer mes gratis)

---

## 🔑 Paso 2: Obtener Credenciales

### Account ID

1. En el dashboard de Cloudflare, mira la URL
2. Verás algo como: `https://dash.cloudflare.com/abc123def456/stream`
3. El `abc123def456` es tu **Account ID**

### API Token

1. Click en tu perfil (esquina superior derecha)
2. **My Profile** → **API Tokens**
3. Click **Create Token**
4. Usa el template **"Edit Cloudflare Stream"** o crea uno custom con:
   - **Permissions**: `Stream:Edit`
   - **Account Resources**: Include → Your Account
5. Click **Continue to summary** → **Create Token**
6. **Copia el token** (solo se muestra una vez)

### Customer Code (Opcional - para Signed URLs)

1. En **Stream** → **Settings**
2. Busca **"Signing Keys"**
3. Si no existe, créalo
4. Copia el **Customer Code**

---

## 📝 Paso 3: Configurar Variables de Entorno

Agrega estas variables a tu `.env.local`:

```env
# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=abc123def456
CLOUDFLARE_API_TOKEN=tu_api_token_aqui
CLOUDFLARE_STREAM_CUSTOMER_CODE=tu_customer_code_opcional

# Public (para el video player)
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=abc123def456
```

---

## 📹 Paso 4: Subir Videos

### Opción A: Desde Cloudflare Dashboard (Recomendado)

1. Ve a **Stream** en Cloudflare Dashboard
2. Click **Upload Video**
3. Arrastra tu video o selecciónalo
4. Espera a que procese
5. **Copia el Video ID** (algo como `abc123def456ghi789`)
6. Agrega el video a tu base de datos Supabase

### Opción B: Via API (Avanzado)

```bash
curl -X POST \
  https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/stream \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F file=@/path/to/video.mp4
```

---

## 🗄️ Paso 5: Agregar Videos a la Base de Datos

Para cada video que subas a Cloudflare, agrega un registro en Supabase:

```sql
INSERT INTO videos (
  title,
  description,
  cloudflare_video_id,
  category,
  duration,
  thumbnail_url,
  published
) VALUES (
  'Pilates Primer Trimestre - Clase 1',
  'Ejercicios suaves para el primer trimestre del embarazo',
  'abc123def456ghi789', -- Video ID de Cloudflare
  'Primer Trimestre',
  1800, -- duración en segundos (30 min)
  'https://customer-YOUR_ACCOUNT_ID.cloudflarestream.com/abc123def456ghi789/thumbnails/thumbnail.jpg',
  true
);
```

### Obtener Thumbnail URL

El thumbnail se genera automáticamente:
```
https://customer-YOUR_ACCOUNT_ID.cloudflarestream.com/VIDEO_ID/thumbnails/thumbnail.jpg
```

### Obtener Duración

1. En Cloudflare Dashboard → Stream
2. Click en el video
3. Verás la duración en los detalles

---

## 🔒 Paso 6: Configurar Seguridad

### Domain Restrictions (Recomendado)

1. En **Stream** → **Settings**
2. **Allowed Origins**
3. Agrega tu dominio: `https://tu-dominio.com`
4. Para desarrollo local: `http://localhost:3000`

### Signed URLs

Si configuraste el Customer Code, las URLs expirarán automáticamente después de 1 hora.

---

## 🧪 Paso 7: Probar

1. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Ve a `/videos`** en tu navegador

3. **Deberías ver:**
   - Grid de videos (si agregaste videos a la DB)
   - Click en un video para reproducirlo
   - Watermark con tu email visible

---

## 📊 Ejemplo Completo

### 1. Subir video en Cloudflare
- Video ID obtenido: `d5bcdeaa6eee4b6fb6e067ca13af6ae0`

### 2. Agregar a Supabase

```sql
INSERT INTO videos (
  title,
  description,
  cloudflare_video_id,
  category,
  duration,
  thumbnail_url,
  published
) VALUES (
  'Introducción al Pilates Prenatal',
  'Aprende los fundamentos del pilates durante el embarazo',
  'd5bcdeaa6eee4b6fb6e067ca13af6ae0',
  'Introducción',
  900,
  'https://customer-abc123def456.cloudflarestream.com/d5bcdeaa6eee4b6fb6e067ca13af6ae0/thumbnails/thumbnail.jpg',
  true
);
```

### 3. Verificar

- Ve a `http://localhost:3000/videos`
- Deberías ver el video en el grid
- Click para reproducir

---

## 💰 Costos

- **Almacenamiento**: $5 USD por 1,000 minutos/mes
- **Streaming**: $1 USD por 1,000 minutos vistos/mes
- **Ejemplo**: 
  - 100 videos de 30 min = 3,000 min almacenados = $15/mes
  - 100 usuarios viendo 1 video/mes = 3,000 min vistos = $3/mes
  - **Total**: ~$18/mes

---

## 🐛 Troubleshooting

### Video no se reproduce

1. Verifica que `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID` esté configurado
2. Verifica que el `cloudflare_video_id` en la DB sea correcto
3. Revisa la consola del navegador para errores

### "Suscripción activa requerida"

1. Verifica que tu usuario tenga una suscripción activa en la tabla `subscriptions`
2. El `status` debe ser `'active'`

### Thumbnail no aparece

1. Espera unos minutos después de subir el video
2. Cloudflare genera thumbnails automáticamente
3. Verifica la URL del thumbnail

---

## ✅ Checklist Final

- [ ] Cuenta de Cloudflare Stream creada
- [ ] Variables de entorno configuradas
- [ ] Al menos 1 video subido a Cloudflare
- [ ] Video agregado a tabla `videos` en Supabase
- [ ] Domain restrictions configuradas
- [ ] Probado en `/videos` con suscripción activa

---

**¡Listo! Ahora tus usuarios pueden ver videos protegidos con su suscripción.** 🎉
