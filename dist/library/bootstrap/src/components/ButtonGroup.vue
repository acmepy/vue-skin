<script setup>
import '../styles/base.css'
import '../styles/ButtonGroup.css'
defineOptions({ inheritAttrs: false })
defineProps({ size: String, vertical: Boolean, label: { type: String, default: 'Grupo de botones' } })
</script>

<template>
  <div v-bind="$attrs" class="btn-group" :class="[size ? `btn-group-${size}` : null, { 'btn-group-vertical': vertical }]" role="group" :aria-label="label">
    <slot />
  </div>
</template>
