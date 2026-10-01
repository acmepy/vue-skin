import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { UiLogin } from '../src/index.js'

const components = {
  UiIcon: { template: '<span />' },
  UiInput: { props: ['modelValue', 'type', 'label'], emits: ['update:modelValue'], template: '<input :type="type" :value="modelValue" :aria-label="label" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  UiCheckbox: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />{{ label }}</label>' },
  UiButton: { props: ['type', 'loading', 'disabled'], template: '<button :type="type" :disabled="disabled || loading"><slot /></button>' }
}

describe('UiLogin', () => {
  it('binds credentials and emits them on submit', async () => {
    const wrapper = mount(UiLogin, {
      props: { email: 'ana@example.com', password: 'secret', remember: true, fullHeight: false },
      global: { components }
    })

    expect(wrapper.text()).toContain('Iniciar sesión')
    expect(wrapper.find('main').classes()).not.toContain('ui-login-full-height')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')?.[0]).toEqual([{ email: 'ana@example.com', password: 'secret', remember: true }])
  })
})
