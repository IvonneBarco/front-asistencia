# Emaús Mujeres - Asistencia con Flores 🌸

Sistema de asistencia con gamificación para la comunidad católica femenina "Emaús Mujeres". Reconoce la constancia, presencia y servicio de cada integrante a través de "flores" digitales.

## 🎯 Características

- ✅ Login con email + PIN
- 📷 Escaneo de códigos QR para registrar asistencia
- 🌸 Sistema de reconocimiento con "flores" (no puntos competitivos)
- 🏆 "Jardín de Emaús" - leaderboard con enfoque en reconocimiento comunitario
- ⚙️ **Panel de administración de sesiones** (crear, ver QR, desactivar)
- 📱 PWA - Instalable como app nativa
- 🎨 Diseño sobrio, cálido y respetuoso

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Routing**: React Router
- **State/Data**: React Query (@tanstack/react-query)
- **QR Scanner**: html5-qrcode
- **PWA**: vite-plugin-pwa
- **Styling**: CSS con design tokens personalizados

## 🎨 Identidad Visual

### Paleta de Colores
- **Primario**: `#6B3A1E` (marrón cruz)
- **Fondo**: `#FAF9F7`
- **Acentos** (máx. uno por vista): 
  - Azul: `#1F4FD8`
  - Amarillo: `#F2C94C`
  - Rojo: `#D64545`

### Tipografía
- **Cuerpo**: Inter
- **Títulos**: Playfair Display (opcional)

### Logo
Cruz + mariposa (sobriedad + transformación)

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Button, Card, Badge
│   ├── SessionForm.tsx  # Formulario de creación de sesiones
│   └── QRModal.tsx      # Modal para visualizar códigos QR
├── context/             # AuthContext
├── hooks/               # useApi (React Query hooks)
├── services/            # API client
├── styles/              # Design tokens + global styles
├── types/               # TypeScript definitions
└── views/
    ├── Login.tsx        # Autenticación
    ├── Scanner.tsx      # Escaneo QR asistencia
    ├── Jardin.tsx       # Leaderboard
    └── AdminSessions.tsx # Gestión de sesiones (admin)
```
├── types/               # TypeScript interfaces
├── views/               # Login, Scanner, Jardin
└── App.tsx              # Router + providers
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 20.11+
- npm o yarn

### Setup

1. **Clonar e instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
Crea un archivo `.env` basado en `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. **Ejecutar en desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Lint del código
```

## 📱 API Endpoints

El frontend consume los siguientes endpoints:

- `POST /auth/login` - Autenticación
  ```json
  { "email": "string", "pin": "string" }
  ```

- `POST /attendance/scan` - Registrar asistencia
  ```json
  { "qrCode": "string" }
  ```

- `GET /leaderboard` - Obtener jardín de flores

- `GET /me` - Datos del usuario actual

## 🌐 PWA - Instalación

La app es una PWA completamente funcional:

1. Abre la app en un navegador compatible
2. Busca el botón "Instalar" o "Añadir a pantalla de inicio"
3. La app se instalará como aplicación nativa

### Características PWA
- ✅ Instalable en dispositivos móviles y escritorio
- ✅ Funciona sin conexión (básico)
- ✅ Ícono personalizado
- ✅ Modo standalone (sin barra del navegador)

## 🎭 Principios de Diseño

1. **Reconocimiento > Competencia**: No es una competencia, es reconocimiento comunitario
2. **Lenguaje positivo y humano**: Mensajes cálidos y cercanos
3. **Mobile-first**: Diseñado primero para móviles
4. **Gamificación discreta**: No invasiva ni infantil
5. **Sobriedad**: Diseño respetuoso y elegante

## 📝 Semántica Obligatoria

- ✅ "flores" (no "puntos")
- ✅ "Jardín de Emaús" (no "leaderboard")
- ✅ "orden de flores" (no "ranking")
- ✅ "asistencia" (no "check-in")

## 🔐 Autenticación

- JWT almacenado en `localStorage`
- Context API para estado global de autenticación
- Protected routes con redirección automática

## 🧪 Testing

_(Por implementar)_

```bash
npm run test      # Tests unitarios
npm run test:e2e  # Tests E2E
```

## 📦 Build y Deploy

### Build para producción:
```bash
npm run build
```

Los archivos optimizados se generan en `/dist`.

### Deploy:
Compatible con:
- Vercel
- Netlify
- GitHub Pages
- Cualquier hosting estático

**Configuración requerida**:
- Asegurar que todas las rutas redirigen a `index.html` (SPA)
- Configurar variable `VITE_API_BASE_URL` en el entorno de producción

## 👥 Equipo

Emaús Mujeres - Comunidad católica femenina

## 📄 Licencia

_(Por definir)_

---

Hecho con 🌸 para la comunidad Emaús Mujeres
