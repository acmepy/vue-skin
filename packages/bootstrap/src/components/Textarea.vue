<script setup>
import FormField from './FormField.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: String, id: String, label: String, name: String, placeholder: String, help: String, tooltip: String,
  error: [String, Boolean], disabled: Boolean, readonly: Boolean, required: Boolean, rows: { type: [String, Number], default: 3 }, maxlength: [String, Number]
})
const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur'])
function update(event) { emit('update:modelValue', event.target.value); emit('input', event) }
</script>

<template>
  <FormField v-bind="props" v-slot="field">
    <textarea v-bind="$attrs" :id="field.inputId" class="form-control" :class="{ 'is-invalid': error }" :name="name"
      :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :required="required"
      :rows="rows" :maxlength="maxlength" :aria-invalid="error ? 'true' : undefined" :aria-describedby="field.describedBy"
      @input="update" @change="emit('change', $event)" @focus="emit('focus', $event)" @blur="emit('blur', $event)" />
  </FormField>
</template>
