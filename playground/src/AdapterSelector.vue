<script setup>
import { computed, inject } from 'vue'
import { availableAdapters, adapterHref } from './adapters.js'

const props = defineProps({ section: String })
const current = inject('playgroundAdapter', __VUE_SKIN_ADAPTER__)
const label = availableAdapters.find(item => item.value === current)?.label ?? current
const items = computed(() => availableAdapters.map(item => ({
  label: item.label + (item.value === current ? ' (actual)' : ''),
  value: item.value,
  href: adapterHref(item.value, window.location.href, import.meta.env.BASE_URL, props.section),
  disabled: item.value === current
})))
</script>

<template>
  <div class="playground-adapter-selector">
    <UiDropdown :label="'Adapter: ' + label" :items="items" variant="outline-secondary" size="sm" align="end" />
  </div>
</template>
