<script setup>
import { computed, onUpdated, provide, ref, shallowReactive, shallowRef, watch } from 'vue'
import Button from './Button.vue'
import InputGroup from './InputGroup.vue'
import { UiIcon } from '@vue-skin/core'
import { listContextKey } from './listContext.js'

const props = defineProps({ title: String, divided: { type: Boolean, default: true }, bordered: { type: Boolean, default: true }, filter: Boolean })
const query = ref('')
const appliedQuery = ref('')
const items = shallowReactive(new Map())
const order = shallowRef([])
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
const term = computed(() => props.filter ? normalize(appliedQuery.value.trim()) : '')

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
      const content = ['header', 'title', 'subtitle', 'text', 'footer', 'after', 'badge', 'filterText'].map((key) => item.props[key] ?? '').join(' ')
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
watch(query, (value) => { if (!value.trim()) appliedQuery.value = '' })
</script>

<template>
  <section class="ui-list">
    <h2 v-if="title" class="h6 mb-2">{{ title }}</h2>
    <form v-if="filter" class="ui-list-filter sticky-top mb-3" role="search" @submit.prevent="appliedQuery = query">
      <InputGroup v-model="query" type="search" aria-label="Buscar en la lista" placeholder="Buscar en la lista…">
        <template #suffix>
          <Button type="submit" variant="outline-secondary" class="bg-body text-body border d-flex align-items-center justify-content-center" aria-label="Buscar" title="Buscar">
            <UiIcon name="mdi:magnify" size="md" />
          </Button>
        </template>
      </InputGroup>
    </form>
    <div class="list-group" :class="{ 'list-group-flush': !bordered }" role="list" :style="divided ? undefined : { '--bs-list-group-border-width': 0 }">
      <slot />
    </div>
    <p v-if="noResults" class="text-body-secondary text-center mt-3" role="status">Sin resultados</p>
  </section>
</template>

<style>
.ui-list > .list-group { --bs-list-group-bg: transparent; }
.ui-list-filter { background-color: var(--ui-list-filter-bg, var(--bs-body-bg)); }
</style>
