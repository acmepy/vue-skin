# Vue Skin

Vue Skin permite usar una API común de componentes Vue 3 mientras cada adapter controla su propio HTML, CSS y JavaScript.

> Estado: implementación inicial. El contrato y la infraestructura están listos; los componentes se incorporarán progresivamente en ambos adapters.

## Versiones de los paquetes

Por ahora, los paquetes de `packages/` utilizan la misma versión que el `package.json` raíz. Después de cambiar esa versión, ejecuta:

```sh
npm run version:sync
```

El script actualiza los `package.json` de esos paquetes y sus versiones en `package-lock.json`, incluida la entrada raíz. No cambia la versión privada del playground, las dependencias ni sus rangos, y no requiere conexión a internet. No incrementa versiones, crea tags ni publica paquetes. Si no hay lockfile, solo actualiza los manifiestos; si el lockfile no incluye algún paquete, solicita ejecutar `npm install` antes de modificar archivos.

Los cuatro paquetes de librería declaran `files` para publicar únicamente `src` y, donde existe, `index.d.ts`, además de los archivos que npm incluye automáticamente (como `package.json`). Los tests quedan en el repositorio, pero no se descargan con el paquete publicado. El playground es privado y no se publica.

## Ejemplo de uso

La aplicación instala un único adapter antes de montar Vue:

```js
import { createApp } from 'vue'
import { createVueSkin } from '@vue-skin/core'
import BasecoatSkin from '@vue-skin/basecoat'
import App from './App.vue'

const app = createApp(App)

app.use(createVueSkin({
  adapter: BasecoatSkin
}))

app.mount('#app')
```

Para usar Bootstrap, solo cambia el adapter en el archivo de arranque:

```js
import BootstrapSkin from '@vue-skin/bootstrap'

app.use(createVueSkin({ adapter: BootstrapSkin }))
```

La vista de la aplicación mantiene la misma API:

```vue
<script setup>
import { ref } from 'vue'

const name = ref('')
const nameError = ref('')
const saving = ref(false)
</script>

<template>
  <UiCard title="Perfil">
    <UiInput
      v-model="name"
      label="Nombre"
      help="Ingrese su nombre completo"
      tooltip="Este valor será visible para su equipo"
      :error="nameError"
      required
    />

    <UiButton variant="primary" :loading="saving">
      Guardar
    </UiButton>
  </UiCard>
</template>
```

La vista no depende de clases ni APIs de Basecoat o Bootstrap. Cada adapter implementa el contrato visual y de comportamiento de forma independiente.

## Encabezado personalizado del sidebar

`UiSidebar` y `UiAppLayout` aceptan un template en el slot `header`. Puedes usar un logo, varias líneas de texto y componentes Vue, con tu propio diseño:

```vue
<UiAppLayout title="Mi aplicación" :sections="sections">
  <template #header>
    <div class="d-flex align-items-center gap-3">
      <img src="/logo.svg" alt="Mi empresa" width="40" height="40">
      <div>
        <h2 class="h6 mb-1">Mi empresa</h2>
        <p class="small mb-0">Panel de administración</p>
      </div>
    </div>
  </template>
  <main>Contenido</main>
</UiAppLayout>
```

El slot reemplaza la prop de texto `header`; sin el slot esa prop sigue funcionando. La altura se adapta al contenido en escritorio y móvil. En `UiSidebar` directo se utiliza la misma sintaxis `#header`. Las clases del ejemplo corresponden a Bootstrap.

## Gráficos

El adapter Bootstrap incluye `UiChart`, basado en Chart.js (dependencia del adapter; no requiere instalación adicional en la aplicación).

```vue
<script setup>
const data = {
  labels: ['Enero', 'Febrero', 'Marzo'],
  datasets: [{ label: 'Ventas', data: [20, 35, 28], backgroundColor: '#0d6efd' }]
}
</script>

<template>
  <UiChart type="bar" :data="data" title="Ventas mensuales" :height="300" />
</template>
```

Soporta barras, líneas, dona, pastel, radar, área polar, dispersión y burbujas. Para un área usa `type="line"` y `fill: true` en el dataset. `options` permite usar la configuración de Chart.js. Los datos son reactivos; el componente adapta sus textos y grilla al tema y libera la instancia al desmontarse. Los ejemplos completos están en la sección `UiChart` del playground.

## Autocompletado

`@vue-skin/core` incluye `index.d.ts` para Volar y TypeScript, aun cuando la implementaciÃ³n estÃ© escrita en JavaScript. El editor sugiere atributos y valores normalizados, por ejemplo `xs`, `sm`, `md`, `lg` y `xl` para `UiIcon.size`, sin impedir dimensiones CSS como `"16"` o `"1.25em"`.

## Diálogos desde JavaScript

El objeto retornado por `createVueSkin` expone un servicio de diálogos asociado a esa aplicación. Registra una vez `UiDialogHost` en la raíz para renderizar las solicitudes:

```js
const skin = createVueSkin({ adapter: BootstrapSkin })
const uiDialog = skin.dialog

app.use(skin)
```

```vue
<template>
  <RouterView />
  <UiDialogHost />
</template>
```

```js
await uiDialog.alert('Los cambios fueron guardados.', 'Éxito')

if (await uiDialog.confirm('¿Desea continuar?', 'Confirmación')) {
  // continuar
}

const name = await uiDialog.prompt('Ingrese un nombre.', 'Nuevo proyecto', {
  label: 'Nombre'
})

const preloader = uiDialog.preloader('Procesando información')
try {
  await save()
} finally {
  preloader.close()
}
```

## Desarrollo

```bash
npm install
npm test
npm run build
npm run dev
```

La especificación de arquitectura y de los componentes está en [IMPLEMENTATION.md](IMPLEMENTATION.md).
