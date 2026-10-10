import { flushPromises, mount } from '@vue/test-utils'
import { reactive, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Chart from '../src/components/Chart.vue'

const { instances, ChartMock } = vi.hoisted(() => {
  const instances = []
  const ChartMock = vi.fn(function (canvas, config) {
    this.canvas = canvas
    this.config = config
    this.data = config.data
    this.options = config.options
    this.update = vi.fn()
    this.destroy = vi.fn()
    instances.push(this)
  })
  return { instances, ChartMock }
})
vi.mock('chart.js/auto', () => ({ default: ChartMock }))
let wrapper
beforeEach(() => { instances.length = 0; ChartMock.mockClear() })
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.documentElement.removeAttribute('data-bs-theme')
})
const data = () => ({ labels: ['Enero', 'Febrero'], datasets: [{ label: 'Ventas', data: [20, 35] }] })

describe('UiChart', () => {
  it.each(['bar', 'line', 'doughnut', 'pie', 'radar', 'polarArea', 'scatter', 'bubble'])('creates %s charts with an accessible data alternative', async (type) => {
    wrapper = mount(Chart, { props: { type, data: data(), title: 'Ventas', height: '20rem' } })
    await flushPromises()
    expect(instances[0].config.type).toBe(type)
    expect(wrapper.get('canvas').attributes('aria-label')).toBe('Ventas')
    expect(wrapper.get('canvas').attributes('aria-describedby')).toBe(wrapper.get('table').attributes('id'))
    expect(wrapper.get('table').text()).toContain('Febrero35')
    expect(wrapper.get('.ui-chart-canvas').attributes('style')).toContain('height: 20rem')
    expect(instances[0].options).toMatchObject({ responsive: true, maintainAspectRatio: false })
  })

  it('updates nested data and options without mutating application configuration', async () => {
    const source = reactive(data())
    const callback = () => 'formatted'
    const options = reactive({ scales: { y: { ticks: { callback } } } })
    wrapper = mount(Chart, { props: { data: source, options, height: '240' } })
    await flushPromises()
    const instance = instances[0]
    instance.data.datasets[0].data[0] = 999
    expect(source.datasets[0].data[0]).toBe(20)
    expect(instance.options.scales.y.ticks.callback).toBe(callback)
    instance.options.scales.y.ticks.color = 'custom'
    expect(options.scales.y.ticks.color).toBeUndefined()
    source.datasets[0].data[0] = 42
    options.scales.y.beginAtZero = true
    await nextTick()
    expect(instance.data.datasets[0].data[0]).toBe(42)
    expect(instance.options.scales.y.beginAtZero).toBe(true)
    expect(instance.update).toHaveBeenCalled()
    expect(instances).toHaveLength(1)
    expect(wrapper.get('.ui-chart-canvas').attributes('style')).toContain('height: 240px')
  })

  it('recreates on type changes and destroys on unmount', async () => {
    wrapper = mount(Chart, { props: { data: data() } })
    await flushPromises()
    await wrapper.setProps({ type: 'doughnut' })
    expect(instances[0].destroy).toHaveBeenCalledOnce()
    expect(instances[1].config.type).toBe('doughnut')
    wrapper.unmount()
    wrapper = undefined
    expect(instances[1].destroy).toHaveBeenCalledOnce()
  })

  it('updates theme colors, honors overrides, and disconnects its observer', async () => {
    const styles = document.createElement('style')
    styles.textContent = ':root { --bs-body-color: #212529; --bs-border-color: #dee2e6; } :root[data-bs-theme="dark"] { --bs-body-color: #dee2e6; --bs-border-color: #495057; }'
    document.head.append(styles)
    // jsdom does not inherit custom properties; read the root for this test.
    const original = window.getComputedStyle.bind(window)
    const computed = vi.spyOn(window, 'getComputedStyle').mockImplementation(() => original(document.documentElement))
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect')
    try {
      wrapper = mount(Chart, { props: { data: data(), options: { plugins: { legend: { labels: { color: 'red' } } } } }, attachTo: document.body })
      await flushPromises()
      expect(instances[0].options.scales.y.ticks.color).toBe('#212529')
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      await flushPromises()
      expect(instances[0].options.scales.y.grid.color).toBe('#495057')
      expect(instances[0].options.plugins.legend.labels.color).toBe('red')
      wrapper.unmount()
      wrapper = undefined
      expect(disconnect).toHaveBeenCalledOnce()
    } finally {
      computed.mockRestore()
      disconnect.mockRestore()
      styles.remove()
    }
  })

  it('does not create a chart after unmounting before the lazy import resolves', async () => {
    wrapper = mount(Chart)
    wrapper.unmount()
    wrapper = undefined
    await flushPromises()
    expect(ChartMock).not.toHaveBeenCalled()
  })

  it('reports initialization errors', async () => {
    const error = new Error('Invalid chart configuration')
    ChartMock.mockImplementationOnce(function () { throw error })
    wrapper = mount(Chart)
    await flushPromises()
    expect(wrapper.emitted('error')).toEqual([[error]])
  })
})
