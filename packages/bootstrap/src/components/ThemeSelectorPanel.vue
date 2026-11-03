<script setup>
import { UiIcon, useTheme } from '@vue-skin/core'
import Switch from './Switch.vue'
import Button from './Button.vue'

const emit = defineEmits(['change'])
const theme = useTheme()
const state = theme.state
const modes = [{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }, { value: 'system', label: 'Sistema' }]
function update(patch) {
  theme.setTheme(patch)
  emit('change', { ...state })
}
function reset() {
  theme.reset()
  emit('change', { ...state })
}
</script>

<template>
  <section class="ui-theme-selector-panel">
    <fieldset class="mb-4">
      <legend class="h6">Apariencia</legend>
      <div class="d-flex flex-wrap gap-2" role="group" aria-label="Apariencia">
        <button v-for="mode in modes" :key="mode.value" type="button" class="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center p-0 ui-theme-mode" :class="{ active: state.mode === mode.value }" :title="mode.label" :aria-label="mode.label" :aria-pressed="state.mode === mode.value" @click="update({ mode: mode.value })">
          <UiIcon v-if="mode.value === 'light'" name="mdi:weather-sunny" size="20" />
          <UiIcon v-else-if="mode.value === 'dark'" name="mdi:weather-night" size="20" />
          <UiIcon v-else name="mdi:circle-half-full" size="20" />
        </button>
      </div>
    </fieldset>
    <fieldset class="mb-4">
      <legend class="h6">Color de acento</legend>
      <div class="d-flex flex-wrap gap-2">
        <button v-for="color in theme.colors" :key="color.value" type="button" class="btn rounded-circle p-0 ui-theme-color" :style="{ '--ui-theme-swatch': color.color }" :title="color.label" :aria-label="color.label" :aria-pressed="state.color === color.value" @click="update({ color: color.value })" />
      </div>
    </fieldset>
    <Switch :model-value="state.vibrant" label="Vibrant" help="Activado: acento más vivo. Desactivado: colores más suaves y apagados." @update:model-value="update({ vibrant: $event })" />
    <Switch :model-value="state.monochrome" label="Monochrome" help="Activado: fondos neutros. Desactivado: fondos con un tinte suave del color elegido." @update:model-value="update({ monochrome: $event })" />
    <Button variant="outline-secondary" size="sm" @click="reset">Restablecer apariencia</Button>
  </section>
</template>

<style>
.ui-theme-color { width: 2rem; height: 2rem; flex-shrink: 0; background-color: var(--ui-theme-swatch) !important; border: 1px solid var(--bs-border-color); }
.ui-theme-color[aria-pressed='true'] { outline: 2px solid var(--bs-emphasis-color); outline-offset: 2px; }
.ui-theme-color:focus-visible { box-shadow: 0 0 0 .25rem rgba(var(--bs-primary-rgb), .35); }
.ui-theme-mode { width: 2.5rem; height: 2.5rem; }
</style>
