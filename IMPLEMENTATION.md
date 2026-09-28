# Vue Skin — IMPLEMENTATION.md

## 1. Objetivo

**Vue Skin** es una capa de abstracción de interfaz para **Vue 3** que permite que una aplicación utilice una API común de componentes Vue mientras distintas implementaciones ("skins" o adapters) generan su propio HTML, CSS y JavaScript.

La aplicación consumidora no debe depender directamente de Basecoat, Bootstrap ni de ningún otro framework visual.

Ejemplo de código de aplicación:

```vue
<UiInput
  v-model="name"
  label="Nombre"
  help="Ingrese el nombre completo"
  :error="errors.name"
/>

<UiButton variant="primary">
  Guardar
</UiButton>
```

La misma aplicación debe funcionar usando distintos adapters sin modificar las vistas de negocio.

Adapters iniciales:

- Basecoat
- Bootstrap

Estos dos adapters se eligen deliberadamente porque sus estructuras y convenciones son suficientemente distintas para validar que el contrato común no está acoplado a un framework específico.

---

## 2. Stack y decisiones base

- Vue 3.
- JavaScript, no TypeScript.
- Composition API.
- Monorepo.
- npm workspaces.
- Vite para desarrollo/build donde corresponda.
- El adapter se selecciona durante el arranque de la aplicación.
- No es requisito cambiar de adapter dinámicamente después de montar la aplicación.
- Los adapters pueden incluir HTML, CSS y JavaScript propios.
- `core` no debe depender de Basecoat, Bootstrap ni de otro framework visual.

---

## 3. Principio arquitectónico principal

El contrato común es la **API Vue**, no el HTML ni las clases CSS.

Cada adapter tiene libertad para:

- generar un DOM diferente;
- utilizar clases diferentes;
- importar su framework CSS;
- inicializar JavaScript requerido por su framework;
- implementar internamente comportamientos de manera distinta.

Siempre debe respetar el contrato público del componente:

- props;
- `v-model`;
- eventos;
- slots;
- comportamiento observable.

Ejemplo:

```vue
<UiInput
  v-model="email"
  label="Correo"
  help="Utilice su correo corporativo"
  tooltip="Este correo se utilizará para las notificaciones"
  :error="emailError"
/>
```

Basecoat y Bootstrap pueden generar estructuras HTML completamente distintas. La aplicación no debe conocer esas diferencias.

---

## 4. Estructura del monorepo

Estructura inicial recomendada:

```text
vue-skin/
├── package.json
├── README.md
├── IMPLEMENTATION.md
├── AGENTS.md
│
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.js
│   │       ├── plugin.js
│   │       └── contracts/
│   │
│   ├── basecoat/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.js
│   │       ├── components/
│   │       ├── styles/
│   │       └── js/
│   │
│   └── bootstrap/
│       ├── package.json
│       └── src/
│           ├── index.js
│           ├── components/
│           ├── styles/
│           └── js/
│
├── playground/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
└── tests/
```

Nombres conceptuales de paquetes:

```text
@vue-skin/core
@vue-skin/basecoat
@vue-skin/bootstrap
```

El nombre/scoping npm definitivo puede cambiar si no está disponible públicamente. Esto no debe afectar la arquitectura.

---

## 5. npm workspaces

El `package.json` raíz debe administrar los paquetes mediante npm workspaces.

Ejemplo conceptual:

```json
{
  "private": true,
  "workspaces": [
    "packages/*",
    "playground"
  ]
}
```

Cada adapter debe ser un paquete independiente dentro del mismo repositorio.

Una aplicación debe poder instalar solamente:

```text
@vue-skin/core
@vue-skin/basecoat
```

sin necesitar Bootstrap, o viceversa.

---

## 6. Responsabilidad de `@vue-skin/core`

`core` define:

- mecanismo de instalación;
- contrato de adapters;
- nombres públicos de componentes;
- validaciones de adapter;
- utilidades verdaderamente agnósticas;
- documentación de props, slots y eventos;
- API común de Vue Skin.

### 6.1 Contratos y primitives

`core` centraliza los nombres públicos de componentes, props, eventos y slots en contratos reutilizables. Los adapters deben implementar esos nombres, pero conservan libertad total sobre su DOM y estilos.

Las `primitives` contienen únicamente lógica Vue agnóstica que haya demostrado ser común entre adapters, como IDs estables y asociaciones accesibles entre un control, su ayuda y su error. No renderizan HTML, no incluyen CSS y no conocen frameworks visuales.

`core` NO debe:

- importar Basecoat;
- importar Bootstrap;
- contener clases CSS específicas de un framework;
- contener HTML copiado de un framework;
- conocer detalles internos de un adapter;
- intentar convertir clases de un framework a otro.

`core` debe mantenerse deliberadamente pequeño.

---

## 7. Contrato de adapter

Cada adapter debe exportar una estructura común.

Ejemplo conceptual:

```js
export default {
  name: 'basecoat',

  components: {
    Button,
    Input,
    Select,
    Checkbox,
    Textarea,
    Navbar,
    Sidebar,
    Card,
    Modal,
    Alert,
    Spinner
  },

  install(app, options) {
    // Inicialización opcional específica del adapter.
  }
}
```

La forma definitiva puede evolucionar durante la implementación, pero Basecoat y Bootstrap deben implementar exactamente el mismo contrato público.

El plugin de `core` será responsable de registrar los componentes con sus nombres públicos:

```text
UiButton
UiButtonGroup
UiBadge
UiIcon
UiList
UiListItem
UiInput
UiSelect
UiCheckbox
UiSwitch
UiTextarea
UiNavbar
UiSidebar
UiCard
UiAccordion
UiModal
UiDialog
UiDropdown
UiAlert
UiToast
UiSpinner
```

---

## 8. Instalación

API objetivo aproximada:

```js
import { createVueSkin } from '@vue-skin/core'
import BasecoatSkin from '@vue-skin/basecoat'

const skin = createVueSkin({
  adapter: BasecoatSkin
})

app.use(skin)
app.mount('#app')
```

Para Bootstrap:

```js
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '@vue-skin/bootstrap'

const skin = createVueSkin({
  adapter: BootstrapSkin
})

app.use(skin)
app.mount('#app')
```

El adapter se decide antes de montar la aplicación.

No se requiere hot-swap de adapter en runtime.

---

## 9. Componentes de la primera versión

La primera versión debe implementar:

### Formulario

- `UiInput`
- `UiSelect`
- `UiCheckbox`
- `UiTextarea`
- `UiButton`

### Layout / navegación

- `UiNavbar`
- `UiSidebar`

### Contenido / feedback

- `UiCard`
- `UiModal`
- `UiDialog`
- `UiAlert`
- `UiSpinner`

No agregar una gran cantidad de componentes antes de validar correctamente estos contratos en ambos adapters.

---

## 10. Convenciones comunes

Las APIs públicas deben utilizar nombres semánticos propios de Vue Skin.

Ejemplo:

```vue
<UiButton
  variant="primary"
  size="sm"
  :disabled="false"
  :loading="saving"
>
  Guardar
</UiButton>
```

Evitar props que sean simplemente nombres de clases de Basecoat o Bootstrap.

Incorrecto:

```vue
<UiButton bootstrap-class="btn-outline-primary" />
```

Incorrecto:

```vue
<UiButton basecoat-variant="..." />
```

El código de negocio nunca debe conocer esas diferencias.

---

## 11. Campos de formulario

`UiInput`, `UiSelect` y `UiTextarea` deben compartir, cuando sea aplicable, una experiencia consistente para:

- `label`;
- ayuda descriptiva;
- tooltip;
- error de validación;
- estado disabled;
- estado readonly cuando corresponda;
- required;
- identificación accesible del campo.

API orientativa:

```vue
<UiInput
  v-model="username"
  label="Usuario"
  placeholder="Ingrese el usuario"
  help="Debe coincidir con el usuario corporativo"
  tooltip="Este valor será visible para los administradores"
  :error="errors.username"
  required
/>
```

### 11.1 Mensaje de ayuda

Prop sugerida:

```text
help
```

Debe mostrar información persistente o contextual debajo/cerca del campo según las convenciones visuales del adapter.

### 11.2 Tooltip

Prop sugerida:

```text
tooltip
```

Debe proporcionar ayuda adicional no intrusiva.

Cada adapter decide cómo renderizarla. Puede usar capacidades nativas, componentes propios del framework o una implementación interna.

La presencia del tooltip no debe modificar la API de la aplicación.

### 11.3 Error

Prop sugerida:

```text
error
```

Casos mínimos:

```vue
<UiInput :error="'El usuario es obligatorio'" />
```

y:

```vue
<UiInput :error="null" />
```

Cuando existe un error:

- debe mostrarse visualmente;
- el campo debe adquirir el estado inválido correspondiente al adapter;
- deben aplicarse atributos ARIA apropiados cuando sea posible;
- el mensaje debe quedar asociado al control.

La ayuda normal y el error son conceptos distintos.

### 11.4 Slots auxiliares

Evaluar slots opcionales como:

```text
label
help
error
prefix
suffix
```

No agregar slots sin una necesidad clara.

---

## 12. `UiButton`

Contrato inicial sugerido:

```text
Props:
- variant
- size
- disabled
- loading
- type

Events:
- click

Slots:
- default
- icon (opcional)
```

Variantes comunes iniciales:

```text
primary
secondary
success
danger
warning
info
ghost
```

Un adapter puede degradar razonablemente una variante si su framework no tiene equivalencia exacta.

La API no debe exponer nombres internos del framework.

---

### 12.1 `UiButtonGroup`

Agrupa botones relacionados sin exponer la estructura interna del framework.

```text
Props: size, vertical, label
Slots: default
```

### 12.2 `UiBadge`

```text
Props: variant, pill
Slots: default
```

---

## 13. `UiInput`

Contrato inicial sugerido:

```text
Props:
- modelValue
- label
- type
- name
- placeholder
- help
- tooltip
- error
- disabled
- readonly
- required
- autocomplete

Events:
- update:modelValue
- input
- change
- focus
- blur
```

Tipos HTML razonables deben propagarse cuando sea posible:

```text
text
password
email
number
date
time
search
tel
url
```

---

### 13.1 `UiList` y `UiListItem`

Lista de contenido general; los adapters determinan el markup y estilo de cada item.

```text
UiList props: title, divided, bordered

UiListItem props:
href, target, header, title, subtitle, text, footer, after,
badge, badgeVariant, active, disabled, groupTitle, tooltip

UiListItem events: click
UiListItem slots: media, default, end

UiLink props: href, target, disabled
UiLink events: click

### 13.2 `UiIcon`

```text
Props: name, label
```

`name` debe ser una referencia Iconify literal, por ejemplo `mdi:home`. En proyectos Vite, `icon-forge` detecta esas referencias y emite CSS local únicamente para los iconos utilizados; la aplicación desplegada no consulta Iconify en runtime.
```

La presencia del slot `media` indica que el item contiene contenido multimedia. Las características de router, swipeout, sortable y smart select de Framework7 no son parte de este contrato.

Cuando existe `badge`, ocupa la posición final del item y reemplaza visualmente a `after`.

---

## 14. `UiSelect`

Contrato inicial:

```text
Props:
- modelValue
- label
- options
- placeholder
- help
- tooltip
- error
- disabled
- required
```

Formato inicial recomendado para opciones:

```js
[
  { value: 'A', label: 'Activo' },
  { value: 'I', label: 'Inactivo' }
]
```

Considerar soporte futuro para grupos sin complicar la primera versión.

---

## 15. `UiCheckbox`

Contrato inicial:

```text
Props:
- modelValue
- label
- help
- tooltip
- error
- disabled
- required
- trueValue
- falseValue

Events:
- update:modelValue
- change
```

Debe funcionar correctamente con valores booleanos como caso principal.

---

### 15.1 `UiSwitch`

Control binario para activar o desactivar una preferencia.

```text
Props: modelValue, label, help, tooltip, error, disabled, required, trueValue, falseValue
Events: update:modelValue, change
```

Los adapters pueden usar su control visual propio, pero deben exponer semántica accesible de switch.

---

## 16. `UiTextarea`

Debe seguir el contrato de campos y agregar, como mínimo:

```text
rows
maxlength
```

Debe soportar:

```text
label
help
tooltip
error
```

---

## 17. `UiNavbar`

Debe abstraer comportamiento, no estructura HTML.

Contrato inicial sugerido:

```text
Props:
- title
- fixed
- sticky

Slots:
- brand
- default
- start
- end
```

Evitar modelar el componente según la estructura exacta de `.navbar` de Bootstrap.

---

## 18. `UiSidebar`

Contrato inicial sugerido:

```text
Props:
- modelValue (abierto/cerrado)
- position
- width

Events:
- update:modelValue
- open
- close

Slots:
- header
- default
- list
- footer
```

Métodos internos y animaciones pueden ser diferentes entre adapters.

---

## 19. `UiCard`

Contrato mínimo:

```text
Props:
- title

Slots:
- header
- default
- footer
```

No replicar toda la API de cards de Bootstrap.

---

### 19.1 `UiAccordion`

Representa una lista de paneles expandibles controlada por `v-model`.

```text
Props: modelValue, items, flush
Events: update:modelValue
```

Cada elemento de `items` debe incluir al menos `id`, `title` y `content`.

---

## 20. `UiModal`

Contrato inicial:

```text
Props:
- modelValue
- title
- size
- centered
- closable

Events:
- update:modelValue
- open
- opened
- close
- closed

Slots:
- header
- default
- footer
```

Cada adapter puede utilizar su propio JavaScript para manejar modal, focus trap, backdrop y animaciones.

La aplicación debe controlar visibilidad principalmente mediante `v-model`.

---

## 21. `UiDialog`

`UiDialog` encapsula diálogos semánticos construidos sobre `UiModal`.

Props:

```text
- modelValue
- type: alert | confirm | prompt | preloader
- title
- message
- label (prompt)
- inputValue (prompt)
- placeholder (prompt)
- acceptText
- cancelText
```

Eventos:

```text
- update:modelValue
- update:inputValue
- accept
- cancel
- closed
```

El modo `preloader` debe bloquear la interacción con la pantalla y no puede cerrarse mediante backdrop o teclado. Además del uso declarativo, el plugin puede exponer un servicio por aplicación para `alert`, `confirm`, `prompt` y `preloader`; no debe ser un singleton global compartido entre aplicaciones.

---

### 21.1 `UiDropdown`

Menú de acciones basado en una lista de opciones normalizada.

```text
Props: label, items, variant, size, align, disabled
Events: select, show, shown, hide, hidden
```

Cada item puede incluir `label`, `value`, `href` y `disabled`. Si no tiene `href`, el adapter lo trata como una acción de botón.

---

## 22. `UiAlert`

Contrato inicial:

```text
Props:
- variant
- dismissible

Events:
- close

Slots:
- default
```

Variantes semánticas:

```text
info
success
warning
danger
```

---

### 22.1 `UiToast`

Notificación temporal controlada con `v-model`.

```text
Props: modelValue, title, message, variant, position, autohide, delay, closable
Events: update:modelValue, show, shown, hide, hidden
Slots: default
```

`position` usa posiciones semánticas como `top-end` o `bottom-center`; cada adapter decide cómo presentarlas.

---

## 22. `UiSpinner`

Contrato inicial:

```text
Props:
- size
- label

Slots:
- opcional, solo si surge una necesidad real
```

Debe incluir una alternativa accesible para indicar carga.

---

## 23. HTML propio por adapter

Es requisito explícito que cada adapter pueda escribir su propio HTML.

No crear un componente HTML base del que Basecoat y Bootstrap deban heredar.

Correcto:

```text
UiInput contract
      |
      +-- Basecoat Input.vue -> DOM Basecoat
      |
      +-- Bootstrap Input.vue -> DOM Bootstrap
```

Incorrecto:

```text
GenericInput.vue
      |
      +-- cambiar clases para Basecoat
      +-- cambiar clases para Bootstrap
```

El segundo enfoque solo debe utilizarse para lógica realmente agnóstica, nunca para forzar DOM compartido.

---

## 24. CSS

Cada adapter administra su propio CSS.

Ejemplo:

```text
packages/basecoat/src/styles/
packages/bootstrap/src/styles/
```

Un adapter puede:

- importar CSS oficial del framework;
- agregar CSS de integración;
- definir pequeñas correcciones necesarias para cumplir el contrato.

Evitar CSS global innecesario.

`core` solo puede contener estilos estrictamente agnósticos si existe una razón demostrable. Preferentemente, `core` no tendrá estilos.

---

## 25. JavaScript específico

Un adapter puede ejecutar JavaScript específico del framework.

Ejemplos:

- inicializar modales;
- tooltips;
- dropdowns;
- offcanvas/sidebar;
- limpieza al desmontar componentes.

Todo recurso creado debe limpiarse en los hooks de Vue correspondientes.

No dejar event listeners globales, observers o instancias sin destruir.

---

## 26. Dependencias

Cada adapter declara sus propias dependencias/peerDependencies según corresponda.

Una aplicación que use Basecoat no debe descargar Bootstrap por causa de Vue Skin.

`@vue-skin/core` debe tener Vue como peer dependency, no incluir una segunda copia de Vue.

Evitar dependencias adicionales salvo que aporten un beneficio claro.

---

## 27. Accesibilidad

Los adapters deben preservar semántica y accesibilidad.

Como mínimo:

- labels asociados a inputs;
- `aria-invalid` para errores;
- `aria-describedby` para ayuda/error cuando corresponda;
- controles interactivos accesibles por teclado;
- botones reales para acciones;
- gestión razonable de foco en modal;
- texto accesible para spinner/loading.

No sacrificar accesibilidad para hacer coincidir visualmente dos frameworks.

---

## 28. Playground

Crear una aplicación Vue 3 en:

```text
playground/
```

Debe mostrar todos los componentes de la primera versión.

La pantalla debe utilizar exclusivamente:

```text
UiButton
UiInput
UiSelect
UiCheckbox
UiTextarea
UiNavbar
UiSidebar
UiCard
UiModal
UiAlert
UiSpinner
```

No debe importar componentes internos de Basecoat o Bootstrap.

Debe existir una forma sencilla de arrancar el playground con cualquiera de los adapters.

Puede resolverse mediante variable de entorno, por ejemplo:

```text
VITE_UI_SKIN=basecoat
```

o:

```text
VITE_UI_SKIN=bootstrap
```

La selección ocurre antes de montar Vue.

No es necesario cambiar de skin en caliente.

---

## 29. Pantalla de demostración

El playground debe incluir al menos:

- navbar;
- sidebar;
- card;
- formulario;
- input normal;
- input con help;
- input con tooltip;
- input con error;
- select;
- checkbox;
- textarea;
- botones de distintas variantes;
- apertura/cierre de modal;
- alert;
- spinner/loading.

La misma vista Vue debe utilizarse para probar ambos adapters.

No duplicar una página demo para Basecoat y otra para Bootstrap.

---

## 30. Tests

Priorizar tests de **contrato**, no snapshots enormes de HTML.

Los tests deben verificar que ambos adapters:

- registran todos los componentes obligatorios;
- soportan las props requeridas;
- implementan `v-model` correctamente;
- emiten eventos esenciales;
- muestran help;
- muestran tooltip o su mecanismo equivalente;
- muestran error;
- marcan campos inválidos;
- abren/cierran modal;
- abren/cierran sidebar;
- manejan disabled/loading.

Los adapters pueden producir DOM diferente; los tests no deben exigir igualdad estructural entre ellos.

---

## 31. Validación del adapter

`core` debería poder detectar durante desarrollo si un adapter está incompleto.

Ejemplo conceptual:

```js
validateAdapter(adapter)
```

Debe comprobar al menos:

- nombre;
- objeto de componentes;
- presencia de todos los componentes obligatorios.

Los errores deben ser claros:

```text
[VueSkin] Adapter "foo" does not implement required component "Input".
```

No crear un sistema complejo de schemas para la primera versión.

---

## 32. Extensibilidad

La arquitectura debe permitir adapters externos.

Un tercero debería poder crear:

```text
vue-skin-terminal
vue-skin-framework7
vue-skin-custom
```

sin modificar `@vue-skin/core`.

Por lo tanto, no usar comprobaciones como:

```js
if (adapter.name === 'bootstrap') ...
```

dentro de `core`.

---

## 33. Características específicas de un framework

Si Bootstrap posee una característica que Basecoat no tiene:

1. no agregarla automáticamente a `core`;
2. determinar primero si representa un concepto UI genérico;
3. si es genérica, diseñar una API neutral;
4. si es específica del framework, mantenerla dentro del adapter.

El objetivo no es exponer la unión de todas las APIs de todos los frameworks.

---

## 34. Escape hatch

Puede ser útil permitir atributos HTML estándar mediante `$attrs`.

Ejemplo:

```vue
<UiInput
  v-model="value"
  data-test="username"
  aria-label="Usuario"
/>
```

Los adapters deben propagar atributos razonablemente al elemento interactivo principal.

No crear props específicas para cada atributo HTML existente.

---

## 35. Eventos y `$attrs`

Los adapters deben evitar comportamientos inconsistentes debido a fallthrough automático de atributos.

Para componentes con múltiples nodos o wrappers, controlar explícitamente dónde se aplican `$attrs`.

El elemento interactivo principal debe recibir los atributos relevantes siempre que sea razonable.

---

## 36. Identificadores

Los campos deben poder recibir:

```text
id
name
```

Si no existe `id`, el adapter puede generar uno estable para asociar:

- label;
- help;
- error;
- tooltip cuando corresponda.

No generar un nuevo ID en cada render.

---

## 37. Estado y lógica

Vue Skin no debe convertirse en un framework de estado.

No agregar Pinia ni estado global salvo que aparezca una necesidad arquitectónica demostrable.

El estado normal debe permanecer en la aplicación consumidora.

---

## 38. Internacionalización

La primera versión no necesita integrar una librería i18n.

Textos internos inevitables deben ser mínimos y configurables cuando sea necesario.

No codificar mensajes de validación de negocio dentro de los adapters.

---

## 39. Iconos

Los iconos no forman parte obligatoria de la primera implementación.

Diseñar slots como `icon`, `prefix` o `suffix` únicamente donde aporten valor sin acoplar Vue Skin a una librería de iconos.

No imponer Iconify, Bootstrap Icons u otra biblioteca desde `core`.

---

## 40. Build

Cada paquete debe poder construirse de manera independiente.

El build debe generar módulos adecuados para consumo desde aplicaciones Vue/Vite modernas.

No empaquetar Vue dentro de cada paquete.

Mantener sourcemaps si no complican innecesariamente la configuración.

---

## 41. Scripts raíz

Agregar scripts convenientes, por ejemplo:

```text
npm run dev
npm run build
npm run test
npm run lint
```

y scripts para ejecutar el playground con cada skin si resulta práctico:

```text
npm run dev:basecoat
npm run dev:bootstrap
```

Los nombres exactos pueden adaptarse a las limitaciones multiplataforma. Evitar scripts que solo funcionen en Unix si el proyecto debe desarrollarse también en Windows.

---

## 42. README

Crear un README inicial con:

- propósito;
- instalación;
- ejemplo mínimo;
- selección de adapter;
- lista de componentes;
- creación de un adapter;
- estado experimental de la API durante la primera etapa.

---

## 43. Orden recomendado de implementación

> Nota de ejecución: a petición explícita del proyecto, la primera iteración implementará primero el conjunto completo de Bootstrap. Basecoat se implementará inmediatamente después contra el mismo contrato; esta excepción no modifica la API común ni permite que `core` conozca detalles de Bootstrap.

### Fase 1 — Monorepo

- Inicializar npm workspaces.
- Crear `core`.
- Crear paquetes Basecoat y Bootstrap.
- Crear playground.
- Configurar scripts.

### Fase 2 — Contrato mínimo

Implementar:

- adapter interface;
- `createVueSkin`;
- registro de componentes;
- validación básica del adapter.

### Fase 3 — Formularios

Implementar en ambos adapters:

- Button;
- Input;
- Select;
- Checkbox;
- Textarea.

Validar especialmente:

- `v-model`;
- help;
- tooltip;
- error;
- accesibilidad.

### Fase 4 — Layout

Implementar:

- Navbar;
- Sidebar;
- Card.

### Fase 5 — Feedback/interacción

Implementar:

- Modal;
- Alert;
- Spinner.

### Fase 6 — Playground completo

Construir una única pantalla común que pruebe ambos adapters.

### Fase 7 — Tests y documentación

- tests de contrato;
- README;
- documentación de creación de adapters;
- limpieza de APIs inconsistentes detectadas al comparar Basecoat y Bootstrap.

---

## 44. Criterios de aceptación

La primera versión se considera válida cuando:

1. El repositorio utiliza npm workspaces.
2. `@vue-skin/core`, Basecoat y Bootstrap son paquetes separados.
3. Existe un único playground Vue 3.
4. El playground puede arrancar con Basecoat o Bootstrap.
5. La vista del playground no cambia para seleccionar otro adapter.
6. Ningún componente de negocio importa Basecoat o Bootstrap directamente.
7. `core` no contiene HTML/CSS específico de los frameworks.
8. Ambos adapters implementan todos los componentes iniciales.
9. Los campos soportan help, tooltip y error.
10. Los errores tienen asociación accesible con el control.
11. `v-model` funciona en los componentes de formulario.
12. Modal y Sidebar tienen una API común aunque su implementación sea distinta.
13. Cada adapter puede ejecutar y limpiar JavaScript propio.
14. Instalar un adapter no obliga a instalar el otro.
15. Los tests validan contratos y comportamiento, no igualdad de DOM.
16. La arquitectura permite crear un tercer adapter sin modificar `core`.
17. El proyecto construye correctamente desde la raíz.
18. README documenta instalación, uso y creación básica de adapters.

---

## 45. Principio para decisiones futuras

Cuando exista duda sobre dónde implementar algo, aplicar esta regla:

> Si describe qué puede hacer un componente desde el punto de vista de una aplicación Vue, probablemente pertenece al contrato de Vue Skin. Si describe cómo un framework concreto consigue ese resultado, pertenece al adapter.

Ejemplo:

```text
"El modal puede cerrarse"
    -> contrato común.

"Bootstrap usa Modal.getOrCreateInstance()"
    -> adapter Bootstrap.

"El input muestra un error"
    -> contrato común.

"El error usa la clase .is-invalid"
    -> adapter Bootstrap.
```

Vue Skin debe abstraer **semántica y comportamiento**, no intentar uniformar internamente tecnologías que deliberadamente son diferentes.
