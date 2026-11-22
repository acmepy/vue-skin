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
  <nav ref="root" class="ks-stepper" :data-orientation="orientation" :aria-label="label">
    <ol class="ks-stepper-list">
      <li v-for="(item,index) in items" :key="item.id" class="ks-stepper-item" :class="{ 'is-active': index === activeIndex, 'is-complete': completed(index), 'is-disabled': item.disabled || disabled }">
        <button type="button" class="ks-stepper-button" :disabled="blocked(index)" :aria-current="index === activeIndex ? 'step' : undefined" :aria-label="item.label + ', etapa ' + (index + 1) + ' de ' + items.length + (completed(index) ? ', completada' : '')" @click="select(item,index)" @keydown="move($event,index)">
          <span class="ks-stepper-marker" aria-hidden="true"><slot name="marker" :item="item" :index="index" :active="index === activeIndex" :completed="completed(index)">{{ completed(index) ? '✓' : index + 1 }}</slot></span>
          <span class="ks-stepper-content"><slot name="item" :item="item" :index="index" :active="index === activeIndex" :completed="completed(index)"><span class="ks-stepper-label">{{ item.label }}</span><span v-if="item.description" class="ks-stepper-description">{{ item.description }}</span></slot></span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style>
.ks-stepper { --step-accent:var(--primary); --step-border:var(--border); --step-muted:var(--muted-foreground); --step-on-accent:var(--primary-foreground); min-width:0; }
.ks-stepper-list { display:flex; list-style:none; padding:0; margin:0; gap:0; }
.ks-stepper-item { position:relative; flex:1; min-width:0; }
.ks-stepper-item:not(:last-child)::after { content:""; position:absolute; top:1rem; inset-inline-start:calc(50% + 1.25rem); width:calc(100% - 2.5rem); height:1px; background:var(--step-border); }
.ks-stepper-item.is-complete::after { background:var(--step-accent); }
.ks-stepper-button { display:flex; flex-direction:column; align-items:center; gap:.65rem; width:100%; padding:0 .5rem; border:0; background:transparent; color:var(--step-muted); font:inherit; text-align:center; cursor:pointer; }
.ks-stepper .ks-stepper-button:disabled { opacity:1; cursor:default; }
.ks-stepper-item.is-disabled { opacity:.5; }
.ks-stepper-button:focus-visible { outline:2px solid var(--step-accent); outline-offset:4px; border-radius:.25rem; }
.ks-stepper-marker { display:flex; flex-shrink:0; align-items:center; justify-content:center; width:2rem; height:2rem; border:1px solid var(--step-border); border-radius:50%; font-size:.8rem; font-weight:600; }
.ks-stepper-item.is-active .ks-stepper-marker { color:var(--step-accent); border:2px solid var(--step-accent); box-shadow:0 0 0 3px color-mix(in srgb,var(--step-accent) 12%,transparent); }
.ks-stepper-item.is-complete .ks-stepper-marker { background:var(--step-accent); border-color:var(--step-accent); color:var(--step-on-accent); }
.ks-stepper-item.is-active .ks-stepper-label { color:var(--step-accent); }
.ks-stepper-label,.ks-stepper-description { display:block; overflow-wrap:anywhere; }
.ks-stepper-label { font-size:.875rem; font-weight:600; }
.ks-stepper-description { font-size:.75rem; margin-top:.2rem; color:var(--step-muted); }
.ks-stepper[data-orientation=vertical] .ks-stepper-list { flex-direction:column; }
.ks-stepper[data-orientation=vertical] .ks-stepper-button { flex-direction:row; text-align:start; align-items:start; gap:.75rem; padding:0 0 1.5rem; }
.ks-stepper[data-orientation=vertical] .ks-stepper-content { padding-top:.3rem; }
.ks-stepper[data-orientation=vertical] .ks-stepper-item:not(:last-child)::after { top:2.25rem; inset-inline-start:1rem; width:1px; height:calc(100% - 2.5rem); }
.ks-stepper[data-orientation=vertical] .ks-stepper-item:last-child .ks-stepper-button { padding-bottom:0; }
</style>
