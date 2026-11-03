<script setup>
import { computed, toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: [Boolean, String, Number], id: String, label: String, help: String, tooltip: String, error: [String, Boolean],
  disabled: Boolean, required: Boolean, trueValue: { default: true }, falseValue: { default: false }
})
const emit = defineEmits(['update:modelValue', 'change'])
const checked = computed(() => props.modelValue === props.trueValue)
const { inputId, helpId, errorId, describedBy } = useFieldIds(toRef(props, 'id'), toRef(props, 'help'), toRef(props, 'error'))
function update(event) { emit('update:modelValue', event.target.checked ? props.trueValue : props.falseValue); emit('change', event) }
</script>
<template>
<div class="bc-field">
  <div class="bc-check-row">
    <input v-bind="$attrs" class="input" :id="inputId" type="checkbox" role="switch"  :checked="checked" :disabled="disabled" :required="required" :aria-checked="checked" :aria-invalid="error ? 'true' : undefined" :aria-describedby="describedBy" @change="update" />
    <label v-if="label" class="label" :for="inputId" :title="tooltip">{{ label }}</label>
  </div>
  <p v-if="help" :id="helpId" class="bc-help">{{ help }}</p><p v-if="error" :id="errorId" class="bc-error" role="alert">{{ error }}</p>
</div>
</template>

