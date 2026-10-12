import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../src/index.js'
import App from '../../../playground/src/App.vue'
import { uiDialog } from '../../../playground/src/skin.js'

const data = [
  { id: 1, name: 'María', balance: 0, details: { city: 'Asunción' } },
  { id: 2, name: 'Luis', balance: 20, details: { city: 'Lima' } }
]
const header = { id: { label: 'ID' }, name: { label: 'Nombre' }, balance: { label: 'Saldo', align: 'end' } }
const render = (props = {}, slots = {}) => mount(BootstrapSkin.components.DataTable, {
  props: { data, header, ...props }, slots,
  global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] }
})

describe('UiDataTable', () => {
  it('renders general actions outside the search form and provides the applied filtered rows', async () => {
    const wrapper = mount({
      data: () => ({ data, header, exported: null, count: 0 }),
      template: '<UiDataTable :data="data" :header="header" filter><template #actions="{ data, total }"><UiButton @click="exported = data; count++">Exportar {{ data.length }}/{{ total }}</UiButton></template></UiDataTable>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })
    try {
      const action = wrapper.get('.ui-data-table-actions button')
      const toolbar = wrapper.get('.ui-data-table-toolbar')
      expect(toolbar.classes()).toContain('col-12')
      expect(toolbar.classes()).toContain('col-lg-6')
      expect(toolbar.get('form').element.parentElement).toBe(toolbar.element)
      expect(toolbar.get('.ui-data-table-actions').element.parentElement).toBe(toolbar.element)
      expect(action.element.closest('form')).toBeNull()
      expect(action.text()).toBe('Exportar 2/2')
      expect(wrapper.findAll('th')).toHaveLength(2)
      await wrapper.get('input').setValue('Luis')
      await action.trigger('click')
      expect(wrapper.vm.count).toBe(1)
      expect(wrapper.vm.exported).toEqual(data)
      expect(wrapper.findAll('tbody tr')).toHaveLength(2)
      await wrapper.get('form').trigger('submit')
      expect(action.text()).toBe('Exportar 1/2')
      await action.trigger('click')
      expect(wrapper.vm.exported).toEqual([data[1]])
      await wrapper.get('input').setValue('')
      expect(action.text()).toBe('Exportar 2/2')
    } finally { wrapper.unmount() }
  })

  it('supports actions without a filter and hides the toolbar when neither is provided', async () => {
    const wrapper = render({}, { actions: '<button type="button">Agregar</button>' })
    const plain = render()
    try {
      expect(wrapper.find('form').exists()).toBe(false)
      expect(wrapper.get('.ui-data-table-actions').text()).toBe('Agregar')
      expect(plain.find('.ui-data-table-toolbar').exists()).toBe(false)
      await wrapper.setProps({ filter: true })
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.get('.ui-data-table-actions').text()).toBe('Agregar')
    } finally { wrapper.unmount(); plain.unmount() }
  })

  it('demonstrates general actions and the renamed row buttons in the playground', async () => {
    const prompt = vi.spyOn(uiDialog, 'prompt').mockResolvedValue('Nuevo cliente')
    const wrapper = mount(App, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })
    try {
      await wrapper.get('a[href="#data-table-column-button"]').trigger('click')
      expect(wrapper.find('a[href="#data-table-button"]').exists()).toBe(false)
      const actions = wrapper.findAll('.ui-data-table-actions button')
      expect(actions.map(button => button.attributes('title'))).toEqual(['Agregar cliente', 'Exportar JSON'])
      expect(actions.map(button => button.attributes('aria-label'))).toEqual(['Agregar cliente', 'Exportar JSON'])
      expect(actions.map(button => button.text())).toEqual(['', ''])
      expect(wrapper.get('.ui-data-table-actions [role="group"]').attributes('aria-label')).toBe('Acciones de clientes')
      expect(wrapper.findAll('.ui-data-table-actions [aria-hidden="true"]')).toHaveLength(2)
      expect(wrapper.findAll('tbody tr')).toHaveLength(3)
      await actions[0].trigger('click')
      await flushPromises()
      expect(prompt).toHaveBeenCalledWith('Ingrese el nombre del cliente.', 'Agregar cliente', { label: 'Nombre' })
      expect(wrapper.findAll('tbody tr')).toHaveLength(4)
      expect(wrapper.get('tbody').text()).toContain('Nuevo cliente')
      await wrapper.get('[role="tab"][id$="-code"]').trigger('click')
      const code = wrapper.get('pre').text()
      expect(code).toContain('<template #actions="{ data }">')
      expect(code).toContain('UiDataTableColumnButton')
      expect(code).toContain('function exportTableClients(rows)')
      expect(code).toContain('<UiButtonGroup label="Acciones de clientes">')
      expect(code).toContain('name="mdi:plus"')
      expect(code).toContain('name="mdi:download"')
    } finally { wrapper.unmount(); prompt.mockRestore() }
  })
  it('provides actions with the correct filtered row and counts the detail column when empty', async () => {
    const wrapper = mount({
      data: () => ({ data, header, selected: null, items: [{ label: 'Editar', value: 'edit' }] }),
      template: '<UiDataTable :data="data" :header="header" filter detail-label="Opciones"><template #detail="{ row }"><UiDataTableColumnButton :items="items" @select="selected = { item: $event, row }" /></template></UiDataTable>'
    }, { global: { plugins: [createVueSkin({ adapter: BootstrapSkin })] } })
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['Nombre', 'Saldo', 'Opciones'])
    await wrapper.get('input').setValue('Luis')
    await wrapper.get('form').trigger('submit')
    await wrapper.get('tbody button').trigger('click')
    expect(wrapper.vm.selected).toEqual({ item: { label: 'Editar', value: 'edit' }, row: data[1] })
    await wrapper.get('input').setValue('no match')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('tbody td').attributes('colspan')).toBe('3')
    wrapper.unmount()
  })

  it('renders field labels and values, and hides or shows the real id', async () => {
    const wrapper = render({ footer: 'Clientes' })
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['Nombre', 'Saldo'])
    expect(wrapper.get('tbody tr td.text-end').text()).toBe('0')
    expect(wrapper.get('footer').text()).toBe('Clientes')
    await wrapper.setProps({ showId: true })
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['ID', 'Nombre', 'Saldo'])
    expect(wrapper.get('tbody tr td').text()).toBe('1')
  })

  it('searches values only on submit, ignores accents and restores data when cleared', async () => {
    const wrapper = render({ filter: true }, { footer: '<template #default="{ data, total }">{{ data.length }}/{{ total }}</template>' })
    await wrapper.get('input').setValue('ASUNCION')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('tbody').text()).toContain('María')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.get('footer').text()).toBe('1/2')
    await wrapper.get('input').setValue('no match')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('tbody').text()).toBe('Sin resultados')
    await wrapper.get('input').setValue('')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(data).toHaveLength(2)
  })

  it('infers columns across rows and supports empty data', async () => {
    const wrapper = render({ header: {}, data: [{ id: 7, name: 'Ana' }, { id: 8, extra: 'Dato' }] })
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['name', 'extra'])
    await wrapper.setProps({ data: [] })
    expect(wrapper.get('tbody').text()).toBe('Sin resultados')
  })
})
