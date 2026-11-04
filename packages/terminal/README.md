# @vue-skin/terminal

Adapter Terminal.css para Vue Skin. Implementa todos los componentes del contrato público, con tipografía monoespaciada, bordes rectos y las convenciones nativas `button is-primary`, `tag`, `card` y `list-item`.

```js
import { createApp } from 'vue'
import { createVueSkin } from '@vue-skin/core'
import Terminal from '@vue-skin/terminal'
import App from './App.vue'

createApp(App).use(createVueSkin({ adapter: Terminal })).mount('#app')
```

El import incluye el CSS. No requiere Tailwind, Bootstrap, Basecoat ni otro adapter. Chart.js es una dependencia del paquete y se carga al montar un gráfico.

El CSS oficial está incluido en `src/styles/vendor/terminal.css`, conservando su licencia MIT. Corresponde al archivo v0.0.4 del repositorio [letieu/terminal.css](https://github.com/letieu/terminal.css), blob `e47f33a66bae8287a34a7550e36f5e183678df97`. Se omitió únicamente la importación remota de Google Fonts para permitir uso sin red; se usa la fuente monoespaciada disponible en el sistema. El JavaScript global de Terminal no se carga: Vue gestiona dropdown, accordion y toast, evitando controladores duplicados.

`src/styles/integration.css` completa el contrato de Vue Skin: formularios accesibles con validación y floating labels, autocomplete, grilla responsiva, búsqueda, acciones de tabla, modal nativo, diálogos desde JavaScript y sidebar persistente/overlay. Los layouts de `@vue-skin/layouts` se usan sin cambios.

`UiThemeSelector`, `UiThemeSwitcher` y `useTheme()` mantienen la API compartida. El adapter convierte las preferencias a variables nativas (`--terminal-bg`, `--terminal-fg`, `--primary`, `--surface`, `--border-color`), con claro/oscuro/sistema, acento, Vibrant y Monochrome. La apariencia se persiste con la misma clave que los demás adapters.

Playground: `npm run dev:terminal` o selecciona **Terminal** en el dropdown Adapter. También está disponible en `/terminal.html` y sus vistas independientes de layouts.
