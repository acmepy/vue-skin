import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, watch } from 'vue'
import { describe, expect, it } from 'vitest'
import { createDialogService } from '../src/dialog.js'

const Dialog = defineComponent({
  props: { modelValue: Boolean, type: String, message: String, title: String, acceptText: String },
  emits: ['accept', 'cancel', 'closed', 'update:modelValue'],
  setup(props, { emit }) {
    watch(() => props.modelValue, (visible) => { if (!visible) emit('closed') })
    return () => h('button', { onClick: () => emit('accept') }, props.type)
  }
})

describe('dialog service', () => {
  it.each(['info', 'success', 'warning', 'error'])('opens and resolves %s from JavaScript', async (type) => {
    const dialog = createDialogService({ components: { Dialog } })
    const wrapper = mount(dialog.Host)
    try {
      const completion = dialog[type]('Mensaje de prueba', 'Título personalizado', { acceptText: 'Entendido' })
      await nextTick()
      expect(wrapper.getComponent(Dialog).props()).toMatchObject({ modelValue: true, type, message: 'Mensaje de prueba', title: 'Título personalizado', acceptText: 'Entendido' })
      await wrapper.get('button').trigger('click')
      await completion
      expect(wrapper.html()).toBe('')
    } finally { wrapper.unmount() }
  })

  it('queues new message types and keeps services isolated between applications', async () => {
    const dialog = createDialogService({ components: { Dialog } })
    const other = createDialogService({ components: { Dialog } })
    const wrapper = mount(dialog.Host)
    const otherWrapper = mount(other.Host)
    try {
      const first = dialog.error('Error')
      const second = dialog.info('Información')
      const independent = other.warning('Advertencia')
      await nextTick()
      expect(wrapper.text()).toBe('error')
      expect(otherWrapper.text()).toBe('warning')
      await wrapper.get('button').trigger('click')
      await first
      await nextTick()
      expect(wrapper.text()).toBe('info')
      expect(otherWrapper.text()).toBe('warning')
      await wrapper.get('button').trigger('click')
      await second
      await otherWrapper.get('button').trigger('click')
      await independent
    } finally { wrapper.unmount(); otherWrapper.unmount() }
  })

  it('continues to resolve false when confirmation is cancelled', async () => {
    const dialog = createDialogService({ components: { Dialog } })
    const wrapper = mount(dialog.Host)
    try {
      const completion = dialog.confirm('¿Continuar?')
      await nextTick()
      wrapper.getComponent(Dialog).vm.$emit('cancel')
      await expect(completion).resolves.toBe(false)
    } finally { wrapper.unmount() }
  })
  it('resolves confirm from JavaScript after the dialog closes', async () => {
    const dialog = createDialogService({ components: { Dialog } })
    const wrapper = mount(dialog.Host)
    const confirmation = dialog.confirm('¿Continuar?', 'Confirmación')

    await nextTick()
    await wrapper.get('button').trigger('click')

    await expect(confirmation).resolves.toBe(true)
    wrapper.unmount()
  })

  it('closes a preloader programmatically', async () => {
    const dialog = createDialogService({ components: { Dialog } })
    const wrapper = mount(dialog.Host)
    const preloader = dialog.preloader('Procesando')

    await nextTick()
    expect(wrapper.text()).toBe('preloader')

    preloader.close()
    await nextTick()
    await nextTick()

    expect(wrapper.html()).toBe('')
    wrapper.unmount()
  })
})
