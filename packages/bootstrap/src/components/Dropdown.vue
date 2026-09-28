<script setup>
import { Dropdown as BootstrapDropdown } from 'bootstrap'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Opciones' },
  items: { type: Array, default: () => [] },
  variant: { type: String, default: 'secondary' },
  size: String,
  align: { type: String, default: 'start' },
  disabled: Boolean
})
const emit = defineEmits(['select', 'show', 'shown', 'hide', 'hidden'])
const toggle = ref()
let instance
function select(item, event) {
  if (item.disabled) { event.preventDefault(); return }
  emit('select', item)
}
function event(name) { return () => emit(name) }
const onShow = event('show')
const onShown = event('shown')
const onHide = event('hide')
const onHidden = event('hidden')
onMounted(() => {
  instance = BootstrapDropdown.getOrCreateInstance(toggle.value)
  toggle.value.addEventListener('show.bs.dropdown', onShow)
  toggle.value.addEventListener('shown.bs.dropdown', onShown)
  toggle.value.addEventListener('hide.bs.dropdown', onHide)
  toggle.value.addEventListener('hidden.bs.dropdown', onHidden)
})
onBeforeUnmount(() => {
  toggle.value?.removeEventListener('show.bs.dropdown', onShow)
  toggle.value?.removeEventListener('shown.bs.dropdown', onShown)
  toggle.value?.removeEventListener('hide.bs.dropdown', onHide)
  toggle.value?.removeEventListener('hidden.bs.dropdown', onHidden)
  instance?.dispose()
})
</script>

<template>
  <div class="dropdown">
    <button ref="toggle" type="button" class="btn dropdown-toggle" :class="[`btn-${variant}`, size ? `btn-${size}` : null]" data-bs-toggle="dropdown" aria-expanded="false" :disabled="disabled">
      {{ label }}
    </button>
    <ul class="dropdown-menu" :class="{ 'dropdown-menu-end': align === 'end' }">
      <li v-for="item in items" :key="item.value ?? item.label">
        <component :is="item.href ? 'a' : 'button'" class="dropdown-item" :class="{ disabled: item.disabled }" :href="item.href" :type="item.href ? undefined : 'button'" :aria-disabled="item.disabled ? 'true' : undefined" @click="select(item, $event)">{{ item.label }}</component>
      </li>
    </ul>
  </div>
</template>
