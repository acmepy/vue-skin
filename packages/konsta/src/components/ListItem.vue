<script setup>
import { computed, inject, onBeforeUnmount, ref } from 'vue'
import { Badge } from './basic.js'
import { ListItem as KListItem } from 'konsta/vue'
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
const hasDetails = computed(() => props.header || props.subtitle || props.text || props.footer)

function click(event) {
  if (props.disabled) { event.preventDefault(); return }
  emit('click', event)
}
onBeforeUnmount(() => list?.unregister(itemId))
</script>
<template>
<div v-if="groupTitle" ref="element" v-show="visible" v-bind="$attrs" class="ks-list-heading" role="heading" aria-level="2">{{ title }}</div>
<div v-else ref="element" v-show="visible" v-bind="$attrs" class="ks-list-entry" :class="{ 'ks-list-active': active }" role="listitem" :aria-current="active || undefined" :aria-disabled="disabled || undefined" :title="tooltip" @click="click">
  <KListItem component="div" :title="title" :header="header" :subtitle="subtitle" :text="text" :footer="footer" :href="disabled ? undefined : href" :link="Boolean(href) && !disabled" :target="target" :dividers="false" :strong-title="Boolean(hasDetails)" content-class="ks-list-item" :link-props="{ tabindex: disabled ? -1 : undefined, 'aria-disabled': disabled || undefined }">
    <template v-if="$slots.media" #media><slot name="media" /></template>
    <template v-if="after || badge != null || $slots.end" #after><Badge v-if="badge != null" :variant="badgeVariant" pill>{{ badge }}</Badge><span v-else-if="after">{{ after }}</span><slot name="end" /></template>
    <template v-if="$slots.default" #inner><slot /></template>
  </KListItem>
</div>
</template>
