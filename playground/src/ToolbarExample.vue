<script setup>
import { ref } from 'vue'

const selected = ref('home')
const position = ref('bottom')
const items = [
  { id:'home', label:'Inicio', icon:'mdi:home' },
  { id:'messages', label:'Mensajes', icon:'mdi:email-outline' },
  { id:'favorites', label:'Favoritos', icon:'mdi:heart-outline' },
  { id:'settings', label:'Configuración', icon:'mdi:cog-outline', disabled:true }
]
// In an application with app.use(router), use to for SPA navigation:
// { id:'account', label:'Mi cuenta', icon:'mdi:account', to:{ name:'account' } }
const links = [
  { id:'local', label:'Contenido de esta página', icon:'mdi:arrow-down', href:'#toolbar-content' },
  { id:'external', label:'GitHub', icon:'mdi:open-in-new', href:'https://github.com/acmepy/vue-skin', target:'_blank' }
]
// Literal references let icon-forge generate CSS for the dynamic item icons:
// <UiIcon name="mdi:home" /> <UiIcon name="mdi:email-outline" />
// <UiIcon name="mdi:heart-outline" /> <UiIcon name="mdi:cog-outline" />
// <UiIcon name="mdi:arrow-down" /> <UiIcon name="mdi:open-in-new" />
</script>

<template>
  <UiCard title="Iconos y texto: arriba o abajo">
    <UiButton @click="position = position === 'top' ? 'bottom' : 'top'">Cambiar posición</UiButton>
    <div class="toolbar-demo-screen">
      <UiToolbar v-if="position === 'top'" v-model="selected" :items="items" position="top" label="Navegación superior" />
      <section id="toolbar-content" class="toolbar-demo-content"><p>Sección seleccionada: {{ selected }}</p><p>La barra se coloca dentro del flujo de la página. Con <code>fixed</code> se fija al borde de la ventana.</p></section>
      <UiToolbar v-if="position === 'bottom'" v-model="selected" :items="items" position="bottom" label="Navegación inferior" />
    </div>
  </UiCard>
  <UiCard title="Solo iconos"><UiToolbar v-model="selected" :items="items" :labels="false" label="Accesos con iconos" /></UiCard>
  <UiCard title="Solo texto"><UiToolbar v-model="selected" :items="items" :icons="false" label="Accesos con texto" /></UiCard>
  <UiCard title="Enlaces"><UiToolbar :items="links" label="Enlaces de ejemplo" /><p>Para rutas SPA, utiliza <code>to</code> e instala Vue Router en tu aplicación. Los enlaces externos usan <code>href</code>.</p></UiCard>
</template>

<style>
.toolbar-demo-screen { display:flex; flex-direction:column; min-height:15rem; margin-top:1rem; border:1px solid var(--bs-border-color,var(--border)); border-radius:.75rem; overflow:hidden; }
.toolbar-demo-content { flex:1; padding:1.5rem; }
</style>
