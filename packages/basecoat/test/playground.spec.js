import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../playground/src/skin.js', async () => {
  const { createVueSkin } = await import('@vue-skin/core')
  const { default: adapter } = await import('../src/index.js')
  const previewAdapter = { ...adapter, components: { ...adapter.components, Chart: { name:'ChartPreview', props:['data','type','title','height','options','label'], template:'<figure />' } } }
  const skin = createVueSkin({ adapter: previewAdapter, theme: { persist: false } })
  return { skin, uiDialog: skin.dialog }
})

import App from '../../../playground/src/App.vue'
import { skin } from '../../../playground/src/skin.js'

describe('Basecoat playground', () => {
  it('renders every documentation section with the real Basecoat adapter', async () => {
    const wrapper = mount(App, { global: { plugins: [skin] } })
    try {
      expect(wrapper.find('.bc-navbar').exists()).toBe(true)
      const ids = wrapper.findAll('aside a[href^="#"]').map(link => link.attributes('href'))
      expect(ids.length).toBeGreaterThan(30)
      for (const href of ids) {
        await wrapper.get(`aside a[href="${href}"]`).trigger('click')
        await flushPromises()
        expect(wrapper.get('main h1').text(), href).not.toBe('')
        expect(wrapper.find('.bc-tabs').exists(), href).toBe(true)
      }
      expect(wrapper.find('.modal.fade').exists()).toBe(false)
    } finally { wrapper.unmount() }
  })
})
