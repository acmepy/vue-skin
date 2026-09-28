<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  variant: { type: String, default: 'primary' },
  size: String,
  disabled: Boolean,
  loading: Boolean,
  type: { type: String, default: 'button' }
})
</script>

<template>
  <button
    v-bind="$attrs"
    class="btn"
    :class="[`btn-${variant}`, size ? `btn-${size}` : null]"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
    <slot name="icon" />
    <slot />
  </button>
</template>
