import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createVueSkin } from '@vue-skin/core'
import BootstrapSkin from '../src/index.js'
import { colors, contrast, createBootstrapTheme, themePalette } from '../src/theme.js'
import App from '../../../playground/src/App.vue'

const wrappers = []
const targets = []
function render(template = '<UiThemeSelector inline /><UiThemeSwitcher /><UiThemeSwitcher />', options = {}) {
  const target = document.createElement('div')
  document.body.append(target)
  targets.push(target)
  const skin = createVueSkin({ adapter: BootstrapSkin, theme: { persist: false, target, ...options } })
  const wrapper = mount(typeof template === 'string' ? { template } : template, { attachTo: target, global: { plugins: [skin] } })
  wrappers.push(wrapper)
  return { wrapper, theme: skin.theme, target }
}
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  targets.splice(0).forEach(target => target.remove())
  localStorage.clear()
})

describe('Bootstrap appearance', () => {
  it('varies accent intensity independently of neutral/tinted backgrounds in both modes', () => {
    for (const resolvedMode of ['light', 'dark']) {
      const plain = themePalette({ color: 'purple', resolvedMode })
      const vibrant = themePalette({ color: 'purple', resolvedMode, vibrant: true })
      const tinted = themePalette({ color: 'purple', resolvedMode, monochrome: false })
      expect(plain.accent).not.toBe(vibrant.accent)
      expect(plain.body).toBe(vibrant.body)
      expect(plain.accent).toBe(tinted.accent)
      expect(plain.body).not.toBe(tinted.body)
      expect(plain.tertiary).not.toBe(tinted.tertiary)
    }
  })

  it('maintains at least 4.5:1 contrast for primary button labels and links across all palettes', () => {
    for (const color of colors.map(item => item.value)) for (const resolvedMode of ['light', 'dark']) for (const vibrant of [false, true]) for (const monochrome of [false, true]) {
      const palette = themePalette({ color, resolvedMode, vibrant, monochrome })
      expect(contrast(palette.accent, palette.foreground)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(palette.link, palette.body)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('applies scoped Bootstrap variables and component states without changing semantic palettes', () => {
    const target = document.createElement('div')
    target.setAttribute('data-bs-theme', 'light')
    const controller = createBootstrapTheme({ target })
    try {
      controller.apply({ color: 'orange', vibrant: true, monochrome: false, resolvedMode: 'dark' })
      const id = target.getAttribute('data-ui-theme')
      const css = document.querySelector(`[data-ui-theme-style="${id}"]`).textContent
      expect(target.getAttribute('data-bs-theme')).toBe('dark')
      for (const value of ['--bs-primary:', '--bs-body-bg:', '.btn-primary', '--bs-btn-hover-bg:', '--bs-btn-disabled-bg:', '.btn-outline-primary', '.form-control', '.list-group', '.alert-primary']) expect(css).toContain(value)
      expect(css).not.toContain('--bs-danger:')
      expect(css).not.toContain('--bs-success:')
      expect(css).not.toContain('--bs-warning:')
      expect(css).not.toContain('filter: brightness')
    } finally { controller.dispose() }
    expect(target.getAttribute('data-bs-theme')).toBe('light')
    expect(target.hasAttribute('data-ui-theme')).toBe(false)
  })

  it('synchronizes mode, palette and switches between every control and emits snapshots', async () => {
    const { wrapper, theme } = render()
    await wrapper.get('.ui-theme-mode[aria-label="Oscuro"]').trigger('click')
    expect(theme.state.mode).toBe('dark')
    expect(wrapper.findAll('button[aria-label="Activar modo claro"]')).toHaveLength(2)
    await wrapper.get('button[aria-label="Activar modo claro"]').trigger('click')
    expect(wrapper.get('.ui-theme-mode[aria-label="Claro"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.findAll('button[aria-label="Activar modo oscuro"]')).toHaveLength(2)
    await wrapper.get('button[aria-label="Violeta"]').trigger('click')
    const switches = wrapper.findAll('[role="switch"]')
    await switches[0].setValue(true)
    await switches[1].setValue(false)
    expect(theme.state).toMatchObject({ color: 'purple', vibrant: true, monochrome: false })
    const selector = wrapper.findComponent(BootstrapSkin.components.ThemeSelector)
    expect(selector.emitted('change').at(-1)[0]).toMatchObject({ color: 'purple', vibrant: true, monochrome: false })
    await wrapper.findAll('button').find(button => button.text() === 'Restablecer apariencia').trigger('click')
    expect(theme.state).toEqual({ mode: 'system', color: 'blue', vibrant: false, monochrome: true })
  })

  it('supports v-model preferences and programmatic updates without feedback loops', async () => {
    const { wrapper, theme } = render({ data: () => ({ preferences: { mode: 'dark', color: 'pink', vibrant: true, monochrome: false } }), template: '<UiThemeSelector v-model="preferences" />' })
    expect(theme.state.color).toBe('pink')
    theme.setColor('green')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.preferences.color).toBe('green')
    wrapper.vm.preferences = { mode: 'light', color: 'orange', vibrant: false, monochrome: true }
    await wrapper.vm.$nextTick()
    expect(theme.state).toEqual(wrapper.vm.preferences)
  })

  it('isolates scoped applications and removes generated CSS on unmount', async () => {
    const first = render('<UiThemeSelector />')
    const second = render('<UiThemeSelector />')
    first.theme.setColor('pink')
    expect(second.theme.state.color).toBe('blue')
    const id = first.target.getAttribute('data-ui-theme')
    first.wrapper.unmount()
    expect(document.querySelector(`[data-ui-theme-style="${id}"]`)).toBeNull()
    expect(second.target.hasAttribute('data-ui-theme')).toBe(true)
    wrappers.splice(wrappers.indexOf(first.wrapper), 1)
  })

  it('restores the complete persisted appearance in a newly mounted application', () => {
    const first = render('<UiThemeSelector />', { persist: true })
    first.theme.setTheme({ mode: 'dark', color: 'teal', vibrant: true, monochrome: false })
    const second = render('<UiThemeSelector />', { persist: true })
    expect(second.theme.state).toEqual({ mode: 'dark', color: 'teal', vibrant: true, monochrome: false })
    expect(second.target.getAttribute('data-bs-theme')).toBe('dark')
  })

  it('does not read a legacy custom switcher key or persist changes when disabled by the application', async () => {
    localStorage.setItem('custom-mode', 'dark')
    const { wrapper, theme } = render('<UiThemeSwitcher storage-key="custom-mode" />', { persist: false, mode: 'light' })
    expect(theme.state.mode).toBe('light')
    await wrapper.get('button').trigger('click')
    await wrapper.get('button').trigger('click')
    expect(localStorage.getItem('custom-mode')).toBe('dark')
    expect(localStorage.getItem('vue-skin:theme')).toBeNull()
  })

  it('shows the selector, preview and complete source in the playground', async () => {
    const { wrapper } = render(App)
    await wrapper.get('a[href="#theme-selector"]').trigger('click')
    expect(wrapper.get('nav [aria-haspopup="dialog"]').attributes('aria-label')).toBe('Apariencia')
    expect(wrapper.findAll('.ui-theme-selector-panel')).toHaveLength(0)
    const trigger = wrapper.get('main [aria-haspopup="dialog"]')
    await trigger.trigger('click')
    const modal = wrapper.get(`[id="${trigger.attributes('aria-controls')}"]`)
    await new Promise(resolve => modal.element.addEventListener('shown.bs.modal', resolve, { once: true }))
    expect(wrapper.findAll('.ui-theme-selector .ui-theme-mode')).toHaveLength(3)
    expect(wrapper.findAll('.ui-theme-selector .ui-theme-color[aria-pressed]')).toHaveLength(8)
    const hidden = new Promise(resolve => modal.element.addEventListener('hidden.bs.modal', resolve, { once: true }))
    await modal.get('button[aria-label="Cerrar"]').trigger('click')
    await hidden
    await wrapper.vm.$nextTick()
    await wrapper.get('[role="tab"][id$="-code"]').trigger('click')
    expect(wrapper.get('pre').text()).toContain('<UiThemeSelector />')
    expect(wrapper.get('pre').text()).toContain('useTheme')
  })

  it('opens a small centered modal with color-only buttons, closes it and restores focus', async () => {
    const { wrapper, theme } = render('<UiThemeSelector label="Personalizar apariencia" />')
    const trigger = wrapper.get('button[aria-haspopup="dialog"]')
    expect(trigger.attributes('title')).toBe('Personalizar apariencia')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.modal').exists()).toBe(false)
    await trigger.trigger('click')
    const modal = wrapper.get(`[id="${trigger.attributes('aria-controls')}"]`)
    await new Promise(resolve => modal.element.addEventListener('shown.bs.modal', resolve, { once: true }))
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(modal.attributes('id'))
    expect(modal.get('.modal-dialog').classes()).toEqual(expect.arrayContaining(['modal-sm', 'modal-dialog-centered']))
    expect(modal.get('.modal-title').text()).toBe('Personalizar apariencia')
    for (const color of colors) {
      const button = modal.get(`button[aria-label="${color.label}"]`)
      expect(button.text()).toBe('')
      expect(button.attributes('title')).toBe(color.label)
      expect(button.attributes('style')).toContain(color.color)
    }
    await modal.get('button[aria-label="Violeta"]').trigger('click')
    expect(theme.state.color).toBe('purple')
    expect(modal.get('button[aria-label="Violeta"]').attributes('aria-pressed')).toBe('true')
    const hidden = new Promise(resolve => modal.element.addEventListener('hidden.bs.modal', resolve, { once: true }))
    await modal.get('button[aria-label="Cerrar"]').trigger('click')
    await hidden
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal').exists()).toBe(false)
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)
    expect(theme.state.color).toBe('purple')
  })

  it('shows only sun, moon and half-circle icons for appearance, with tooltips and exclusive selection', async () => {
    const { wrapper, theme } = render('<UiThemeSelector inline />')
    for (const [label, icon, mode] of [['Claro', 'mdi:weather-sunny', 'light'], ['Oscuro', 'mdi:weather-night', 'dark'], ['Sistema', 'mdi:circle-half-full', 'system']]) {
      const button = wrapper.get(`.ui-theme-mode[aria-label="${label}"]`)
      expect(button.text()).toBe('')
      expect(button.attributes('title')).toBe(label)
      expect(button.get('span').classes()).toContain(`icon:${icon}`)
      expect(button.get('span').attributes('aria-hidden')).toBe('true')
      await button.trigger('click')
      expect(theme.state.mode).toBe(mode)
      expect(button.attributes('aria-pressed')).toBe('true')
      expect(wrapper.findAll('.ui-theme-mode[aria-pressed="true"]')).toHaveLength(1)
    }
  })
})
