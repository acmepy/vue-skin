<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
const props = defineProps({ modelValue: Boolean, title: String, size: String, centered: Boolean, closable: { type: Boolean, default: true }, tone: String })
const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed'])
const element = ref()
const id = useId()
let previousFocus
let backdropPress = false
let disposed = false
function closed() {
  emit('update:modelValue', false)
  emit('closed')
  previousFocus?.focus?.()
}
function requestClose() { if (props.closable) emit('update:modelValue', false) }
function sync(visible) {
  if (!element.value || disposed) return
  if (visible && !element.value.open) {
    previousFocus = document.activeElement
    emit('open')
    if (element.value.showModal) element.value.showModal()
    else element.value.setAttribute('open', '')
    nextTick(() => { if (!disposed) emit('opened') })
  } else if (!visible && element.value.open) {
    emit('close')
    if (element.value.close) element.value.close()
    else { element.value.removeAttribute('open'); closed() }
  }
}
watch(() => props.modelValue, sync)
onMounted(() => sync(props.modelValue))
onBeforeUnmount(() => { disposed = true; if (element.value?.open) element.value.close?.(); previousFocus?.focus?.() })
</script>
<template>
  <dialog ref="element" class="dialog bc-modal" :aria-labelledby="title ? id + '-title' : undefined" @cancel.prevent="requestClose" @close="closed" @pointerdown="backdropPress = $event.target === element" @click="backdropPress && $event.target === element && requestClose()">
    <article class="bc-modal-content" :class="['bc-modal-' + (size || 'md'), { 'bc-modal-toned': tone }]">
      <header v-if="title || $slots.header" :data-tone="tone"><slot name="header"><h2 :id="id + '-title'">{{ title }}</h2></slot></header>
      <button v-if="closable" class="bc-modal-close" type="button" aria-label="Cerrar" @click="requestClose">×</button>
      <section><slot /></section><footer v-if="$slots.footer"><slot name="footer" /></footer>
    </article>
  </dialog>
</template>
