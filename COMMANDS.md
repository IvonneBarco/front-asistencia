# Comandos Útiles - Emaús Mujeres

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará en http://localhost:5173
# Hot reload automático activado
```

## Build y Producción

```bash
# Build optimizado para producción
npm run build

# Preview del build de producción
npm run preview
```

## Linting y Code Quality

```bash
# Ejecutar ESLint
npm run lint

# Auto-fix problemas de linting
npm run lint -- --fix
```

## Testing (Por implementar)

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests E2E
npm run test:e2e
```

## PWA

```bash
# Verificar service worker
# Después de build, abre Chrome DevTools > Application > Service Workers

# Limpiar cache de PWA
# Chrome DevTools > Application > Clear storage > Clear site data
```

## Dependencias

```bash
# Instalar nueva dependencia
npm install <package>

# Instalar dependencia de desarrollo
npm install -D <package>

# Actualizar dependencias
npm update

# Auditoría de seguridad
npm audit

# Fix vulnerabilidades automáticas
npm audit fix
```

## Git

```bash
# Inicializar repositorio (si no existe)
git init

# Añadir archivos
git add .

# Commit
git commit -m "feat: descripción del cambio"

# Conectar a repositorio remoto
git remote add origin <url>

# Push
git push -u origin main
```

## Environment Variables

```bash
# Desarrollo local
# Crea archivo .env en la raíz:
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Producción
# Configura en tu plataforma de hosting:
# VITE_API_BASE_URL=https://api.emaus.com
```

## Troubleshooting

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar cache de Vite
rm -rf node_modules/.vite

# Verificar versión de Node
node --version
# Debe ser >= 20.11.0

# Verificar puerto en uso
# Windows:
netstat -ano | findstr :5173
# Linux/Mac:
lsof -i :5173
```

## Deployment

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy a producción
netlify deploy --prod
```

## Análisis de Bundle

```bash
# Analizar tamaño del bundle
npm run build -- --mode analyze

# Ver reporte de tamaño
npx vite-bundle-visualizer
```

## TypeScript

```bash
# Verificar tipos sin compilar
npx tsc --noEmit

# Generar declaraciones de tipos
npx tsc --declaration --emitDeclarationOnly
```

## Debugging

```bash
# Debugging en VSCode
# Añadir breakpoint y presionar F5

# Debugging en Chrome
# Abre Chrome DevTools (F12)
# Sources > Encuentra tu archivo
# Añade breakpoints
```
