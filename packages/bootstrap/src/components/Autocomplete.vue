<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import FormField from './FormField.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: '' },
  data: { type: Array, default: () => [] },
  minLength: { type: Number, default: 2 },
  requireMatch: { type: Boolean, default: true },
  id: String, name: String, label: String, placeholder: String, help: String,
  tooltip: String, error: [String, Boolean], validator: Function,
  disabled: Boolean, readonly: Boolean, required: Boolean,
  autocomplete: { type: String, default: 'off' }
})
const emit = defineEmits(['update:modelValue', 'select', 'input', 'change', 'focus', 'blur'])
const text = ref(props.modelValue)
const focused = ref(false)
const requested = ref(false)
const composing = ref(false)
const activeIndex = ref(-1)
const validationError = ref('')
const displayedError = computed(() => props.error || validationError.value)
const listId = `vue-skin-autocomplete-${useId()}`
const optionId = (index) => `${listId}-${index}`
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const itemLabel = (item) => typeof item === 'string' ? item : String(item?.label ?? '')
const threshold = computed(() => Number.isFinite(props.minLength) ? Math.max(0, Math.floor(props.minLength)) : 2)
const eligible = computed(() => !props.disabled && !props.readonly && !composing.value && text.value.trim().length >= threshold.value)
const matches = computed(() => {
  if (!eligible.value) return []
  const query = normalize(text.value.trim())
  return props.data.map((item, index) => ({ item, index, label: itemLabel(item) }))
    .filter((entry) => normalize(entry.label).includes(query))
})
const expanded = computed(() => focused.value && requested.value && eligible.value)
let validationRun = 0
watch(() => props.modelValue, (value) => {
  ++validationRun
  validationError.value = ''
  text.value = value ?? ''
})
watch(matches, () => { activeIndex.value = -1 })
watch(activeIndex, async (index) => {
  if (index < 0) return
  await nextTick()
  document.getElementById(optionId(index))?.scrollIntoView?.({ block: 'nearest' })
})

async function validate() {
  const run = ++validationRun
  const value = text.value.trim()
  const exists = props.data.some((item) => normalize(itemLabel(item).trim()) === normalize(value))
  validationError.value = !value && props.required
    ? 'Este campo es obligatorio.'
    : value && props.requireMatch && !exists
      ? 'Seleccione una opción de la lista.'
      : ''
  if (validationError.value) return false
  if (!props.validator) return !displayedError.value
  try {
    const result = await props.validator(text.value)
    if (run !== validationRun) return !displayedError.value
    validationError.value = result === false ? 'Valor inválido' : typeof result === 'string' ? result : ''
  } catch (error) {
    if (run === validationRun) validationError.value = error?.message || 'Valor inválido'
  }
  return !displayedError.value
}
function update(event) {
  ++validationRun
  validationError.value = ''
  text.value = event.target.value
  requested.value = true
  emit('update:modelValue', text.value)
  emit('input', event)
}
function select(entry) {
  if (props.disabled || props.readonly) return
  ++validationRun
  validationError.value = ''
  text.value = entry.label
  requested.value = false
  activeIndex.value = -1
  emit('update:modelValue', entry.label)
  emit('select', entry.item)
}
function focus(event) { focused.value = true; requested.value = true; emit('focus', event) }
function blur(event) {
  focused.value = false
  requested.value = false
  activeIndex.value = -1
  validate()
  emit('blur', event)
}
function keydown(event) {
  if (event.isComposing || composing.value || !eligible.value) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!matches.value.length) return
    event.preventDefault()
    const wasOpen = expanded.value
    requested.value = true
    const count = matches.value.length
    activeIndex.value = !wasOpen || activeIndex.value < 0
      ? event.key === 'ArrowDown' ? 0 : count - 1
      : (activeIndex.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count
  } else if (event.key === 'Enter' && expanded.value && activeIndex.value >= 0) {
    event.preventDefault()
    select(matches.value[activeIndex.value])
  } else if (event.key === 'Escape' && expanded.value) {
    event.preventDefault()
    event.stopPropagation()
    requested.value = false
    activeIndex.value = -1
  } else if (event.key === 'Tab') {
    requested.value = false
    activeIndex.value = -1
  }
}
onBeforeUnmount(() => { ++validationRun })
defineExpose({ validate })
</script>

<template>
  <FormField v-bind="props" :error="displayedError" v-slot="field">
    <div class="position-relative">
      <input v-bind="$attrs" :id="field.inputId" class="form-control" :class="{ 'is-invalid': displayedError }" type="text"
        :value="text" :name="name" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :required="required" :autocomplete="autocomplete"
        role="combobox" aria-autocomplete="list" aria-haspopup="listbox" :aria-expanded="expanded" :aria-controls="expanded ? listId : undefined"
        :aria-activedescendant="expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :aria-invalid="displayedError ? 'true' : undefined" :aria-describedby="field.describedBy"
        @input="update" @change="emit('change', $event)" @focus="focus" @blur="blur" @keydown="keydown"
        @compositionstart="composing = true" @compositionend="composing = false">
      <div v-if="expanded" class="ui-autocomplete-menu dropdown-menu show w-100 top-100 start-0 mt-1" @pointerdown.prevent @mousedown.prevent>
        <ul :id="listId" role="listbox" :aria-label="label || 'Sugerencias'" class="list-unstyled mb-0">
          <li v-for="(entry, index) in matches" :id="optionId(index)" :key="entry.index" role="option" :aria-selected="index === activeIndex"
            class="dropdown-item" :class="{ active: index === activeIndex }" @click="select(entry)">{{ entry.label }}</li>
        </ul>
        <div v-if="!matches.length" role="status" class="px-3 py-1 text-body-secondary">Sin resultados</div>
      </div>
    </div>
  </FormField>
</template>

<style scoped>
.ui-autocomplete-menu { max-height: 16rem; overflow-y: auto; }
.ui-autocomplete-menu .dropdown-item { cursor: pointer; white-space: normal; overflow-wrap: anywhere; }
</style>
