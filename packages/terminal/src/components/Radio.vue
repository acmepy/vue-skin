<script setup>
import { computed, toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'

defineOptions({ inheritAttrs: false })
const props = defineProps({ modelValue: [String, Number, Boolean], value: [String, Number, Boolean], id: String, name: String, label: String, help: String, tooltip: String, error: [String, Boolean], disabled: Boolean, required: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const checked = computed(() => props.modelValue === props.value)
const { inputId, helpId, errorId, describedBy } = useFieldIds(toRef(props, 'id'), toRef(props, 'help'), toRef(props, 'error'))
function update(event) { if (event.target.checked) emit('update:modelValue', props.value); emit('change', event) }
</script>
<template>
<div class="tc-field">
  <div class="tc-check-row">
    <input v-bind="$attrs" class="input" :id="inputId" type="radio"  :name="name" :value="value" :checked="checked" :disabled="disabled" :required="required" :aria-checked="checked" :aria-invalid="error ? 'true' : undefined" :aria-describedby="describedBy" @change="update" />
    <label v-if="label" class="label" :for="inputId" :title="tooltip">{{ label }}</label>
  </div>
  <p v-if="help" :id="helpId" class="tc-help">{{ help }}</p><p v-if="error" :id="errorId" class="tc-error" role="alert">{{ error }}</p>
</div>
</template>
