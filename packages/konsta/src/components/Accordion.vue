<script setup>
import { useId } from 'vue'
const props = defineProps({ modelValue: [String, Number], items: { type: Array, default: () => [] }, flush: Boolean })
const emit = defineEmits(['update:modelValue'])
const id = useId()
function toggle(item, event) { if (event.target.open && props.modelValue !== item.id) emit('update:modelValue', item.id); else if (!event.target.open && props.modelValue === item.id) emit('update:modelValue', null) }
</script>
<template><div class="accordion ks-accordion" :class="{ 'ks-accordion-flush': flush }"><details v-for="item in items" :key="item.id" :open="modelValue === item.id" @toggle="toggle(item,$event)"><summary :aria-disabled="item.disabled || undefined" :aria-controls="id + '-' + item.id" @click="item.disabled && $event.preventDefault()">{{ item.title }}</summary><section :id="id + '-' + item.id">{{ item.content }}</section></details></div></template>
