<script setup>
import { computed, ref } from 'vue'
import yep from 'yep'
import { UiAppLayout, UiLogin, UiDashboard } from '@vue-skin/layouts'
import { dashboardExample, dashboardExampleCode } from './dashboardExample.js'
import { uiDialog } from './skin.js'
import { layoutPreviewHref } from './layoutPreview.js'
import GridExample from './GridExample.vue'
import gridExampleCode from './GridExample.vue?raw'

const sections = [
  ['button', 'UiButton'], ['button-group', 'UiButtonGroup'], ['badge', 'UiBadge'], ['icon', 'UiIcon'], ['link', 'UiLink'], ['list', 'UiList / UiListItem'], ['input', 'UiInput'], ['input-group', 'UiInputGroup'], ['select', 'UiSelect'], ['checkbox', 'UiCheckbox'], ['switch', 'UiSwitch'],
  ['autocomplete', 'UiAutocomplete'], ['textarea', 'UiTextarea'], ['radio', 'UiRadio'], ['navbar', 'UiNavbar'], ['theme-switcher', 'UiThemeSwitcher'], ['dropdown', 'UiDropdown'], ['sidebar', 'UiSidebar'], ['card', 'UiCard'],
  ['accordion', 'UiAccordion'], ['tabs', 'UiTabs'], ['modal', 'UiModal'], ['dialog', 'UiDialog'], ['alert', 'UiAlert'], ['toast', 'UiToast'], ['spinner', 'UiSpinner'],
  ['data-table', 'UiDataTable'], ['data-table-column-button', 'UiDataTableColumnButton'], ['chart', 'UiChart'], ['grid', 'Grid / Container / Row / Col'],
  { id: 'layouts-group', title: 'Layouts', groupTitle: true }, ['app-layout', 'UiAppLayout'], ['login', 'UiLogin'], ['dashboard', 'UiDashboard']
]
const active = ref('button')
const activeName = computed(() => {
  const section = sections.find((item) => (Array.isArray(item) ? item[0] : item.id) === active.value)
  return Array.isArray(section) ? section[1] : section?.title
})
const documentationTab = ref('example')
const documentationTabs = [{ id: 'example', label: 'Ejemplo', content: '' }, { id: 'code', label: 'Código', content: '' }]
const chartExamples = ref([
  {
    title: 'Barras', type: 'bar',
    data: { labels: ['Enero', 'Febrero', 'Marzo', 'Abril'], datasets: [
      { label: 'Ventas', data: [35, 48, 42, 65], backgroundColor: '#0d6efd' },
      { label: 'Objetivo', data: [40, 45, 50, 60], backgroundColor: '#6c757d' }
    ] },
    options: { scales: { y: { beginAtZero: true } } }
  },
  {
    title: 'Línea', type: 'line',
    data: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], datasets: [
      { label: 'Visitas', data: [120, 180, 145, 220, 260], borderColor: '#0d6efd', backgroundColor: '#0d6efd', tension: 0.3 }
    ] }
  },
  {
    title: 'Dona', type: 'doughnut',
    data: { labels: ['Web', 'Tienda', 'Otros'], datasets: [
      { label: 'Ventas por canal', data: [55, 30, 15], backgroundColor: ['#0d6efd', '#198754', '#ffc107'], borderWidth: 0 }
    ] },
    options: { cutout: '65%', plugins: { legend: { position: 'bottom' } } }
  },
  {
    title: 'Pastel', type: 'pie',
    data: { labels: ['Completado', 'Pendiente', 'En curso'], datasets: [
      { label: 'Tareas', data: [18, 7, 10], backgroundColor: ['#198754', '#ffc107', '#0dcaf0'], borderWidth: 0 }
    ] }
  },
  {
    title: 'Área', type: 'line',
    data: { labels: ['Enero', 'Febrero', 'Marzo', 'Abril'], datasets: [
      { label: 'Ingresos', data: [12, 19, 16, 28], borderColor: '#198754', backgroundColor: 'rgba(25, 135, 84, 0.2)', fill: true, tension: 0.3 }
    ] },
    options: { scales: { y: { beginAtZero: true } } }
  }
])
function updateChartExample() {
  const dataset = chartExamples.value[0].data.datasets[0]
  dataset.data = dataset.data.map((value) => value + 5)
}
const componentExamples = {
  autocomplete: `// Dentro de script setup
import { ref } from 'vue'
const city = ref('')
const customer = ref('')
const selectedCustomer = ref(null)
const largeCustomer = ref('')
const selectedLargeCustomer = ref(null)
const largeCustomers = Array.from({ length: 1000 }, (_, index) => ({
  label: 'Cliente ' + String(index + 1).padStart(4, '0'),
  value: index + 1
}))
const cities = ['Asunción', 'Encarnación', 'Concepción', 'Ciudad del Este', 'San Lorenzo', 'Fernando de la Mora']
const customers = [
  { label: 'Ana Gómez', value: 1 },
  { label: 'Luis Pérez', value: 2 },
  { label: 'María López', value: 3 }
]

<UiAutocomplete
  v-model="city"
  :data="cities"
  label="Ciudad"
  placeholder="Escribe al menos 2 caracteres"
  help="Prueba cion: busca en cualquier parte del texto, sin distinguir acentos ni mayúsculas."
/>
<p>Ciudad: {{ city || '—' }}</p>
<UiAutocomplete
  v-model="customer"
  :data="customers"
  :min-length="3"
  label="Cliente"
  placeholder="Escribe al menos 3 caracteres"
  help="Usa las flechas y Enter para elegir; Escape cierra las sugerencias."
  @input="selectedCustomer = null"
  @select="selectedCustomer = $event"
/>
<p>Cliente: {{ customer || '—' }} · ID seleccionado: {{ selectedCustomer?.value ?? '—' }}</p>
<h3 class="h6 mt-4">1000 elementos con label y value</h3>
<UiAutocomplete
  v-model="largeCustomer"
  :data="largeCustomers"
  :require-match="true"
  data-test="autocomplete-large"
  label="Cliente (1000 elementos)"
  placeholder="Busca por nombre o número, por ejemplo 0999"
  help="Busca desde 2 caracteres. Al salir del campo debes haber elegido un cliente o escrito su etiqueta completa; cliente 00 no es válido."
  @input="selectedLargeCustomer = null"
  @select="selectedLargeCustomer = $event"
/>
<p>Total: {{ largeCustomers.length }} · Texto: {{ largeCustomer || '—' }} · value seleccionado: {{ selectedLargeCustomer?.value ?? '—' }}</p>`,
  chart: `// Dentro de script setup
import { ref } from 'vue'
const chartExamples = ref(${JSON.stringify(chartExamples.value, null, 2)})
function updateChartExample() {
  const dataset = chartExamples.value[0].data.datasets[0]
  dataset.data = dataset.data.map((value) => value + 5)
}

<div class="d-grid gap-4">
  <div><UiButton @click="updateChartExample">Actualizar barras</UiButton></div>
  <div class="row g-4">
    <div v-for="example in chartExamples" :key="example.title" class="col-12 col-xl-6">
      <UiCard>
        <UiChart :type="example.type" :data="example.data" :options="example.options" :title="example.title" :height="300" />
      </UiCard>
    </div>
  </div>
</div>`,
  'data-table': `// Datos y columnas (dentro de script setup)
import { ref } from 'vue'
const tableData = ref([
  { id: 1, nombre: 'Ana Gómez', correo: 'ana@ejemplo.com', saldo: 150 },
  { id: 2, nombre: 'Luis Pérez', correo: 'luis@ejemplo.com', saldo: 85 },
  { id: 3, nombre: 'María López', correo: 'maria@ejemplo.com', saldo: 230 }
])
const tableHeader = {
  id: { label: 'ID', align: 'center' },
  nombre: { label: 'Nombre', align: 'start' },
  correo: { label: 'Correo', align: 'start' },
  saldo: { label: 'Saldo', align: 'end' }
}
// Referencias para icon-forge: <UiIcon name="mdi:eye" /> <UiIcon name="mdi:pencil" /> <UiIcon name="mdi:delete" />
const tableActions = [
  { label: 'Ver', icon: 'mdi:eye', value: 'view' },
  { label: 'Editar', icon: 'mdi:pencil', value: 'edit' },
  { label: 'Borrar', icon: 'mdi:delete', value: 'delete', variant: 'outline-danger' }
]
async function handleTableAction(item, row) {
  if (item.value === 'view') {
    await uiDialog.alert(row.nombre + ' · ' + row.correo, 'Cliente')
  } else if (item.value === 'edit') {
    const nombre = await uiDialog.prompt('Ingrese el nombre del cliente.', 'Editar cliente', { label: 'Nombre', initialValue: row.nombre })
    if (nombre !== null && nombre.trim()) row.nombre = nombre.trim()
  } else if (item.value === 'delete' && await uiDialog.confirm('¿Borrar a ' + row.nombre + '?', 'Borrar cliente')) {
    tableData.value = tableData.value.filter((cliente) => cliente.id !== row.id)
  }
}
// uiDialog proviene de createVueSkin({ adapter }).dialog.
// Montar <UiDialogHost /> una vez en la aplicación.
async function addTableClient() {
  const nombre = await uiDialog.prompt('Ingrese el nombre del cliente.', 'Agregar cliente', { label: 'Nombre' })
  if (nombre === null || !nombre.trim()) return
  const id = Math.max(0, ...tableData.value.map(cliente => cliente.id)) + 1
  tableData.value.push({ id, nombre: nombre.trim(), correo: '', saldo: 0 })
}
function exportTableClients(rows) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'clientes.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

<UiDataTable
  :data="tableData"
  :header="tableHeader"
  title="Clientes"
  filter
  show-id
  vertical-borders
  horizontal-borders
  striped
  scroll="20rem"
>
  <template #actions="{ data }">
    <UiButtonGroup label="Acciones de clientes">
      <UiButton variant="outline-secondary" title="Agregar cliente" aria-label="Agregar cliente" @click="addTableClient"><UiIcon name="mdi:plus" /></UiButton>
      <UiButton variant="outline-secondary" title="Exportar JSON" aria-label="Exportar JSON" @click="exportTableClients(data)"><UiIcon name="mdi:download" /></UiButton>
    </UiButtonGroup>
  </template>
  <template #detail="{ row }">
    <UiDataTableColumnButton :items="tableActions" @select="handleTableAction($event, row)" />
  </template>
  <template #footer="{ data, total }">
    Mostrando {{ data.length }} de {{ total }} clientes
  </template>
</UiDataTable>
<p>Una opción con link se muestra como enlace:</p>
<UiDataTableColumnButton :items="[{ label: 'Volver a la tabla', icon: 'mdi:eye', link: '#table-example' }]" />
<!-- Asignar id="table-example" al contenedor de la tabla. -->`,
  button: '<UiButton>Primario</UiButton>\n<UiButton variant="secondary">Secundario</UiButton>\n<UiButton variant="danger">Eliminar</UiButton>\n<UiButton loading>Guardando</UiButton>',
  'button-group': '<UiButtonGroup label="Acciones de documento"><UiButton>Editar</UiButton><UiButton variant="secondary">Duplicar</UiButton><UiButton variant="danger">Eliminar</UiButton></UiButtonGroup>',
  badge: '<UiBadge>Nuevo</UiBadge>\n<UiBadge variant="success" pill>Activo</UiBadge>\n<UiBadge variant="danger">3 errores</UiBadge>',
  icon: '<UiIcon name="mdi:home" label="Extra pequeño" size="xs" />\n<UiIcon name="mdi:home" label="Pequeño" size="sm" />\n<UiIcon name="mdi:account" label="Mediano" size="md" />\n<UiIcon name="mdi:bell" label="Grande" size="lg" />\n<UiIcon name="mdi:bell" label="Extra grande" size="xl" />\n<UiIcon name="mdi:bell" label="16 píxeles" size="16" />\n<UiIcon name="mdi:bell" label="2.4 em" size="2.4em" />',
  link: '<UiLink href="#details">Ver detalles</UiLink>\n<UiLink href="#disabled" disabled>No disponible</UiLink>',
  list: `<UiList title="Songs">
  <UiListItem href="#" title="Yellow Submarine" subtitle="Beatles" after="$15" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
    <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg" alt="Yellow Submarine" width="80"></template>
  </UiListItem>
  <UiListItem href="#" title="Don't Stop Me Now" subtitle="Queen" after="$22" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
    <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-2.jpg" alt="Don't Stop Me Now" width="80"></template>
  </UiListItem>
  <UiListItem href="#" title="Billie Jean" subtitle="Michael Jackson" badge="Nuevo" badge-variant="success" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
    <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-3.jpg" alt="Billie Jean" width="80"></template>
  </UiListItem>
</UiList>
<UiList title="Links, Header, Footer" class="mt-4">
  <UiListItem href="#" header="Name" title="John Doe" after="Edit"><template #media>●</template></UiListItem>
  <UiListItem href="#" header="Phone" title="+7 90 111-22-3344" after="Edit"><template #media>●</template></UiListItem>
  <UiListItem href="#" header="Email" title="john@doe" footer="Home" after="Edit"><template #media>●</template></UiListItem>
  <UiListItem href="#" header="Email" title="john@framework7" footer="Work" after="Edit"><template #media>●</template></UiListItem>
</UiList>
<UiList title="Links, no icons" class="mt-4" filter>
  <UiListItem href="#" title="Ivan Petrov" />
  <UiListItem href="#" title="John Doe" />
  <UiListItem group-title title="Group Title Here" />
  <UiListItem href="#" title="Ivan Petrov" />
  <UiListItem href="#" title="Jenna Smith" />
</UiList>
<UiList title="Contenido personalizado" class="mt-4" filter>
  <UiListItem filter-text="Ana Gómez Administración">
    <strong>Ana Gómez</strong> · Administración
  </UiListItem>
</UiList>`,
  input: String.raw`// Dentro de script setup
import { ref } from 'vue'
import yep from 'yep'
const name = ref('')
const nameInput = ref()
const result = ref('')
const email = ref('')
const age = ref(null)
const birthDate = ref('')
const appointmentTime = ref('')
const appointmentDateTime = ref('')
const errorEmail = ref('ana@ejemplo.com')
const inputErrors = ref({ email: 'Este correo ya está registrado.' })
function validateRegistrationEmail() {
  const value = errorEmail.value.trim()
  inputErrors.value.email = !value
    ? 'Ingrese un correo.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? 'Ingrese un correo válido.'
      : value.toLowerCase() === 'ana@ejemplo.com'
        ? 'Este correo ya está registrado.'
        : null
}
const userSchema = yep.object({ name: yep.string().title('Nombre').required().min(3) })
async function validateName(value) { await userSchema.validateAt('name', { name: value }) }
async function validateNameField() {
  result.value = (await nameInput.value?.validate()) ? 'Nombre válido' : 'Revise el nombre'
}

<UiInput ref="nameInput" v-model="name" label="Nombre" help="Ingrese al menos tres caracteres" tooltip="Visible para el equipo" :validator="validateName" required />
<UiButton class="mt-3" size="sm" @click="validateNameField">Validar nombre</UiButton>
<div class="row g-3 mt-1">
  <div class="col-md-6"><UiInput v-model="email" type="email" label="Correo electrónico" placeholder="nombre@empresa.com" autocomplete="email" /></div>
  <div class="col-md-6"><UiInput v-model="age" type="number" label="Edad" /></div>
  <div class="col-md-6"><UiInput v-model="birthDate" type="date" label="Fecha de nacimiento" /></div>
  <div class="col-md-6"><UiInput v-model="appointmentTime" type="time" label="Hora de la cita" /></div>
  <div class="col-12"><UiInput v-model="appointmentDateTime" type="datetime-local" label="Fecha y hora de entrega" /></div>
</div>
<p>Nombre: {{ name || '—' }} · Correo: {{ email || '—' }} · Edad: {{ age ?? '—' }} · Fecha: {{ birthDate || '—' }}</p>
<section class="mt-4">
  <h3 class="h6">Error desde la aplicación</h3>
  <p class="small text-body-secondary">Valida al perder el foco y muestra el resultado mediante la prop error. El correo ana@ejemplo.com simula un registro existente.</p>
  <UiInput v-model="errorEmail" label="Correo de registro" type="email" :error="inputErrors.email" help="Ingresa otro correo y sal del campo para validar." @blur="validateRegistrationEmail" @input="inputErrors.email = null" />
  <div class="d-flex flex-wrap gap-2 mt-3">
    <UiButton size="sm" variant="danger" @click="inputErrors.email = 'Este correo ya está registrado.'">Mostrar error</UiButton>
    <UiButton size="sm" variant="secondary" @click="inputErrors.email = null">Quitar error</UiButton>
  </div>
</section>
<section class="mt-4">
  <h3 class="h6">Floating labels</h3>
  <UiInput v-model="email" type="email" label="Correo electrónico flotante" floating help="El label se eleva al escribir o enfocar." />
  <UiInput v-model="age" type="number" label="Edad flotante" floating />
</section>`,
  'input-group': `<UiInputGroup v-model="amount" label="Monto" prefix="$" help="Ingrese el monto a aplicar">
  <template #suffix><UiButton variant="secondary">Aplicar</UiButton></template>
</UiInputGroup>
<div class="row g-3 mt-1">
  <div class="col-md-6">
    <UiInputGroup v-model="search" label="Buscar" placeholder="Buscar...">
      <template #prefix><span class="input-group-text"><UiIcon name="mdi:magnify" /></span></template>
    </UiInputGroup>
  </div>
  <div class="col-md-6">
    <UiInputGroup v-model="website" type="url" label="Sitio web" placeholder="ejemplo.com">
      <template #prefix><span class="input-group-text"><UiIcon name="mdi:web" /></span></template>
      <template #suffix><span class="input-group-text">.com</span></template>
    </UiInputGroup>
  </div>
</div>`,
  select: `// Dentro de script setup
import { ref } from 'vue'
const role = ref('editor')
const roles = [{ value: 'admin', label: 'Administración' }, { value: 'editor', label: 'Edición' }, { value: 'viewer', label: 'Consulta' }]

<UiSelect v-model="role" label="Rol" :options="roles" placeholder="Seleccione un rol" />
<h3 class="h6 mt-4">Floating label</h3>
<UiSelect v-model="role" label="Rol flotante" :options="roles" placeholder="Seleccione un rol" floating help="En select, el label siempre aparece elevado." />
<p class="example-result">Seleccionado: {{ role }}</p>`,
  checkbox: '<UiCheckbox v-model="accepted" label="Acepto los términos" help="Requerido para guardar" required />',
  radio: '<UiRadio v-model="selectedPlan" name="plan" value="basic" label="Plan Básico" />\n<UiRadio v-model="selectedPlan" name="plan" value="pro" label="Plan Pro" />\n<UiRadio v-model="selectedPlan" name="plan" value="enterprise" label="Plan Empresa" />',
  switch: '<UiSwitch v-model="notificationsEnabled" label="Activar notificaciones" help="Recibirá novedades importantes." />',
  textarea: '<UiTextarea v-model="notes" label="Notas" placeholder="Información adicional" />',
  login: `<UiLogin
  v-model:email="loginEmail"
  v-model:password="loginPassword"
  v-model:remember="loginRemember"
  :full-height="false"
  @submit="login"
/>`,
  dashboard: dashboardExampleCode,
  grid: gridExampleCode,
  navbar: '<UiNavbar title="Proyecto Atlas"><template #start>...</template><template #end>...</template></UiNavbar>',
  'theme-switcher': '<UiThemeSwitcher v-model="theme" />',
  dropdown: '<UiDropdown label="Acciones" :items="dropdownItems" align="end" @select="dropdownResult = $event.label" />',
  sidebar: '<UiSidebar v-model="open" breakpoint="lg"><template #header>...</template><UiList>...</UiList></UiSidebar>',
  'app-layout': `// Dentro de script setup
import { ref } from 'vue'
import { UiAppLayout } from '@vue-skin/layouts'
const active = ref('home')
const sections = [['home', 'Inicio'], ['settings', 'Configuración']]

<UiAppLayout v-model="active" title="Vue Skin" :sections="sections">
  <template #header>
    <div class="d-flex align-items-center gap-3">
      <UiIcon name="mdi:home" size="32" class="text-primary flex-shrink-0" />
      <div>
        <h2 class="h6 mb-1">Vue Skin</h2>
        <p class="small text-body-secondary mb-0">Componentes y layouts</p>
      </div>
    </div>
  </template>
  <main>Contenido de {{ active }}</main>
</UiAppLayout>`,
  card: `<UiCard title="Perfil">
  <p>Las tarjetas organizan contenido con título, cuerpo y slots de cabecera o pie opcionales.</p>
  <template #footer>Última actualización: hoy</template>
</UiCard>
<UiCard title="Configuración">
  <template #list>
    <UiList :bordered="false">
      <UiListItem href="#profile" title="Abrir perfil" subtitle="Navegación" after="Ver" />
      <UiListItem href="#yellow-submarine" title="Yellow Submarine" subtitle="Beatles" after="$15" text="Item de canción con media.">
        <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg" alt="Yellow Submarine" width="56"></template>
      </UiListItem>
    </UiList>
  </template>
</UiCard>`,
  accordion: '<UiAccordion v-model="accordionOpen" :items="accordionItems" />',
  tabs: '<UiTabs v-model="activeTab" :items="tabItems" />',
  modal: '<UiButton @click="modalOpen = true">Abrir modal</UiButton>\n<UiModal v-model="modalOpen" title="Ejemplo de modal">Este modal usa <code>v-model</code> y el JavaScript oficial de Bootstrap.<template #footer><UiButton @click="modalOpen = false">Cerrar</UiButton></template></UiModal>',
  dialog: `<script setup>
import { ref } from 'vue'
import { uiDialog } from './skin.js'
// uiDialog es createVueSkin({ adapter }).dialog.
// Montar <UiDialogHost /> una sola vez en la raíz de la aplicación.
const result = ref('')

async function showInfo() { await uiDialog.info('El informe está disponible para descargar.', 'Información'); result.value = 'Información aceptada' }
async function showSuccess() { await uiDialog.success('Los cambios fueron guardados.', 'Operación confirmada'); result.value = 'Éxito aceptado' }
async function showWarning() { await uiDialog.warning('Hay pedidos pendientes de revisar.', 'Advertencia'); result.value = 'Advertencia aceptada' }
async function showError() { await uiDialog.error('No se pudo guardar. Intente nuevamente.', 'Error'); result.value = 'Error aceptado' }
async function showAlert() { await uiDialog.alert('Los cambios fueron guardados.', 'Éxito'); result.value = 'Alert aceptado' }
async function showConfirm() { result.value = (await uiDialog.confirm('¿Desea continuar?', 'Confirmación')) ? 'Confirmado' : 'Cancelado' }
async function showPrompt() { const value = await uiDialog.prompt('Ingrese un nombre para el proyecto.', 'Nuevo proyecto', { label: 'Nombre', initialValue: 'Vue Skin' }); result.value = value === null ? 'Prompt cancelado' : \`Proyecto: \${value}\` }
async function showPreloader() { const preloader = uiDialog.preloader('Procesando cambios'); await new Promise((resolve) => setTimeout(resolve, 5000)); preloader.close(); result.value = 'Proceso finalizado' }
<\/script>

<template>
  <div class="example-row">
    <UiButton variant="info" @click="showInfo">Información</UiButton>
    <UiButton variant="success" @click="showSuccess">Éxito</UiButton>
    <UiButton variant="warning" @click="showWarning">Advertencia</UiButton>
    <UiButton variant="danger" @click="showError">Error</UiButton>
    <UiButton @click="showAlert">Alert</UiButton>
    <UiButton variant="secondary" @click="showConfirm">Confirm</UiButton>
    <UiButton variant="secondary" @click="showPrompt">Prompt</UiButton>
    <UiButton variant="secondary" @click="showPreloader">Preloader</UiButton>
  </div>
  <p v-if="result" class="example-result">{{ result }}</p>
</template>`,
  alert: '<UiAlert variant="success">Operación realizada correctamente.</UiAlert>\n<UiAlert variant="warning" dismissible>Esta alerta puede cerrarse.</UiAlert>',
  toast: `// Dentro de script setup
import { ref } from 'vue'

const toastColors = ref(
  ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    .map((variant) => ({ variant, open: false }))
)
const toastPositions = ref([
  { position: 'top-start', label: 'Arriba izquierda', open: false },
  { position: 'top-center', label: 'Arriba centro', open: false },
  { position: 'top-end', label: 'Arriba derecha', open: false },
  { position: 'bottom-start', label: 'Abajo izquierda', open: false },
  { position: 'bottom-center', label: 'Abajo centro', open: false },
  { position: 'bottom-end', label: 'Abajo derecha', open: false }
])

<section class="component-examples">
  <UiCard title="Colores">
    <div class="example-row">
      <UiButton v-for="toast in toastColors" :key="toast.variant" :variant="toast.variant" @click="toast.open = true">
        {{ toast.variant }}
      </UiButton>
    </div>
    <UiToast v-for="toast in toastColors" :key="toast.variant" v-model="toast.open" :title="toast.variant" :message="'Ejemplo de toast ' + toast.variant" :variant="toast.variant" position="bottom-end" />
  </UiCard>
  <UiCard title="Ubicaciones">
    <div class="example-row">
      <UiButton v-for="toast in toastPositions" :key="toast.position" variant="outline-secondary" @click="toast.open = true">
        {{ toast.label }}
      </UiButton>
    </div>
    <UiToast v-for="toast in toastPositions" :key="toast.position" v-model="toast.open" :title="toast.label" :message="toast.position" variant="info" :position="toast.position" />
  </UiCard>
</section>

/* CSS del ejemplo */
.component-examples { display: grid; gap: 1.5rem; }
.example-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }`,
  spinner: '<UiSpinner />\n<UiButton :loading="loading" @click="loading = !loading">Alternar carga</UiButton>'
}
componentExamples['data-table-column-button'] = componentExamples['data-table']
const activeCode = computed(() => formatExample(componentExamples[active.value] ?? ''))
const theme = ref(null)
const modalOpen = ref(false)
const city = ref('')
const customer = ref('')
const selectedCustomer = ref(null)
const largeCustomer = ref('')
const selectedLargeCustomer = ref(null)
const largeCustomers = Array.from({ length: 1000 }, (_, index) => ({
  label: 'Cliente ' + String(index + 1).padStart(4, '0'),
  value: index + 1
}))
const cities = ['Asunción', 'Encarnación', 'Concepción', 'Ciudad del Este', 'San Lorenzo', 'Fernando de la Mora']
const customers = [
  { label: 'Ana Gómez', value: 1 },
  { label: 'Luis Pérez', value: 2 },
  { label: 'María López', value: 3 }
]
const name = ref('')
const nameInput = ref()
const age = ref(null)
const email = ref('')
const errorEmail = ref('ana@ejemplo.com')
const inputErrors = ref({ email: 'Este correo ya está registrado.' })
function validateRegistrationEmail() {
  const value = errorEmail.value.trim()
  inputErrors.value.email = !value
    ? 'Ingrese un correo.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? 'Ingrese un correo válido.'
      : value.toLowerCase() === 'ana@ejemplo.com'
        ? 'Este correo ya está registrado.'
        : null
}
const birthDate = ref('')
const appointmentTime = ref('')
const appointmentDateTime = ref('')
const amount = ref('')
const search = ref('')
const website = ref('')
const role = ref('editor')
const accepted = ref(false)
const selectedPlan = ref('basic')
const notes = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const loginRemember = ref(false)
const loginResult = ref('')
const loading = ref(false)
const toastColors = ref(
  ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    .map((variant) => ({ variant, open: false }))
)
const toastPositions = ref([
  { position: 'top-start', label: 'Arriba izquierda', open: false },
  { position: 'top-center', label: 'Arriba centro', open: false },
  { position: 'top-end', label: 'Arriba derecha', open: false },
  { position: 'bottom-start', label: 'Abajo izquierda', open: false },
  { position: 'bottom-center', label: 'Abajo centro', open: false },
  { position: 'bottom-end', label: 'Abajo derecha', open: false }
])
const accordionOpen = ref('first')
const activeTab = ref('overview')
const notificationsEnabled = ref(true)
const dropdownResult = ref('')
const result = ref('')
const roles = [{ value: 'admin', label: 'Administración' }, { value: 'editor', label: 'Edición' }, { value: 'viewer', label: 'Consulta' }]
const tableData = ref([
  { id: 1, nombre: 'Ana Gómez', correo: 'ana@ejemplo.com', saldo: 150 },
  { id: 2, nombre: 'Luis Pérez', correo: 'luis@ejemplo.com', saldo: 85 },
  { id: 3, nombre: 'María López', correo: 'maria@ejemplo.com', saldo: 230 }
])
const tableHeader = {
  id: { label: 'ID', align: 'center' },
  nombre: { label: 'Nombre', align: 'start' },
  correo: { label: 'Correo', align: 'start' },
  saldo: { label: 'Saldo', align: 'end' }
}
// Referencias para icon-forge: <UiIcon name="mdi:eye" /> <UiIcon name="mdi:pencil" /> <UiIcon name="mdi:delete" />
const tableActions = [
  { label: 'Ver', icon: 'mdi:eye', value: 'view' },
  { label: 'Editar', icon: 'mdi:pencil', value: 'edit' },
  { label: 'Borrar', icon: 'mdi:delete', value: 'delete', variant: 'outline-danger' }
]
const tableLinks = [{ label: 'Volver a la tabla', icon: 'mdi:eye', link: '#table-example' }]
async function addTableClient() {
  const nombre = await uiDialog.prompt('Ingrese el nombre del cliente.', 'Agregar cliente', { label: 'Nombre' })
  if (nombre === null || !nombre.trim()) return
  const id = Math.max(0, ...tableData.value.map(cliente => cliente.id)) + 1
  tableData.value.push({ id, nombre: nombre.trim(), correo: '', saldo: 0 })
}
function exportTableClients(rows) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'clientes.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
async function handleTableAction(item, row) {
  if (item.value === 'view') {
    await uiDialog.alert(row.nombre + ' · ' + row.correo, 'Cliente')
  } else if (item.value === 'edit') {
    const nombre = await uiDialog.prompt('Ingrese el nombre del cliente.', 'Editar cliente', { label: 'Nombre', initialValue: row.nombre })
    if (nombre !== null && nombre.trim()) row.nombre = nombre.trim()
  } else if (item.value === 'delete' && await uiDialog.confirm('¿Borrar a ' + row.nombre + '?', 'Borrar cliente')) {
    tableData.value = tableData.value.filter((cliente) => cliente.id !== row.id)
  }
}
const accordionItems = [
  { id: 'first', title: 'Primer panel', content: 'Contenido del primer panel.' },
  { id: 'second', title: 'Segundo panel', content: 'Contenido del segundo panel.' },
  { id: 'third', title: 'Tercer panel', content: 'Contenido del tercer panel.' }
]
const tabItems = [
  { id: 'overview', label: 'Resumen', content: 'Estado general del proyecto y sus últimos cambios.' },
  { id: 'activity', label: 'Actividad', content: 'Actividad reciente del equipo.' },
  { id: 'settings', label: 'Configuración', content: 'Preferencias disponibles para el proyecto.' }
]
const dropdownItems = [{ label: 'Editar', value: 'edit' }, { label: 'Duplicar', value: 'duplicate' }, { label: 'Eliminar', value: 'delete' }]
const userSchema = yep.object({ name: yep.string().title('Nombre').required().min(3) })

async function validateName(value) { await userSchema.validateAt('name', { name: value }) }
async function validateNameField() { result.value = (await nameInput.value?.validate()) ? 'Nombre válido' : 'Revise el nombre' }
function formatExample(example) {
  if (!example.startsWith('<')) return example

  let depth = 0
  return (example.match(/<[^>]+>|[^<]+/g) ?? []).reduce((lines, token) => {
    const value = token.trim()
    if (!value) return lines
    if (value.startsWith('</')) depth -= 1
    lines.push(`${'  '.repeat(Math.max(depth, 0))}${value}`)
    if (value.startsWith('<') && !value.startsWith('</') && !value.endsWith('/>')) depth += 1
    return lines
  }, []).join('\n')
}
async function showAlert() { await uiDialog.alert('Los cambios fueron guardados.', 'Éxito'); result.value = 'Alert aceptado' }
async function showInfo() { await uiDialog.info('El informe está disponible para descargar.', 'Información'); result.value = 'Información aceptada' }
async function showSuccess() { await uiDialog.success('Los cambios fueron guardados.', 'Operación confirmada'); result.value = 'Éxito aceptado' }
async function showWarning() { await uiDialog.warning('Hay pedidos pendientes de revisar.', 'Advertencia'); result.value = 'Advertencia aceptada' }
async function showError() { await uiDialog.error('No se pudo guardar. Intente nuevamente.', 'Error'); result.value = 'Error aceptado' }
async function showConfirm() { result.value = (await uiDialog.confirm('¿Desea continuar?', 'Confirmación')) ? 'Confirmado' : 'Cancelado' }
async function showPrompt() { const value = await uiDialog.prompt('Ingrese un nombre para el proyecto.', 'Nuevo proyecto', { label: 'Nombre', initialValue: 'Vue Skin' }); result.value = value === null ? 'Prompt cancelado' : `Proyecto: ${value}` }
async function showPreloader() { const preloader = uiDialog.preloader('Procesando cambios'); await new Promise((resolve) => setTimeout(resolve, 5000)); preloader.close(); result.value = 'Proceso finalizado' }
function login({ email, remember }) { loginResult.value = `Enviado: ${email || 'sin correo'}${remember ? ' · recordar sesión' : ''}` }
</script>

<template>
  <UiAppLayout v-model="active" title="Vue Skin" header="Componentes" :sections="sections">
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <UiIcon name="mdi:home" size="32" class="text-primary flex-shrink-0" />
        <div>
          <h2 class="h6 mb-1">Vue Skin</h2>
          <p class="small text-body-secondary mb-0">Componentes y layouts</p>
        </div>
      </div>
    </template>

    <main class="documentation-main">
      <p class="eyebrow">Adapter activo: Bootstrap</p>
      <h1>{{ activeName }}</h1>

      <UiTabs v-model="documentationTab" :items="documentationTabs">
        <template #panel="{ item }">
          <template v-if="item.id === 'example'">

      <UiCard v-if="active === 'button'" title="Botones">
        <div class="example-row"><UiButton>Primario</UiButton><UiButton variant="secondary">Secundario</UiButton><UiButton variant="danger">Eliminar</UiButton><UiButton loading>Guardando</UiButton></div>
      </UiCard>

      <UiCard v-else-if="active === 'button-group'" title="Grupo de botones">
        <UiButtonGroup label="Acciones de documento"><UiButton>Editar</UiButton><UiButton variant="secondary">Duplicar</UiButton><UiButton variant="danger">Eliminar</UiButton></UiButtonGroup>
      </UiCard>

      <UiCard v-else-if="active === 'badge'" title="Badges">
        <div class="example-row"><UiBadge>Nuevo</UiBadge><UiBadge variant="success" pill>Activo</UiBadge><UiBadge variant="danger">3 errores</UiBadge></div>
      </UiCard>

      <UiCard v-else-if="active === 'icon'" title="Iconos">
        <div class="example-row"><UiIcon name="mdi:home" label="Extra pequeño" size="xs" /><UiIcon name="mdi:home" label="Pequeño" size="sm" /><UiIcon name="mdi:account" label="Mediano" size="md" /><UiIcon name="mdi:bell" label="Grande" size="lg" /><UiIcon name="mdi:bell" label="Extra grande" size="xl" /><UiIcon name="mdi:bell" label="16 píxeles" size="16" /><UiIcon name="mdi:bell" label="2.4 em" size="2.4em" /></div>
      </UiCard>

      <UiCard v-else-if="active === 'link'" title="Enlaces">
        <div class="example-row"><UiLink href="#details">Ver detalles</UiLink><UiLink href="#disabled" disabled>No disponible</UiLink></div>
      </UiCard>

      <UiCard v-else-if="active === 'list'" title="Lista con contenido multimedia">
        <UiList title="Songs">
          <UiListItem href="#" title="Yellow Submarine" subtitle="Beatles" after="$15" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
            <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg" alt="Yellow Submarine" width="80"></template>
          </UiListItem>
          <UiListItem href="#" title="Don't Stop Me Now" subtitle="Queen" after="$22" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
            <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-2.jpg" alt="Don't Stop Me Now" width="80"></template>
          </UiListItem>
          <UiListItem href="#" title="Billie Jean" subtitle="Michael Jackson" after="$16" badge="Nuevo" badge-variant="success" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
            <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-3.jpg" alt="Billie Jean" width="80"></template>
          </UiListItem>
        </UiList>
        <UiList title="Links, Header, Footer" class="mt-4">
          <UiListItem href="#" header="Name" title="John Doe" after="Edit"><template #media>●</template></UiListItem>
          <UiListItem href="#" header="Phone" title="+7 90 111-22-3344" after="Edit"><template #media>●</template></UiListItem>
          <UiListItem href="#" header="Email" title="john@doe" footer="Home" after="Edit"><template #media>●</template></UiListItem>
          <UiListItem href="#" header="Email" title="john@framework7" footer="Work" after="Edit"><template #media>●</template></UiListItem>
        </UiList>
        <UiList title="Links, no icons" class="mt-4" filter>
          <UiListItem href="#" title="Ivan Petrov" />
          <UiListItem href="#" title="John Doe" />
          <UiListItem group-title title="Group Title Here" />
          <UiListItem href="#" title="Ivan Petrov" />
          <UiListItem href="#" title="Jenna Smith" />
        </UiList>
        <UiList title="Contenido personalizado" class="mt-4" filter>
          <UiListItem filter-text="Ana Gómez Administración">
            <strong>Ana Gómez</strong> · Administración
          </UiListItem>
        </UiList>
      </UiCard>

      <UiCard v-else-if="active === 'autocomplete'" title="Autocompletado">
        <UiAutocomplete
          v-model="city"
          :data="cities"
          label="Ciudad"
          placeholder="Escribe al menos 2 caracteres"
          help="Prueba cion: busca en cualquier parte del texto, sin distinguir acentos ni mayúsculas."
        />
        <p>Ciudad: {{ city || '—' }}</p>
        <UiAutocomplete
          v-model="customer"
          :data="customers"
          :min-length="3"
          label="Cliente"
          placeholder="Escribe al menos 3 caracteres"
          help="Usa las flechas y Enter para elegir; Escape cierra las sugerencias."
          @input="selectedCustomer = null"
          @select="selectedCustomer = $event"
        />
        <p>Cliente: {{ customer || '—' }} · ID seleccionado: {{ selectedCustomer?.value ?? '—' }}</p>
        <h3 class="h6 mt-4">1000 elementos con label y value</h3>
        <UiAutocomplete
          v-model="largeCustomer"
          :data="largeCustomers"
          :require-match="true"
          data-test="autocomplete-large"
          label="Cliente (1000 elementos)"
          placeholder="Busca por nombre o número, por ejemplo 0999"
          help="Busca desde 2 caracteres. Al salir del campo debes haber elegido un cliente o escrito su etiqueta completa; cliente 00 no es válido."
          @input="selectedLargeCustomer = null"
          @select="selectedLargeCustomer = $event"
        />
        <p>Total: {{ largeCustomers.length }} · Texto: {{ largeCustomer || '—' }} · value seleccionado: {{ selectedLargeCustomer?.value ?? '—' }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'input'" title="Campo de texto">
        <UiInput ref="nameInput" v-model="name" label="Nombre" help="Ingrese al menos tres caracteres" tooltip="Visible para el equipo" :validator="validateName" required />
        <UiButton class="mt-3" size="sm" @click="validateNameField">Validar nombre</UiButton>
        <div class="row g-3 mt-1">
          <div class="col-md-6"><UiInput v-model="email" type="email" label="Correo electrónico" placeholder="nombre@empresa.com" autocomplete="email" /></div>
          <div class="col-md-6"><UiInput v-model="age" type="number" label="Edad" /></div>
          <div class="col-md-6"><UiInput v-model="birthDate" type="date" label="Fecha de nacimiento" /></div>
          <div class="col-md-6"><UiInput v-model="appointmentTime" type="time" label="Hora de la cita" /></div>
          <div class="col-12"><UiInput v-model="appointmentDateTime" type="datetime-local" label="Fecha y hora de entrega" /></div>
        </div>
        <p class="example-result">Nombre: {{ name || '—' }} · Correo: {{ email || '—' }} · Edad: {{ age ?? '—' }} · Fecha: {{ birthDate || '—' }}</p>
        <section class="mt-4">
          <h3 class="h6">Error desde la aplicación</h3>
          <p class="small text-body-secondary">Valida al perder el foco y muestra el resultado mediante la prop error. El correo ana@ejemplo.com simula un registro existente.</p>
          <UiInput v-model="errorEmail" label="Correo de registro" type="email" :error="inputErrors.email" help="Ingresa otro correo y sal del campo para validar." @blur="validateRegistrationEmail" @input="inputErrors.email = null" />
          <div class="d-flex flex-wrap gap-2 mt-3">
            <UiButton size="sm" variant="danger" @click="inputErrors.email = 'Este correo ya está registrado.'">Mostrar error</UiButton>
            <UiButton size="sm" variant="secondary" @click="inputErrors.email = null">Quitar error</UiButton>
          </div>
        </section>
        <section class="mt-4">
          <h3 class="h6">Floating labels</h3>
          <UiInput v-model="email" type="email" label="Correo electrónico flotante" floating help="El label se eleva al escribir o enfocar." />
          <UiInput v-model="age" type="number" label="Edad flotante" floating />
        </section>
      </UiCard>

      <UiCard v-else-if="active === 'input-group'" title="Grupo de input">
        <UiInputGroup v-model="amount" label="Monto" prefix="$" help="Ingrese el monto a aplicar"><template #suffix><UiButton variant="secondary">Aplicar</UiButton></template></UiInputGroup>
        <div class="row g-3 mt-1">
          <div class="col-md-6"><UiInputGroup v-model="search" label="Buscar" placeholder="Buscar..."><template #prefix><span class="input-group-text"><UiIcon name="mdi:magnify" /></span></template></UiInputGroup></div>
          <div class="col-md-6"><UiInputGroup v-model="website" type="url" label="Sitio web" placeholder="ejemplo.com"><template #prefix><span class="input-group-text"><UiIcon name="mdi:web" /></span></template><template #suffix><span class="input-group-text">.com</span></template></UiInputGroup></div>
        </div>
        <p class="example-result">Monto: {{ amount || '—' }} · Búsqueda: {{ search || '—' }} · Sitio: {{ website || '—' }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'select'" title="Lista de opciones">
        <UiSelect v-model="role" label="Rol" :options="roles" placeholder="Seleccione un rol" />
        <h3 class="h6 mt-4">Floating label</h3>
        <UiSelect v-model="role" label="Rol flotante" :options="roles" placeholder="Seleccione un rol" floating help="En select, el label siempre aparece elevado." />
        <p class="example-result">Seleccionado: {{ role }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'checkbox'" title="Checkbox">
        <UiCheckbox v-model="accepted" label="Acepto los términos" help="Requerido para guardar" required />
        <p class="example-result">Estado: {{ accepted ? 'Aceptado' : 'Pendiente' }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'radio'" title="Radio">
        <UiRadio v-model="selectedPlan" name="plan" value="basic" label="Plan Básico" />
        <UiRadio v-model="selectedPlan" name="plan" value="pro" label="Plan Pro" />
        <UiRadio v-model="selectedPlan" name="plan" value="enterprise" label="Plan Empresa" />
        <p class="example-result">Plan seleccionado: {{ selectedPlan }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'switch'" title="Switch">
        <UiSwitch v-model="notificationsEnabled" label="Activar notificaciones" help="Recibirá novedades importantes." />
        <p class="example-result">Estado: {{ notificationsEnabled ? 'Activado' : 'Desactivado' }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'textarea'" title="Área de texto">
        <UiTextarea v-model="notes" label="Notas" placeholder="Información adicional" />
        <p class="example-result">{{ notes || 'Sin notas' }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'login'" title="Inicio de sesión">
        <UiLink :href="layoutPreviewHref('login')" target="_blank" rel="noopener noreferrer" class="btn btn-primary mb-3">Abrir layout en nueva pestaña</UiLink>
        <UiLogin v-model:email="loginEmail" v-model:password="loginPassword" v-model:remember="loginRemember" :full-height="false" @submit="login">
          <template #footer><p v-if="loginResult" class="example-result text-center">{{ loginResult }}</p></template>
        </UiLogin>
      </UiCard>

      <UiCard v-else-if="active === 'navbar'" title="Barra de navegación">
        <p>La barra superior de esta página es un <code>UiNavbar</code>. Este ejemplo muestra sus slots de navegación.</p>
        <UiNavbar title="Proyecto Atlas">
          <template #start><UiButton variant="link">Inicio</UiButton><UiButton variant="link">Proyectos</UiButton></template>
          <template #end><UiDropdown label="Cuenta" size="sm" variant="outline-secondary" align="end" :items="[{ label: 'Mi perfil', value: 'profile' }, { label: 'Cerrar sesión', value: 'logout' }]" /></template>
        </UiNavbar>
      </UiCard>

      <UiCard v-else-if="active === 'theme-switcher'" title="Tema">
        <UiThemeSwitcher v-model="theme" />
        <p class="example-result">Tema activo: {{ theme }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'dropdown'" title="Dropdown">
        <UiDropdown label="Acciones" :items="dropdownItems" align="end" @select="dropdownResult = $event.label" />
        <p v-if="dropdownResult" class="example-result">Acción: {{ dropdownResult }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'sidebar'" title="Panel lateral">
        <p>En escritorio ocupa espacio dentro del layout; en móvil se abre como un panel superpuesto.</p>
        <p>Este shell ya integra la navegación lateral y su switcher.</p>
        <p>El slot <code>#header</code> acepta logos, texto en varias líneas y cualquier componente Vue. El encabezado de esta página es un ejemplo.</p>
      </UiCard>

      <GridExample v-else-if="active === 'grid'" />

      <div v-else-if="active === 'dashboard'">
        <UiLink :href="layoutPreviewHref('dashboard')" target="_blank" rel="noopener noreferrer" class="btn btn-primary mb-3">Abrir layout en nueva pestaña</UiLink>
        <UiDashboard v-bind="dashboardExample" />
      </div>

      <UiCard v-else-if="active === 'app-layout'" title="Layout de aplicación">
        <UiLink :href="layoutPreviewHref('app-layout')" target="_blank" rel="noopener noreferrer" class="btn btn-primary mb-3">Abrir layout en nueva pestaña</UiLink>
        <p>Esta documentación está construida con <code>UiAppLayout</code>. Integra navbar, sidebar responsivo, selector de tema y secciones de navegación.</p>
        <p>Usa <code>&lt;template #header&gt;</code> para reemplazar el encabezado lateral; sin el slot se muestra el texto de la prop <code>header</code>.</p>
      </UiCard>

      <div v-else-if="active === 'chart'" class="d-grid gap-4">
        <div><UiButton @click="updateChartExample">Actualizar barras</UiButton></div>
        <div class="row g-4">
          <div v-for="example in chartExamples" :key="example.title" class="col-12 col-xl-6">
            <UiCard>
              <UiChart :type="example.type" :data="example.data" :options="example.options" :title="example.title" :height="300" />
            </UiCard>
          </div>
        </div>
      </div>

      <UiCard v-else-if="active === 'data-table' || active === 'data-table-column-button'" id="table-example">
        <UiDataTable :data="tableData" :header="tableHeader" title="Clientes" filter show-id vertical-borders horizontal-borders striped scroll="20rem">
          <template #actions="{ data }">
            <UiButtonGroup label="Acciones de clientes">
              <UiButton variant="outline-secondary" title="Agregar cliente" aria-label="Agregar cliente" @click="addTableClient"><UiIcon name="mdi:plus" /></UiButton>
              <UiButton variant="outline-secondary" title="Exportar JSON" aria-label="Exportar JSON" @click="exportTableClients(data)"><UiIcon name="mdi:download" /></UiButton>
            </UiButtonGroup>
          </template>
          <template #detail="{ row }"><UiDataTableColumnButton :items="tableActions" @select="handleTableAction($event, row)" /></template>
          <template #footer="{ data, total }">Mostrando {{ data.length }} de {{ total }} clientes</template>
        </UiDataTable>
        <p class="mt-3">Una opción con <code>link</code> se muestra como enlace:</p>
        <UiDataTableColumnButton :items="tableLinks" />
      </UiCard>

      <section v-else-if="active === 'card'" class="component-examples">
        <div>
          <h2>Card de contenido</h2>
          <UiCard title="Perfil">
            <p>Las tarjetas organizan contenido con título, cuerpo y slots de cabecera o pie opcionales.</p>
            <template #footer>Última actualización: hoy</template>
          </UiCard>
        </div>
        <div>
          <h2>Card con lista</h2>
          <UiCard title="Configuración">
            <template #list>
              <UiList :bordered="false">
                <UiListItem href="#profile" title="Abrir perfil" subtitle="Navegación" after="Ver" />
                <UiListItem href="#yellow-submarine" title="Yellow Submarine" subtitle="Beatles" after="$15" text="Item de canción con media.">
                  <template #media><img class="song-image" src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg" alt="Yellow Submarine" width="56"></template>
                </UiListItem>
              </UiList>
            </template>
          </UiCard>
        </div>
      </section>

      <UiCard v-else-if="active === 'accordion'" title="Acordeón">
        <UiAccordion v-model="accordionOpen" :items="accordionItems" />
      </UiCard>

      <UiCard v-else-if="active === 'tabs'" title="Pestañas">
        <UiTabs v-model="activeTab" :items="tabItems" />
        <p class="example-result">Pestaña activa: {{ activeTab }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'modal'" title="Modal">
        <UiButton @click="modalOpen = true">Abrir modal</UiButton>
      </UiCard>

      <UiCard v-else-if="active === 'dialog'" title="Diálogos desde JavaScript">
        <p>El servicio usa el adapter activo y muestra un único diálogo a la vez.</p>
        <p><code>success()</code> comunica una operación realizada; <code>confirm()</code> solicita una decisión con Aceptar y Cancelar.</p>
        <div class="example-row"><UiButton variant="info" @click="showInfo">Información</UiButton><UiButton variant="success" @click="showSuccess">Éxito</UiButton><UiButton variant="warning" @click="showWarning">Advertencia</UiButton><UiButton variant="danger" @click="showError">Error</UiButton></div>
        <div class="example-row"><UiButton @click="showAlert">Alert</UiButton><UiButton variant="secondary" @click="showConfirm">Confirm</UiButton><UiButton variant="secondary" @click="showPrompt">Prompt</UiButton><UiButton variant="secondary" @click="showPreloader">Preloader</UiButton></div>
        <p v-if="result" class="example-result">{{ result }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'alert'" title="Alertas">
        <UiAlert variant="success">Operación realizada correctamente.</UiAlert>
        <UiAlert variant="warning" dismissible>Esta alerta puede cerrarse.</UiAlert>
      </UiCard>

      <section v-else-if="active === 'toast'" class="component-examples">
        <UiCard title="Colores">
          <div class="example-row">
            <UiButton v-for="toast in toastColors" :key="toast.variant" :variant="toast.variant" @click="toast.open = true">
              {{ toast.variant }}
            </UiButton>
          </div>
          <UiToast v-for="toast in toastColors" :key="toast.variant" v-model="toast.open" :title="toast.variant" :message="'Ejemplo de toast ' + toast.variant" :variant="toast.variant" position="bottom-end" />
        </UiCard>
        <UiCard title="Ubicaciones">
          <div class="example-row">
            <UiButton v-for="toast in toastPositions" :key="toast.position" variant="outline-secondary" @click="toast.open = true">
              {{ toast.label }}
            </UiButton>
          </div>
          <UiToast v-for="toast in toastPositions" :key="toast.position" v-model="toast.open" :title="toast.label" :message="toast.position" variant="info" :position="toast.position" />
        </UiCard>
      </section>

      <UiCard v-else-if="active === 'spinner'" title="Indicador de carga">
        <div class="example-row"><UiSpinner /><UiButton :loading="loading" @click="loading = !loading">Alternar carga</UiButton></div>
      </UiCard>
          </template>
          <pre v-else class="example-code"><code>{{ activeCode }}</code></pre>
        </template>
      </UiTabs>
    </main>
  </UiAppLayout>

  <UiModal v-model="modalOpen" title="Ejemplo de modal">
    Este modal usa <code>v-model</code> y el JavaScript oficial de Bootstrap.
    <template #footer><UiButton @click="modalOpen = false">Cerrar</UiButton></template>
  </UiModal>
  <UiDialogHost />
</template>

<style scoped>
:global(body) { margin: 0; background: var(--bs-body-bg); color: var(--bs-body-color); font-family: system-ui, sans-serif; }
.documentation-main { width: 100%; padding: 2rem 3rem; min-width: 0; }
.documentation-main h1 { margin-top: 0; }
.eyebrow { color: #6c757d; font-size: .875rem; margin: 0 0 .5rem; }
.example-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.example-result { margin: 1rem 0 0; color: #495057; }
.example-code { margin: 0; padding: 1rem; border-radius: .375rem; background: #212529; color: #f8f9fa; tab-size: 2; white-space: pre-wrap; }
.component-examples { display: grid; gap: 1.5rem; }
.component-examples h2 { font-size: 1rem; margin: 0 0 .75rem; }
.song-image { border-radius: .5rem; display: block; }
@media (max-width: 760px) { .documentation-main { padding: 1.5rem; } }
</style>
