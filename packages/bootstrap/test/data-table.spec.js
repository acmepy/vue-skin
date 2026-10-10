import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../src/index.js'

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
  it('provides actions with the correct filtered row and counts the detail column when empty', async () => {
    const wrapper = mount({
      data: () => ({ data, header, selected: null, items: [{ label: 'Editar', value: 'edit' }] }),
      template: '<UiDataTable :data="data" :header="header" filter detail-label="Opciones"><template #detail="{ row }"><UiDataTableButton :items="items" @select="selected = { item: $event, row }" /></template></UiDataTable>'
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
