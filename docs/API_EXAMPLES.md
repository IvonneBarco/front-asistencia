# API Mock Examples

Para desarrollo y testing, estos son ejemplos de respuestas esperadas del backend.

## POST /auth/login

**Request:**
```json
{
  "email": "maria@emaus.com",
  "pin": "1234"
}
```

**Response (200):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "maria@emaus.com",
      "name": "María García",
      "flores": 45,
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

**Response (401):**
```json
{
  "message": "Credenciales inválidas"
}
```

---

## POST /attendance/scan

**Request:**
```json
{
  "qrCode": "SESSION-2026-01-31-ABC123"
}
```

**Response (200) - Primera vez:**
```json
{
  "data": {
    "success": true,
    "message": "Asistencia registrada. +1 flor 🌸",
    "flores": 1,
    "session": {
      "id": "session-abc",
      "name": "Encuentro Semanal",
      "date": "2026-01-31T19:00:00Z"
    }
  }
}
```

**Response (200) - Ya registrado:**
```json
{
  "data": {
    "success": false,
    "message": "Esta sesión ya fue registrada"
  }
}
```

**Response (400) - Código inválido:**
```json
{
  "message": "Código inválido o vencido"
}
```

---

## GET /leaderboard

**Response (200):**
```json
{
  "data": {
    "entries": [
      {
        "rank": 1,
        "user": {
          "id": "user-456",
          "name": "Ana Martínez",
          "avatar": "https://example.com/avatar1.jpg"
        },
        "flores": 120,
        "isCurrentUser": false
      },
      {
        "rank": 2,
        "user": {
          "id": "user-789",
          "name": "Isabel Rodríguez",
          "avatar": null
        },
        "flores": 95,
        "isCurrentUser": false
      },
      {
        "rank": 3,
        "user": {
          "id": "user-123",
          "name": "María García",
          "avatar": null
        },
        "flores": 45,
        "isCurrentUser": true
      }
    ],
    "currentUser": {
      "rank": 3,
      "user": {
        "id": "user-123",
        "name": "María García",
        "avatar": null
      },
      "flores": 45,
      "isCurrentUser": true
    }
  }
}
```

---

## GET /me

**Response (200):**
```json
{
  "data": {
    "id": "user-123",
    "email": "maria@emaus.com",
    "name": "María García",
    "flores": 45,
    "avatar": null
  }
}
```

**Response (401):**
```json
{
  "message": "No autorizado"
}
```

---

## Notas de Implementación

1. **Autenticación:** Todos los endpoints excepto `/auth/login` requieren el header:
   ```
   Authorization: Bearer <token>
   ```

2. **Formato de respuesta:** Todas las respuestas exitosas siguen el patrón:
   ```json
   {
     "data": { ... },
     "message": "Opcional"
   }
   ```

3. **Códigos de estado:**
   - `200`: Éxito
   - `400`: Error de validación
   - `401`: No autorizado
   - `403`: Prohibido
   - `404`: No encontrado
   - `500`: Error del servidor

4. **QR Code Format:** Los códigos QR deben seguir el formato:
   ```
   SESSION-YYYY-MM-DD-{UNIQUE_ID}
   ```

5. **Flores:** Se otorga 1 flor por asistencia registrada. No se pueden duplicar registros para la misma sesión.
