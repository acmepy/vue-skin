<script setup>
import { Alert as BootstrapAlert } from 'bootstrap'
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({ variant: { type: String, default: 'info' }, dismissible: Boolean })
const emit = defineEmits(['close'])
const element = ref()
let instance
function onClose() { emit('close') }
onMounted(() => {
  instance = BootstrapAlert.getOrCreateInstance(element.value)
  element.value.addEventListener('close.bs.alert', onClose)
})
onBeforeUnmount(() => {
  element.value?.removeEventListener('close.bs.alert', onClose)
  instance?.dispose()
})
</script>

<template>
  <div ref="element" class="alert" :class="[`alert-${variant}`, { 'alert-dismissible fade show': dismissible }]" role="alert">
    <slot />
    <button v-if="dismissible" type="button" class="btn-close" aria-label="Cerrar" data-bs-dismiss="alert" />
  </div>
</template>
