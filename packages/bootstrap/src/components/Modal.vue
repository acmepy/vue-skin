<script setup>
import { Modal as BootstrapModal } from 'bootstrap'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean, title: String, size: String, centered: Boolean, closable: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed'])
const element = ref()
let instance
let requestedVisible = props.modelValue
let isVisible = false
let backdropElement
let disposeTimer

function disposeInstance() {
  if (!instance) return
  instance.dispose()
  instance = undefined
}

function sync(visible) {
  requestedVisible = visible
  visible ? instance?.show() : instance?.hide()
}
function onShow() { isVisible = true; emit('open') }
function onShown() {
  backdropElement = [...document.querySelectorAll('.modal-backdrop')].at(-1)
  if (!requestedVisible) { instance?.hide(); return }
  emit('update:modelValue', true)
  emit('opened')
}
function onHide() { emit('close') }
function onHidden() {
  isVisible = false
  if (requestedVisible) { instance?.show(); return }
  emit('update:modelValue', false)
  emit('closed')
}
function requestClose() { emit('update:modelValue', false) }

watch(() => props.modelValue, sync)
onMounted(() => {
  instance = BootstrapModal.getOrCreateInstance(element.value, { backdrop: props.closable ? true : 'static', keyboard: props.closable })
  element.value.addEventListener('show.bs.modal', onShow)
  element.value.addEventListener('shown.bs.modal', onShown)
  element.value.addEventListener('hide.bs.modal', onHide)
  element.value.addEventListener('hidden.bs.modal', onHidden)
  sync(props.modelValue)
})
onBeforeUnmount(() => {
  element.value?.removeEventListener('show.bs.modal', onShow)
  element.value?.removeEventListener('shown.bs.modal', onShown)
  element.value?.removeEventListener('hide.bs.modal', onHide)
  element.value?.removeEventListener('hidden.bs.modal', onHidden)
  if (isVisible) {
    element.value?.addEventListener('hidden.bs.modal', disposeInstance, { once: true })
    instance?.hide()
    disposeTimer = window.setTimeout(() => {
      disposeInstance()
      backdropElement?.remove()
      if (!document.querySelector('.modal-backdrop')) document.body.classList.remove('modal-open')
    }, 350)
  } else {
    disposeInstance()
  }
})
</script>

<template>
  <div ref="element" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" :class="[size ? `modal-${size}` : null, { 'modal-dialog-centered': centered }]">
      <section class="modal-content">
        <header v-if="title || $slots.header" class="modal-header">
          <slot name="header"><h2 class="modal-title fs-5">{{ title }}</h2></slot>
          <button v-if="closable" type="button" class="btn-close" aria-label="Cerrar" @click="requestClose" />
        </header>
        <div class="modal-body"><slot /></div>
        <footer v-if="$slots.footer" class="modal-footer"><slot name="footer" /></footer>
      </section>
    </div>
  </div>
</template>
