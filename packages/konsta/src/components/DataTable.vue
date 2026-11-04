<script setup>
import { computed, ref, watch } from 'vue'
import InputGroup from './InputGroup.vue'
import { Button } from './basic.js'
import { UiIcon } from '@vue-skin/core'

const props = defineProps({
  data: { type: Array, default: () => [] },
  header: { type: Object, default: () => ({}) },
  title: String,
  footer: String,
  detailLabel: { type: String, default: 'Acciones' },
  filter: Boolean,
  showId: Boolean,
  verticalBorders: Boolean,
  horizontalBorders: { type: Boolean, default: true },
  scroll: [Boolean, String],
  striped: Boolean
})
const query = ref('')
const appliedQuery = ref('')
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
const searchable = (value) => value && typeof value === 'object' ? Object.values(value).map(searchable).join(' ') : String(value ?? '')
const columns = computed(() => {
  const keys = Object.keys(props.header).length
    ? Object.keys(props.header)
    : [...new Set(props.data.flatMap((row) => Object.keys(row)))]
  if (props.showId && !keys.includes('id')) keys.unshift('id')
  return keys.filter((key) => props.showId || key !== 'id').map((key) => ({
    key, label: props.header[key]?.label ?? key,
    align: ['start', 'center', 'end'].includes(props.header[key]?.align) ? props.header[key].align : 'start'
  }))
})
const rows = computed(() => {
  const term = props.filter ? normalize(appliedQuery.value.trim()) : ''
  return term ? props.data.filter((row) => normalize(searchable(row)).includes(term)) : props.data
})
const scrollStyle = computed(() => props.scroll ? {
  overflow: 'auto', maxHeight: typeof props.scroll === 'string' ? props.scroll : '24rem'
} : undefined)
watch(query, (value) => { if (!value.trim()) appliedQuery.value = '' })
</script>
<template>
<section class="ks-data-table">
  <h2 v-if="title">{{ title }}</h2>
  <div v-if="filter || $slots.actions" class="ks-table-toolbar">
    <form v-if="filter" role="search" @submit.prevent="appliedQuery = query"><InputGroup v-model="query" type="search" aria-label="Buscar en la tabla" placeholder="Buscar en los datos…"><template #suffix><Button type="submit" variant="outline-secondary" aria-label="Buscar" title="Buscar"><UiIcon name="mdi:magnify" size="md" /></Button></template></InputGroup></form>
    <div v-if="$slots.actions" class="ks-table-actions"><slot name="actions" :data="rows" :total="data.length" /></div>
  </div>
  <div class="table-container" :style="scrollStyle" :tabindex="scroll ? 0 : undefined" :role="scroll ? 'region' : undefined" :aria-label="scroll ? (title || 'Tabla de datos') : undefined">
    <table class="table ks-table" :class="{ 'ks-table-striped': striped, 'ks-table-vertical': verticalBorders, 'ks-table-no-horizontal': !horizontalBorders }">
      <caption class="ks-sr-only">{{ title || 'Tabla de datos' }}</caption>
      <thead><tr><th v-for="column in columns" :key="column.key" scope="col" :style="{ textAlign: column.align }">{{ column.label }}</th><th v-if="$slots.detail" scope="col" class="ks-text-end">{{ detailLabel }}</th></tr></thead>
      <tbody><tr v-for="(row,index) in rows" :key="index"><td v-for="column in columns" :key="column.key" :style="{ textAlign: column.align }">{{ row[column.key] }}</td><td v-if="$slots.detail" class="ks-text-end"><slot name="detail" :row="row" :index="index" /></td></tr><tr v-if="!rows.length"><td :colspan="Math.max(columns.length + ($slots.detail ? 1 : 0),1)">Sin resultados</td></tr></tbody>
    </table>
  </div>
  <footer v-if="footer || $slots.footer"><slot name="footer" :data="rows" :total="data.length">{{ footer }}</slot></footer>
</section>
</template>
