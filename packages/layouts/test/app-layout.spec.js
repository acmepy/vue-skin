import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { UiAppLayout } from '../src/index.js'

const components = {
  UiSidebar: { props: ['modelValue', 'width'], template: '<aside><slot name="header" /><slot /></aside>' },
  UiNavbar: { props: ['title'], template: '<nav>{{ title }}<slot name="start" /><slot name="end" /></nav>' },
  UiButton: { template: '<button><slot name="icon" /><slot /></button>' },
  UiIcon: { template: '<span />' },
  UiThemeSwitcher: { template: '<button aria-label="Tema" />' },
  UiThemeSelector: { template: '<button aria-label="Apariencia" />' },
  UiList: { template: '<div><slot /></div>' },
  UiListItem: { props: ['title', 'active'], emits: ['click'], template: '<button data-test="section" :data-active="active" @click="$emit(\'click\', $event)">{{ title }}</button>' }
}

describe('UiAppLayout', () => {
  it('defaults the sidebar width to 15rem and forwards reactive CSS widths', async () => {
    const wrapper = mount(UiAppLayout, { global: { components } })
    try {
      const sidebar = wrapper.getComponent(components.UiSidebar)
      expect(sidebar.props('width')).toBe('15rem')
      await wrapper.setProps({ sidebarWidth: '18rem' })
      expect(sidebar.props('width')).toBe('18rem')
      await wrapper.setProps({ sidebarWidth: '280px' })
      expect(sidebar.props('width')).toBe('280px')
      await wrapper.setProps({ sidebarWidth: undefined })
      expect(sidebar.props('width')).toBe('15rem')
    } finally { wrapper.unmount() }
  })

  it('forwards a custom header template instead of the text fallback', () => {
    const wrapper = mount(UiAppLayout, {
      props: { title: 'Proyecto', header: 'Texto predeterminado' },
      slots: { header: '<div class="brand"><img src="/logo.svg" alt="Mi empresa"><h2>Mi empresa</h2><p>Primera línea<br>Segunda línea</p><button>Perfil</button></div>' },
      global: { components }
    })
    expect(wrapper.get('aside .brand img').attributes('alt')).toBe('Mi empresa')
    expect(wrapper.get('aside .brand h2').text()).toBe('Mi empresa')
    expect(wrapper.get('aside .brand p br').exists()).toBe(true)
    expect(wrapper.get('aside .brand button').text()).toBe('Perfil')
    expect(wrapper.get('aside').text()).not.toContain('Texto predeterminado')
    expect(wrapper.get('nav').text()).toContain('Proyecto')
    expect(wrapper.get('nav button[aria-label="Apariencia"]').exists()).toBe(true)
    wrapper.unmount()
  })

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
