# Vue Skin

Vue Skin permite usar una API común de componentes Vue 3 mientras cada adapter controla su propio HTML, CSS y JavaScript.

> Estado: adapters Bootstrap, Basecoat, Terminal.css, Konsta UI y Slate implementados contra el contrato común. El proyecto continúa en etapa experimental.

## Elegir adapter en el playground

Todos los adapters implementan los 34 componentes del contrato común y funcionan con los layouts compartidos.

| Adapter | Paquete | Presentación y dependencias visuales |
| --- | --- | --- |
| Bootstrap | `@vue-skin/bootstrap` | Componentes y grilla oficiales de Bootstrap; utiliza su JavaScript para las interacciones correspondientes. |
| [Basecoat](packages/basecoat/README.md) | `@vue-skin/basecoat` | CSS oficial precompilado; Vue controla las interacciones y los modales usan `dialog` nativo. |
| [Terminal](packages/terminal/README.md) | `@vue-skin/terminal` | CSS oficial de Terminal.css incluido localmente, bordes rectos y tipografía monoespaciada del sistema. |
| [Konsta UI](packages/konsta/README.md) | `@vue-skin/konsta` | Componentes Vue oficiales con tema iOS y CSS precompilado; layout responsivo para móvil, tablet y escritorio. |
| [Slate](packages/slate/README.md) | `@vue-skin/slate` | Diseño propio sin framework CSS: fondos suaves, cards elevadas, acentos azules y modo oscuro azul profundo. |

Cada paquete importa sus estilos al instalarlo en la aplicación. Basecoat y Konsta distribuyen el CSS preparado; la aplicación consumidora no necesita configurar Tailwind. Terminal y Slate no requieren descargas de fuentes. Cada adapter mantiene sus dependencias aisladas y no importa los otros adapters.

Desde la raíz del repositorio:

```sh
npm install
npm run dev:bootstrap
npm run dev:basecoat
npm run dev:terminal
npm run dev:konsta
npm run dev:slate
```

Ejecuta uno de los comandos `dev:<adapter>` para elegir la entrada inicial. `npm run dev` inicia Bootstrap por defecto. Una vez abierto, el dropdown **Adapter** permite elegir cualquiera de los cinco: navega a otra página y recarga Vue, conservando el componente o layout abierto. También está disponible en las vistas independientes de layouts. No requiere reiniciar Vite.

Las páginas `/bootstrap.html`, `/basecoat.html`, `/terminal.html`, `/konsta.html` y `/slate.html` comparten los mismos ejemplos, pero cada una carga únicamente su adapter y sus estilos. Todas se generan en cada build. La página `/` usa Bootstrap por defecto; los scripts `dev:<adapter>` y `build:<adapter>` disponibles cambian ese valor inicial. `VITE_UI_SKIN` también se admite en el entorno o en un archivo `.env.local` del playground. El build verifica el aislamiento de los módulos por página. Basecoat publica además su pequeño script de preparación del CSS, sin ejecutarlo al instalar la librería.

`VITE_UI_SKIN` admite `bootstrap`, `basecoat`, `terminal`, `konsta` y `slate`. Los builds específicos disponibles son `build:basecoat`, `build:terminal`, `build:konsta` y `build:slate`; `npm run build` prepara los paquetes, sincroniza sus versiones y construye el playground con Bootstrap como entrada predeterminada. Todos generan las cinco páginas de adapter y comparten los ejemplos y sus pestañas de código.

## Componentes disponibles

`createVueSkin` registra estos componentes globalmente con el prefijo `Ui`:

| Grupo | Componentes |
| --- | --- |
| Acciones y contenido | `UiButton`, `UiButtonGroup`, `UiLink`, `UiIcon`, `UiBadge`, `UiCard` |
| Formularios | `UiInput`, `UiInputGroup`, `UiAutocomplete`, `UiSelect`, `UiTextarea`, `UiCheckbox`, `UiRadio`, `UiSwitch` |
| Estructura y navegación | `UiContainer`, `UiRow`, `UiCol`, `UiNavbar`, `UiSidebar`, `UiDropdown`, `UiTabs`, `UiAccordion` |
| Datos | `UiList`, `UiListItem`, `UiDataTable`, `UiDataTableColumnButton`, `UiChart` |
| Mensajes y carga | `UiModal`, `UiDialog`, `UiAlert`, `UiToast`, `UiSpinner` |
| Apariencia | `UiThemeSwitcher`, `UiThemeSelector` |

Además registra `UiDialogHost` para el servicio de diálogos. `@vue-skin/layouts` exporta por separado `UiAppLayout`, `UiLogin` y `UiDashboard`; se importan en las vistas que los utilizan. `FormField` es interno: organiza label, ayuda y errores de los controles de cada adapter.

La API común normaliza props, slots, eventos y `v-model`; el HTML y la apariencia pertenecen al adapter. Puedes agregar atributos HTML, `class` y `style`: se combinan con los del componente. En los campos, se aplican al control interactivo; las clases específicas de un framework deben aportarse desde la aplicación cuando se utilicen.

## Apariencia y temas

`UiThemeSelector` permite elegir Claro/Oscuro/Sistema, color de acento, Vibrant y Monochrome. Comparte estado con todos los `UiThemeSwitcher` de la aplicación y recuerda la elección.

Por defecto muestra un botón cuadrado de paleta que abre un modal pequeño y centrado. `UiAppLayout` lo integra en el navbar junto al switcher rápido. Los colores se eligen con muestras circulares sin texto, con tooltip, nombre accesible y selección marcada. Para mostrar el panel directamente en una página de ajustes, usa `<UiThemeSelector inline />`. `label` personaliza el título del modal y el nombre del botón (por defecto «Apariencia»).

La sección Apariencia usa tres botones de solo icono: sol (Claro), luna (Oscuro) y círculo de dos mitades (Sistema). Sus nombres se conservan como tooltip y etiqueta accesible; el modo elegido se indica con `aria-pressed` y estado visual activo.

```vue
<template>
  <UiThemeSelector />
</template>
```

También se puede configurar desde JavaScript:

```js
const skin = createVueSkin({
  adapter: BootstrapSkin,
  theme: { mode: 'system', color: 'blue', vibrant: false, monochrome: true }
})
app.use(skin)

skin.theme.setColor('purple')
skin.theme.setVibrant(true)
skin.theme.setMonochrome(false)
skin.theme.setMode('dark')
```

En `setup`, `useTheme()` de `@vue-skin/core` obtiene ese mismo servicio. `theme.state` es readonly; `theme.resolvedMode.value` indica claro/oscuro efectivo. `UiThemeSelector` admite `v-model` opcional para las preferencias y `change` para interacción.

El color de acento destaca botones primarios, enlaces, selección y foco. Vibrant activado lo hace más vivo; apagado, más suave. Monochrome activado mantiene fondos neutros; apagado les da un tinte ligero del color elegido. El modo claro/oscuro sigue funcionando en ambos casos. Los colores de éxito, advertencia y error se conservan. Hay ocho acentos: blue, indigo, purple, pink, red, orange, teal y green. Estas opciones están disponibles en los cinco adapters, cada uno con su paleta y tokens.

El icono de `UiThemeSwitcher` indica la acción: luna en modo claro para activar oscuro, sol en oscuro para activar claro. Su tooltip y nombre accesible indican lo mismo.

Se guarda el objeto completo en `localStorage['vue-skin:theme']`; se lee `themeMode` como migración cuando no hay preferencias nuevas. Puedes configurar `theme.storageKey` o desactivar el almacenamiento con `theme.persist: false`. Los valores iniciales explícitos del plugin tienen prioridad sobre lo guardado; omítelos si quieres restaurar libremente la elección del usuario.

La apariencia es global al documento por defecto. `theme.target` permite acotar los tokens de tema a un elemento raíz, por ejemplo para instancias con paletas distintas; no aísla todas las reglas CSS del framework. El adapter genera CSS dinámico acotado a esa raíz y lo limpia al desmontar; no cambia datasets de gráficos ni colores explícitos definidos por la aplicación. Si tu CSP bloquea estilos dinámicos, debes autorizar este mecanismo. El ejemplo completo está en la sección `UiThemeSelector` del playground.

## Versiones de los paquetes

Por ahora, los paquetes de `packages/` utilizan la misma versión que el `package.json` raíz. Después de cambiar esa versión, ejecuta:

```sh
npm run version:sync
```

El script actualiza los `package.json` de esos paquetes y sus versiones en `package-lock.json`, incluida la entrada raíz. No cambia la versión privada del playground, las dependencias ni sus rangos, y no requiere conexión a internet. No incrementa versiones, crea tags ni publica paquetes. Si no hay lockfile, solo actualiza los manifiestos; si el lockfile no incluye algún paquete, solicita ejecutar `npm install` antes de modificar archivos.

Los paquetes de librería declaran `files` para publicar su código y tipos, además de los scripts de preparación de estilos cuando corresponda y los archivos que npm incluye automáticamente (como `package.json`). Los tests quedan en el repositorio, pero no se descargan con el paquete publicado. El playground es privado y no se publica.

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

La vista no depende de clases ni APIs de un framework concreto. Para usar Terminal, Konsta o Slate, cambia el import del adapter por `@vue-skin/terminal`, `@vue-skin/konsta` o `@vue-skin/slate`; el contrato de los componentes se conserva.

## Inputs y validación

`UiInput` admite campos de texto, números, fechas y horas. `type` se pasa al input HTML; el editor sugiere `text`, `password`, `email`, `search`, `tel`, `url`, `number`, `date`, `time` y `datetime-local`. Con `number`, `v-model` recibe un número o `''` si se vacía; fechas y horas conservan las cadenas de los controles HTML. `error` acepta un mensaje externo; `help` y `tooltip` añaden contexto. Para casillas y opciones utiliza `UiCheckbox` y `UiRadio`.

`UiInput`, `UiInputGroup` y `UiAutocomplete` exponen `validate(): Promise<boolean>` y ejecutan su validador al perder el foco. `validator` recibe el valor y puede ser síncrono o asíncrono: `true` o vacío indican éxito, `false` o un string indican error, y un error lanzado utiliza su `message`.

```vue
<script setup>
import { ref } from 'vue'

const nombre = ref('')
const input = ref(null)
const validarNombre = value => value.trim() ? true : 'Ingrese su nombre'
const comprobar = () => input.value.validate()
</script>

<template>
  <UiInput ref="input" v-model="nombre" label="Nombre" :validator="validarNombre" />
  <UiButton @click="comprobar">Validar</UiButton>
</template>
```

Para integrar un esquema de Yep u otra librería que tenga `validateAt`, adapta la llamada desde la aplicación. Devuelve `true` cuando no lance errores, para que un valor string válido no se interprete como mensaje de error:

```js
async function validarNombre(value) {
  await schema.validateAt('nombre', { nombre: value })
  return true
}
```

`UiSelect` y `UiTextarea` también reciben `error`; checkbox, radio y switch admiten ayuda, error, estado deshabilitado y requerido. `UiSwitch` y `UiCheckbox` permiten valores personalizados mediante `true-value` y `false-value`.

## InputGroup

`UiInputGroup` añade prefijos y sufijos al campo sin perder validación, atributos HTML ni eventos de input. Admite texto con `prefix`/`suffix` o contenido personalizado mediante los slots homónimos:

```vue
<UiInputGroup v-model="correo" type="email" label="Correo" prefix="@" />
<UiInputGroup v-model="busqueda" label="Buscar">
  <template #prefix><UiIcon name="mdi:magnify" size="sm" /></template>
  <template #suffix><UiButton @click="buscar">Buscar</UiButton></template>
</UiInputGroup>
```

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

`UiListItem` admite `title`, `header`, `subtitle`, `text`, `footer`, `after`, enlaces con `href`, estados activo/deshabilitado y los slots `media`, `default` y `end`. `badge` ocupa el lugar de `after` y `badge-variant` controla su variante. `group-title` crea un encabezado de grupo; `filter-text` permite aportar términos para buscar contenido personalizado. `UiList` acepta `:divided="false"` y `:bordered="false"`.

El slot `list` de `UiCard` permite incorporar una lista como parte de la card:

```vue
<UiCard title="Canciones">
  <p>Mi selección</p>
  <template #list>
    <UiList :filter="false">
      <UiListItem title="Yellow Submarine" subtitle="The Beatles" after="$15" href="#cancion" />
      <UiListItem title="Favoritas" :badge="12" />
    </UiList>
  </template>
</UiCard>
```

## DataTable

`UiDataTable` recibe `data` como array de objetos. `header` es un objeto por clave de columna, por ejemplo `{ nombre: { label: 'Nombre', align: 'start' }, total: { label: 'Total', align: 'end' } }`; `align` admite `start`, `center` y `end`. Si se omite, las columnas se obtienen de los datos. El campo `id` se oculta por defecto y se muestra con `show-id`.

Admite `title`, `footer` o slot `footer`, `striped`, `vertical-borders`, `horizontal-borders` (true por defecto) y `scroll` como boolean o altura CSS. El filtro se activa con `filter` y busca en los datos al enviar el formulario con el botón o Enter; a diferencia de List, no filtra automáticamente al escribir. El slot `detail` permite contenido por fila y `detail-label` cambia el título de esa columna.

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

`span` admite 1–12 o `auto`; sin `span`, las columnas comparten el espacio disponible. `sm`, `md`, `lg`, `xl` y `xxl` sobrescriben el ancho desde 576, 768, 992, 1200 y 1400px respectivamente. `gap` admite `none`, `xs`, `sm`, `md`, `lg`, `xl` (por defecto `md`) y controla ambos ejes. `fluid` ocupa todo el ancho; sin él, el container centra y limita el contenido. Los cinco adapters implementan esta API; Bootstrap la convierte a sus clases oficiales y los demás utilizan su CSS de estructura. El playground incluye ejemplos bajo Grid.

## Vista independiente de layouts

`UiAppLayout` recibe `title` (navbar), `header` (sidebar), `sections` y `v-model` para la sección activa. Cada sección puede ser `[id, título]` o un objeto `{ id, title, groupTitle? }`. Integra navbar, sidebar con búsqueda, botón lateral, `UiThemeSwitcher` y `UiThemeSelector`; el contenido principal se aporta por el slot `default`. El slot `navbar-actions` permite agregar controles junto a los botones de apariencia.

El sidebar ocupa parte del ancho de la página en escritorio y se convierte en un panel superpuesto en pantallas pequeñas. `UiSidebar` directo también ofrece un slot `footer`.

El ancho lateral de `UiAppLayout` se configura con `sidebar-width`, por ejemplo `<UiAppLayout sidebar-width="18rem" />` o `sidebar-width="280px"`. El valor predeterminado es `15rem` y se aplica al sidebar de escritorio y al panel móvil.

Las secciones `UiAppLayout`, `UiLogin` y `UiDashboard` del playground incluyen un enlace para abrir cada layout en una pestaña nueva, sin el contenedor de documentación. También puedes acceder mediante `?layout=app-layout`, `?layout=login` y `?layout=dashboard`. La vista de aplicación tiene contenido y navegación de prueba para comprobar el sidebar, el scroll y los cambios de tamaño; la vista de login ocupa toda la altura y no realiza autenticación real. El dashboard muestra indicadores, gráficos de barras/línea/dona y tablas con datos de demostración.

### Login

`UiLogin` se importa de `@vue-skin/layouts`. Vincula `email`, `password` y `remember`, permite personalizar textos, estado de carga y slots `brand`, `before-fields` y `footer`. Emite las credenciales en `submit`; la autenticación la implementa la aplicación.

```vue
<UiLogin
  v-model:email="email"
  v-model:password="password"
  v-model:remember="remember"
  @submit="iniciarSesion"
/>
```

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

Los cinco adapters incluyen `UiChart`, basado en Chart.js (dependencia de cada adapter y cargada de forma diferida; no requiere instalación adicional en la aplicación).

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

## Iconos

`UiIcon` recibe un nombre Iconify como `mdi:magnify` o `lucide:sidebar`, hereda el color del texto y es decorativo por defecto. `label` le da un nombre accesible. `size` acepta `xs`, `sm`, `md`, `lg`, `xl`, números en píxeles o dimensiones CSS:

```vue
<UiIcon name="mdi:magnify" size="sm" />
<UiIcon name="lucide:sidebar" size="24" label="Navegación" />
<UiIcon name="mdi:account" size="1.25em" />
```

Los estilos de los iconos se generan con `icon-forge`. En un proyecto Vite, instálalo como dependencia de desarrollo y configura el plugin para escanear la aplicación y el adapter seleccionado, incluidos los layouts si los utilizas:

```sh
npm install -D github:acmepy/icon-forge
```

```js
// vite.config.js — ejemplo para una aplicación que utiliza Basecoat
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { iconForge } from 'icon-forge/vite'

export default defineConfig({
  plugins: [vue(), iconForge({
    component: 'UiIcon',
    source: [
      'src',
      'node_modules/@vue-skin/basecoat/src',
      'node_modules/@vue-skin/layouts/src'
    ]
  })]
})
```

Cambia la ruta `basecoat` por el adapter elegido. Incluir sus fuentes permite generar también los iconos internos de búsqueda, navegación y temas. El generador detecta referencias literales; los nombres construidos dinámicamente requieren incluir sus referencias en la generación. La aplicación desplegada utiliza CSS local y no consulta una API de iconos en ejecución. El [Vite config del playground](playground/vite.config.js) muestra cómo escanear los cinco adapters del workspace.

## Menús, pestañas y notificaciones

`UiDropdown` recibe un array `items` con `{ label, value?, href?, disabled? }`, emite `select` y admite `align="start"` o `"end"`. `UiTabs` usa items `{ id, label, content?, disabled? }`, `v-model` para la pestaña activa y un slot `panel` para contenido personalizado. `UiAccordion` recibe items `{ id, title, content, disabled? }` y `v-model` para el panel abierto.

`UiAlert` muestra mensajes con variantes semánticas y cierre opcional. `UiToast` se controla con `v-model` y recibe `title`, `message`, `variant`, `position`, `autohide`, `delay` y `closable`. Las posiciones son `top-start`, `top-center`, `top-end`, `bottom-start`, `bottom-center` y `bottom-end`; las variantes incluyen `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light` y `dark`.

```vue
<UiToast v-model="guardado" title="Guardado" message="Cambios registrados" variant="success" position="bottom-end" :delay="4000" />
```

## Tipos y sugerencias del editor

`@vue-skin/core` incluye `index.d.ts` para Volar y TypeScript, aun cuando la implementación esté escrita en JavaScript. El editor sugiere atributos y valores normalizados, por ejemplo `xs`, `sm`, `md`, `lg` y `xl` para `UiIcon.size`, sin impedir dimensiones CSS como `"16"` o `"1.25em"`. Los adapters y layouts también exponen sus declaraciones de tipos.

## Diálogos desde JavaScript

Para contenido personalizado, `UiModal` se controla con `v-model` y ofrece `title`, `size`, `centered`, `closable` y los slots `header`, `default` y `footer`. `UiDialog` añade tipos de mensaje, confirmación, prompt y preloader con el mismo contrato en todos los adapters.

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

`prompt` devuelve el texto aceptado o `null` al cancelar y admite `initialValue`, `label` y `placeholder`. El preloader bloquea la interacción hasta llamar a `close()`. Las solicitudes se encolan por aplicación. Dentro de componentes, el mismo servicio está disponible mediante `inject('uiDialog')` o `this.$uiDialog`.

## Desarrollo

```bash
npm install
npm test
npm run build
npm run dev
```

La especificación de arquitectura y de los componentes está en [IMPLEMENTATION.md](IMPLEMENTATION.md).
