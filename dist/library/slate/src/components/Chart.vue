<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = defineProps({
  type: { type: String, default: 'bar' },
  data: { type: Object, default: () => ({ labels: [], datasets: [] }) },
  options: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  label: { type: String, default: '' },
  height: { type: [Number, String], default: 320 }
})
const emit = defineEmits(['error'])
const canvas = ref(null)
const descriptionId = useId()
const chartHeight = computed(() => typeof props.height === 'number' || /^\d+(\.\d+)?$/.test(props.height) ? `${props.height}px` : props.height)
const rows = computed(() => Array.from({ length: Math.max(props.data.labels?.length ?? 0, ...((props.data.datasets ?? []).map((dataset) => dataset.data?.length ?? 0))) }, (_, index) => index))
const formatValue = (value) => value != null && typeof value === 'object' ? JSON.stringify(value) : value ?? '—'
let chart
let Chart
let observer
let disposed = false

// Chart.js mutates configuration. Copy plain objects, keeping callbacks and
// special values (such as CanvasGradient) intact and outside Vue reactivity.
const isPlain = (value) => value && Object.getPrototypeOf(value) === Object.prototype
function copy(value) {
  if (Array.isArray(value)) return value.map(copy)
  if (isPlain(value)) return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, copy(entry)]))
  return value
}
function merge(base, overrides) {
  const result = copy(base)
  for (const [key, value] of Object.entries(overrides)) {
    result[key] = isPlain(value) && isPlain(result[key]) ? merge(result[key], value) : copy(value)
  }
  return result
}
function chartOptions() {
  const styles = getComputedStyle(canvas.value)
  const color = styles.getPropertyValue('--foreground').trim() || '#212529'
  const border = styles.getPropertyValue('--border').trim() || '#dee2e6'
  const axis = { ticks: { color }, grid: { color: border }, border: { color: border }, title: { color } }
  const scales = ['bar', 'line', 'scatter', 'bubble'].includes(props.type)
    ? { x: axis, y: axis }
    : ['radar', 'polarArea'].includes(props.type)
      ? { r: { ...axis, pointLabels: { color }, angleLines: { color: border }, ticks: { color, backdropColor: 'transparent' } } }
      : {}
  return merge({ responsive: true, maintainAspectRatio: false, color, plugins: { legend: { labels: { color } } }, scales }, props.options)
}
function sync() {
  if (!Chart || disposed) return
  try {
    if (chart && chart.config.type !== props.type) {
      chart.destroy()
      chart = undefined
    }
    if (!chart) {
      chart = new Chart(canvas.value, { type: props.type, data: copy(props.data), options: chartOptions() })
    } else {
      chart.data = copy(props.data)
      chart.options = chartOptions()
      chart.update()
    }
  } catch (error) {
    emit('error', error)
  }
}
watch(() => [props.type, props.data, props.options], sync, { deep: true })
onMounted(async () => {
  try {
    const module = await import('chart.js/auto')
    if (disposed) return
    Chart = module.default
    sync()
    observer = new MutationObserver(sync)
    // Observe ancestors too: Slate allows a local theme on any container.
    for (let element = canvas.value; element; element = element.parentElement) {
      observer.observe(element, { attributes: true, attributeFilter: ['class', 'data-ui-slate'] })
    }
  } catch (error) {
    if (!disposed) emit('error', error)
  }
})
onBeforeUnmount(() => {
  disposed = true
  observer?.disconnect()
  chart?.destroy()
})
</script>
<template>
<figure class="sl-chart"><figcaption v-if="title">{{ title }}</figcaption><div class="sl-chart-canvas" :style="{ height: chartHeight }"><canvas ref="canvas" role="img" :aria-label="label || title || 'Gráfico'" :aria-describedby="descriptionId" /></div><table :id="descriptionId" class="sl-sr-only"><caption>{{ label || title || 'Datos del gráfico' }}</caption><thead><tr><th>Etiqueta</th><th v-for="(dataset,index) in data.datasets" :key="index">{{ dataset.label || 'Serie ' + (index+1) }}</th></tr></thead><tbody><tr v-for="index in rows" :key="index"><th>{{ data.labels?.[index] ?? index+1 }}</th><td v-for="(dataset,serie) in data.datasets" :key="serie">{{ formatValue(dataset.data?.[index]) }}</td></tr></tbody></table></figure>
</template>
