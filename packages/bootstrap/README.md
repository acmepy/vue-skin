# @vue-skin/bootstrap

Adapter Bootstrap para Vue Skin. Implementa el contrato completo con componentes Vue y los estilos oficiales de Bootstrap, compilados por módulos.

## Uso completo

```js
import { createVueSkin } from '@vue-skin/core'
import Bootstrap from '@vue-skin/bootstrap'

app.use(createVueSkin({ adapter: Bootstrap }))
```

Cada componente importa su base compartida y los CSS que necesita. No se importa `bootstrap.min.css`. Esta entrada registra los 35 componentes, por lo que incluye sus estilos; no detecta qué etiquetas se utilizan en las plantillas de la aplicación. `Stepper` utiliza estilos propios porque Bootstrap no ofrece un componente equivalente, y conserva la API común horizontal/vertical.

## Componentes individuales

Para cargar solo un componente y sus dependencias visuales, impórtalo directamente:

```vue
<script setup>
import Button from '@vue-skin/bootstrap/components/Button'
</script>

<template>
  <Button variant="primary" loading>Guardar</Button>
</template>
```

Este ejemplo incluye base, botones y spinner para el estado de carga. No carga los estilos de modal, tablas, formularios, sidebar o accordion. Las composiciones importan las piezas que necesitan: por ejemplo, Dialog utiliza Button, Input, Modal y Spinner.

La base contiene variables, reset, tipografía, helpers y utilidades generales de Bootstrap. Se comparte y el bundler la incluye una sola vez. Grid, controles de formulario, validación y tooltips también se comparten donde corresponde. Los estilos propios de integración siguen dentro del componente Vue al que pertenecen.

Los componentes de apariencia (`ThemeSwitcher` y `ThemeSelector`) requieren el servicio de temas que proporciona `createVueSkin`. La entrada completa sigue siendo la opción para instalar todos los componentes, temas y diálogos. Las importaciones directas de componentes normales permiten utilizar un subconjunto sin registrar el adapter completo; combinarlas con el adapter completo volverá a incluir sus demás estilos.

También puedes importar un módulo para HTML propio con clases Bootstrap:

```js
import '@vue-skin/bootstrap/styles/base.css'
import '@vue-skin/bootstrap/styles/Button.css'
```

Los módulos se definen en `scripts/styles.js`. No se incluyen componentes Bootstrap que Vue Skin no utiliza, como carousel, pagination o progress. Para esos usos, la aplicación puede aportar su propia hoja de Bootstrap.

## Preparación de estilos

Desde la raíz del repositorio:

```sh
npm run generate:bootstrap
```

Equivale a ejecutar el build del paquete directamente:

```sh
npm run build --workspace @vue-skin/bootstrap
```

El script compila los parciales Sass oficiales una sola vez por módulo y conserva la licencia MIT en `src/styles`. Sass es una dependencia de desarrollo del paquete. El consumidor recibe CSS precompilado y no necesita Sass ni un plugin adicional de CSS. `prepack` prepara los archivos antes de publicar; no hay scripts de instalación.

Los iconos se generan por separado con icon-forge, como se explica en el README raíz.
