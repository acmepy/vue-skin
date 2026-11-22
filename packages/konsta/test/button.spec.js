import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVueSkin } from '@vue-skin/core'
import Konsta from '../src/index.js'

let wrapper
afterEach(() => wrapper?.unmount())

describe('Konsta loading button', () => {
  it.each(['primary', 'secondary', 'danger', 'outline-primary', 'ghost'])('keeps the native preloader visible on %s buttons', async variant => {
    wrapper = mount(Konsta.components.Button, {
      props: { loading: true, variant },
      slots: { default: 'Guardando' },
      global: { plugins: [createVueSkin({ adapter: Konsta, theme: { persist: false } })] }
    })
    const button = wrapper.get('button')
    expect(button.element.disabled).toBe(true)
    expect(button.attributes('aria-busy')).toBe('true')
    const preloader = button.get('.k-material-preloader')
    expect(preloader.classes()).toContain('text-current')
    expect(preloader.classes()).not.toContain('text-md-light-primary')
    expect(preloader.get('svg').attributes('stroke')).toBe('currentcolor')
    expect(button.text()).toBe('Guardando')

    await wrapper.setProps({ loading: false })
    expect(button.element.disabled).toBe(false)
    expect(button.attributes('aria-busy')).toBeUndefined()
    expect(button.find('.k-preloader').exists()).toBe(false)
  })
})
