import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../../../playground/src/App.vue'
import { skin } from '../../../playground/src/skin.js'

describe('playground input error example', () => {
  it('validates on blur, clears the error while editing and documents the same behavior', async () => {
    const wrapper = mount(App, {
      global: { plugins: [skin] }
    })
    try {
      await wrapper.get('a[href="#input"]').trigger('click')
      const label = wrapper.findAll('label').find((item) => item.text() === 'Correo de registro')
      const input = wrapper.get(`input[id="${label.attributes('for')}"]`)
      expect(wrapper.text()).toContain('Este correo ya está registrado.')
      await input.setValue('otro@ejemplo.com')
      await input.trigger('blur')
      await flushPromises()
      expect(input.classes()).not.toContain('is-invalid')
      await input.setValue('correo inválido')
      expect(input.classes()).not.toContain('is-invalid')
      await input.trigger('blur')
      await flushPromises()
      expect(wrapper.text()).toContain('Ingrese un correo válido.')
      expect(input.attributes('aria-invalid')).toBe('true')
      await input.setValue('')
      await input.trigger('blur')
      await flushPromises()
      expect(wrapper.text()).toContain('Ingrese un correo.')
      await input.setValue('ANA@EJEMPLO.COM')
      await input.trigger('blur')
      await flushPromises()
      expect(wrapper.text()).toContain('Este correo ya está registrado.')
      await wrapper.get('[role="tab"][id$="-code"]').trigger('click')
      const code = wrapper.get('pre').text()
      expect(code).toContain('@blur="validateRegistrationEmail"')
      expect(code).toContain('/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/')
    } finally {
      wrapper.unmount()
    }
  })
})
