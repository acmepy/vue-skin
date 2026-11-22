<script setup>
import { ref } from 'vue'
import { useStepState } from '@vue-skin/core'

const props = defineProps({
  modelValue: [String, Number], items: { type: Array, default: () => [] },
  orientation: { type: String, default: 'horizontal' },
  linear: Boolean, readonly: Boolean, disabled: Boolean,
  label: { type: String, default: 'Etapas' }
})
const emit = defineEmits(['update:modelValue', 'change'])
const root = ref()
const { activeIndex, completed } = useStepState(props)
const blocked = index => props.disabled || props.readonly || props.items[index].disabled || (props.linear && index > activeIndex.value)
function select(item, index) {
  if (blocked(index) || index === activeIndex.value) return
  emit('update:modelValue', item.id)
  emit('change', item)
}
function move(event, index) {
  const forward = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  const backward = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  if (![forward, backward, 'Home', 'End'].includes(event.key)) return
  const allowed = props.items.map((_, i) => i).filter(i => !blocked(i))
  if (!allowed.length) return
  event.preventDefault()
  const position = allowed.indexOf(index)
  const next = event.key === 'Home' ? allowed[0] : event.key === 'End' ? allowed.at(-1) : allowed[(position + (event.key === forward ? 1 : -1) + allowed.length) % allowed.length]
  root.value.querySelectorAll('button')[next]?.focus()
}
</script>

<template>
  <nav ref="root" class="bc-stepper" :data-orientation="orientation" :aria-label="label">
    <ol class="bc-stepper-list">
      <li v-for="(item,index) in items" :key="item.id" class="bc-stepper-item" :class="{ 'is-active': index === activeIndex, 'is-complete': completed(index), 'is-disabled': item.disabled || disabled }">
        <button type="button" class="bc-stepper-button" :disabled="blocked(index)" :aria-current="index === activeIndex ? 'step' : undefined" :aria-label="item.label + ', etapa ' + (index + 1) + ' de ' + items.length + (completed(index) ? ', completada' : '')" @click="select(item,index)" @keydown="move($event,index)">
          <span class="bc-stepper-marker" aria-hidden="true"><slot name="marker" :item="item" :index="index" :active="index === activeIndex" :completed="completed(index)">{{ completed(index) ? '✓' : index + 1 }}</slot></span>
          <span class="bc-stepper-content"><slot name="item" :item="item" :index="index" :active="index === activeIndex" :completed="completed(index)"><span class="bc-stepper-label">{{ item.label }}</span><span v-if="item.description" class="bc-stepper-description">{{ item.description }}</span></slot></span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style>
.bc-stepper { --step-accent:var(--primary); --step-border:var(--border); --step-muted:var(--muted-foreground); --step-on-accent:var(--primary-foreground); min-width:0; }
.bc-stepper-list { display:flex; list-style:none; padding:0; margin:0; gap:0; }
.bc-stepper-item { position:relative; flex:1; min-width:0; }
.bc-stepper-item:not(:last-child)::after { content:""; position:absolute; top:1rem; inset-inline-start:calc(50% + 1.25rem); width:calc(100% - 2.5rem); height:1px; background:var(--step-border); }
.bc-stepper-item.is-complete::after { background:var(--step-accent); }
.bc-stepper-button { display:flex; flex-direction:column; align-items:center; gap:.65rem; width:100%; padding:0 .5rem; border:0; background:transparent; color:var(--step-muted); font:inherit; text-align:center; cursor:pointer; }
.bc-stepper .bc-stepper-button:disabled { opacity:1; cursor:default; }
.bc-stepper-item.is-disabled { opacity:.5; }
.bc-stepper-button:focus-visible { outline:2px solid var(--step-accent); outline-offset:4px; border-radius:.25rem; }
.bc-stepper-marker { display:flex; flex-shrink:0; align-items:center; justify-content:center; width:2rem; height:2rem; border:1px solid var(--step-border); border-radius:50%; font-size:.8rem; font-weight:600; }
.bc-stepper-item.is-active .bc-stepper-marker { color:var(--step-accent); border:2px solid var(--step-accent); box-shadow:0 0 0 3px color-mix(in srgb,var(--step-accent) 12%,transparent); }
.bc-stepper-item.is-complete .bc-stepper-marker { background:var(--step-accent); border-color:var(--step-accent); color:var(--step-on-accent); }
.bc-stepper-item.is-active .bc-stepper-label { color:var(--step-accent); }
.bc-stepper-label,.bc-stepper-description { display:block; overflow-wrap:anywhere; }
.bc-stepper-label { font-size:.875rem; font-weight:600; }
.bc-stepper-description { font-size:.75rem; margin-top:.2rem; color:var(--step-muted); }
.bc-stepper[data-orientation=vertical] .bc-stepper-list { flex-direction:column; }
.bc-stepper[data-orientation=vertical] .bc-stepper-button { flex-direction:row; text-align:start; align-items:start; gap:.75rem; padding:0 0 1.5rem; }
.bc-stepper[data-orientation=vertical] .bc-stepper-content { padding-top:.3rem; }
.bc-stepper[data-orientation=vertical] .bc-stepper-item:not(:last-child)::after { top:2.25rem; inset-inline-start:1rem; width:1px; height:calc(100% - 2.5rem); }
.bc-stepper[data-orientation=vertical] .bc-stepper-item:last-child .bc-stepper-button { padding-bottom:0; }
</style>
