import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../src/components/Input.vue'
import Select from '../src/components/Select.vue'
import App from '../../../playground/src/App.vue'
import { skin } from '../../../playground/src/skin.js'

describe('floating labels', () => {
  it('keeps normal labels by default and toggles floating without changing the field ID or value', async () => {
    const wrapper = mount(Input, { props: { label: 'Nombre', modelValue: 'Ana' } })
    try {
      const id = wrapper.get('input').attributes('id')
      expect(wrapper.find('.form-floating').exists()).toBe(false)
      expect(wrapper.get('label').classes()).toContain('form-label')
      await wrapper.setProps({ floating: true })
      expect(wrapper.get('.form-floating').element.children[0].tagName).toBe('INPUT')
      expect(wrapper.get('.form-floating').element.children[1].tagName).toBe('LABEL')
      expect(wrapper.get('input').attributes('placeholder')).toBe('Nombre')
      expect(wrapper.get('input').attributes('id')).toBe(id)
      expect(wrapper.get('label').attributes('for')).toBe(id)
      expect(wrapper.get('input').element.value).toBe('Ana')
      await wrapper.setProps({ floating: false })
      expect(wrapper.find('.form-floating').exists()).toBe(false)
      expect(wrapper.get('input').attributes('placeholder')).toBeUndefined()
    } finally { wrapper.unmount() }
  })

  it('preserves input attributes, events, validation and help/error associations', async () => {
    const wrapper = mount(Input, { props: { id: 'floating-email', floating: true, label: 'Correo', type: 'email', modelValue: '', placeholder: 'nombre@empresa.com', help: 'Ayuda', validator: () => { throw new Error('Correo inválido') } }, attrs: { class: 'custom', style: 'color: red', 'data-test': 'email' } })
    try {
      const input = wrapper.get('input')
      expect(input.attributes('placeholder')).toBe('nombre@empresa.com')
      expect(input.classes()).toContain('custom')
      expect(input.attributes('style')).toContain('color: red')
      expect(input.attributes('data-test')).toBe('email')
      await input.setValue('incorrecto')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['incorrecto'])
      await input.trigger('focus')
      await input.trigger('blur')
      await flushPromises()
      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.emitted('blur')).toHaveLength(1)
      expect(input.classes()).toContain('is-invalid')
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toContain(wrapper.get('.invalid-feedback').attributes('id'))
      expect(input.attributes('aria-describedby')).toContain(wrapper.get('.form-text').attributes('id'))
      expect(wrapper.find('.form-floating .invalid-feedback').exists()).toBe(false)
      expect(wrapper.find('.form-floating .form-text').exists()).toBe(false)
      expect(wrapper.get('.invalid-feedback').text()).toBe('Correo inválido')
    } finally { wrapper.unmount() }
  })

  it('keeps external errors, disabled and readonly states on floating controls', () => {
    const wrapper = mount(Input, { props: { floating: true, label: 'Nombre', modelValue: 'Ana', error: 'Error externo', disabled: true, readonly: true, required: true } })
    try {
      expect(wrapper.get('input').element.disabled).toBe(true)
      expect(wrapper.get('input').element.readOnly).toBe(true)
      expect(wrapper.get('input').element.required).toBe(true)
      expect(wrapper.get('.invalid-feedback').text()).toBe('Error externo')
    } finally { wrapper.unmount() }
  })

  it.each(['file', 'checkbox', 'color'])('uses the normal label for unsupported input type %s', type => {
    const wrapper = mount(Input, { props: { floating: true, label: 'Campo', type } })
    try { expect(wrapper.find('.form-floating').exists()).toBe(false) } finally { wrapper.unmount() }
  })

  it('does not create a floating wrapper without a label', () => {
    for (const component of [Input, Select]) {
      const wrapper = mount(component, { props: { floating: true } })
      try { expect(wrapper.find('.form-floating').exists()).toBe(false) } finally { wrapper.unmount() }
    }
  })

  it('floats select labels after the control and preserves options, value, errors and events', async () => {
    const wrapper = mount(Select, { props: { floating: true, label: 'Rol', modelValue: 'editor', placeholder: 'Seleccione', options: [{ value: 'admin', label: 'Administración' }, { value: 'editor', label: 'Edición' }], error: 'Seleccione otro rol', help: 'Ayuda' }, attrs: { class: 'custom' } })
    try {
      expect(wrapper.get('.form-floating').element.children[0].tagName).toBe('SELECT')
      expect(wrapper.get('.form-floating').element.children[1].tagName).toBe('LABEL')
      expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('select').attributes('id'))
      expect(wrapper.get('select').element.value).toBe('editor')
      expect(wrapper.get('select').classes()).toContain('custom')
      expect(wrapper.get('select').classes()).toContain('is-invalid')
      expect(wrapper.findAll('option')).toHaveLength(3)
      await wrapper.get('select').setValue('admin')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['admin'])
      expect(wrapper.emitted('change')).toHaveLength(1)
      expect(wrapper.find('.form-floating .invalid-feedback').exists()).toBe(false)
      await wrapper.setProps({ floating: false })
      expect(wrapper.find('.form-floating').exists()).toBe(false)
    } finally { wrapper.unmount() }
  })

  it.each([{ multiple: true }, { multiple: '' }, { size: 3 }])('uses normal labels for unsupported select attributes %j', attrs => {
    const wrapper = mount(Select, { props: { floating: true, label: 'Rol' }, attrs })
    try { expect(wrapper.find('.form-floating').exists()).toBe(false) } finally { wrapper.unmount() }
  })

  it('shows floating input/select examples and their code in the playground', async () => {
    const wrapper = mount(App, { global: { plugins: [skin] } })
    try {
      await wrapper.get('a[href="#input"]').trigger('click')
      expect(wrapper.findAll('.form-floating input')).toHaveLength(2)
      await wrapper.get('[role="tab"][id$="-code"]').trigger('click')
      expect(wrapper.get('pre').text()).toContain('label="Correo electrónico flotante" floating')
      await wrapper.get('a[href="#select"]').trigger('click')
      expect(wrapper.get('.form-floating label').text()).toBe('Rol flotante')
      await wrapper.get('[role="tab"][id$="-code"]').trigger('click')
      expect(wrapper.get('pre').text()).toContain('label="Rol flotante"')
      expect(wrapper.get('pre').text()).toContain('floating')
    } finally { wrapper.unmount() }
  })
})
