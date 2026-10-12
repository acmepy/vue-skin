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

## Autocompletado

```vue
<UiAutocomplete
  v-model="ciudad"
  :data="['Asunción', 'Encarnación', 'Concepción']"
  label="Ciudad"
  :min-length="2"
/>
```

Busca coincidencias en cualquier parte del texto, sin distinguir acentos o mayúsculas. El mínimo predeterminado es 2 caracteres. `data` también puede contener objetos `{ label, value }`: `v-model` mantiene el texto y `select` devuelve el elemento elegido. Al perder el foco exige que el texto coincida con una etiqueta completa de `data`; una búsqueda parcial muestra un error. Usa `:require-match="false"` para admitir texto libre. Un campo vacío es válido salvo con `required`. Admite teclado, ayuda, errores y `validator` adicional. Los ejemplos completos están en el playground.

## Filtro de listas

`UiList` muestra el buscador y filtra automáticamente al escribir desde 2 caracteres, sin requerir el botón o Enter. Con menos caracteres muestra todos los elementos, incluso al acortar una búsqueda anterior. Puedes cambiar el mínimo con `:min-length="3"` o desactivar el buscador con `:filter="false"`.

## Acciones de DataTable

`UiDataTableColumnButton` reemplaza el nombre anterior `UiDataTableButton` para las acciones de cada fila. Para acciones generales junto al filtro, utiliza `#actions`; recibe las filas filtradas (`data`) y la cantidad original (`total`), y funciona también sin filtro.

```vue
<UiDataTable :data="clientes" :header="header" filter>
  <template #actions="{ data }">
    <UiButtonGroup label="Acciones de la tabla">
      <UiButton title="Agregar" aria-label="Agregar" @click="agregar"><UiIcon name="mdi:plus" /></UiButton>
      <UiButton title="Exportar" aria-label="Exportar" @click="exportar(data)"><UiIcon name="mdi:download" /></UiButton>
    </UiButtonGroup>
  </template>
  <template #detail="{ row }">
    <UiDataTableColumnButton :items="acciones" @select="ejecutar($event, row)" />
  </template>
</UiDataTable>
```

Los botones generales están fuera del formulario de búsqueda. La tabla no agrega registros ni exporta datos por sí misma: esas funciones pertenecen a la aplicación. El playground muestra ambos casos y exporta JSON con las filas visibles.

`UiDataTableColumnButton` agrupa automáticamente sus opciones con `UiButtonGroup`. Cuando un item recibe `icon`, solo muestra el icono y usa `label` como tooltip nativo y nombre accesible; sin icono, muestra el label como texto.

## Floating labels

Activa `floating` en `UiInput` o `UiSelect`, enviando un `label`. El comportamiento normal sigue siendo el predeterminado.

```vue
<UiInput v-model="email" type="email" label="Correo electrónico" floating />
<UiSelect v-model="role" label="Rol" :options="roles" floating />
```

En Bootstrap se utiliza `form-floating` oficial; el input genera el placeholder necesario si no lo envías. El select mantiene su label elevado y vuelve al label normal con `multiple` o `size`. Los ejemplos de Input y Select incluyen esta opción.

## Grilla (componentes de estructura)

`UiContainer`, `UiRow` y `UiCol` son componentes del adapter, no layouts completos. Se registran automáticamente con `createVueSkin`. Bootstrap convierte sus props a clases oficiales, sin CSS de grilla adicional.

```vue
<UiContainer fluid>
  <UiRow gap="md">
    <UiCol :span="12" :md="6" :lg="4">
      <UiCard title="Resumen">Contenido</UiCard>
    </UiCol>
    <UiCol :span="12" :md="6" :lg="8">
      <UiCard title="Detalle">Contenido</UiCard>
    </UiCol>
  </UiRow>
</UiContainer>
```

`span` admite 1–12 o `auto`; sin `span`, las columnas comparten el espacio disponible. `sm`, `md`, `lg`, `xl` y `xxl` sobrescriben el ancho desde 576, 768, 992, 1200 y 1400px respectivamente. `gap` admite `none`, `xs`, `sm`, `md`, `lg`, `xl` (por defecto `md`) y controla ambos ejes. `fluid` ocupa todo el ancho; sin él, el container centra y limita el contenido. La implementación inicial está disponible en Bootstrap. El playground incluye ejemplos bajo Grid.

## Vista independiente de layouts

Las secciones `UiAppLayout`, `UiLogin` y `UiDashboard` del playground incluyen un enlace para abrir cada layout en una pestaña nueva, sin el contenedor de documentación. También puedes acceder mediante `?layout=app-layout`, `?layout=login` y `?layout=dashboard`. La vista de aplicación tiene contenido y navegación de prueba para comprobar el sidebar, el scroll y los cambios de tamaño; la vista de login ocupa toda la altura y no realiza autenticación real. El dashboard muestra indicadores, gráficos de barras/línea/dona y tablas con datos de demostración.

### Dashboard

`UiDashboard` se importa de `@vue-skin/layouts` y organiza el contenido principal. Úsalo dentro de `UiAppLayout` si necesitas sidebar y navbar. Recibe `title`, `description` y arrays `summary`, `charts` y `tables`; no carga datos remotos ni calcula indicadores.

```vue
<script setup>
import { UiAppLayout, UiDashboard } from '@vue-skin/layouts'

const summary = [{ id: 'sales', label: 'Ventas', value: '$48.250', trend: '+12,8%', variant: 'success' }]
const charts = [{ id: 'sales', title: 'Ventas', type: 'bar', data: { labels: ['Agosto', 'Septiembre'], datasets: [{ label: 'Ventas', data: [42800, 48250] }] } }]
const tables = [{ id: 'orders', title: 'Pedidos', filter: true, data: [{ id: 1, cliente: 'Ana', total: 245 }] }]
</script>

<template>
  <UiAppLayout title="Mi negocio" header="Dashboard">
    <UiDashboard title="Resumen" :summary="summary" :charts="charts" :tables="tables" />
  </UiAppLayout>
</template>
```

Cada entrada necesita un `id` único. Los gráficos aceptan la configuración de `UiChart`; las tablas, las opciones de `UiDataTable`. Los slots `actions`, `summary` (`{ item }`), `table-detail` (`{ table, row, index }`) y `default` permiten personalizar contenido y acciones. La grilla se adapta al ancho disponible sin clases específicas de Bootstrap.

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
await uiDialog.info('El informe está disponible.', 'Información')
await uiDialog.success('Los cambios fueron guardados.', 'Operación confirmada')
await uiDialog.warning('Hay pedidos pendientes de revisar.', 'Advertencia')
await uiDialog.error('No se pudo guardar. Intente nuevamente.', 'Error')

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

`info`, `success`, `warning` y `error` tienen un botón Aceptar y devuelven `Promise<void>` al cerrarse. El título es opcional y admite un tercer argumento, por ejemplo `{ acceptText: 'Entendido' }`. `success` comunica una operación realizada; `confirm` solicita una decisión y devuelve `true` o `false`. También puedes usarlos declarativamente: `<UiDialog v-model="open" type="error" message="No se pudo guardar" />`.

## Desarrollo

```bash
npm install
npm test
npm run build
npm run dev
```

La especificación de arquitectura y de los componentes está en [IMPLEMENTATION.md](IMPLEMENTATION.md).
