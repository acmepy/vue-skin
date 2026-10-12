import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Dialog from '../src/components/Dialog.vue'
import Modal from '../src/components/Modal.vue'

describe('Bootstrap semantic dialogs', () => {
  it.each([
    ['info', 'info', 'Información', 'status'],
    ['success', 'success', 'Operación realizada', 'status'],
    ['warning', 'warning', 'Advertencia', 'alert'],
    ['error', 'danger', 'Error', 'alert']
  ])('renders %s with a default title, icon, semantic color and accept button', async (type, variant, title, role) => {
    const wrapper = mount(Dialog, { props: { type, message: 'Mensaje de ejemplo' } })
    try {
      expect(wrapper.get('.modal-title').text()).toBe(title)
      expect(wrapper.getComponent(Modal).props('centered')).toBe(true)
      expect(wrapper.get('.modal').classes()).toContain(`ui-dialog-${variant}`)
      expect(wrapper.get('.modal-header').find('span').exists()).toBe(true)
      expect(wrapper.get('.modal-body p').attributes('role')).toBe(role)
      expect(wrapper.get('.modal-body').text()).toBe('Mensaje de ejemplo')
      expect(wrapper.find('.modal-body .alert').exists()).toBe(false)
      expect(wrapper.get('.modal-header').text()).not.toContain('Mensaje de ejemplo')
      expect(wrapper.findAll('.modal-footer button')).toHaveLength(1)
      await wrapper.get(`.modal-footer .btn-${variant}`).trigger('click')
      expect(wrapper.emitted('accept')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
      await wrapper.setProps({ title: 'Título propio', acceptText: 'Entendido' })
      expect(wrapper.get('.modal-title').text()).toBe('Título propio')
      expect(wrapper.get('.modal-footer button').text()).toBe('Entendido')
    } finally { wrapper.unmount() }
  })

  it('keeps confirmation cancellable and preloader without a header or buttons', async () => {
    const wrapper = mount(Dialog, { props: { type: 'confirm', title: 'Confirmar', message: '¿Continuar?' } })
    try {
      expect(wrapper.findAll('.modal-footer button')).toHaveLength(2)
      await wrapper.get('.modal-footer .btn-secondary').trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      await wrapper.setProps({ type: 'preloader', message: undefined })
      expect(wrapper.get('.modal').classes().some(name => name.startsWith('ui-dialog-'))).toBe(false)
      expect(wrapper.find('.modal-header').exists()).toBe(false)
      expect(wrapper.find('.modal-footer').exists()).toBe(false)
      expect(wrapper.getComponent(Modal).props('closable')).toBe(false)
    } finally { wrapper.unmount() }
  })
})
