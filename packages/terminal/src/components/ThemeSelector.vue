<script setup>
import { onMounted, ref, useId, watch } from 'vue'
import { UiIcon, useTheme } from '@vue-skin/core'
import { Button } from './basic.js'
import Modal from './Modal.vue'
import ThemeSelectorPanel from './ThemeSelectorPanel.vue'

const props = defineProps({ modelValue: Object, inline: Boolean, label: { type: String, default: 'Apariencia' } })
const emit = defineEmits(['update:modelValue', 'change'])
const theme = useTheme()
const open = ref(false)
const mounted = ref(false)
const trigger = ref()
const id = useId()
watch(() => props.modelValue, value => { if (value) theme.setTheme(value, false) }, { immediate: true, deep: true })
watch(() => ({ ...theme.state }), value => emit('update:modelValue', value), { flush: 'sync' })
onMounted(() => emit('update:modelValue', { ...theme.state }))
function show() { mounted.value = true; open.value = true }
function closed() { mounted.value = false; trigger.value?.$el?.focus() }
</script>
<template>
<div class="tc-theme-selector"><ThemeSelectorPanel v-if="inline" @change="emit('change',$event)" /><template v-else><Button ref="trigger" variant="outline-secondary" class="tc-square-button" :title="label" :aria-label="label" aria-haspopup="dialog" :aria-expanded="open" :aria-controls="id + '-modal'" @click="show"><UiIcon name="mdi:palette-outline" size="16" /></Button><Modal v-if="mounted" :id="id + '-modal'" v-model="open" :title="label" :aria-labelledby="id + '-title'" size="sm" centered @closed="closed"><template #header><h2 :id="id + '-title'">{{ label }}</h2></template><ThemeSelectorPanel @change="emit('change',$event)" /></Modal></template></div>
</template>
