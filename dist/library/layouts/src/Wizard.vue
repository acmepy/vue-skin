<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useStepState } from '../../core/src/index.js'

const props = defineProps({
  modelValue: [String, Number], items: { type:Array, default:()=>[] },
  title:String, orientation:{type:String,default:'horizontal'},
  linear:{type:Boolean,default:true}, disabled:Boolean, beforeChange:Function,
  cancelable:{type:Boolean,default:true}, cancelText:{type:String,default:'Cancelar'},
  backText:{type:String,default:'Anterior'}, nextText:{type:String,default:'Siguiente'},
  finishText:{type:String,default:'Finalizar'}
})
const emit = defineEmits(['update:modelValue','change','finish','cancel','invalid'])
const selected = ref(props.modelValue)
const busy = ref(false)
const finished = ref(false)
const error = ref('')
const panel = ref()
const id = useId()
let run = 0
const { activeIndex, current } = useStepState({ get items() { return props.items }, get modelValue() { return selected.value } })
const previousIndex = computed(() => props.items.map((item,index)=>({item,index})).filter(entry=>!entry.item.disabled && entry.index < activeIndex.value).at(-1)?.index ?? -1)
const nextIndex = computed(() => props.items.findIndex((item,index)=>!item.disabled && index > activeIndex.value))
const isFirst = computed(() => previousIndex.value < 0)
const isLast = computed(() => activeIndex.value >= 0 && nextIndex.value < 0)
const stepperItems = computed(() => props.items.map(item => ({ ...item, completed:finished.value && !item.disabled ? true : item.completed })))
const scope = computed(() => ({ item:current.value, index:activeIndex.value, busy:busy.value, isFirst:isFirst.value, isLast:isLast.value, next, back, goTo, finish, cancel, reset }))

watch(() => props.modelValue, value => {
  if (selected.value === value) return
  ++run; busy.value = false; finished.value = false; error.value = ''; selected.value = value
})
watch(() => props.items, () => { ++run; busy.value = false; finished.value = false; error.value = '' }, { deep:true })
onBeforeUnmount(() => { ++run })

async function navigate(index, direction) {
  if (busy.value || props.disabled || finished.value || !current.value) return false
  const target = direction === 'finish' ? null : props.items[index]
  if (direction !== 'finish' && (!target || target.disabled)) return false
  if (direction === 'step' && props.linear && index > activeIndex.value) return false
  if (direction !== 'finish' && index === activeIndex.value) return true
  if (direction === 'finish' && !isLast.value) return false
  const context = { from:current.value, to:target, fromIndex:activeIndex.value, toIndex:target ? index : null, direction }
  const request = ++run
  error.value = ''
  busy.value = true
  try {
    const result = await props.beforeChange?.(context)
    if (request !== run || props.disabled || current.value?.id !== context.from.id) return false
    if (result === false || typeof result === 'string') {
      error.value = typeof result === 'string' ? result : ''
      emit('invalid', { ...context, message:error.value })
      return false
    }
    if (direction === 'finish') {
      finished.value = true
      emit('finish', context)
    } else {
      selected.value = target.id
      emit('update:modelValue', target.id)
      emit('change', context)
    }
    await nextTick()
    if (request === run) panel.value?.focus({ preventScroll:true })
    return true
  } catch (cause) {
    if (request !== run) return false
    error.value = cause?.message || 'No se pudo completar la etapa.'
    emit('invalid', { ...context, message:error.value })
    return false
  } finally {
    if (request === run) busy.value = false
  }
}
function next() { return isLast.value ? finish() : navigate(nextIndex.value,'next') }
function back() { return navigate(previousIndex.value,'back') }
function goTo(value) { return navigate(props.items.findIndex(item=>item.id === value),'step') }
function finish() { return navigate(activeIndex.value,'finish') }
function cancel() { if (!busy.value && !props.disabled) emit('cancel', { item:current.value, index:activeIndex.value }) }
function reset() {
  ++run; busy.value = false; finished.value = false; error.value = ''
  selected.value = props.items.find(item=>!item.disabled)?.id
  if (selected.value !== undefined) emit('update:modelValue', selected.value)
}
defineExpose({ next, back, goTo, finish, reset })
</script>

<template>
  <section class="ui-wizard" :data-orientation="orientation" :aria-label="title || 'Asistente por etapas'" :aria-busy="busy">
    <h2 v-if="title" class="ui-wizard-title">{{ title }}</h2>
    <div class="ui-wizard-workspace">
      <UiStepper class="ui-wizard-steps" :model-value="current?.id" :items="stepperItems" :orientation="orientation" :linear="linear" :disabled="disabled || busy || finished" @update:model-value="goTo">
        <template v-if="$slots.step" #item="step"><slot name="step" v-bind="step" /></template>
      </UiStepper>
      <div :id="id + '-panel'" ref="panel" class="ui-wizard-content" tabindex="-1" role="region" :aria-label="finished ? 'Proceso completado' : (current?.label || 'Contenido de la etapa')">
        <slot v-if="finished" name="complete" v-bind="scope"><p role="status">Proceso completado.</p></slot>
        <slot v-else name="panel" v-bind="scope"><slot v-bind="scope" /></slot>
        <p v-if="error" class="ui-wizard-error" role="alert">{{ error }}</p>
      </div>
    </div>
    <footer v-if="!finished" class="ui-wizard-actions">
      <slot name="actions" v-bind="scope">
        <UiButton v-if="cancelable" variant="link" :disabled="disabled || busy" @click="cancel">{{ cancelText }}</UiButton>
        <UiButtonGroup class="ui-wizard-controls" label="Navegación entre etapas">
          <UiButton variant="outline-secondary" :disabled="disabled || busy || isFirst" @click="back">{{ backText }}</UiButton>
          <UiButton :disabled="disabled || busy || !current" :loading="busy" @click="next">{{ isLast ? finishText : nextText }}</UiButton>
        </UiButtonGroup>
      </slot>
    </footer>
  </section>
</template>

<style>
.ui-wizard { min-width:0; }
.ui-wizard-title { font-size:1.1rem; font-weight:600; margin:0 0 1.5rem; }
.ui-wizard-workspace { display:grid; gap:2rem; }
.ui-wizard-content { min-width:0; min-height:10rem; outline:none; }
.ui-wizard-content:focus-visible { outline:2px solid var(--bs-primary,var(--primary,#0d6efd)); outline-offset:.5rem; border-radius:.25rem; }
.ui-wizard-actions { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-top:2rem; }
.ui-wizard-controls { margin-inline-start:auto; }
.ui-wizard-error { color:var(--bs-danger,var(--destructive,#b91c1c)); margin-top:1rem; font-size:.875rem; }
.ui-wizard[data-orientation=vertical] .ui-wizard-workspace { grid-template-columns:minmax(10rem,14rem) minmax(0,1fr); }
@media(max-width:639px) { .ui-wizard[data-orientation=vertical] .ui-wizard-workspace { grid-template-columns:minmax(0,1fr); } }
</style>
