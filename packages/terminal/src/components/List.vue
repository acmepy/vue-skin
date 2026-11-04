<script setup>
import { computed, onUpdated, provide, ref, shallowReactive, shallowRef } from 'vue'
import { Button } from './basic.js'
import InputGroup from './InputGroup.vue'
import { UiIcon } from '@vue-skin/core'
import { listContextKey } from './listContext.js'

const props = defineProps({ title: String, divided: { type: Boolean, default: true }, bordered: { type: Boolean, default: true }, filter: { type: Boolean, default: true }, minLength: { type: Number, default: 2 } })
const query = ref('')
const items = shallowReactive(new Map())
const order = shallowRef([])
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
const threshold = computed(() => Number.isFinite(props.minLength) ? Math.max(0, Math.floor(props.minLength)) : 2)
const term = computed(() => props.filter && query.value.trim().length >= threshold.value ? normalize(query.value.trim()) : '')

function refreshOrder() {
  const next = [...items.keys()].sort((a, b) => {
    const first = items.get(a).element.value
    const second = items.get(b).element.value
    if (!first || !second) return 0
    const position = first.compareDocumentPosition(second)
    return position & 4 ? -1 : position & 2 ? 1 : 0
  })
  if (next.length !== order.value.length || next.some((id, index) => id !== order.value[index])) order.value = next
}
const visibility = computed(() => {
  const result = new Map()
  let groupHasMatches = false
  for (const id of [...order.value].reverse()) {
    const item = items.get(id)
    if (!item) continue
    if (item.props.groupTitle) {
      result.set(id, !term.value || groupHasMatches)
      groupHasMatches = false
    } else {
      const content = ['header', 'title', 'subtitle', 'text', 'footer', 'after', 'tag', 'filterText'].map((key) => item.props[key] ?? '').join(' ')
      const matches = !term.value || normalize(content).includes(term.value)
      result.set(id, matches)
      groupHasMatches ||= matches
    }
  }
  return result
})
const noResults = computed(() => term.value && ![...items].some(([id, item]) => !item.props.groupTitle && visibility.value.get(id)))
provide(listContextKey, {
  visibility,
  register(id, item) { items.set(id, item); refreshOrder() },
  unregister(id) { items.delete(id); refreshOrder() }
})
onUpdated(refreshOrder)
</script>
<template>
<section class="tc-list">
  <h2 v-if="title" class="tc-list-title">{{ title }}</h2>
  <form v-if="filter" role="search" class="tc-list-filter" @submit.prevent>
    <InputGroup v-model="query" type="search" aria-label="Buscar en la lista" placeholder="Buscar en la lista…"><template #suffix><Button type="submit" variant="outline-secondary" aria-label="Buscar" title="Buscar"><UiIcon name="mdi:magnify" size="md" /></Button></template></InputGroup>
  </form>
  <div role="list" class="tc-list-items" :class="{ 'tc-list-bordered': bordered, 'tc-list-divided': divided }"><slot /></div>
  <p v-if="noResults" role="status" class="tc-help">Sin resultados</p>
</section>
</template>
