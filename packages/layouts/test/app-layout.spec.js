import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { UiAppLayout } from '../src/index.js'

const components = {
  UiSidebar: { props: ['modelValue'], template: '<aside><slot name="header" /><slot /></aside>' },
  UiNavbar: { props: ['title'], template: '<nav>{{ title }}<slot name="start" /><slot name="end" /></nav>' },
  UiButton: { template: '<button><slot name="icon" /><slot /></button>' },
  UiIcon: { template: '<span />' },
  UiThemeSwitcher: { template: '<button aria-label="Tema" />' },
  UiList: { template: '<div><slot /></div>' },
  UiListItem: { props: ['title', 'active'], emits: ['click'], template: '<button data-test="section" :data-active="active" @click="$emit(\'click\', $event)">{{ title }}</button>' }
}

describe('UiAppLayout', () => {
  it('renders integrated navigation and updates the selected section', async () => {
    const wrapper = mount(UiAppLayout, {
      props: { modelValue: 'home', title: 'Proyecto', header: 'Navegación', sections: [{ id: 'layouts', title: 'Layouts', groupTitle: true }, ['home', 'Inicio'], ['settings', 'Ajustes']] },
      global: { components }
    })

    expect(wrapper.get('nav').text()).toContain('Proyecto')
    expect(wrapper.get('aside').text()).toContain('Navegación')
    const sections = wrapper.findAll('[data-test="section"]')
    expect(sections[1].attributes('data-active')).toBe('true')
    await sections[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['settings'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'settings', title: 'Ajustes' })
  })
})
