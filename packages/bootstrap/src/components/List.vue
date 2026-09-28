<script setup>
defineProps({ title: String, divided: { type: Boolean, default: true }, bordered: { type: Boolean, default: true } })
</script>

<template>
  <section>
    <h2 v-if="title" class="h6 mb-2">{{ title }}</h2>
    <div class="list-group" :class="{ 'list-group-flush': !bordered }" role="list" :style="divided ? undefined : { '--bs-list-group-border-width': 0 }">
      <slot />
    </div>
  </section>
</template>
