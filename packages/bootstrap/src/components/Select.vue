<script setup>
import FormField from './FormField.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: [String, Number], id: String, label: String, options: { type: Array, default: () => [] }, placeholder: String,
  help: String, tooltip: String, error: [String, Boolean], disabled: Boolean, required: Boolean
})
const emit = defineEmits(['update:modelValue', 'change'])
function update(event) { emit('update:modelValue', event.target.value); emit('change', event) }
</script>

<template>
  <FormField v-bind="props" v-slot="field">
    <select v-bind="$attrs" :id="field.inputId" class="form-select" :class="{ 'is-invalid': error }" :value="modelValue"
      :disabled="disabled" :required="required" :aria-invalid="error ? 'true' : undefined" :aria-describedby="field.describedBy" @change="update">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      <slot />
    </select>
  </FormField>
</template>
