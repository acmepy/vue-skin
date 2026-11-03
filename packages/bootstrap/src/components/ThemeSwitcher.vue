<script setup>
import { onMounted, watch } from 'vue'
import { UiIcon, useTheme } from '@vue-skin/core'

const props = defineProps({ modelValue: String, storageKey: { type: String, default: 'themeMode' }, persist: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue', 'change'])
const theme = useTheme()
const currentTheme = theme.resolvedMode
const validTheme = value => value === 'dark' || value === 'light'
function toggle() {
  const mode = currentTheme.value === 'dark' ? 'light' : 'dark'
  theme.setMode(mode, props.persist)
  if (props.persist && theme.persist) {
    try { localStorage.setItem(props.storageKey, mode) } catch { /* Storage can be unavailable. */ }
  }
  emit('change', mode)
}
watch(() => props.modelValue, mode => {
  if (validTheme(mode) && mode !== currentTheme.value) theme.setMode(mode, false)
})
watch(currentTheme, mode => emit('update:modelValue', mode), { flush: 'sync' })
onMounted(() => {
  if (validTheme(props.modelValue)) theme.setMode(props.modelValue, false)
  else if (props.persist && theme.persist && props.storageKey !== 'themeMode') {
    try {
      const mode = localStorage.getItem(props.storageKey)
      if (validTheme(mode)) theme.setMode(mode, false)
    } catch { /* Storage can be unavailable. */ }
  }
  if (props.modelValue !== currentTheme.value) emit('update:modelValue', currentTheme.value)
})
</script>

<template>
  <button type="button" class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center p-0" style="width: 2rem; height: 2rem" :aria-label="currentTheme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" :title="currentTheme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" @click="toggle">
    <UiIcon v-if="currentTheme === 'dark'" name="mdi:weather-sunny" size="16" />
    <UiIcon v-else name="mdi:weather-night" size="16" />
  </button>
</template>
