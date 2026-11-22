<script setup>
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { Button } from './basic.js'

const props = defineProps({ label: String, items: { type: Array, default: () => [] }, variant: { default: 'primary' }, size: String, align: { default: 'start' }, disabled: Boolean })
const emit = defineEmits(['select', 'show', 'shown', 'hide', 'hidden'])
const id = useId()
const root = ref()
const trigger = ref()
const menu = ref()
const open = ref(false)
let disposed = false
const close = () => { open.value = false }
const focusTrigger = () => trigger.value?.$el?.focus()
function outside(event) { if (!root.value?.contains(event.target)) close() }
function toggle() { if (!props.disabled) open.value = !open.value }
watch(open, async value => {
  document[value ? 'addEventListener' : 'removeEventListener']('pointerdown', outside)
  emit(value ? 'show' : 'hide')
  await nextTick()
  if (!disposed && open.value === value) emit(value ? 'shown' : 'hidden')
})
watch(() => props.disabled, value => { if (value) close() })
function choose(item) {
  if (props.disabled || item.disabled) return
  emit('select', item)
  close()
  focusTrigger()
}
async function keydown(event) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    event.stopPropagation()
    close()
    focusTrigger()
    return
  }
  if (event.key === 'Tab') { if (open.value) focusTrigger(); close(); return }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || props.disabled) return
  event.preventDefault()
  open.value = true
  await nextTick()
  if (disposed || !open.value) return
  const nodes = [...menu.value.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')]
  if (!nodes.length) return
  const index = nodes.indexOf(document.activeElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? nodes.length - 1 : index < 0 ? (event.key === 'ArrowUp' ? nodes.length - 1 : 0) : (index + (event.key === 'ArrowUp' ? -1 : 1) + nodes.length) % nodes.length
  nodes[next]?.focus()
}
onBeforeUnmount(() => { disposed = true; document.removeEventListener('pointerdown', outside) })
</script>

<template>
  <div ref="root" class="sl-dropdown" :data-align="align" @keydown="keydown">
    <Button ref="trigger" :variant="variant" :size="size" :disabled="disabled" aria-haspopup="menu" :aria-controls="open ? id : undefined" :aria-expanded="open" @click="toggle">{{ label }}</Button>
    <div v-if="open" ref="menu" :id="id" role="menu" class="sl-dropdown-popover">
      <component v-for="(item, index) in items" :key="index" :is="item.href ? 'a' : 'button'" :href="item.disabled ? undefined : item.href" :type="item.href ? undefined : 'button'" role="menuitem" :aria-disabled="item.disabled || undefined" :disabled="item.disabled" :tabindex="item.disabled ? -1 : 0" @click="item.disabled ? $event.preventDefault() : choose(item)">{{ item.label }}</component>
    </div>
  </div>
</template>
