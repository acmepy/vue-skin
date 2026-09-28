<script setup>
import { Tooltip } from 'bootstrap'
import { onBeforeUnmount, onMounted, ref, toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'

const props = defineProps({
  id: String,
  label: String,
  help: String,
  tooltip: String,
  error: [String, Boolean]
})

const { inputId, helpId, errorId, describedBy } = useFieldIds(
  toRef(props, 'id'),
  toRef(props, 'help'),
  toRef(props, 'error')
)
const labelElement = ref()
let tooltipInstance

onMounted(() => {
  if (props.tooltip && labelElement.value) tooltipInstance = Tooltip.getOrCreateInstance(labelElement.value)
})
onBeforeUnmount(() => tooltipInstance?.dispose())
</script>

<template>
  <div class="mb-3">
    <label v-if="label" ref="labelElement" class="form-label" :for="inputId" :title="tooltip || undefined" :data-bs-toggle="tooltip ? 'tooltip' : undefined">
      {{ label }}
    </label>
    <slot :input-id="inputId" :described-by="describedBy" />
    <div v-if="help" :id="helpId" class="form-text">{{ help }}</div>
    <div v-if="error" :id="errorId" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>
