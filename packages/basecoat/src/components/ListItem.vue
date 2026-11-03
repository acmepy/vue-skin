<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { UiIcon } from '@vue-skin/core'
import { Badge } from './basic.js'
import { listContextKey } from './listContext.js'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  href: String,
  target: String,
  header: String,
  title: String,
  subtitle: String,
  text: String,
  footer: String,
  after: String,
  badge: [String, Number],
  badgeVariant: { type: String, default: 'primary' },
  active: Boolean,
  disabled: Boolean,
  groupTitle: Boolean,
  tooltip: String,
  filterText: String
})
const emit = defineEmits(['click'])
const element = ref()
const list = inject(listContextKey, null)
const itemId = Symbol('list-item')
list?.register(itemId, { props, element })
const visible = computed(() => list?.visibility.value.get(itemId) ?? true)
const tag = computed(() => props.href ? 'a' : 'div')
const hasDetails = computed(() => props.header || props.subtitle || props.text || props.footer)

function click(event) {
  if (props.disabled) { event.preventDefault(); return }
  emit('click', event)
}
onBeforeUnmount(() => list?.unregister(itemId))
</script>
<template>
<div v-if="groupTitle" ref="element" v-show="visible" v-bind="$attrs" class="bc-list-heading" role="heading" aria-level="2">{{ title }}</div>
<component v-else :is="tag" ref="element" v-show="visible" v-bind="$attrs" class="item bc-list-item" :class="{ 'bc-list-active': active }" role="listitem" :href="disabled ? undefined : href" :target="target" :aria-current="active || undefined" :aria-disabled="disabled || undefined" :tabindex="disabled ? -1 : undefined" :title="tooltip" @click="click">
  <div v-if="$slots.media" class="bc-list-media"><slot name="media" /></div>
  <div class="bc-list-content"><small v-if="header">{{ header }}</small><div :class="{ 'bc-semibold': hasDetails }">{{ title }}</div><small v-if="subtitle">{{ subtitle }}</small><p v-if="text">{{ text }}</p><slot /><small v-if="footer">{{ footer }}</small></div>
  <div v-if="after || badge != null || $slots.end || href" class="bc-list-end"><Badge v-if="badge != null" :variant="badgeVariant" pill>{{ badge }}</Badge><span v-else-if="after">{{ after }}</span><slot name="end" /><UiIcon v-if="href" name="lucide:chevron-right" size="sm" /></div>
</component>
</template>

