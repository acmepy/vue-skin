<script setup>
import FormField from './FormField.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: [String, Number], id: String, label: String, type: { type: String, default: 'text' }, name: String,
  placeholder: String, help: String, tooltip: String, error: [String, Boolean], disabled: Boolean,
  readonly: Boolean, required: Boolean, autocomplete: String
})
const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur'])
function update(event) { emit('update:modelValue', event.target.value); emit('input', event) }
</script>

<template>
  <FormField v-bind="props" v-slot="field">
    <input v-bind="$attrs" :id="field.inputId" class="form-control" :class="{ 'is-invalid': error }" :type="type"
      :name="name" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
      :required="required" :autocomplete="autocomplete" :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="field.describedBy" @input="update" @change="emit('change', $event)"
      @focus="emit('focus', $event)" @blur="emit('blur', $event)" />
  </FormField>
</template>
