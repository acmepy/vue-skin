<script setup>
import { UiIcon, useTheme } from '@vue-skin/core'
import Switch from './Switch.vue'
import { Button } from './basic.js'

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
<section class="sl-theme-panel">
<fieldset><legend>Apariencia</legend><div class="sl-theme-options" role="group" aria-label="Apariencia"><button v-for="mode in modes" :key="mode.value" class="sl-button sl-square-button" data-variant="outline" type="button" :title="mode.label" :aria-label="mode.label" :aria-pressed="state.mode === mode.value" @click="update({ mode: mode.value })"><UiIcon v-if="mode.value === 'light'" name="mdi:weather-sunny" size="20" /><UiIcon v-else-if="mode.value === 'dark'" name="mdi:weather-night" size="20" /><UiIcon v-else name="mdi:circle-half-full" size="20" /></button></div></fieldset>
<fieldset><legend>Color de acento</legend><div class="sl-theme-options"><button v-for="color in theme.colors" :key="color.value" type="button" class="sl-theme-swatch" :style="{ backgroundColor: color.color }" :title="color.label" :aria-label="color.label" :aria-pressed="state.color === color.value" @click="update({ color: color.value })" /></div></fieldset>
<Switch :model-value="state.vibrant" label="Vibrant" help="Acentos más vivos al activar, más suaves al desactivar." @update:model-value="update({ vibrant: $event })" />
<Switch :model-value="state.monochrome" label="Monochrome" help="Fondos neutros al activar; teñidos del acento al desactivar." @update:model-value="update({ monochrome: $event })" />
<Button variant="outline-secondary" size="sm" @click="reset">Restablecer apariencia</Button>
</section>
</template>
