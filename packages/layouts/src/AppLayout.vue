<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  title: String,
  header: String,
  sections: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'select'])
const isDesktop = () => typeof window !== 'undefined' && (window.matchMedia?.('(min-width: 992px)').matches ?? false)
const sidebarOpen = ref(isDesktop())
const normalizedSections = computed(() => props.sections.map((section) => Array.isArray(section)
  ? { id: section[0], title: section[1] }
  : { id: section.id, title: section.title ?? section.label }
))

function selectSection(section, event) {
  event?.preventDefault()
  emit('update:modelValue', section.id)
  emit('select', section)
  if (!isDesktop()) sidebarOpen.value = false
}
</script>

<template>
  <div class="ui-app-layout">
    <div class="ui-app-layout-sidebar">
      <UiSidebar v-model="sidebarOpen" width="15rem" aria-label="Navegación principal">
        <template #header><slot name="header"><h2 class="ui-app-layout-heading">{{ header }}</h2></slot></template>
        <UiList :bordered="false">
          <UiListItem v-for="section in normalizedSections" :key="section.id" :href="`#${section.id}`" :title="section.title" :active="modelValue === section.id" @click="selectSection(section, $event)" />
        </UiList>
      </UiSidebar>
    </div>
    <div class="ui-app-layout-content">
      <UiNavbar :title="title">
        <template #start>
          <UiButton class="ui-app-layout-sidebar-switcher d-inline-flex align-items-center justify-content-center p-0" style="width: 2rem; height: 2rem" variant="outline-secondary" :aria-label="sidebarOpen ? 'Ocultar navegación' : 'Mostrar navegación'" :title="sidebarOpen ? 'Ocultar navegación' : 'Mostrar navegación'" @click="sidebarOpen = !sidebarOpen">
            <template #icon><UiIcon name="lucide:sidebar" size="18" /></template>
          </UiButton>
        </template>
        <template #end><UiThemeSwitcher /></template>
      </UiNavbar>
      <slot />
    </div>
  </div>
</template>

<style>
.ui-app-layout { display: grid; grid-template-columns: max-content minmax(0, 1fr); min-height: 100vh; }
.ui-app-layout-sidebar { height: 100vh; position: sticky; top: 0; overflow: hidden; }
.ui-app-layout-sidebar > * { height: 100%; }
.ui-app-layout-content { grid-column: 2; min-width: 0; }
.ui-app-layout-heading { margin: 0; font-size: 1rem; }

@media (max-width: 991.98px) {
  .ui-app-layout { display: block; }
  .ui-app-layout-sidebar { height: auto; position: static; overflow: visible; }
  .ui-app-layout-content { grid-column: auto; }
}
</style>
