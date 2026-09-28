<script setup>
import { Modal as BootstrapModal } from 'bootstrap'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean, title: String, size: String, centered: Boolean, closable: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed'])
const element = ref()
let instance

function sync(visible) { visible ? instance?.show() : instance?.hide() }
function onShow() { emit('open') }
function onShown() { emit('update:modelValue', true); emit('opened') }
function onHide() { emit('close') }
function onHidden() { emit('update:modelValue', false); emit('closed') }

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
  instance?.dispose()
})
</script>

<template>
  <div ref="element" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" :class="[size ? `modal-${size}` : null, { 'modal-dialog-centered': centered }]">
      <section class="modal-content">
        <header v-if="title || $slots.header" class="modal-header">
          <slot name="header"><h2 class="modal-title fs-5">{{ title }}</h2></slot>
          <button v-if="closable" type="button" class="btn-close" aria-label="Cerrar" data-bs-dismiss="modal" />
        </header>
        <div class="modal-body"><slot /></div>
        <footer v-if="$slots.footer" class="modal-footer"><slot name="footer" /></footer>
      </section>
    </div>
  </div>
</template>
