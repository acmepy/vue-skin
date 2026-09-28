<script setup>
import Button from './Button.vue'
import Input from './Input.vue'
import Modal from './Modal.vue'
import Spinner from './Spinner.vue'

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
const modalTitle = () => props.type === 'preloader' ? undefined : props.title

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
  <Modal :model-value="modelValue" :title="modalTitle()" centered :closable="type !== 'preloader'" @update:model-value="visibilityChanged" @closed="emit('closed')">
    <p v-if="message" class="mb-3">{{ message }}</p>
    <Input v-if="isPrompt()" :model-value="inputValue" :label="label" :placeholder="placeholder" autofocus @update:model-value="emit('update:inputValue', $event)" />
    <div v-if="type === 'preloader'" class="d-flex align-items-center gap-3">
      <Spinner />
      <div><strong v-if="title" class="d-block">{{ title }}</strong><span>Procesando…</span></div>
    </div>
    <template v-if="type !== 'preloader'" #footer>
      <Button v-if="canCancel()" variant="secondary" @click="cancel">{{ cancelText }}</Button>
      <Button variant="primary" @click="accept">{{ acceptText }}</Button>
    </template>
  </Modal>
</template>
