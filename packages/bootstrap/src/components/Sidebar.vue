<script setup>
import { Offcanvas } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean, position: { type: String, default: 'start' }, width: String })
const emit = defineEmits(['update:modelValue', 'open', 'close'])
const placement = computed(() => props.position === 'end' ? 'end' : 'start')
const element = ref()
let instance

function sync(visible) { visible ? instance?.show() : instance?.hide() }
function onShown() { emit('update:modelValue', true); emit('open') }
function onHidden() { emit('update:modelValue', false); emit('close') }

watch(() => props.modelValue, sync)
onMounted(() => {
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
  <aside ref="element" class="offcanvas" :class="`offcanvas-${placement}`" :style="width ? { width } : undefined" tabindex="-1">
    <header v-if="$slots.header" class="offcanvas-header">
      <slot name="header" />
      <button type="button" class="btn-close" aria-label="Cerrar" data-bs-dismiss="offcanvas" />
    </header>
    <div class="offcanvas-body"><slot /></div>
    <footer v-if="$slots.footer" class="offcanvas-footer"><slot name="footer" /></footer>
  </aside>
</template>
