import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Autocomplete from '../src/components/Autocomplete.vue'

const data = ['Asunción', 'Encarnación', 'Concepción', 'Ciudad del Este']
const wrappers = []
function render(props = {}, attrs = {}) {
  const wrapper = mount(Autocomplete, { props: { data, ...props }, attrs })
  wrappers.push(wrapper)
  return wrapper
}
afterEach(() => { wrappers.splice(0).forEach((wrapper) => wrapper.unmount()) })
const options = (wrapper) => wrapper.findAll('[role="option"]').map((option) => option.text())

describe('UiAutocomplete', () => {
  it('starts at two characters and matches any part of labels, ignoring case and accents', async () => {
    const wrapper = render()
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('c')
    expect(options(wrapper)).toEqual([])
    expect(input.attributes('aria-expanded')).toBe('false')
    await input.setValue('CIÓN')
    expect(options(wrapper)).toEqual(['Asunción', 'Encarnación', 'Concepción'])
    expect(wrapper.get('[role="listbox"]').attributes('id')).toBe(input.attributes('aria-controls'))
    await input.setValue('zz')
    expect(wrapper.get('[role="status"]').text()).toBe('Sin resultados')
    expect(data).toEqual(['Asunción', 'Encarnación', 'Concepción', 'Ciudad del Este'])
  })

  it('supports custom thresholds including zero, but opens only when focused', async () => {
    const wrapper = render({ minLength: 3, modelValue: 'ci' })
    expect(options(wrapper)).toEqual([])
    const input = wrapper.get('input')
    await input.trigger('focus')
    expect(options(wrapper)).toEqual([])
    await input.setValue('ciu')
    expect(options(wrapper)).toEqual(['Ciudad del Este'])
    await wrapper.setProps({ minLength: 0, modelValue: '' })
    expect(options(wrapper)).toEqual(data)
    await input.setValue('   ')
    await wrapper.setProps({ minLength: 2 })
    expect(options(wrapper)).toEqual([])
  })

  it('selects the original object by pointer, writes its label and closes without blurring', async () => {
    const item = { label: 'Ana Gómez', value: 7 }
    const wrapper = render({ data: [item] })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('gó')
    await wrapper.get('[role="option"]').trigger('pointerdown')
    await wrapper.get('[role="option"]').trigger('click')
    expect(input.element.value).toBe('Ana Gómez')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['Ana Gómez'])
    expect(wrapper.emitted('select')[0]).toEqual([item])
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('blur')).toBeUndefined()
  })

  it('supports arrows, Escape, Enter and Tab without forcing a selection', async () => {
    const wrapper = render()
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('ci')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.get('[aria-selected="true"]').text()).toBe('Asunción')
    expect(input.attributes('aria-activedescendant')).toBe(wrapper.get('[aria-selected="true"]').attributes('id'))
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.get('[aria-selected="true"]').text()).toBe('Ciudad del Este')
    await input.trigger('keydown', { key: 'Escape' })
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(input.element.value).toBe('ci')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')[0]).toEqual(['Asunción'])
    await input.setValue('ci')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')).toHaveLength(1)
    await input.trigger('keydown', { key: 'Tab' })
    expect(input.attributes('aria-expanded')).toBe('false')
  })

  it.each(['disabled', 'readonly'])('does not offer suggestions when %s', async (prop) => {
    const wrapper = render({ [prop]: true, modelValue: 'ci' })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(options(wrapper)).toEqual([])
    expect(input.attributes(prop)).toBeDefined()
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('reacts to data and external text changes', async () => {
    const wrapper = render()
    await wrapper.get('input').trigger('focus')
    await wrapper.setProps({ modelValue: 'ci' })
    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.setProps({ data: ['Nueva ciudad'] })
    expect(options(wrapper)).toEqual(['Nueva ciudad'])
    expect(wrapper.get('input').attributes('aria-activedescendant')).toBeUndefined()
  })

  it('assigns unique list IDs to multiple fields within the same application', async () => {
    const wrapper = mount({
      components: { Autocomplete },
      template: '<Autocomplete model-value="ci" :data="[\'Ciudad\']" /><Autocomplete model-value="ci" :data="[\'Ciudad\']" />'
    })
    wrappers.push(wrapper)
    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('focus')
    await inputs[1].trigger('focus')
    expect(inputs[0].attributes('aria-controls')).not.toBe(inputs[1].attributes('aria-controls'))
  })

  it('retains input styling, attrs, labels, help and external errors', () => {
    const wrapper = render({ id: 'city', label: 'Ciudad', help: 'Ayuda', error: 'Elige otra ciudad', tooltip: 'Ubicación' }, { class: 'custom', style: 'color: red', 'data-test': 'city' })
    const input = wrapper.get('input')
    expect(wrapper.get('label').attributes('for')).toBe('city')
    expect(input.classes()).toEqual(expect.arrayContaining(['form-control', 'custom', 'is-invalid']))
    expect(input.attributes('style')).toContain('color: red')
    expect(input.attributes('data-test')).toBe('city')
    expect(input.attributes('aria-invalid')).toBe('true')
    for (const id of input.attributes('aria-describedby').split(' ')) expect(wrapper.find(`[id="${id}"]`).exists()).toBe(true)
  })

  it('closes on blur and validates asynchronously on blur or via validate()', async () => {
    const validator = vi.fn(async (value) => { if (value === 'ci') throw new Error('Ciudad incompleta') })
    const wrapper = render({ validator, requireMatch: false })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('ci')
    await input.trigger('blur')
    await flushPromises()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.text()).toContain('Ciudad incompleta')
    expect(validator).toHaveBeenCalledWith('ci')
    await input.setValue('Asunción')
    expect(await wrapper.vm.validate()).toBe(true)
    await wrapper.setProps({ error: 'Error externo' })
    expect(await wrapper.vm.validate()).toBe(false)
  })

  it('does not open or select suggestions during IME composition', async () => {
    const wrapper = render()
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.trigger('compositionstart')
    await input.setValue('ci')
    await input.trigger('keydown', { key: 'ArrowDown', isComposing: true })
    expect(options(wrapper)).toEqual([])
    await input.trigger('compositionend')
    expect(options(wrapper)).toHaveLength(4)
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it.each([
    { data: ['Asunción'], valid: '  ASUNCION  ' },
    { data: [{ label: 'Cliente 0001', value: 1 }], valid: 'Cliente 0001' }
  ])('requires a complete label match on blur and through validate()', async ({ data, valid }) => {
    const wrapper = render({ data })
    const input = wrapper.get('input')
    await input.setValue(valid.trim().slice(0, 3))
    await input.trigger('blur')
    await flushPromises()
    expect(wrapper.text()).toContain('Seleccione una opción de la lista.')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(await wrapper.vm.validate()).toBe(false)
    await input.setValue(valid)
    await input.trigger('blur')
    await flushPromises()
    expect(input.classes()).not.toContain('is-invalid')
    expect(await wrapper.vm.validate()).toBe(true)
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('allows optional empty values and free text, but validates required empty values', async () => {
    const wrapper = render()
    expect(await wrapper.vm.validate()).toBe(true)
    await wrapper.setProps({ required: true })
    expect(await wrapper.vm.validate()).toBe(false)
    expect(wrapper.text()).toContain('Este campo es obligatorio.')
    await wrapper.setProps({ required: false, modelValue: 'No existe', requireMatch: false })
    expect(await wrapper.vm.validate()).toBe(true)
    await wrapper.setProps({ requireMatch: true })
    expect(await wrapper.vm.validate()).toBe(false)
  })

  it('checks membership before calling a custom validator', async () => {
    const validator = vi.fn(() => 'Error personalizado')
    const wrapper = render({ validator, modelValue: 'ci' })
    expect(await wrapper.vm.validate()).toBe(false)
    expect(validator).not.toHaveBeenCalled()
    await wrapper.setProps({ modelValue: 'Asunción' })
    expect(await wrapper.vm.validate()).toBe(false)
    expect(validator).toHaveBeenCalledWith('Asunción')
    expect(wrapper.text()).toContain('Error personalizado')
  })
})
