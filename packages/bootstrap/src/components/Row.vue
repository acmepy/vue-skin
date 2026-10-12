<script setup>
import { gridGaps } from './grid.js'
defineProps({ gap: { type: String, default: 'md', validator: value => Object.hasOwn(gridGaps, value) } })
</script>

<template>
  <div class="row" :class="`g-${gridGaps[gap] ?? gridGaps.md}`"><slot /></div>
</template>
