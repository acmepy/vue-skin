<script setup>
import { Toast as BootstrapToast } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  variant: String,
  position: { type: String, default: 'top-end' },
  autohide: { type: Boolean, default: true },
  delay: { type: Number, default: 5000 },
  closable: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'show', 'shown', 'hide', 'hidden'])
const element = ref()
let instance
const positionClass = computed(() => ({
  'top-start': 'top-0 start-0', 'top-center': 'top-0 start-50 translate-middle-x', 'top-end': 'top-0 end-0',
  'bottom-start': 'bottom-0 start-0', 'bottom-center': 'bottom-0 start-50 translate-middle-x', 'bottom-end': 'bottom-0 end-0'
}[props.position] || 'top-0 end-0'))
function sync(visible) { visible ? instance?.show() : instance?.hide() }
function onShow() { emit('show') }
function onShown() { emit('update:modelValue', true); emit('shown') }
function onHide() { emit('hide') }
function onHidden() { emit('update:modelValue', false); emit('hidden') }
watch(() => props.modelValue, sync)
onMounted(() => {
  instance = BootstrapToast.getOrCreateInstance(element.value, { autohide: props.autohide, delay: props.delay })
  element.value.addEventListener('show.bs.toast', onShow)
  element.value.addEventListener('shown.bs.toast', onShown)
  element.value.addEventListener('hide.bs.toast', onHide)
  element.value.addEventListener('hidden.bs.toast', onHidden)
  sync(props.modelValue)
})
onBeforeUnmount(() => {
  element.value?.removeEventListener('show.bs.toast', onShow)
  element.value?.removeEventListener('shown.bs.toast', onShown)
  element.value?.removeEventListener('hide.bs.toast', onHide)
  element.value?.removeEventListener('hidden.bs.toast', onHidden)
  instance?.dispose()
})
</script>

<template>
  <div class="toast-container position-fixed p-3" :class="positionClass">
    <div ref="element" class="toast" :class="variant ? `text-bg-${variant}` : null" role="alert" aria-live="assertive" aria-atomic="true">
      <div v-if="title" class="toast-header" :class="variant ? `text-bg-${variant}` : null">
        <strong class="me-auto">{{ title }}</strong>
        <button v-if="closable" type="button" class="btn-close" :class="variant ? 'btn-close-white' : null" aria-label="Cerrar" data-bs-dismiss="toast" />
      </div>
      <div class="toast-body"><slot>{{ message }}</slot></div>
    </div>
  </div>
</template>
