<script setup>
defineProps({ title: String, fixed: Boolean, sticky: Boolean })
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary" :class="{ 'fixed-top': fixed, 'sticky-top': sticky }">
    <div class="container-fluid">
      <div v-if="$slots.start" class="d-flex align-items-center me-3"><slot name="start" /></div>
      <slot name="brand"><span class="navbar-brand">{{ title }}</span></slot>
      <div class="navbar-nav me-auto"><slot /></div>
      <div class="navbar-nav"><slot name="end" /></div>
    </div>
  </nav>
</template>
