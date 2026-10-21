# Implementación responsive — Emaús Mujeres

## Auditoría breve

La aplicación es una SPA React + TypeScript construida con Vite. Las vistas manejan su
propio layout y reutilizan tokens, `Card`, `Button`, `TopBar` y `NavigationMenu`.
La autenticación, los hooks de API y las rutas están desacoplados de CSS, por lo que
el ajuste se concentró en presentación.

Problemas detectados:

- La navegación permanecía como un menú hamburguesa desplegable en escritorio.
- Varias vistas administrativas usaban contenedores de 800–1200 px sin una distribución
  de escritorio consistente.
- Selección de grupos y administración de sesiones no aprovechaban dos áreas de trabajo
  en pantallas grandes.
- El escáner tenía un límite visual demasiado estrecho para tablets y desktop.
- Había una llave CSS sobrante en `Scanner.css`.
- Las vistas no tenían una protección global contra overflow horizontal.

## Cambios implementados

- Se mantuvo la navegación compacta en mobile y tablet; desde 1024 px el menú se
  presenta como navegación horizontal visible y desplazable, sin cambiar rutas ni
  handlers. Esto evita que el menú administrativo crezca verticalmente y cubra la
  pantalla en anchos intermedios.
- Se ampliaron y centraron las barras superiores hasta 1440 px.
- Se añadió `overflow-x: hidden` al documento y límites `min-width: 0` para evitar
  desbordamientos por contenido largo.
- Dashboard de grupos: formulario y listado se distribuyen en dos columnas en desktop.
- Gestión de sesiones: creación y listado se distribuyen en dos columnas en desktop.
- Selección de grupos: tarjetas en dos columnas desde tablet.
- Registro manual de asistencias: mantiene dos columnas desde tablet y usa un ancho
  de lectura mayor en desktop.
- Ranking de flores, perfil, login y escáner conservan su comportamiento móvil y ganan
  espacio progresivamente en tablet/desktop.
- El escáner mantiene el flujo `html5-qrcode` y aumenta únicamente el área visual
  disponible en desktop.
- No se modificaron endpoints, contratos, JWT, Service Worker ni configuración PWA.

## Puntos de entrada revisados

| Pantalla | Mobile | Tablet | Desktop |
|---|---|---|---|
| Login | Formulario centrado y compacto | Formulario limitado | Formulario limitado, sin estiramiento |
| Escáner QR | Cámara y acciones verticales | Panel centrado | Panel más amplio, cámara con límite seguro |
| Ranking de flores | Lista vertical virtualizada | Contenedor ampliado | Contenedor hasta 1200 px |
| Selección de grupos | Tarjetas verticales | Dos columnas | Dos columnas en contenedor amplio |
| Gestión de usuarios | Lista apilada y tabs desplazables | Contenedor flexible | Lista y contenido con ancho controlado |
| Gestión de sesiones/QR | Tarjetas verticales | Lectura amplia | Formulario y listado en dos columnas |
| Registro de asistencias | Selectores apilados | Dos columnas | Dos columnas hasta 1440 px |

## Validación

Se ejecutaron build y lint desde `asistencia-emaus`:

- `npm run build`
- `npm run build`: correcto. TypeScript y Vite completan la compilación; Vite solo
  mantiene el warning existente del tamaño del bundle y Browserslist desactualizado.
- `npm run lint`: bloqueado antes de analizar archivos por un problema preexistente de
  configuración: `eslint@8.57.1` no expone `eslint/config`, pero `eslint.config.js`
  intenta importarlo. No se cambiaron dependencias porque no es necesario para el ajuste
  responsive.

La comprobación automatizada de la ruta pública `/login` se ejecutó a 375 px, 768 px,
1024 px, 1440 px y 1920 px. En cada tamaño `document.documentElement.scrollWidth`
coincidió con `clientWidth`, sin overflow horizontal.

La validación estática cubre límites de contenido, tablas con scroll horizontal
localizado y controles que mantienen su tamaño funcional. La revisión visual de rutas
autenticadas debe hacerse con datos de prueba, especialmente las tablas de usuarios,
préstamos de santos y códigos QR, además de confirmar el permiso de cámara en
`/scanner`.

## Iteración final de UI/UX

- El reporte administrativo usa un contenedor fluido con `min-width: 0` y padding
  responsive, por lo que aprovecha el área disponible tanto con el sidebar expandido
  como contraído.
- Las tarjetas de estadísticas tienen altura uniforme, iconos discretos y valores con
  mayor jerarquía visual; su distribución es de cuatro, dos o una columna según el
  viewport.
- El podio solo presenta posiciones con al menos una asistencia. Las participantes con
  cero asistencias permanecen en la clasificación general con su porcentaje de 0 %.
- Las posiciones ausentes se eliminan visualmente sin alterar el ranking del backend;
  la composición se centra automáticamente cuando hay una o dos posiciones elegibles.
- Los empates muestran una participante representativa, el total de participantes
  empatadas y una lista desplegable accesible con todos los nombres.
- Se redujo la intensidad visual del scrollbar del sidebar sin cambiar su
  desplazamiento ni la separación entre encabezado, navegación y cierre de sesión.

La validación de compilación de esta iteración se realizó con `npm run build` y fue
correcta. La página autenticada compartida no pudo inspeccionarse visualmente durante
esta ejecución porque el servidor local devolvió `ERR_CONNECTION_REFUSED`; por ello no
se reportan mediciones visuales de datos reales como si hubieran sido observadas.
