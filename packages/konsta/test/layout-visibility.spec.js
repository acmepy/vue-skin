import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVueSkin } from '@vue-skin/core'
import { UiAppLayout } from '../../layouts/src/index.js'
import Konsta from '../src/index.js'

const require = createRequire(import.meta.url)
let style, wrapper, target
afterEach(() => { wrapper?.unmount(); target?.remove(); style?.remove(); vi.unstubAllGlobals() })
function setup(width) {
  vi.stubGlobal('matchMedia', query => ({matches:width >= Number(query.match(/\d+/)?.[0] ?? 0),addEventListener(){},removeEventListener(){}}))
  style = document.createElement('style')
  const layout = readFileSync(require.resolve('../../layouts/src/AppLayout.vue'),'utf8').match(/<style>([\s\S]+)<\/style>/)[1]
  style.textContent = readFileSync(require.resolve('../src/styles/integration.css'),'utf8') + layout
  document.head.append(style)
  target = document.createElement('section'); document.body.append(target)
}
it('aligns theme controls and reserves visible space for the sidebar icon without Bootstrap utilities', () => {
  setup(1280)
  wrapper = mount(UiAppLayout, {attachTo:target,props:{title:'Aplicación',sections:[{id:'home',title:'Inicio',icon:'lucide:home'}]},global:{plugins:[createVueSkin({adapter:Konsta,theme:{target,persist:false}})]}})
  expect(wrapper.find('[class*="icon:lucide:home"]').exists()).toBe(true)
  const actions = wrapper.get('.ui-app-layout-navbar-actions')
  expect(getComputedStyle(actions.element).display).toBe('flex')
  expect(getComputedStyle(actions.element).flexDirection).toBe('row')
  const button = wrapper.get('.ui-app-layout-sidebar-switcher')
  const css = getComputedStyle(button.element)
  expect(css.padding).toBe('0px')
  expect(css.width).toBe('2rem')
  expect(css.height).toBe('2rem')
  const icon = button.get('[class*="icon:lucide:sidebar"]')
  expect(getComputedStyle(icon.element).flexShrink).toBe('0')
  expect(icon.element.style.width).toBe('18px')
  expect(actions.classes()).not.toContain('d-flex')
})
it.each([375,1280])('keeps UiDataTable rendered as a visible table at %s px', width => {
  setup(width)
  wrapper = mount(Konsta.components.DataTable,{attachTo:target,props:{data:[{name:'Cliente'}],header:{name:{label:'Nombre'}}},global:{plugins:[createVueSkin({adapter:Konsta,theme:{target,persist:false}})]}})
  expect(getComputedStyle(wrapper.element).minWidth).toBe('0')
  expect(getComputedStyle(wrapper.get('.table-container').element).overflowX).toBe('auto')
  expect(wrapper.get('table').isVisible()).toBe(true)
  expect(getComputedStyle(wrapper.get('table').element).display).toBe('table')
  expect(wrapper.get('tbody td').text()).toBe('Cliente')
})

it('renders with official Konsta UI table components and theme classes', () => {
  setup(1024)
  wrapper = mount(Konsta.components.DataTable, {
    attachTo: target,
    props: { data: [{ name: 'Cliente' }], header: { name: { label: 'Nombre' } } },
    global: { plugins: [createVueSkin({ adapter: Konsta, theme: { target, persist: false } })] }
  })
  const card = wrapper.get('.table-container')
  expect(card.classes()).toContain('k-card')
  const table = wrapper.get('table')
  expect(table.classes()).toContain('k-table')
  expect(table.classes()).toContain('ks-table')
  expect(wrapper.find('thead tr').exists()).toBe(true)
  expect(wrapper.find('tbody tr').exists()).toBe(true)
  expect(wrapper.get('tbody td').text()).toBe('Cliente')
})
