<script setup>
import { toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'
const props = defineProps({ id: String, label: String, help: String, tooltip: String, error: [String, Boolean], floating: Boolean })
const { inputId, helpId, errorId, describedBy } = useFieldIds(toRef(props, 'id'), toRef(props, 'help'), toRef(props, 'error'))
</script>
<template>
  <div class="sl-field" :class="{ 'sl-floating': floating && label }">
    <label v-if="label && !floating" class="sl-label" :for="inputId" :title="tooltip">{{ label }}</label>
    <div class="sl-field-control"><slot :input-id="inputId" :described-by="describedBy" /><label v-if="label && floating" class="sl-floating-label" :for="inputId" :title="tooltip">{{ label }}</label></div>
    <p v-if="help" :id="helpId" class="sl-help">{{ help }}</p>
    <p v-if="error" :id="errorId" class="sl-error" role="alert">{{ error }}</p>
  </div>
</template>
