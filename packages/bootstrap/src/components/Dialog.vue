<script setup>
import Button from './Button.vue'
import Input from './Input.vue'
import Modal from './Modal.vue'
import Spinner from './Spinner.vue'
import { UiIcon } from '@vue-skin/core'
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
  <Modal :model-value="modelValue" :title="modalTitle()" :class="state ? `ui-dialog-${state.variant}` : undefined" centered :closable="type !== 'preloader'" @update:model-value="visibilityChanged" @closed="emit('closed')">
    <template v-if="state" #header>
      <div class="d-flex align-items-center gap-3">
        <UiIcon v-if="type === 'info'" name="mdi:information-outline" size="xl" class="flex-shrink-0" />
        <UiIcon v-else-if="type === 'success'" name="mdi:check-circle-outline" size="xl" class="flex-shrink-0" />
        <UiIcon v-else-if="type === 'warning'" name="mdi:alert-outline" size="xl" class="flex-shrink-0" />
        <UiIcon v-else name="mdi:close-circle-outline" size="xl" class="flex-shrink-0" />
        <h2 class="modal-title fs-5">{{ modalTitle() }}</h2>
      </div>
    </template>
    <p v-if="message" class="mb-0" :role="state ? (type === 'warning' || type === 'error' ? 'alert' : 'status') : undefined">{{ message }}</p>
    <Input v-if="isPrompt()" :model-value="inputValue" :label="label" :placeholder="placeholder" autofocus @update:model-value="emit('update:inputValue', $event)" />
    <div v-if="type === 'preloader'" class="d-flex align-items-center gap-3">
      <Spinner />
      <div><strong v-if="title" class="d-block">{{ title }}</strong><span>Procesando…</span></div>
    </div>
    <template v-if="type !== 'preloader'" #footer>
      <Button v-if="canCancel()" variant="secondary" @click="cancel">{{ cancelText }}</Button>
      <Button :variant="state?.variant ?? 'primary'" @click="accept">{{ acceptText }}</Button>
    </template>
  </Modal>
</template>

<style>
.ui-dialog-info .modal-header { background-color: var(--bs-info-bg-subtle); color: var(--bs-info-text-emphasis); border-color: var(--bs-info-border-subtle); }
.ui-dialog-success .modal-header { background-color: var(--bs-success-bg-subtle); color: var(--bs-success-text-emphasis); border-color: var(--bs-success-border-subtle); }
.ui-dialog-warning .modal-header { background-color: var(--bs-warning-bg-subtle); color: var(--bs-warning-text-emphasis); border-color: var(--bs-warning-border-subtle); }
.ui-dialog-danger .modal-header { background-color: var(--bs-danger-bg-subtle); color: var(--bs-danger-text-emphasis); border-color: var(--bs-danger-border-subtle); }
</style>
