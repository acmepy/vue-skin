<script setup>
defineProps({ variant: { type: String, default: 'secondary' }, pill: Boolean })
</script>

<template>
  <span class="badge" :class="[`text-bg-${variant}`, { 'rounded-pill': pill }]"><slot /></span>
</template>
