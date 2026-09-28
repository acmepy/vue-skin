<script setup>
defineProps({ title: String, fixed: Boolean, sticky: Boolean })
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" :class="{ 'fixed-top': fixed, 'sticky-top': sticky }">
    <div class="container-fluid">
      <slot name="brand"><span class="navbar-brand">{{ title }}</span></slot>
      <div class="navbar-nav me-auto"><slot name="start" /><slot /></div>
      <div class="navbar-nav"><slot name="end" /></div>
    </div>
  </nav>
</template>
