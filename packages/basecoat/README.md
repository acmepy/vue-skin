# @vue-skin/basecoat

Adapter Basecoat para Vue Skin (Vue 3 + Composition API). Exporta por defecto el adapter que recibe `createVueSkin` y conserva `adapterName = 'basecoat'`.

```js
import { createVueSkin } from '@vue-skin/core'
import Basecoat from '@vue-skin/basecoat'

app.use(createVueSkin({ adapter: Basecoat }))
```

Implementa todos los nombres del contrato público de core, incluidos formularios, grilla de 12 columnas, navegación, listas, tablas, gráficos, diálogos y apariencia. No importa componentes, CSS ni JavaScript de Bootstrap. El JavaScript interactivo lo controla Vue y los modales usan el elemento nativo `dialog`; no se debe cargar además `basecoat-css/all` sobre los mismos elementos.

Se incluye el CSS precompilado oficial de Basecoat, por lo que la aplicación no necesita instalar Tailwind ni configurar un compilador para los componentes. `scripts/prepare-css.js` copia ese archivo y su licencia desde la dependencia instalada durante build y prepack; no se ejecutan scripts de instalación en el consumidor. Los estilos de integración añaden comportamientos del contrato que Basecoat no ofrece directamente: grilla normalizada, labels flotantes, listas multimedia y variantes semánticas. Los tooltips simples usan el atributo nativo `title`.

Durante esa preparación se elimina una regla inválida incluida en Basecoat 1.0.2 (`[data-tooltip]:before:has()`), que el navegador ya descarta. El resto del CSS se conserva; así la minificación no genera el warning `Unexpected ")"`. La corrección se aplica al archivo distribuido, sin modificar `node_modules`.

Los gráficos utilizan Chart.js, aislado en este paquete y cargado de forma diferida. El tema utiliza tokens Basecoat/shadcn y la clase `dark`, con el servicio común de core. Se conservan modo sistema, persistencia, acento, Vibrant y Monochrome.

El playground común puede ejecutarse con `npm run dev:basecoat` desde la raíz. Las utilidades de presentación de sus ejemplos antiguos viven únicamente en el playground y no forman parte del paquete.

Se requiere un navegador moderno con soporte de `dialog`, CSS Grid, variables CSS, `color-mix` y los selectores utilizados por la versión instalada de Basecoat. La primera implementación se verifica con Basecoat CSS 1.0.2. La apariencia exacta y animaciones pueden variar entre adapters; la API Vue y los comportamientos del contrato son comunes.
