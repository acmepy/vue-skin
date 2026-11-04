# @vue-skin/slate

Slate es el diseño propio de Vue Skin: fondos suaves, cards elevadas, acentos azules, bordes discretos y tipografía de sistema. No utiliza un framework CSS, fuentes remotas ni imágenes externas.

```js
import { createApp } from 'vue'
import { createVueSkin } from '@vue-skin/core'
import Slate from '@vue-skin/slate'
import App from './App.vue'

createApp(App).use(createVueSkin({ adapter: Slate })).mount('#app')
```

El import incluye los estilos del adapter. Las vistas usan los mismos componentes, props, eventos, slots y métodos que los demás adapters. Se implementa el contrato completo, incluyendo validación al perder foco, `validate()`, floating labels, búsqueda, autocomplete, tablas con acciones, gráficos y diálogos desde JavaScript. Los layouts de `@vue-skin/layouts` funcionan sin cambios.

## Apariencia

- Fondos claros gris azulados y modo oscuro azul profundo; cards diferenciadas del fondo.
- Botones compactos con esquinas suaves y estados de foco; badges con fondos tenues.
- Navbar y sidebar sobre la misma superficie; navegación activa con un tinte del acento.
- Pestañas como controles segmentados, tablas con encabezados discretos y modales con fondo desenfocado.
- Tipografía nativa del sistema, sin descargas adicionales; animaciones reducidas cuando el sistema lo solicita.

`UiThemeSelector`, `UiThemeSwitcher` y `useTheme()` conservan claro/oscuro/sistema, ocho colores de acento, Vibrant, Monochrome y persistencia. La paleta distingue fondo de página, superficie de card, campos y navegación; las pruebas verifican contraste 4.5:1 para texto, etiquetas de botones primarios, enlaces y selección en todas las combinaciones de preferencias.

El CSS utiliza clases `sl-*`. Las variables de tema se aplican al target del servicio; `theme.target` permite acotarlas a un contenedor. Tokens útiles para personalizar desde CSS: `--background`, `--card`, `--foreground`, `--primary`, `--primary-foreground`, `--border`, `--sl-field-bg` y `--sl-chrome`. Los cambios mediante `useTheme()` recalculan la paleta.

No hay dependencia de otro adapter ni de herramientas de compilación de CSS. Solo requiere Vue, core y Chart.js; este último se carga al montar un gráfico. El paquete distribuye `src` y los tipos, sin pruebas ni playground.

## Playground

Selecciona **Slate** en el dropdown Adapter o ejecuta `npm run dev:slate`. La página `/slate.html` y las vistas independientes de layouts conservan la selección al recargar. `VITE_UI_SKIN=slate` y `npm run build:slate` permiten usarlo como adapter inicial.
