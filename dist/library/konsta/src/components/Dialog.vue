<script setup>
import { Button } from './basic.js'
import Input from './Input.vue'
import Modal from './Modal.vue'
import { Spinner } from './basic.js'
import { UiIcon } from '../../../core/src/index.js'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  type: { type: String, default: 'alert' },
  title: String,
  message: String,
  label: String,
  inputValue: String,
  placeholder: String,
  acceptText: { type: String, default: 'Aceptar' },
  cancelText: { type: String, default: 'Cancelar' }
})
const emit = defineEmits(['update:modelValue', 'update:inputValue', 'accept', 'cancel', 'closed'])
const isPrompt = () => props.type === 'prompt'
const canCancel = () => props.type === 'confirm' || props.type === 'prompt'
const states = {
  info: { title: 'Información', variant: 'info' },
  success: { title: 'Operación realizada', variant: 'success' },
  warning: { title: 'Advertencia', variant: 'warning' },
  error: { title: 'Error', variant: 'danger' }
}
const state = computed(() => states[props.type])
const modalTitle = () => props.type === 'preloader' ? undefined : (props.title ?? state.value?.title)

function accept() {
  emit('accept', isPrompt() ? props.inputValue : undefined)
  emit('update:modelValue', false)
}
function cancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
function visibilityChanged(visible) {
  if (visible || props.type === 'preloader') return
  cancel()
}
</script>
<template>
<Modal :model-value="modelValue" :title="modalTitle()" :tone="state?.variant" :class="{ 'ks-preloader-compact': type === 'preloader' && !title && !message }" :aria-label="type === 'preloader' ? (title || 'Cargando') : undefined" centered :closable="type !== 'preloader'" @update:model-value="visibilityChanged" @closed="emit('closed')">
  <p v-if="message && type !== 'preloader'" :role="type === 'error' || type === 'warning' ? 'alert' : undefined">{{ message }}</p>
  <Input v-if="isPrompt()" :model-value="inputValue" :label="label" :placeholder="placeholder" autofocus @update:model-value="emit('update:inputValue', $event)" />
  <div v-if="type === 'preloader'" class="ks-loader">
    <strong v-if="title">{{ title }}</strong>
    <Spinner />
    <p v-if="message">{{ message }}</p>
  </div>
  <template v-if="type !== 'preloader'" #footer><Button v-if="canCancel()" variant="secondary" @click="cancel">{{ cancelText }}</Button><Button :variant="state?.variant ?? 'primary'" @click="accept">{{ acceptText }}</Button></template>
</Modal>
</template>
