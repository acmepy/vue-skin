<script setup>
import '../styles/base.css'
import '../styles/Container.css'
defineProps({ fluid: Boolean })
</script>

<template>
  <div :class="fluid ? 'container-fluid' : 'container'"><slot /></div>
</template>
