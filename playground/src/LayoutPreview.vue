<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { UiAppLayout, UiLogin, UiDashboard } from '@vue-skin/layouts'
import { dashboardExample } from './dashboardExample.js'

const props = defineProps({ layout: { type: String, default: 'app-layout' } })
const active = ref('home')
const sections = [
  ['home', 'Inicio'], ['settings', 'Configuración'],
  { id: 'reports', title: 'Reportes', groupTitle: true },
  ...Array.from({ length: 24 }, (_, index) => [`report-${index + 1}`, `Reporte ${index + 1}`])
]
const activeTitle = computed(() => sections.find((section) => Array.isArray(section) && section[0] === active.value)?.[1] ?? 'Inicio')
const documentationHref = import.meta.env.BASE_URL
const email = ref('')
const password = ref('')
const remember = ref(false)
const result = ref('')
const originalTitle = document.title
onMounted(() => { document.title = `${props.layout === 'login' ? 'UiLogin' : props.layout === 'dashboard' ? 'UiDashboard' : 'UiAppLayout'} — Vista independiente` })
onBeforeUnmount(() => { document.title = originalTitle })
function login(credentials) {
  result.value = `Formulario de demostración enviado: ${credentials.email}. No se realiza autenticación.`
}
</script>

<template>
  <UiAppLayout v-if="layout === 'app-layout'" v-model="active" title="Proyecto de ejemplo" :sections="sections">
    <template #header>
      <div class="d-flex align-items-center gap-3">
        <UiIcon name="mdi:home" size="32" class="text-primary flex-shrink-0" />
        <div><h2 class="h6 mb-1">Mi aplicación</h2><p class="small text-body-secondary mb-0">Vista independiente</p></div>
      </div>
    </template>
    <main class="p-4">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h1 class="h3 mb-0">{{ activeTitle }}</h1>
        <UiLink :href="documentationHref" class="btn btn-outline-secondary">Volver a la documentación</UiLink>
      </div>
      <p>Prueba el switcher del sidebar, su scroll y el tema. Cambia el tamaño de la ventana para comprobar el offcanvas en pantallas pequeñas.</p>
      <div class="row g-4">
        <div v-for="index in 8" :key="index" class="col-12 col-xl-6">
          <UiCard :title="activeTitle + ' · Bloque ' + index">
            <p>Contenido de ejemplo que ocupa el espacio disponible del layout.</p>
            <p class="mb-0">El sidebar y el contenido principal pueden desplazarse de forma independiente. Esta vista no está dentro de otro layout ni de una tarjeta de documentación.</p>
          </UiCard>
        </div>
      </div>
    </main>
  </UiAppLayout>
  <UiAppLayout v-else-if="layout === 'dashboard'" v-model="active" title="Dashboard" header="Mi negocio" :sections="[['home', 'Dashboard'], ['orders', 'Pedidos'], ['products', 'Productos']]">
    <UiDashboard v-if="active === 'home'" v-bind="dashboardExample">
      <template #actions><UiLink :href="documentationHref" class="btn btn-outline-secondary">Volver a la documentación</UiLink></template>
    </UiDashboard>
    <UiDashboard v-else :title="active === 'orders' ? 'Pedidos' : 'Productos'" description="Datos de demostración" :tables="dashboardExample.tables.filter(table => table.id === active)">
      <template #actions><UiLink :href="documentationHref" class="btn btn-outline-secondary">Volver a la documentación</UiLink></template>
    </UiDashboard>
  </UiAppLayout>
  <template v-else>
    <div class="position-fixed top-0 end-0 p-3"><UiThemeSwitcher /></div>
    <UiLogin v-model:email="email" v-model:password="password" v-model:remember="remember" @submit="login">
      <template #footer>
        <p class="small text-body-secondary text-center mt-3">Formulario de demostración, sin autenticación real.</p>
        <p v-if="result" role="status" class="text-center">{{ result }}</p>
        <p class="text-center mb-0"><UiLink :href="documentationHref">Volver a la documentación</UiLink></p>
      </template>
    </UiLogin>
  </template>
</template>
