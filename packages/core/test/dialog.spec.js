import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, watch } from 'vue'
import { describe, expect, it } from 'vitest'
import { createDialogService } from '../src/dialog.js'

const Dialog = defineComponent({
  props: { modelValue: Boolean, type: String },
  emits: ['accept', 'closed'],
  setup(props, { emit }) {
    watch(() => props.modelValue, (visible) => { if (!visible) emit('closed') })
    return () => h('button', { onClick: () => emit('accept') }, props.type)
  }
})

describe('dialog service', () => {
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
