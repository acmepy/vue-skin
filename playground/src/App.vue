<script setup>
import { computed, ref } from 'vue'
import yep from 'yep'
import { uiDialog } from './skin.js'

const sections = [
  ['button', 'UiButton'], ['button-group', 'UiButtonGroup'], ['badge', 'UiBadge'], ['icon', 'UiIcon'], ['link', 'UiLink'], ['list', 'UiList / UiListItem'], ['input', 'UiInput'], ['select', 'UiSelect'], ['checkbox', 'UiCheckbox'], ['switch', 'UiSwitch'],
  ['textarea', 'UiTextarea'], ['radio', 'UiRadio'], ['navbar', 'UiNavbar'], ['dropdown', 'UiDropdown'], ['sidebar', 'UiSidebar'], ['card', 'UiCard'],
  ['accordion', 'UiAccordion'], ['tabs', 'UiTabs'], ['modal', 'UiModal'], ['dialog', 'UiDialog'], ['alert', 'UiAlert'], ['toast', 'UiToast'], ['spinner', 'UiSpinner']
]
const active = ref('button')
const activeName = computed(() => sections.find(([id]) => id === active.value)?.[1])
const documentationTab = ref('example')
const documentationTabs = [{ id: 'example', label: 'Ejemplo', content: '' }, { id: 'code', label: 'Código', content: '' }]
const componentExamples = {
  button: '<UiButton variant="primary">Guardar</UiButton>',
  'button-group': '<UiButtonGroup><UiButton>Editar</UiButton><UiButton variant="secondary">Cancelar</UiButton></UiButtonGroup>',
  badge: '<UiBadge variant="success" pill>Activo</UiBadge>',
  icon: '<UiIcon name="mdi:home" size="lg" label="Inicio" />',
  link: '<UiLink href="/details">Ver detalles</UiLink>',
  list: '<UiList title="Canciones"><UiListItem title="Yellow Submarine" subtitle="Beatles" /></UiList>',
  input: '<UiInput ref="nameInput" v-model="name" label="Nombre" :validator="validateName" />\nawait nameInput.value.validate()',
  select: '<UiSelect v-model="role" label="Rol" :options="roles" />',
  checkbox: '<UiCheckbox v-model="accepted" label="Acepto los términos" />',
  radio: '<UiRadio v-model="plan" name="plan" value="pro" label="Plan Pro" />',
  switch: '<UiSwitch v-model="enabled" label="Activar notificaciones" />',
  textarea: '<UiTextarea v-model="notes" label="Notas" :rows="4" />',
  navbar: '<UiNavbar title="Proyecto"><template #end><UiButton size="sm">Cuenta</UiButton></template></UiNavbar>',
  dropdown: '<UiDropdown label="Acciones" :items="[{ label: \'Editar\', value: \'edit\' }]" />',
  sidebar: '<UiSidebar v-model="open" position="start">Contenido</UiSidebar>',
  card: '<UiCard title="Perfil">Contenido de la tarjeta</UiCard>',
  accordion: '<UiAccordion v-model="openPanel" :items="[{ id: \'one\', title: \'Panel\', content: \'Contenido\' }]" />',
  tabs: '<UiTabs v-model="activeTab" :items="[{ id: \'overview\', label: \'Resumen\', content: \'Contenido\' }]" />',
  modal: '<UiModal v-model="modalOpen" title="Ejemplo">Contenido</UiModal>',
  dialog: 'await uiDialog.alert(\'Los cambios fueron guardados.\', \'Éxito\')',
  alert: '<UiAlert variant="success" dismissible>Operación realizada.</UiAlert>',
  toast: '<UiToast v-model="toastOpen" title="Vue Skin" message="Operación completada." />',
  spinner: '<UiSpinner label="Cargando" />'
}
const activeCode = computed(() => formatExample(componentExamples[active.value] ?? ''))
const sidebarOpen = ref(false)
const modalOpen = ref(false)
const name = ref('')
const nameInput = ref()
const age = ref(null)
const birthDate = ref('')
const role = ref('editor')
const accepted = ref(false)
const selectedPlan = ref('basic')
const notes = ref('')
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

function selectSection(id, event) { event?.preventDefault(); active.value = id; sidebarOpen.value = false }
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
</script>

<template>
  <UiNavbar title="Vue Skin">
    <template #end><UiButton variant="outline-light" size="sm" @click="sidebarOpen = true">Componentes</UiButton></template>
  </UiNavbar>

  <div class="documentation-layout">
    <aside class="component-index" aria-label="Índice de componentes">
      <h2>Componentes</h2>
      <UiList :bordered="false">
        <UiListItem v-for="[id, label] in sections" :key="id" :href="`#${id}`" :title="label" :active="active === id" @click="selectSection(id, $event)" />
      </UiList>
    </aside>

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
        <div class="row g-3 mt-1"><div class="col-md-6"><UiInput v-model="age" type="number" label="Edad" /></div><div class="col-md-6"><UiInput v-model="birthDate" type="date" label="Fecha de nacimiento" /></div></div>
        <p class="example-result">Nombre: {{ name || '—' }} · Edad: {{ age ?? '—' }} · Fecha: {{ birthDate || '—' }}</p>
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

      <UiCard v-else-if="active === 'navbar'" title="Barra de navegación">
        <p>La barra superior de esta página es un <code>UiNavbar</code>. Este ejemplo muestra sus slots de navegación.</p>
        <UiNavbar title="Proyecto Atlas">
          <template #start><UiButton variant="link">Inicio</UiButton><UiButton variant="link">Proyectos</UiButton></template>
          <template #end><UiDropdown label="Cuenta" size="sm" variant="outline-light" align="end" :items="[{ label: 'Mi perfil', value: 'profile' }, { label: 'Cerrar sesión', value: 'logout' }]" /></template>
        </UiNavbar>
      </UiCard>

      <UiCard v-else-if="active === 'dropdown'" title="Dropdown">
        <UiDropdown label="Acciones" :items="dropdownItems" align="end" @select="dropdownResult = $event.label" />
        <p v-if="dropdownResult" class="example-result">Acción: {{ dropdownResult }}</p>
      </UiCard>

      <UiCard v-else-if="active === 'sidebar'" title="Panel lateral">
        <p>El listado de componentes también se muestra en un <code>UiSidebar</code> en pantallas pequeñas.</p>
        <UiButton @click="sidebarOpen = true">Abrir sidebar</UiButton>
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
  </div>

  <UiSidebar v-model="sidebarOpen" width="20rem">
    <template #header><h2>Componentes</h2></template>
    <UiList :bordered="false">
      <UiListItem v-for="[id, label] in sections" :key="id" :href="`#${id}`" :title="label" :active="active === id" @click="selectSection(id, $event)" />
    </UiList>
  </UiSidebar>

  <UiModal v-model="modalOpen" title="Ejemplo de modal">
    Este modal usa <code>v-model</code> y el JavaScript oficial de Bootstrap.
    <template #footer><UiButton @click="modalOpen = false">Cerrar</UiButton></template>
  </UiModal>
  <UiDialogHost />
</template>

<style scoped>
:global(body) { margin: 0; background: #f8f9fa; color: #212529; font-family: system-ui, sans-serif; }
.documentation-layout { display: grid; grid-template-columns: 15rem minmax(0, 1fr); max-width: 1200px; margin: 0 auto; min-height: calc(100vh - 56px); }
.component-index { padding: 2rem 1rem; border-right: 1px solid #dee2e6; display: grid; align-content: start; gap: .5rem; background: white; }
.component-index h2 { margin: 0 0 .5rem; font-size: 1rem; }
.documentation-main { padding: 3rem; }
.documentation-main h1 { margin-top: 0; }
.eyebrow { color: #6c757d; font-size: .875rem; margin: 0 0 .5rem; }
.example-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.example-result { margin: 1rem 0 0; color: #495057; }
.example-code { margin: 0; padding: 1rem; border-radius: .375rem; background: #212529; color: #f8f9fa; tab-size: 2; white-space: pre-wrap; }
.component-examples { display: grid; gap: 1.5rem; }
.component-examples h2 { font-size: 1rem; margin: 0 0 .75rem; }
.song-image { border-radius: .5rem; display: block; }
@media (max-width: 760px) { .documentation-layout { display: block; } .component-index { display: none; } .documentation-main { padding: 1.5rem; } }
</style>
