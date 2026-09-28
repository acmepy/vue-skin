<script setup>
import { Collapse } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = defineProps({ modelValue: { type: [String, Number], default: null }, items: { type: Array, default: () => [] }, flush: Boolean })
const emit = defineEmits(['update:modelValue'])
const generatedId = useId()
const root = ref()
const panels = new Map()
const instances = new Map()

const rootId = `vue-skin-accordion-${generatedId}`
const itemId = (item) => `${rootId}-${item.id}`
const headingId = (item) => `${itemId(item)}-heading`
const panelId = (item) => `${itemId(item)}-panel`
const active = computed(() => props.modelValue)
function setPanel(id, element) { if (element) panels.set(id, element); else panels.delete(id) }
function sync(value) {
  for (const [id, entry] of instances) id === value ? entry.instance.show() : entry.instance.hide()
}
function bindPanel(item) {
  const element = panels.get(item.id)
  if (!element) return
  const instance = Collapse.getOrCreateInstance(element, { toggle: false })
  const shown = () => emit('update:modelValue', item.id)
  const hidden = () => { if (props.modelValue === item.id) emit('update:modelValue', null) }
  element.addEventListener('shown.bs.collapse', shown)
  element.addEventListener('hidden.bs.collapse', hidden)
  instances.set(item.id, { instance, element, shown, hidden })
}
watch(() => props.modelValue, sync)
onMounted(() => { props.items.forEach(bindPanel); sync(props.modelValue) })
onBeforeUnmount(() => {
  for (const { instance, element, shown, hidden } of instances.values()) {
    element.removeEventListener('shown.bs.collapse', shown)
    element.removeEventListener('hidden.bs.collapse', hidden)
    instance.dispose()
  }
})
</script>

<template>
  <div ref="root" class="accordion" :class="{ 'accordion-flush': flush }" :id="rootId">
    <section v-for="item in items" :key="item.id" class="accordion-item">
      <h2 class="accordion-header" :id="headingId(item)">
        <button class="accordion-button" :class="{ collapsed: active !== item.id }" type="button" data-bs-toggle="collapse" :data-bs-target="`#${panelId(item)}`" :aria-expanded="active === item.id" :aria-controls="panelId(item)" :disabled="item.disabled">
          {{ item.title }}
        </button>
      </h2>
      <div :id="panelId(item)" :ref="(element) => setPanel(item.id, element)" class="accordion-collapse collapse" :class="{ show: active === item.id }" :aria-labelledby="headingId(item)" :data-bs-parent="`#${rootId}`">
        <div class="accordion-body">{{ item.content }}</div>
      </div>
    </section>
  </div>
</template>
