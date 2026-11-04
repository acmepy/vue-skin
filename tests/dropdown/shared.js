import { DOMWrapper, mount, flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createVueSkin } from '@vue-skin/core'
import { ref } from 'vue'

export function dropdownSuite(adapter, prefix) {
  let wrapper
  let target
  let stylesheet
  const items = [{ label:'Primero', value:1 }, { label:'Deshabilitado', disabled:true }, { label:'Último', value:3 }]
  function render(component = { template:'<UiCard title="Acciones"><UiDropdown label="Opciones" align="end" :items="items" /></UiCard>', setup: () => ({items}) }) {
    stylesheet = document.createElement('style')
    stylesheet.textContent = readFileSync(createRequire(import.meta.url).resolve('../../packages/'+adapter.name+'/src/styles/integration.css'), 'utf8')
    document.head.append(stylesheet)
    target = document.createElement('div')
    document.body.append(target)
    const skin = createVueSkin({ adapter, theme:{ persist:false, target } })
    wrapper = mount(component, { attachTo:target, global:{ plugins:[skin] } })
    return { surface:new DOMWrapper(target), dropdown:wrapper.findComponent(adapter.components.Dropdown) }
  }
  afterEach(() => { wrapper?.unmount(); target?.remove(); stylesheet?.remove(); vi.restoreAllMocks() })

  describe(adapter.name + ' CSS dropdown', () => {
    it('keeps the menu inside the themed card without clipping and positions it with CSS', async () => {
      const { surface, dropdown } = render()
      await dropdown.get('button').trigger('click')
      await flushPromises()
      const popup = surface.get('.'+prefix+'-dropdown-popover')
      expect(wrapper.element.contains(popup.element)).toBe(true)
      expect(popup.element.parentElement).toBe(dropdown.element)
      expect(target.hasAttribute('data-ui-'+adapter.name)).toBe(true)
      expect(getComputedStyle(wrapper.element).overflow).toBe('visible')
      expect(getComputedStyle(dropdown.element).position).toBe('relative')
      expect(getComputedStyle(popup.element).position).toBe('absolute')
      expect(getComputedStyle(popup.element).top).toBe('100%')
      expect(getComputedStyle(popup.element).zIndex).toBe('30')
      expect(popup.attributes('style')).toBeUndefined()
    })

    it('aligns the menu to either edge using the align prop', async () => {
      const align = ref('start')
      const { surface, dropdown } = render({ template:'<UiDropdown :items="items" :align="align" />', setup:()=>({items,align}) })
      await dropdown.get('button').trigger('click')
      await flushPromises()
      const popup = surface.get('.'+prefix+'-dropdown-popover')
      expect(getComputedStyle(popup.element).left).toBe('0px')
      align.value = 'end'
      await flushPromises()
      expect(getComputedStyle(popup.element).right).toBe('0px')
      expect(getComputedStyle(popup.element).left).toBe('auto')
    })

    it('stays inside a native dialog and preserves its local theme ancestry', async () => {
      const { surface, dropdown } = render({ template:'<dialog open><UiDropdown :items="items" /></dialog>', setup:()=>({items}) })
      await dropdown.get('button').trigger('click')
      await flushPromises()
      expect(surface.get('.'+prefix+'-dropdown-popover').element.closest('dialog')).toBe(wrapper.get('dialog').element)
    })

    it('navigates options, skips disabled items and restores focus on Escape', async () => {
      const { surface, dropdown } = render()
      await dropdown.get('button').trigger('keydown', { key:'ArrowDown' })
      await flushPromises()
      const options = surface.findAll('[role="menuitem"]')
      expect(document.activeElement).toBe(options[0].element)
      await options[0].trigger('keydown', { key:'ArrowDown' })
      expect(document.activeElement).toBe(options[2].element)
      await options[2].trigger('keydown', { key:'Escape' })
      await flushPromises()
      expect(surface.find('[role="menu"]').exists()).toBe(false)
      expect(document.activeElement).toBe(dropdown.get('button').element)
      for (const name of ['show','shown','hide','hidden']) expect(dropdown.emitted(name)).toHaveLength(1)
    })

    it('closes on outside interaction and removes the outside listener', async () => {
      const remove = vi.spyOn(document, 'removeEventListener')
      const { surface, dropdown } = render()
      await dropdown.get('button').trigger('click')
      await flushPromises()
      document.body.dispatchEvent(new Event('pointerdown', { bubbles:true }))
      await flushPromises()
      expect(surface.find('[role="menu"]').exists()).toBe(false)
      expect(remove).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    })

    it('keeps pointer interaction inside the menu and selects normally', async () => {
      const { surface, dropdown } = render()
      await dropdown.get('button').trigger('click')
      await flushPromises()
      const option = surface.get('[role="menuitem"]')
      await option.trigger('pointerdown')
      expect(surface.find('[role="menu"]').exists()).toBe(true)
      await option.trigger('click')
      expect(dropdown.emitted('select').at(-1)[0].value).toBe(1)
      expect(surface.find('[role="menu"]').exists()).toBe(false)
    })
  })
}
