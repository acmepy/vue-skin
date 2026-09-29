<script setup>
import { onMounted, ref, watch } from 'vue'
import { UiIcon } from '@vue-skin/core'

const props = defineProps({ modelValue: String, storageKey: { type: String, default: 'themeMode' }, persist: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue', 'change'])
const currentTheme = ref(props.modelValue)
const validTheme = (value) => value === 'dark' || value === 'light'
const preferredTheme = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const storedTheme = () => { try { return localStorage.getItem(props.storageKey) } catch { return null } }
function setTheme(theme, notify = false, remember = false) {
  if (!validTheme(theme)) return
  currentTheme.value = theme
  document.documentElement.setAttribute('data-bs-theme', theme)
  if (remember && props.persist) { try { localStorage.setItem(props.storageKey, theme) } catch {} }
  if (notify) { emit('update:modelValue', theme); emit('change', theme) }
}
function toggle() { setTheme(currentTheme.value === 'dark' ? 'light' : 'dark', true, true) }
watch(() => props.modelValue, (theme) => { if (validTheme(theme)) setTheme(theme) })
onMounted(() => {
  const theme = validTheme(props.modelValue) ? props.modelValue : validTheme(storedTheme()) ? storedTheme() : preferredTheme()
  setTheme(theme)
  if (theme !== props.modelValue) emit('update:modelValue', theme)
})
</script>

<template>
  <button type="button" class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center p-0" style="width: 2rem; height: 2rem" :aria-label="currentTheme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" :title="currentTheme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'" @click="toggle">
    <UiIcon v-if="currentTheme === 'dark'" name="mdi:weather-sunny" size="16" />
    <UiIcon v-else name="mdi:weather-night" size="16" />
  </button>
</template>
