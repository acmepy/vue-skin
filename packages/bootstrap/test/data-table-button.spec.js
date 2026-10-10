import { mount } from '@vue/test-utils'
import { toRaw } from 'vue'
import { describe, expect, it } from 'vitest'
import BootstrapSkin from '../src/index.js'

describe('UiDataTableButton', () => {
  it('renders links and buttons, icons and emits the original selected option', async () => {
    const items = [
      { label: 'Ver', icon: 'mdi:eye', link: '#cliente-1' },
      { label: 'Editar', icon: 'mdi:pencil', value: 'edit' }
    ]
    const wrapper = mount(BootstrapSkin.components.DataTableButton, { props: { items } })
    expect(wrapper.get('a').attributes('href')).toBe('#cliente-1')
    expect(wrapper.get('button').attributes('type')).toBe('button')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Editar')
    expect(wrapper.get('button').attributes('title')).toBe('Editar')
    expect(wrapper.get('button').text()).toBe('')
    expect(wrapper.get('a').attributes('title')).toBe('Ver')
    expect(wrapper.get('a').text()).toBe('')
    expect(wrapper.findAll('[aria-hidden="true"]')).toHaveLength(2)
    await wrapper.get('button').trigger('click')
    expect(toRaw(wrapper.emitted('select')?.[0]?.[0])).toBe(items[1])
    await wrapper.get('a').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('blocks disabled actions and disabled links', async () => {
    const wrapper = mount(BootstrapSkin.components.DataTableButton, { props: { items: [
      { label: 'Borrar', disabled: true },
      { label: 'Ver', link: '/clientes/1', disabled: true }
    ] } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').text()).toBe('Borrar')
    expect(wrapper.get('a').attributes('href')).toBeUndefined()
    expect(wrapper.get('a').attributes('tabindex')).toBe('-1')
    await wrapper.get('button').trigger('click')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    wrapper.get('a').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
