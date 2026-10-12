<script setup>
defineProps({ fluid: Boolean })
</script>

<template>
  <div :class="fluid ? 'container-fluid' : 'container'"><slot /></div>
</template>
