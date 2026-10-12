import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../src/index.js'
import { validSpan } from '../src/components/grid.js'
import GridExample from '../../../playground/src/GridExample.vue'
import App from '../../../playground/src/App.vue'
import gridExampleCode from '../../../playground/src/GridExample.vue?raw'

const render = (component, options = {}) => mount(component, { ...options, global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })

describe('Bootstrap grid', () => {
  it('renders a responsive container and switches to full width while preserving attributes', async () => {
    const wrapper = render(BootstrapSkin.components.Container, { props: { fluid: false }, attrs: { class: 'custom', style: 'color: red', 'aria-label': 'Contenido' }, slots: { default: 'Contenido' } })
    try {
      expect(wrapper.classes()).toEqual(['container', 'custom'])
      expect(wrapper.attributes('aria-label')).toBe('Contenido')
      expect(wrapper.attributes('style')).toContain('color: red')
      expect(wrapper.text()).toBe('Contenido')
      await wrapper.setProps({ fluid: true })
      expect(wrapper.classes()).toEqual(['container-fluid', 'custom'])
    } finally { wrapper.unmount() }
  })

  it.each([['none', 0], ['xs', 1], ['sm', 2], ['md', 3], ['lg', 4], ['xl', 5]])('maps the %s gap to official Bootstrap gutters', (gap, value) => {
    const wrapper = render(BootstrapSkin.components.Row, { props: { gap }, slots: { default: 'Columnas' } })
    try {
      expect(wrapper.classes()).toEqual(['row', `g-${value}`])
      expect(wrapper.text()).toBe('Columnas')
    } finally { wrapper.unmount() }
  })

  it('defaults to medium spacing and updates it reactively', async () => {
    const wrapper = render(BootstrapSkin.components.Row)
    try {
      expect(wrapper.classes()).toContain('g-3')
      await wrapper.setProps({ gap: 'none' })
      expect(wrapper.classes()).toContain('g-0')
      expect(wrapper.classes()).not.toContain('g-3')
    } finally { wrapper.unmount() }
  })

  it('maps numeric and string spans at each responsive breakpoint', async () => {
    const wrapper = render(BootstrapSkin.components.Col, { props: { span: 12, sm: '6', md: 4, lg: 3, xl: 2, xxl: 'auto' }, attrs: { class: 'custom', style: 'min-height: 2rem' }, slots: { default: 'Contenido' } })
    try {
      expect(wrapper.classes()).toEqual(['col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xl-2', 'col-xxl-auto', 'custom'])
      expect(wrapper.attributes('style')).toContain('min-height: 2rem')
      await wrapper.setProps({ span: 'auto', md: undefined })
      expect(wrapper.classes()).toContain('col-auto')
      expect(wrapper.classes()).not.toContain('col-md-4')
      expect(wrapper.classes()).toContain('col-lg-3')
    } finally { wrapper.unmount() }
  })

  it('uses equal flexible columns when span is omitted', () => {
    const wrapper = render({ template: '<UiContainer><UiRow><UiCol>Uno</UiCol><UiCol md="6">Dos</UiCol></UiRow></UiContainer>' })
    try {
      expect(wrapper.get('.container > .row').classes()).toContain('g-3')
      const cols = wrapper.findAll('.row > div')
      expect(cols[0].classes()).toEqual(['col'])
      expect(cols[1].classes()).toEqual(['col', 'col-md-6'])
    } finally { wrapper.unmount() }
  })

  it.each([0, 13, -1, 1.5, '6px', '0', '13', '', null, undefined])('rejects invalid span %s', value => {
    expect(validSpan(value)).toBe(false)
  })

  it('renders the responsive playground example and shows its exact source in the code tab', async () => {
    const example = render(GridExample)
    const wrapper = render(App)
    try {
      expect(example.findAll('.col-12.col-md-6.col-lg-4')).toHaveLength(3)
      expect(example.find('.col-auto').exists()).toBe(true)
      expect(example.find('.row.g-0').exists()).toBe(true)
      await wrapper.get('a[href="#grid"]').trigger('click')
      expect(wrapper.find('.container-fluid').exists()).toBe(true)
      const codeTab = wrapper.findAll('[role="tab"]').find(tab => tab.text() === 'Código')
      await codeTab.trigger('click')
      expect(wrapper.get('pre code').text().replace(/\s+/g, '')).toBe(gridExampleCode.replace(/\s+/g, ''))
    } finally { example.unmount(); wrapper.unmount() }
  })
})
