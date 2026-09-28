<script setup>
defineProps({ title: String })
</script>

<template>
  <section class="card">
    <header v-if="title || $slots.header" class="card-header">
      <slot name="header"><h2 class="h5 mb-0">{{ title }}</h2></slot>
    </header>
    <div v-if="$slots.default" class="card-body"><slot /></div>
    <slot name="list" />
    <footer v-if="$slots.footer" class="card-footer"><slot name="footer" /></footer>
  </section>
</template>
