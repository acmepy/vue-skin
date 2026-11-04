<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { Button } from './basic.js'
const props = defineProps({ label: String, items: { type: Array, default: () => [] }, variant: { default: 'primary' }, size: String, align: { default: 'start' }, disabled: Boolean })
const emit = defineEmits(['select','show','shown','hide','hidden'])
const open = ref(false), root = ref(), trigger = ref()
const id = useId()
watch(open, async value => { emit(value ? 'show' : 'hide'); await nextTick(); emit(value ? 'shown' : 'hidden') })
const outside = event => { if (!root.value?.contains(event.target)) open.value = false }
function choose(item) { if (props.disabled || item.disabled) return; emit('select', item); open.value = false; trigger.value?.$el?.focus() }
watch(() => props.disabled, value => { if (value) open.value = false })
async function keydown(event) {
  if (event.key === 'Escape' && open.value) { event.preventDefault(); open.value = false; trigger.value?.$el?.focus(); return }
  if (event.key === 'Tab') { open.value = false; return }
  if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key) || props.disabled) return
  event.preventDefault(); open.value = true; await nextTick()
  const nodes = [...root.value.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')]
  const index = nodes.indexOf(document.activeElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? nodes.length - 1 : index < 0 ? (event.key === 'ArrowUp' ? nodes.length - 1 : 0) : (index + (event.key === 'ArrowUp' ? -1 : 1) + nodes.length) % nodes.length
  nodes[next]?.focus()
}
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>
<template><div ref="root" class="dropdown sl-dropdown" @keydown="keydown"><Button ref="trigger" :variant="variant" :size="size" :disabled="disabled" aria-haspopup="menu" :aria-controls="id" :aria-expanded="open" @click="open = !open">{{ label }}</Button><div v-if="open" data-popover aria-hidden="false" class="sl-dropdown-popover" :style="align === 'end' ? { right: 0, left: 'auto' } : undefined"><div :id="id" role="menu"><component v-for="(item,index) in items" :key="index" :is="item.href ? 'a' : 'button'" :href="item.disabled ? undefined : item.href" :type="item.href ? undefined : 'button'" role="menuitem" :aria-disabled="item.disabled || undefined" :disabled="item.disabled" :tabindex="item.disabled ? -1 : 0" @click="item.disabled ? $event.preventDefault() : choose(item)">{{ item.label }}</component></div></div></div></template>
