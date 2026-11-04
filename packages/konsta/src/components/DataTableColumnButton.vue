<script setup>
import { UiIcon } from '@vue-skin/core'
import { Button, ButtonGroup, Link, variant as buttonVariant } from './basic.js'
defineProps({ items: { type: Array, default: () => [] }, size: { default: 'sm' }, variant: { default: 'outline-secondary' } })
const emit = defineEmits(['select'])
</script>
<template><ButtonGroup :size="size" label="Acciones de fila"><component v-for="(item,index) in items" :key="index" :is="item.link ? Link : Button" :href="item.link" :disabled="item.disabled" :variant="item.variant || variant" :size="size" :class="item.link ? 'ks-button' : undefined" :data-variant="item.link ? buttonVariant(item.variant || variant) : undefined" :title="item.label" :aria-label="item.label" @click="!item.disabled && !item.link && emit('select',item)"><UiIcon v-if="item.icon" :name="item.icon" size="sm" /><span v-else>{{ item.label }}</span></component></ButtonGroup></template>
