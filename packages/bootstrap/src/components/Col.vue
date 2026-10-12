<script setup>
import { computed } from 'vue'
import { gridBreakpoints, spanProp, validSpan } from './grid.js'

const props = defineProps({ span: spanProp, sm: spanProp, md: spanProp, lg: spanProp, xl: spanProp, xxl: spanProp })
const classes = computed(() => [
  validSpan(props.span) ? `col-${props.span}` : 'col',
  ...gridBreakpoints.filter(breakpoint => validSpan(props[breakpoint])).map(breakpoint => `col-${breakpoint}-${props[breakpoint]}`)
])
</script>

<template>
  <div :class="classes"><slot /></div>
</template>
