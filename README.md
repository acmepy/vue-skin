# Vue Skin

Vue Skin permite usar una API común de componentes Vue 3 mientras cada adapter controla su propio HTML, CSS y JavaScript.

> Estado: implementación inicial. El contrato y la infraestructura están listos; los componentes se incorporarán progresivamente en ambos adapters.

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
