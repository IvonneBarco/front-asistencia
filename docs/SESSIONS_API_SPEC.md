# 📋 ESPECIFICACIÓN DE FORMULARIOS - SESSIONS

## 1️⃣ CREAR SESIÓN

**Endpoint:** `POST /api/admin/sessions`  
**Auth:** Bearer token (requiere rol admin)

### Request Body:
```typescript
{
  name: string;        // Requerido, nombre de la sesión
  startsAt: string;    // Requerido, ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
  endsAt: string;      // Requerido, ISO 8601 format
}
```

### Ejemplo Request:
```json
{
  "name": "Encuentro Semanal - Febrero",
  "startsAt": "2026-02-05T19:00:00.000Z",
  "endsAt": "2026-02-05T21:00:00.000Z"
}
```

### Response (201 Created):
```json
{
  "data": {
    "id": "uuid-here",
    "sessionId": "SESSION-2026-02-05-A1B2C3D4",
    "name": "Encuentro Semanal - Febrero",
    "startsAt": "2026-02-05T19:00:00.000Z",
    "endsAt": "2026-02-05T21:00:00.000Z",
    "isActive": true,
    "qrCode": "data:image/png;base64,iVBORw0KGg..."
  },
  "message": "Sesión creada correctamente"
}
```

### Validaciones Frontend:
- `name`: mínimo 3 caracteres, máximo 100
- `startsAt`: debe ser fecha futura
- `endsAt`: debe ser posterior a `startsAt`

---

## 2️⃣ LISTAR SESIONES

**Endpoint:** `GET /api/admin/sessions`  
**Auth:** Bearer token (requiere rol admin)

### Request:
Sin parámetros (lista todas las sesiones ordenadas por más recientes)

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "sessionId": "SESSION-2026-02-05-A1B2C3D4",
      "name": "Encuentro Semanal - Febrero",
      "startsAt": "2026-02-05T19:00:00.000Z",
      "endsAt": "2026-02-05T21:00:00.000Z",
      "isActive": true,
      "createdAt": "2026-02-03T18:10:42.000Z"
    },
    {
      "id": "uuid-2",
      "sessionId": "SESSION-2026-01-29-F5E6D7C8",
      "name": "Retiro Espiritual",
      "startsAt": "2026-01-29T09:00:00.000Z",
      "endsAt": "2026-01-29T17:00:00.000Z",
      "isActive": false,
      "createdAt": "2026-01-25T14:22:15.000Z"
    }
  ]
}
```

---

## 3️⃣ OBTENER QR DE SESIÓN

**Endpoint:** `GET /api/admin/sessions/:sessionId/qr`  
**Auth:** Bearer token (requiere rol admin)

### Request:
```
GET /api/admin/sessions/SESSION-2026-02-05-A1B2C3D4/qr
```

### Response (200 OK):
```json
{
  "data": {
    "sessionId": "SESSION-2026-02-05-A1B2C3D4",
    "name": "Encuentro Semanal - Febrero",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

## 4️⃣ DESACTIVAR SESIÓN

**Endpoint:** `PATCH /api/admin/sessions/:sessionId/deactivate`  
**Auth:** Bearer token (requiere rol admin)

### Request:
```
PATCH /api/admin/sessions/SESSION-2026-02-05-A1B2C3D4/deactivate
```

### Response (200 OK):
```json
{
  "message": "Sesión desactivada correctamente",
  "sessionId": "SESSION-2026-02-05-A1B2C3D4"
}
```

---

## 🎨 COMPONENTES UI RECOMENDADOS

### Formulario de Creación:
```typescript
interface SessionFormData {
  name: string;
  startsAt: Date | string;
  endsAt: Date | string;
}

// Campos del formulario:
// 1. Input text: Nombre de la sesión
// 2. DateTimePicker: Fecha/hora inicio
// 3. DateTimePicker: Fecha/hora fin
// 4. Button: Crear Sesión
```

### Lista de Sesiones:
```typescript
interface SessionListItem {
  id: string;
  sessionId: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
}

// Elementos de cada card/fila:
// - Nombre de la sesión
// - Fecha y hora (formato legible)
// - Badge: Activa/Inactiva
// - Botón: Ver QR
// - Botón: Desactivar (si está activa)
// - Botón: Eliminar (opcional)
```

### Vista QR:
```typescript
// Modal/Dialog con:
// - Nombre de la sesión
// - QR code (imagen base64)
// - Botón: Descargar QR
// - Botón: Imprimir
// - SessionId (para referencia)
```

---

## 📝 EJEMPLO DE USO COMPLETO

### CREAR SESIÓN
```typescript
const createSession = async (formData: SessionFormData) => {
  const response = await fetch('http://localhost:3000/api/admin/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: formData.name,
      startsAt: new Date(formData.startsAt).toISOString(),
      endsAt: new Date(formData.endsAt).toISOString()
    })
  });
  
  const result = await response.json();
  return result.data; // incluye qrCode
};
```

### LISTAR SESIONES
```typescript
const getSessions = async () => {
  const response = await fetch('http://localhost:3000/api/admin/sessions', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  return result.data; // array de sesiones
};
```

### DESACTIVAR SESIÓN
```typescript
const deactivateSession = async (sessionId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/admin/sessions/${sessionId}/deactivate`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
};
```

### OBTENER QR
```typescript
const getSessionQR = async (sessionId: string) => {
  const response = await fetch(
    `http://localhost:3000/api/admin/sessions/${sessionId}/qr`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const result = await response.json();
  return result.data; // { sessionId, name, qrCode }
};
```

---

## 🔐 MANEJO DE ERRORES

### Errores Comunes:

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "El nombre de la sesión es requerido",
    "Fecha de inicio inválida"
  ],
  "error": "Bad Request"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden (No es admin)
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Sesión no encontrada",
  "error": "Not Found"
}
```

---

## 📊 ESTADOS DE SESIÓN

| Estado | Descripción |
|--------|-------------|
| `isActive: true` | Sesión disponible para escaneo QR |
| `isActive: false` | Sesión desactivada, no acepta más asistencias |

### Flujo de Estado:
1. Sesión creada → `isActive: true`
2. Admin desactiva → `isActive: false`
3. Una vez desactivada, no puede reactivarse (por seguridad)

---

## 🎯 CASOS DE USO

### Caso 1: Crear sesión para evento futuro
```typescript
// Evento: Retiro del 10 de febrero de 9am a 5pm
{
  "name": "Retiro Espiritual - Febrero 2026",
  "startsAt": "2026-02-10T09:00:00.000Z",
  "endsAt": "2026-02-10T17:00:00.000Z"
}
```

### Caso 2: Crear sesión para hoy
```typescript
// Encuentro de hoy 7pm a 9pm
const today = new Date();
const startsAt = new Date(today.setHours(19, 0, 0, 0));
const endsAt = new Date(today.setHours(21, 0, 0, 0));

{
  "name": "Encuentro Semanal",
  "startsAt": startsAt.toISOString(),
  "endsAt": endsAt.toISOString()
}
```

### Caso 3: Desactivar sesión después del evento
```typescript
// Después del evento, el admin puede desactivar la sesión
// para que nadie más pueda escanear el QR
await deactivateSession("SESSION-2026-02-10-ABC123");
```

---

## 🔄 INTEGRACIÓN CON OTROS ENDPOINTS

### Después de crear sesión:
1. La sesión queda disponible inmediatamente
2. El QR puede ser escaneado por usuarios con `POST /api/attendance/scan`
3. Las asistencias se registran y otorgan flores

### Relación con Attendance:
```typescript
// Usuario escanea QR de la sesión
POST /api/attendance/scan
{
  "qrCode": "{\"sid\":\"SESSION-2026-02-10-ABC123\",\"exp\":1738944000,\"sig\":\"...\"}"
}

// Si la sesión está activa y el QR es válido:
// → Se registra asistencia
// → Usuario recibe +1 flor
```

---

## 📱 NOTAS PARA DESARROLLO MÓVIL

- El `qrCode` viene como data URL: `data:image/png;base64,...`
- Puede renderizarse directamente en una etiqueta `<img>`
- Para descargar: convertir base64 a blob y usar FileSaver
- Para imprimir: abrir en nueva ventana con `window.print()`
- El `sessionId` es único y puede usarse como referencia

---

## 🚀 BASE URL

**Desarrollo:** `http://localhost:3000/api`  
**Producción:** (definir según deployment)

Todos los endpoints están prefijados con `/api`
