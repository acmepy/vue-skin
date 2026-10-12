import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../../bootstrap/src/index.js'
import { UiDashboard } from '../src/index.js'
import { dashboardExample } from '../../../playground/src/dashboardExample.js'

const ChartStub = { name: 'DashboardChart', props: ['title', 'label', 'type', 'data', 'options', 'height'], template: '<div />' }
function render(props, slots) {
  const adapter = { ...BootstrapSkin, components: { ...BootstrapSkin.components, Chart: ChartStub } }
  return mount(UiDashboard, { props, slots, global: { plugins: [createVueSkin({ adapter })] } })
}

describe('UiDashboard', () => {
  it('renders an empty dashboard without empty grids or navigation', () => {
    const wrapper = render()
    try {
      expect(wrapper.get('h1').text()).toBe('Dashboard')
      expect(wrapper.find('.ui-dashboard-summary').exists()).toBe(false)
      expect(wrapper.find('.ui-dashboard-charts').exists()).toBe(false)
      expect(wrapper.find('.ui-dashboard-tables').exists()).toBe(false)
      expect(wrapper.find('aside').exists()).toBe(false)
    } finally { wrapper.unmount() }
  })

  it('composes reactive summaries, charts and searchable tables without mutating the data', async () => {
    const original = JSON.stringify(dashboardExample)
    const wrapper = render(dashboardExample)
    try {
      expect(wrapper.get('h1').text()).toBe(dashboardExample.title)
      expect(wrapper.findAll('.ui-dashboard-summary-card')).toHaveLength(4)
      expect(wrapper.findAllComponents({ name: 'DashboardChart' })).toHaveLength(3)
      expect(wrapper.findAll('.ui-dashboard-table-card')).toHaveLength(2)
      const orders = wrapper.get('.ui-dashboard-table-card')
      await orders.get('input[type="search"]').setValue('Luis')
      await orders.get('form').trigger('submit')
      expect(orders.findAll('tbody tr')).toHaveLength(1)
      expect(orders.text()).toContain('Luis Pérez')
      expect(JSON.stringify(dashboardExample)).toBe(original)
      await wrapper.setProps({ summary: [{ id: 'sales', label: 'Ventas actualizadas', value: 99 }], charts: [], tables: [] })
      expect(wrapper.get('.ui-dashboard-summary-card').text()).toContain('99')
      expect(wrapper.find('.ui-dashboard-charts').exists()).toBe(false)
      expect(wrapper.find('.ui-dashboard-tables').exists()).toBe(false)
    } finally { wrapper.unmount() }
  })

  it('forwards chart configuration and supports actions, summaries, table details and extra content', () => {
    const wrapper = render(dashboardExample, {
      actions: '<button>Actualizar</button>',
      summary: '<template #summary="{ item }"><p>Indicador: {{ item.label }}</p></template>',
      'table-detail': '<template #table-detail="{ table, row, index }"><button :data-table="table.id" :data-row="row.id">Ver {{ index + 1 }}</button></template>',
      default: '<p>Información adicional</p>'
    })
    try {
      const charts = wrapper.findAllComponents({ name: 'DashboardChart' })
      expect(charts[0].props('type')).toBe('bar')
      expect(charts[0].props('data')).toEqual(dashboardExample.charts[0].data)
      expect(charts[0].props('height')).toBe(280)
      expect(wrapper.get('.ui-dashboard-actions').text()).toBe('Actualizar')
      expect(wrapper.get('.ui-dashboard-summary-card').text()).toContain('Indicador: Ventas')
      expect(wrapper.get('button[data-table="orders"][data-row="1"]').text()).toBe('Ver 1')
      expect(wrapper.text()).toContain('Información adicional')
    } finally { wrapper.unmount() }
  })
})
