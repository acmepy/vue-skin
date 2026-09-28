<script setup>
import { Tooltip } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref, toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: [Boolean, String, Number], id: String, label: String, help: String, tooltip: String, error: [String, Boolean],
  disabled: Boolean, required: Boolean, trueValue: { default: true }, falseValue: { default: false }
})
const emit = defineEmits(['update:modelValue', 'change'])
const checked = computed(() => props.modelValue === props.trueValue)
const { inputId, helpId, errorId, describedBy } = useFieldIds(toRef(props, 'id'), toRef(props, 'help'), toRef(props, 'error'))
const labelElement = ref()
let tooltipInstance
function update(event) { emit('update:modelValue', event.target.checked ? props.trueValue : props.falseValue); emit('change', event) }
onMounted(() => {
  if (props.tooltip && labelElement.value) tooltipInstance = Tooltip.getOrCreateInstance(labelElement.value)
})
onBeforeUnmount(() => tooltipInstance?.dispose())
</script>

<template>
  <div class="mb-3">
    <div class="form-check form-switch">
      <input v-bind="$attrs" :id="inputId" class="form-check-input" :class="{ 'is-invalid': error }" type="checkbox" role="switch" :checked="checked"
        :disabled="disabled" :required="required" :aria-checked="checked ? 'true' : 'false'" :aria-invalid="error ? 'true' : undefined" :aria-describedby="describedBy" @change="update" />
      <label v-if="label" ref="labelElement" class="form-check-label" :for="inputId" :title="tooltip || undefined" :data-bs-toggle="tooltip ? 'tooltip' : undefined">{{ label }}</label>
    </div>
    <div v-if="help" :id="helpId" class="form-text">{{ help }}</div>
    <div v-if="error" :id="errorId" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>
