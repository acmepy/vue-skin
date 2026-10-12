<script setup>
import { Tooltip } from 'bootstrap'
import { onBeforeUnmount, ref, toRef, watch } from 'vue'
import { useFieldIds } from '@vue-skin/core'

const props = defineProps({
  id: String,
  label: String,
  floating: Boolean,
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

watch([labelElement, toRef(props, 'tooltip')], ([element, tooltip]) => {
  tooltipInstance?.dispose()
  tooltipInstance = element && tooltip ? Tooltip.getOrCreateInstance(element) : undefined
}, { flush: 'post' })
onBeforeUnmount(() => tooltipInstance?.dispose())
</script>

<template>
  <div class="mb-3">
    <div v-if="floating && label" class="form-floating">
      <slot :input-id="inputId" :described-by="describedBy" />
      <label ref="labelElement" :for="inputId" :title="tooltip || undefined" :data-bs-toggle="tooltip ? 'tooltip' : undefined">{{ label }}</label>
    </div>
    <template v-else>
      <label v-if="label" ref="labelElement" class="form-label" :for="inputId" :title="tooltip || undefined" :data-bs-toggle="tooltip ? 'tooltip' : undefined">
        {{ label }}
      </label>
      <slot :input-id="inputId" :described-by="describedBy" />
    </template>
    <div v-if="help" :id="helpId" class="form-text">{{ help }}</div>
    <div v-if="error" :id="errorId" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>
