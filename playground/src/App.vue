<script setup>
import { computed, ref } from 'vue'
import yep from 'yep'
import { UiAppLayout, UiLogin } from '@vue-skin/layouts'
import { uiDialog } from './skin.js'

const sections = [
  ['button', 'UiButton'], ['button-group', 'UiButtonGroup'], ['badge', 'UiBadge'], ['icon', 'UiIcon'], ['link', 'UiLink'], ['list', 'UiList / UiListItem'], ['input', 'UiInput'], ['input-group', 'UiInputGroup'], ['select', 'UiSelect'], ['checkbox', 'UiCheckbox'], ['switch', 'UiSwitch'],
  ['textarea', 'UiTextarea'], ['radio', 'UiRadio'], ['navbar', 'UiNavbar'], ['theme-switcher', 'UiThemeSwitcher'], ['dropdown', 'UiDropdown'], ['sidebar', 'UiSidebar'], ['card', 'UiCard'],
  ['accordion', 'UiAccordion'], ['tabs', 'UiTabs'], ['modal', 'UiModal'], ['dialog', 'UiDialog'], ['alert', 'UiAlert'], ['toast', 'UiToast'], ['spinner', 'UiSpinner'],
  { id: 'layouts-group', title: 'Layouts', groupTitle: true }, ['app-layout', 'UiAppLayout'], ['login', 'UiLogin']
]
const active = ref('button')
const activeName = computed(() => {
  const section = sections.find((item) => (Array.isArray(item) ? item[0] : item.id) === active.value)
  return Array.isArray(section) ? section[1] : section?.title
})
const documentationTab = ref('example')
const documentationTabs = [{ id: 'example', label: 'Ejemplo', content: '' }, { id: 'code', label: 'Código', content: '' }]
const componentExamples = {
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
<UiList title="Links, no icons" class="mt-4">
  <UiListItem href="#" title="Ivan Petrov" />
  <UiListItem href="#" title="John Doe" />
  <UiListItem group-title title="Group Title Here" />
  <UiListItem href="#" title="Ivan Petrov" />
  <UiListItem href="#" title="Jenna Smith" />
</UiList>`,
  input: `<UiInput ref="nameInput" v-model="name" label="Nombre" help="Ingrese al menos tres caracteres" tooltip="Visible para el equipo" :validator="validateName" required />
<UiButton class="mt-3" size="sm" @click="validateNameField">Validar nombre</UiButton>
<div class="row g-3 mt-1">
  <div class="col-md-6"><UiInput v-model="email" type="email" label="Correo electrónico" placeholder="nombre@empresa.com" autocomplete="email" /></div>
  <div class="col-md-6"><UiInput v-model="age" type="number" label="Edad" /></div>
  <div class="col-md-6"><UiInput v-model="birthDate" type="date" label="Fecha de nacimiento" /></div>
  <div class="col-md-6"><UiInput v-model="appointmentTime" type="time" label="Hora de la cita" /></div>
  <div class="col-12"><UiInput v-model="appointmentDateTime" type="datetime-local" label="Fecha y hora de entrega" /></div>
</div>`,
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
  select: '<UiSelect v-model="role" label="Rol" :options="roles" placeholder="Seleccione un rol" />',
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
  navbar: '<UiNavbar title="Proyecto Atlas"><template #start>...</template><template #end>...</template></UiNavbar>',
  'theme-switcher': '<UiThemeSwitcher v-model="theme" />',
  dropdown: '<UiDropdown label="Acciones" :items="dropdownItems" align="end" @select="dropdownResult = $event.label" />',
  sidebar: '<UiSidebar v-model="open" breakpoint="lg"><template #header>...</template><UiList>...</UiList></UiSidebar>',
  'app-layout': '<UiAppLayout v-model="active" title="Vue Skin" header="Componentes" :sections="sections"><main>Contenido</main></UiAppLayout>',
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
  dialog: `<UiButton @click="showAlert">Alert</UiButton>
<UiButton variant="secondary" @click="showConfirm">Confirm</UiButton>
<UiButton variant="secondary" @click="showPrompt">Prompt</UiButton>
<UiButton variant="secondary" @click="showPreloader">Preloader</UiButton>

await uiDialog.alert('Los cambios fueron guardados.', 'Éxito')
await uiDialog.confirm('¿Desea continuar?', 'Confirmación')
await uiDialog.prompt('Ingrese un nombre para el proyecto.', 'Nuevo proyecto', { label: 'Nombre', initialValue: 'Vue Skin' })
const preloader = uiDialog.preloader('Procesando cambios')
setTimeout(() => preloader.close(), 5000)`,
  alert: '<UiAlert variant="success">Operación realizada correctamente.</UiAlert>\n<UiAlert variant="warning" dismissible>Esta alerta puede cerrarse.</UiAlert>',
  toast: '<UiButton @click="toastOpen = true">Mostrar toast</UiButton>\n<UiToast v-model="toastOpen" title="Vue Skin" message="La operación fue completada." variant="success" />',
  spinner: '<UiSpinner />\n<UiButton :loading="loading" @click="loading = !loading">Alternar carga</UiButton>'
}
const activeCode = computed(() => formatExample(componentExamples[active.value] ?? ''))
const theme = ref(null)
const modalOpen = ref(false)
const name = ref('')
const nameInput = ref()
const age = ref(null)
const email = ref('')
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
const toastOpen = ref(false)
const accordionOpen = ref('first')
const activeTab = ref('overview')
const notificationsEnabled = ref(true)
const dropdownResult = ref('')
const result = ref('')
const roles = [{ value: 'admin', label: 'Administración' }, { value: 'editor', label: 'Edición' }, { value: 'viewer', label: 'Consulta' }]
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
async function showConfirm() { result.value = (await uiDialog.confirm('¿Desea continuar?', 'Confirmación')) ? 'Confirmado' : 'Cancelado' }
async function showPrompt() { const value = await uiDialog.prompt('Ingrese un nombre para el proyecto.', 'Nuevo proyecto', { label: 'Nombre', initialValue: 'Vue Skin' }); result.value = value === null ? 'Prompt cancelado' : `Proyecto: ${value}` }
async function showPreloader() { const preloader = uiDialog.preloader('Procesando cambios'); await new Promise((resolve) => setTimeout(resolve, 5000)); preloader.close(); result.value = 'Proceso finalizado' }
function login({ email, remember }) { loginResult.value = `Enviado: ${email || 'sin correo'}${remember ? ' · recordar sesión' : ''}` }
</script>

<template>
  <UiAppLayout v-model="active" title="Vue Skin" header="Componentes" :sections="sections">

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
        <UiList title="Links, no icons" class="mt-4">
          <UiListItem href="#" title="Ivan Petrov" />
          <UiListItem href="#" title="John Doe" />
          <UiListItem group-title title="Group Title Here" />
          <UiListItem href="#" title="Ivan Petrov" />
          <UiListItem href="#" title="Jenna Smith" />
        </UiList>
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
      </UiCard>

      <UiCard v-else-if="active === 'app-layout'" title="Layout de aplicación">
        <p>Esta documentación está construida con <code>UiAppLayout</code>. Integra navbar, sidebar responsivo, selector de tema y secciones de navegación.</p>
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
        <div class="example-row"><UiButton @click="showAlert">Alert</UiButton><UiButton variant="secondary" @click="showConfirm">Confirm</UiButton><UiButton variant="secondary" @click="showPrompt">Prompt</UiButton><UiButton variant="secondary" @click="showPreloader">Preloader</UiButton></div>
        <p v-if="result" class="example-result">{{ result }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'alert'" title="Alertas">
        <UiAlert variant="success">Operación realizada correctamente.</UiAlert>
        <UiAlert variant="warning" dismissible>Esta alerta puede cerrarse.</UiAlert>
      </UiCard>

      <UiCard v-else-if="active === 'toast'" title="Toast">
        <UiButton @click="toastOpen = true">Mostrar toast</UiButton>
        <UiToast v-model="toastOpen" title="Vue Skin" message="La operación fue completada." variant="success" />
      </UiCard>

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
