import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVueSkin } from '@vue-skin/core'
import Konsta from '../src/index.js'

describe('Konsta input group', () => {
  it('overrides standalone input borders and lets the field shrink beside its button', async () => {
    const style = document.createElement('style')
    style.textContent = readFileSync(createRequire(import.meta.url).resolve('../src/styles/integration.css'), 'utf8')
    document.head.append(style)
    const wrapper = mount({ props: ['error'], template: '<UiInputGroup :error="error"><template #suffix><UiButton>Buscar</UiButton></template></UiInputGroup>' }, {
      attachTo: document.body,
      global: { plugins: [createVueSkin({ adapter: Konsta, theme: { persist: false } })] }
    })
    try {
      const input = wrapper.get('input')
      const css = getComputedStyle(input.element)
      expect(css.borderTopWidth).toBe('0px')
      expect(css.borderRadius).toBe('0')
      expect(css.minWidth).toBe('0')
      expect(css.width).toBe('0px')
      expect(getComputedStyle(wrapper.get('button').element).borderRadius).toBe('0')
      await input.setValue('Cliente')
      expect(wrapper.findComponent(Konsta.components.InputGroup).emitted('update:modelValue').at(-1)).toEqual(['Cliente'])
      await wrapper.setProps({ error: 'Requerido' })
      expect(wrapper.get('.ks-input-group').classes()).toContain('ks-input-group-invalid')
      expect(input.attributes('aria-invalid')).toBe('true')
    } finally { wrapper.unmount(); style.remove() }
  })
})
