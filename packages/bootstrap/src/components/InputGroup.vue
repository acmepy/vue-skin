<script setup>
import { computed, ref } from 'vue'
import FormField from './FormField.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({ modelValue: [String, Number], id: String, label: String, type: { type: String, default: 'text' }, name: String, placeholder: String, prefix: String, suffix: String, help: String, tooltip: String, error: [String, Boolean], validator: Function, disabled: Boolean, readonly: Boolean, required: Boolean, autocomplete: String })
const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur'])
const validationError = ref('')
const displayedError = computed(() => props.error || validationError.value)
let validationRun = 0
async function validate() {
  if (!props.validator) return !displayedError.value
  const run = ++validationRun
  try { const result = await props.validator(props.modelValue); if (run === validationRun) validationError.value = result === false ? 'Valor inválido' : typeof result === 'string' ? result : '' }
  catch (error) { if (run === validationRun) validationError.value = error?.message || 'Valor inválido' }
  return !validationError.value
}
function update(event) { validationError.value = ''; emit('update:modelValue', props.type === 'number' && event.target.value !== '' ? event.target.valueAsNumber : event.target.value); emit('input', event) }
defineExpose({ validate })
</script>

<template>
  <FormField :id="id" :label="label" :help="help" :tooltip="tooltip" :error="displayedError" v-slot="field">
    <div class="input-group">
      <span v-if="prefix" class="input-group-text">{{ prefix }}</span><slot name="prefix" />
      <input v-bind="$attrs" :id="field.inputId" class="form-control" :class="{ 'is-invalid': displayedError }" :type="type" :name="name" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :required="required" :autocomplete="autocomplete" :aria-invalid="displayedError ? 'true' : undefined" :aria-describedby="field.describedBy" @input="update" @change="emit('change', $event)" @focus="emit('focus', $event)" @blur="validate(); emit('blur', $event)" />
      <span v-if="suffix" class="input-group-text">{{ suffix }}</span><slot name="suffix" />
    </div>
  </FormField>
</template>
