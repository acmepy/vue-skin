<script setup>
import { UiIcon } from '@vue-skin/core'
import Button from './Button.vue'
import Link from './Link.vue'

defineProps({
  items: { type: Array, default: () => [] },
  size: { type: String, default: 'sm' },
  variant: { type: String, default: 'outline-secondary' }
})
const emit = defineEmits(['select'])
function select(item) {
  if (!item.disabled && !item.link) emit('select', item)
}
</script>

<template>
  <div class="d-inline-flex flex-wrap justify-content-end gap-2">
    <component v-for="(item, index) in items" :key="index" :is="item.link ? Link : Button"
      :href="item.link" :type="item.link ? undefined : 'button'" :disabled="item.disabled"
      :variant="item.link ? undefined : (item.variant || variant)" :size="item.link ? undefined : size"
      :class="item.link ? ['btn', `btn-${item.variant || variant}`, size ? `btn-${size}` : null] : null"
      :title="item.label" :aria-label="item.label" @click="select(item)">
      <UiIcon v-if="item.icon" :name="item.icon" size="sm" class="align-middle" />
      <span v-else>{{ item.label }}</span>
    </component>
  </div>
</template>
