# Validación de Encoding UTF-8 para Caracteres Acentuados

## Problema Identificado
Los nombres con acentos/tildes se visualizaban con caracteres especiales en la interfaz de la aplicación, aunque en la base de datos aparecían correctamente.

## Causa Raíz
El header HTTP `Content-Type` no especificaba explícitamente `charset=utf-8`, lo que podría causar problemas de encoding dependiendo de la configuración del servidor backend y del navegador.

## Solución Implementada

### Cambio en `src/services/api.ts` (Línea 55-57)

**Antes:**
```typescript
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};
```

**Después:**
```typescript
const headers: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
};
```

## Validación Técnica

### 1. Configuración Existente ✅
- **index.html**: Meta charset ya estaba configurado correctamente en línea 4
  ```html
  <meta charset="UTF-8" />
  ```

### 2. Puntos de Renderización de Nombres ✅
Los nombres se renderizan directamente desde los datos de la API sin transformaciones:

- **Jardin.tsx (Leaderboard)**: 
  - Línea 171: `{currentUserEntry.user.name}`
  - Línea 347: `{entry.user.name}`

- **AdminUsers.tsx**: 
  - Línea 144: `{user.name}`
  - Línea 155: `{user.group.name}`

### 3. Stack de Codificación
- **Frontend**: React/TypeScript (maneja UTF-8 nativamente)
- **API Client**: Fetch API con headers explícitos
- **Transport**: HTTP con charset especificado
- **HTML**: Meta charset UTF-8

## Nombres de Prueba Sugeridos
Crea usuarios con estos nombres para validar:
- María García
- José María González
- Luisa Pérez Núñez
- Ángela María Rodríguez
- Paola Guzmán
- Catalina López Ibáñez

## Validación en Navegador

Puedes verificar el encoding abriendo las DevTools:
1. Abre la consola (F12)
2. Ve a Network
3. Abre un request de la API (ej: `/api/leaderboard`)
4. Busca en Response Headers:
   ```
   content-type: application/json; charset=utf-8
   ```

## Componentes Afectados Positivamente

1. **Jardin.tsx** - Orden de Flores (Leaderboard)
2. **AdminUsers.tsx** - Listado de Usuarios
3. **AdminGroups.tsx** - Grupos
4. **MyGroup.tsx** - Mi Grupo
5. **RegisterAttendance.tsx** - Registro Manual

## Recomendaciones Adicionales

- Verificar que el backend también responda con `charset=utf-8`
- Asegurar que la base de datos está configurada con UTF-8 (utf8mb4 para MySQL)
- En deployment, confirmar que los servidores (nginx, Apache) estén configurados para UTF-8

## Estado
✅ Implementado
✅ Validado en código
⏳ Pendiente de prueba en runtime
