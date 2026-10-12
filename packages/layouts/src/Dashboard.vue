<script setup>
defineProps({
  title: { type: String, default: 'Dashboard' },
  description: String,
  summary: { type: Array, default: () => [] },
  charts: { type: Array, default: () => [] },
  tables: { type: Array, default: () => [] }
})
</script>

<template>
  <main class="ui-dashboard">
    <header class="ui-dashboard-header">
      <div>
        <h1 class="ui-dashboard-title">{{ title }}</h1>
        <p v-if="description" class="ui-dashboard-description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="ui-dashboard-actions"><slot name="actions" /></div>
    </header>
    <div v-if="summary.length" class="ui-dashboard-summary">
      <UiCard v-for="item in summary" :key="item.id" class="ui-dashboard-summary-card">
        <slot name="summary" :item="item">
          <h2 class="ui-dashboard-summary-label">{{ item.label }}</h2>
          <p class="ui-dashboard-summary-value">{{ item.value }}</p>
          <UiBadge v-if="item.trend" :variant="item.variant ?? 'secondary'">{{ item.trend }}</UiBadge>
          <p v-if="item.description" class="ui-dashboard-summary-description">{{ item.description }}</p>
        </slot>
      </UiCard>
    </div>
    <div v-if="charts.length" class="ui-dashboard-charts">
      <UiCard v-for="chart in charts" :key="chart.id" class="ui-dashboard-chart-card">
        <UiChart :title="chart.title" :label="chart.label" :type="chart.type" :data="chart.data" :options="chart.options" :height="chart.height ?? 280" />
      </UiCard>
    </div>
    <div v-if="tables.length" class="ui-dashboard-tables">
      <UiCard v-for="table in tables" :key="table.id" :title="table.title" class="ui-dashboard-table-card">
        <UiDataTable :data="table.data" :header="table.header" :footer="table.footer" :filter="table.filter" :striped="table.striped" :scroll="table.scroll" :show-id="table.showId" :vertical-borders="table.verticalBorders" :horizontal-borders="table.horizontalBorders ?? true" :detail-label="table.detailLabel">
          <template v-if="$slots['table-detail']" #detail="{ row, index }"><slot name="table-detail" :table="table" :row="row" :index="index" /></template>
        </UiDataTable>
      </UiCard>
    </div>
    <slot />
  </main>
</template>

<style>
.ui-dashboard { display: grid; gap: 1.5rem; padding: 1.5rem; min-width: 0; }
.ui-dashboard-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.ui-dashboard-title { margin: 0; font-size: 1.75rem; }
.ui-dashboard-description { margin: .5rem 0 0; opacity: .75; }
.ui-dashboard-summary, .ui-dashboard-charts, .ui-dashboard-tables { display: grid; gap: 1.5rem; min-width: 0; }
.ui-dashboard-summary { grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); }
.ui-dashboard-charts { grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr)); }
.ui-dashboard-summary-card, .ui-dashboard-chart-card, .ui-dashboard-table-card { min-width: 0; }
.ui-dashboard-summary-label { font-size: .875rem; font-weight: 500; margin: 0 0 .5rem; opacity: .75; }
.ui-dashboard-summary-value { font-size: 1.75rem; font-weight: 600; margin: 0 0 .5rem; }
.ui-dashboard-summary-description { margin: .5rem 0 0; font-size: .875rem; opacity: .75; }
</style>
