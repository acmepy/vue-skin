<script setup>
defineProps({ size: String, label: { type: String, default: 'Cargando' } })
</script>

<template>
  <span class="spinner-border" :class="size ? `spinner-border-${size}` : null" role="status">
    <span class="visually-hidden">{{ label }}</span>
  </span>
</template>
