# @vue-skin/konsta

Adapter Konsta UI para Vue Skin. Implementa todos los componentes del contrato público y usa componentes Vue oficiales de [Konsta UI](https://konstaui.com/vue/): Button, Card, Badge, ListItem y Preloader. La presentación nativa utiliza el tema iOS de Konsta, tanto en móviles como en tablets y escritorio.

```js
import { createApp } from 'vue'
import { createVueSkin } from '@vue-skin/core'
import Konsta from '@vue-skin/konsta'
import App from './App.vue'

createApp(App).use(createVueSkin({ adapter: Konsta })).mount('#app')
```

No necesitas envolver la aplicación en `k-app`, configurar Tailwind ni agregar un plugin de Vite. El adapter proporciona el contexto requerido por sus controles nativos e importa su CSS precompilado. Konsta y Chart.js son dependencias del paquete; Bootstrap, Basecoat y Terminal no son necesarios.

Los componentes sin correspondencia directa utilizan HTML accesible y CSS de integración propio: inputs con `validate()`/errores/floating labels, autocomplete, filtros, acciones de tabla, tabs, dropdown, accordion, modal nativo, toast y sidebar responsivo. `uiDialog` conserva los métodos compartidos de core. Los eventos y slots públicos mantienen el contrato de Vue Skin, aunque el DOM sea diferente.

El sidebar se integra al espacio del layout desde el breakpoint `lg` (992px) y se convierte en overlay por debajo. Esto permite utilizar el mismo layout en tablets verticales, tablets horizontales y escritorio; las tablas admiten desplazamiento horizontal. No se fuerza un ancho de teléfono ni se utiliza un contenedor de altura fija para toda la aplicación.

Los temas claro/oscuro/sistema, colores, Vibrant y Monochrome usan el servicio compartido y se convierten a tokens de Konsta, incluido `--k-color-primary`. Los layouts y los controles de tema se usan sin cambios.

## Desarrollo del paquete

`npm run build --workspace @vue-skin/konsta` genera `src/styles/vendor/konsta.css` con Tailwind y el tema oficial `konsta/vue/theme.css`. El CSS generado y la licencia MIT se distribuyen en el paquete; Tailwind y su CLI son exclusivamente dependencias de desarrollo. `prepack` vuelve a generar los estilos antes de empaquetar. No hay scripts de instalación que deban ejecutar los consumidores.

Playground: `npm run dev:konsta` o selecciona **Konsta UI** en el dropdown Adapter. También está disponible en `/konsta.html` y sus vistas independientes de layouts. La revisión visual real en móvil/tablet sigue pendiente si el entorno no tiene navegador conectado.
