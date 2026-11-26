<script setup>
import { computed, ref, useId } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  title: String,
  header: String,
  sidebarWidth: { type: String, default: '15rem' },
  sections: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'select'])
const isDesktop = () => typeof window !== 'undefined' && (window.matchMedia?.('(min-width: 992px)').matches ?? false)
const sidebarOpen = ref(isDesktop())
const generatedId = typeof useId === 'function' ? useId() : undefined
const sidebarId = generatedId ? `ui-app-layout-sidebar-${generatedId}` : 'ui-app-layout-sidebar'
const normalizedSections = computed(() => props.sections.map((section) => Array.isArray(section)
  ? { id: section[0], title: section[1] }
  : { id: section.id, title: section.title ?? section.label, groupTitle: section.groupTitle, icon: section.icon }
))

function selectSection(section, event) {
  if (section.groupTitle) return
  event?.preventDefault()
  emit('update:modelValue', section.id)
  emit('select', section)
  if (!isDesktop()) sidebarOpen.value = false
}
</script>

<template>
  <div class="ui-app-layout">
    <div class="ui-app-layout-sidebar">
      <UiSidebar :id="sidebarId" v-model="sidebarOpen" class="ui-app-layout-navigation" :width="sidebarWidth" aria-label="Navegación principal">
        <template #header><slot name="header"><h2 class="ui-app-layout-heading">{{ header }}</h2></slot></template>
        <UiList :bordered="false" :divided="false" style="--ui-list-filter-bg: var(--ui-layout-surface, var(--bs-tertiary-bg))" filter>
          <UiListItem v-for="section in normalizedSections" :key="section.id" :href="section.groupTitle ? undefined : `#${section.id}`" :title="section.title" :group-title="section.groupTitle" :active="modelValue === section.id" @click="selectSection(section, $event)">
            <template v-if="section.icon" #media><UiIcon :name="section.icon" size="20" /></template>
          </UiListItem>
        </UiList>
      </UiSidebar>
    </div>
    <div class="ui-app-layout-content">
      <UiNavbar class="ui-app-layout-navbar" :title="title">
        <template #start>
          <UiButton
            class="ui-app-layout-sidebar-switcher"
            variant="outline-secondary"
            :aria-expanded="sidebarOpen"
            :aria-controls="sidebarId"
            :aria-label="sidebarOpen ? 'Ocultar navegación' : 'Mostrar navegación'"
            :title="sidebarOpen ? 'Ocultar navegación' : 'Mostrar navegación'"
            @click="sidebarOpen = !sidebarOpen"
          >
            <template #icon><UiIcon name="lucide:sidebar" size="18" /></template>
          </UiButton>
        </template>
        <template #end><div class="ui-app-layout-navbar-actions"><slot name="navbar-actions" /><UiThemeSwitcher /><UiThemeSelector /></div></template>
      </UiNavbar>
      <slot />
    </div>
  </div>
</template>

<style>
.ui-app-layout { --ui-app-layout-header-height: 3.5rem; display: grid; grid-template-columns: max-content minmax(0, 1fr); min-height: 100vh; }
.ui-app-layout-sidebar { height: 100vh; position: sticky; top: 0; overflow: hidden; }
.ui-app-layout-sidebar > * { height: 100%; }
.ui-app-layout-sidebar > .ui-sidebar { border-inline-end: 1px solid var(--ui-sidebar-scroll-thumb) !important; }
.ui-app-layout-navbar { min-height: var(--ui-app-layout-header-height); }
.ui-app-layout-navbar-actions { display:flex; flex-direction:row; align-items:center; gap:.5rem; }
.ui-app-layout .ui-app-layout-sidebar-switcher { display:inline-flex; align-items:center; justify-content:center; flex:0 0 2rem; width:2rem; height:2rem; min-height:2rem; padding:0; gap:0; box-sizing:border-box; }
.ui-app-layout-sidebar-switcher > * { flex-shrink:0; }
.ui-app-layout-navigation { background:var(--ui-layout-surface, var(--bs-tertiary-bg, #f8f9fa)); }
.ui-app-layout-sidebar .ui-sidebar-header { min-height: var(--ui-app-layout-header-height); padding-block: .5rem; }
.ui-app-layout-content { grid-column: 2; min-width: 0; }
.ui-app-layout-heading { margin: 0; font-size: 1rem; }

@media (max-width: 991.98px) {
  .ui-app-layout { display: block; }
  .ui-app-layout-sidebar { height: auto; position: static; overflow: visible; }
  .ui-app-layout-content { grid-column: auto; }
}
</style>
