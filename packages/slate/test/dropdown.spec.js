import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import adapter from '../src/index.js'
import { createVueSkin } from '@vue-skin/core'
import { dropdownSuite } from '../../../tests/dropdown/shared.js'

dropdownSuite(adapter, 'sl')

describe('Slate popover pilot', () => {
  it('exposes popover="manual" and calls showPopover when opened in supported environments', async () => {
    const showPopover = vi.fn()
    const hidePopover = vi.fn()
    HTMLElement.prototype.showPopover = showPopover
    HTMLElement.prototype.hidePopover = hidePopover
    try {
      const skin = createVueSkin({ adapter, theme: { persist: false } })
      const wrapper = mount(adapter.components.Dropdown, {
        props: { label: 'Opciones', items: [{ label: 'Uno', value: 1 }] },
        global: { plugins: [skin] }
      })
      const button = wrapper.get('button')
      await button.trigger('click')
      await flushPromises()
      const popover = wrapper.get('.sl-dropdown-popover')
      expect(popover.attributes('popover')).toBe('manual')
      expect(showPopover).toHaveBeenCalled()

      await button.trigger('click')
      await flushPromises()
      expect(hidePopover).toHaveBeenCalled()
      wrapper.unmount()
    } finally {
      delete HTMLElement.prototype.showPopover
      delete HTMLElement.prototype.hidePopover
    }
  })
})
