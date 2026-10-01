<script setup>
import { Offcanvas } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean, position: { type: String, default: 'start' }, width: String, breakpoint: { type: String, default: 'lg' } })
const emit = defineEmits(['update:modelValue', 'open', 'close'])
const placement = computed(() => props.position === 'end' ? 'end' : 'start')
const element = ref()
let instance
let mediaQuery

const breakpointWidths = { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 }
function isOverlay() { return !mediaQuery?.matches }

function sync(visible) {
  if (!isOverlay()) return
  visible ? instance?.show() : instance?.hide()
}
function onShown() { emit('update:modelValue', true); emit('open') }
function onHidden() { emit('update:modelValue', false); emit('close') }

watch(() => props.modelValue, sync)
onMounted(() => {
  mediaQuery = window.matchMedia?.(`(min-width: ${breakpointWidths[props.breakpoint] ?? breakpointWidths.lg}px)`) ?? { matches: false }
  instance = Offcanvas.getOrCreateInstance(element.value)
  element.value.addEventListener('shown.bs.offcanvas', onShown)
  element.value.addEventListener('hidden.bs.offcanvas', onHidden)
  sync(props.modelValue)
})
onBeforeUnmount(() => {
  element.value?.removeEventListener('shown.bs.offcanvas', onShown)
  element.value?.removeEventListener('hidden.bs.offcanvas', onHidden)
  instance?.dispose()
})
</script>

<template>
  <aside ref="element" class="ui-sidebar" :class="[`offcanvas-${placement}`, `offcanvas-${breakpoint}`, modelValue ? `d-${breakpoint}-flex` : `d-${breakpoint}-none`]" :style="width ? { width } : undefined" tabindex="-1">
    <header v-if="$slots.header" class="offcanvas-header">
      <slot name="header" />
    </header>
    <div class="offcanvas-body ui-sidebar-body" style="flex: 1 1 auto; min-height: 0; overflow-y: auto"><slot /></div>
    <footer v-if="$slots.footer" class="offcanvas-footer"><slot name="footer" /></footer>
  </aside>
</template>

<style>
.ui-sidebar { flex-direction: column; min-width: 0; }
.ui-sidebar .offcanvas-header { display: flex !important; flex-shrink: 0; }
.ui-sidebar .ui-sidebar-body { display: block !important; flex: 1 1 auto !important; min-height: 0; overflow-y: auto !important; scrollbar-color: var(--ui-sidebar-scroll-thumb) var(--ui-sidebar-scroll-track); }
.ui-sidebar .ui-sidebar-body::-webkit-scrollbar { width: .75rem; }
.ui-sidebar .ui-sidebar-body::-webkit-scrollbar-track { background: var(--ui-sidebar-scroll-track); }
.ui-sidebar .ui-sidebar-body::-webkit-scrollbar-thumb { background: var(--ui-sidebar-scroll-thumb); border: .2rem solid var(--ui-sidebar-scroll-track); border-radius: 999px; }
.ui-sidebar .ui-sidebar-body::-webkit-scrollbar-thumb:hover { background-color: var(--ui-sidebar-scroll-thumb-hover); }
[data-bs-theme='light'] .ui-sidebar .ui-sidebar-body { --ui-sidebar-scroll-track: #f8f9fa; --ui-sidebar-scroll-thumb: #adb5bd; --ui-sidebar-scroll-thumb-hover: #6c757d; color-scheme: light; }
[data-bs-theme='dark'] .ui-sidebar .ui-sidebar-body { --ui-sidebar-scroll-track: #212529; --ui-sidebar-scroll-thumb: #495057; --ui-sidebar-scroll-thumb-hover: #6c757d; color-scheme: dark; }
</style>
