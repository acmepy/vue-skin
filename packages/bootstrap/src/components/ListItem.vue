<script setup>
import { Tooltip } from 'bootstrap'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { UiIcon } from '@vue-skin/core'
import Badge from './Badge.vue'
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
let tooltipInstance

function click(event) {
  if (props.disabled) { event.preventDefault(); return }
  emit('click', event)
}
onMounted(() => {
  if (props.tooltip && element.value) tooltipInstance = Tooltip.getOrCreateInstance(element.value)
})
onBeforeUnmount(() => { list?.unregister(itemId); tooltipInstance?.dispose() })
</script>

<template>
  <div v-if="groupTitle" v-show="visible" ref="element" v-bind="$attrs" class="list-group-item list-group-item-secondary fw-semibold" role="heading" aria-level="2">{{ title }}</div>
  <component
    v-else
    :is="tag"
    ref="element"
    v-bind="$attrs"
    class="ui-list-item list-group-item align-items-start"
    :class="[{ 'd-flex': visible, 'd-none': !visible, 'list-group-item-action': href, active, disabled }, href ? 'text-decoration-none' : null]"
    :href="href || undefined"
    :target="target"
    :aria-current="active ? 'true' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    :title="tooltip || undefined"
    :data-bs-toggle="tooltip ? 'tooltip' : undefined"
    role="listitem"
    @click="click"
  >
    <div v-if="$slots.media" class="flex-shrink-0 me-3"><slot name="media" /></div>
    <div class="flex-grow-1 min-width-0">
      <div v-if="header" class="small text-body-secondary">{{ header }}</div>
      <div v-if="title" :class="{ 'fw-semibold': hasDetails }">{{ title }}</div>
      <div v-if="subtitle" class="small text-body-secondary">{{ subtitle }}</div>
      <div v-if="text" class="small mt-1">{{ text }}</div>
      <slot />
      <div v-if="footer" class="small text-body-secondary mt-1">{{ footer }}</div>
    </div>
    <div v-if="after || badge !== undefined || $slots.end || href" class="ms-3 text-end flex-shrink-0 d-flex align-items-center">
      <div v-if="after && (badge === undefined || badge === null)">{{ after }}</div>
      <Badge v-if="badge !== undefined && badge !== null" :variant="badgeVariant" pill>{{ badge }}</Badge>
      <slot name="end" />
      <UiIcon v-if="href" class="ms-2" name="lucide:chevron-right" size="sm" />
    </div>
  </component>
</template>

<style>
.ui-list-item { --bs-list-group-bg: transparent; }
</style>
