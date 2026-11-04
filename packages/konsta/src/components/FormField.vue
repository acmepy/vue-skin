<script setup>
import { toRef } from 'vue'
import { useFieldIds } from '@vue-skin/core'
const props = defineProps({ id: String, label: String, help: String, tooltip: String, error: [String, Boolean], floating: Boolean })
const { inputId, helpId, errorId, describedBy } = useFieldIds(toRef(props, 'id'), toRef(props, 'help'), toRef(props, 'error'))
</script>
<template>
  <div class="ks-field" :class="{ 'ks-floating': floating && label }">
    <label v-if="label && !floating" class="label" :for="inputId" :title="tooltip">{{ label }}</label>
    <div class="ks-field-control"><slot :input-id="inputId" :described-by="describedBy" /><label v-if="label && floating" class="ks-floating-label" :for="inputId" :title="tooltip">{{ label }}</label></div>
    <p v-if="help" :id="helpId" class="ks-help">{{ help }}</p>
    <p v-if="error" :id="errorId" class="ks-error" role="alert">{{ error }}</p>
  </div>
</template>
