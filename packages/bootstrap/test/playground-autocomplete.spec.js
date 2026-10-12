import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../../../playground/src/App.vue'
import { skin } from '../../../playground/src/skin.js'

describe('playground autocomplete with 1000 elements', () => {
  it('filters the real demo data and displays the selected value', async () => {
    const wrapper = mount(App, { global: { plugins: [skin] } })
    try {
      await wrapper.get('a[href="#autocomplete"]').trigger('click')
      const input = wrapper.get('[data-test="autocomplete-large"]')
      await input.trigger('focus')
      await input.setValue('cliente 00')
      await input.trigger('blur')
      expect(input.classes()).toContain('is-invalid')
      expect(wrapper.text()).toContain('Seleccione una opción de la lista.')
      await input.trigger('focus')
      await input.setValue('cliente')
      expect(wrapper.findAll('[role="option"]')).toHaveLength(1000)
      expect(wrapper.findAll('[role="option"]').at(-1).text()).toBe('Cliente 1000')
      await input.setValue('0999')
      expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
      expect(wrapper.get('[role="option"]').text()).toBe('Cliente 0999')
      await wrapper.get('[role="option"]').trigger('click')
      expect(input.element.value).toBe('Cliente 0999')
      expect(wrapper.text()).toContain('value seleccionado: 999')
      await input.trigger('blur')
      expect(input.classes()).not.toContain('is-invalid')
      await input.trigger('focus')
      await input.setValue('1000')
      expect(wrapper.text()).toContain('value seleccionado: —')
      await wrapper.get('[role="option"]').trigger('click')
      expect(wrapper.text()).toContain('value seleccionado: 1000')
      await wrapper.get('[role="tab"][id$="-code"]').trigger('click')
      expect(wrapper.get('pre').text()).toContain('Array.from({ length: 1000 }')
    } finally {
      wrapper.unmount()
    }
  })
})
