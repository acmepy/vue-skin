<script setup>
import { Tooltip } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref, toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'

defineOptions({ inheritAttrs: false })
const props = defineProps({ modelValue: [String, Number, Boolean], value: [String, Number, Boolean], id: String, name: String, label: String, help: String, tooltip: String, error: [String, Boolean], disabled: Boolean, required: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const checked = computed(() => props.modelValue === props.value)
const { inputId, helpId, errorId, describedBy } = useFieldIds(toRef(props, 'id'), toRef(props, 'help'), toRef(props, 'error'))
const labelElement = ref()
let tooltipInstance
function update(event) { if (event.target.checked) emit('update:modelValue', props.value); emit('change', event) }
onMounted(() => { if (props.tooltip && labelElement.value) tooltipInstance = Tooltip.getOrCreateInstance(labelElement.value) })
onBeforeUnmount(() => tooltipInstance?.dispose())
</script>

<template>
  <div class="mb-3">
    <div class="form-check">
      <input v-bind="$attrs" :id="inputId" class="form-check-input" :class="{ 'is-invalid': error }" type="radio" :name="name" :checked="checked" :value="value" :disabled="disabled" :required="required" :aria-invalid="error ? 'true' : undefined" :aria-describedby="describedBy" @change="update" />
      <label v-if="label" ref="labelElement" class="form-check-label" :for="inputId" :title="tooltip || undefined" :data-bs-toggle="tooltip ? 'tooltip' : undefined">{{ label }}</label>
    </div>
    <div v-if="help" :id="helpId" class="form-text">{{ help }}</div>
    <div v-if="error" :id="errorId" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>
