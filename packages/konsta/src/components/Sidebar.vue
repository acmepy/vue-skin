<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps({ modelValue: Boolean, position: { default: 'start' }, width: String, breakpoint: { default: 'lg' } })
const emit = defineEmits(['update:modelValue', 'open', 'close'])
const panel = ref()
const overlay = ref(false)
let media
let focusBefore
let overflowBefore
const close = () => emit('update:modelValue', false)
const mediaChanged = () => { overlay.value = !media.matches }
function unlock() { if (overflowBefore !== undefined) { document.body.style.overflow = overflowBefore; overflowBefore = undefined } }
watch(() => [props.modelValue, overlay.value], async ([open, mobile], [wasOpen] = []) => {
  unlock()
  if (open !== wasOpen) emit(open ? 'open' : 'close')
  if (open && mobile) {
    overflowBefore = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusBefore = document.activeElement
    await nextTick()
    panel.value?.focus()
  } else if (!open) focusBefore?.focus?.()
})
function keydown(event) {
  if (!overlay.value || !props.modelValue) return
  if (event.key === 'Escape') { event.preventDefault(); close() }
  if (event.key !== 'Tab') return
  const nodes = [...panel.value.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(node => !node.closest('[hidden]') && !node.closest('[style*="display: none"]'))
  const first = nodes[0], last = nodes.at(-1)
  if (!first) { event.preventDefault(); panel.value.focus() }
  else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.value)) { event.preventDefault(); first.focus() }
}
onMounted(() => { media = window.matchMedia?.('(min-width: ' + ({ sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 }[props.breakpoint] ?? 992) + 'px)') ?? { matches: true }; mediaChanged(); media.addEventListener?.('change', mediaChanged) })
onBeforeUnmount(() => { media?.removeEventListener?.('change', mediaChanged); unlock() })
</script>
<template>
  <aside v-show="modelValue" class="sidebar ks-sidebar ui-sidebar" data-sidebar-initialized :data-side="position === 'end' ? 'right' : 'left'" :class="{ 'ks-sidebar-overlay': overlay }" :style="{ '--ks-sidebar-width': width || '15rem' }" :aria-hidden="!modelValue" @click.self="overlay && close()" @keydown="keydown">
    <nav ref="panel" tabindex="-1" :role="overlay ? 'dialog' : undefined" :aria-modal="overlay || undefined" aria-label="Navegación">
      <header v-if="$slots.header" class="ui-sidebar-header"><slot name="header" /></header>
      <section class="ks-sidebar-body"><slot /></section><footer v-if="$slots.footer"><slot name="footer" /></footer>
    </nav>
  </aside>
</template>
